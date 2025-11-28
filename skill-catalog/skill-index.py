#!/Users/adilkalam/.claude/skill-catalog/.venv/bin/python3
"""
Skill Index - Semantic search for Claude Code skills.

Uses sentence-transformers for embeddings, SQLite for storage.
Lazy model loading to minimize startup time.

Usage:
    skill-index.py index              # Index all skills
    skill-index.py search <query>     # Semantic search
    skill-index.py list               # List all indexed skills
    skill-index.py show <id>          # Show skill details
    skill-index.py health             # Health check
"""

import argparse
import hashlib
import json
import os
import re
import sqlite3
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional, List, Dict, Any, Tuple

# Lazy-loaded globals
_model = None
_config = None

# =============================================================================
# Configuration
# =============================================================================

def get_config() -> dict:
    """Load configuration from config.json."""
    global _config
    if _config is None:
        config_path = Path(__file__).parent / "config.json"
        if config_path.exists():
            with open(config_path) as f:
                _config = json.load(f)
        else:
            _config = {
                "model_name": "all-MiniLM-L6-v2",
                "skill_sources": ["~/.claude/skills"],
                "precedence": "project-first",
                "log_level": "info"
            }
    return _config


def get_db_path() -> Path:
    """Get the database path."""
    return Path(__file__).parent / "index.db"


def get_skills_dirs() -> List[Path]:
    """Get skill source directories, expanded."""
    config = get_config()
    dirs = []
    for src in config.get("skill_sources", ["~/.claude/skills"]):
        if "<project>" in src:
            # Skip project-specific paths in global index
            continue
        expanded = Path(os.path.expanduser(src))
        if expanded.exists():
            dirs.append(expanded)
    return dirs


# =============================================================================
# Model Loading (Lazy)
# =============================================================================

def get_model():
    """Lazy load the sentence transformer model."""
    global _model
    if _model is None:
        try:
            from sentence_transformers import SentenceTransformer
            config = get_config()
            model_name = config.get("model_name", "all-MiniLM-L6-v2")
            _model = SentenceTransformer(model_name)
        except ImportError:
            print("ERROR: sentence-transformers not installed.", file=sys.stderr)
            print("Run: pip install sentence-transformers", file=sys.stderr)
            sys.exit(1)
    return _model


def encode_text(text: str) -> bytes:
    """Encode text to embedding bytes."""
    import numpy as np
    model = get_model()
    embedding = model.encode(text, normalize_embeddings=True)
    return embedding.astype(np.float32).tobytes()


def cosine_similarity(emb1: bytes, emb2: bytes) -> float:
    """Compute cosine similarity between two embedding byte arrays."""
    import numpy as np
    arr1 = np.frombuffer(emb1, dtype=np.float32)
    arr2 = np.frombuffer(emb2, dtype=np.float32)
    # Already normalized, so dot product = cosine similarity
    return float(np.dot(arr1, arr2))


# =============================================================================
# Database
# =============================================================================

def init_db(conn: sqlite3.Connection):
    """Initialize database schema."""
    conn.execute("""
        CREATE TABLE IF NOT EXISTS skills (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            path TEXT UNIQUE NOT NULL,
            title TEXT NOT NULL,
            category TEXT,
            tags TEXT,  -- JSON array
            version TEXT,
            description TEXT NOT NULL,
            content_hash TEXT NOT NULL,
            embedding BLOB NOT NULL,
            source TEXT NOT NULL,  -- 'global' or 'project'
            indexed_at TEXT NOT NULL
        )
    """)
    conn.execute("CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category)")
    conn.execute("CREATE INDEX IF NOT EXISTS idx_skills_source ON skills(source)")
    conn.commit()


def get_connection() -> sqlite3.Connection:
    """Get database connection, initializing if needed."""
    db_path = get_db_path()
    conn = sqlite3.connect(str(db_path))
    conn.row_factory = sqlite3.Row
    init_db(conn)
    return conn


# =============================================================================
# Skill Parsing
# =============================================================================

def parse_skill_file(path: Path) -> Optional[Dict[str, Any]]:
    """
    Parse a skill file with YAML frontmatter.
    
    Returns dict with: title, category, tags, version, description, full_content
    Or None if parsing fails.
    """
    try:
        content = path.read_text(encoding='utf-8')
    except Exception as e:
        print(f"WARNING: Could not read {path}: {e}", file=sys.stderr)
        return None
    
    # Check for YAML frontmatter
    if not content.startswith('---'):
        # No frontmatter - use filename as title, first paragraph as description
        lines = content.strip().split('\n')
        title = path.stem.replace('-', ' ').replace('_', ' ').title()
        description = ""
        for line in lines:
            line = line.strip()
            if line and not line.startswith('#'):
                description = line
                break
        return {
            "title": title,
            "category": "general",
            "tags": [],
            "version": "1.0.0",
            "description": description or title,
            "full_content": content
        }
    
    # Parse YAML frontmatter
    parts = content.split('---', 2)
    if len(parts) < 3:
        print(f"WARNING: Invalid frontmatter in {path}", file=sys.stderr)
        return None
    
    frontmatter_text = parts[1].strip()
    body = parts[2].strip()
    
    # Simple YAML parsing (avoid PyYAML dependency)
    frontmatter = {}
    for line in frontmatter_text.split('\n'):
        if ':' in line:
            key, value = line.split(':', 1)
            key = key.strip()
            value = value.strip()
            # Handle arrays: [tag1, tag2]
            if value.startswith('[') and value.endswith(']'):
                value = [v.strip().strip('"\'') for v in value[1:-1].split(',')]
            # Handle quoted strings
            elif value.startswith('"') and value.endswith('"'):
                value = value[1:-1]
            elif value.startswith("'") and value.endswith("'"):
                value = value[1:-1]
            frontmatter[key] = value
    
    # Extract description: first paragraph after frontmatter
    description = ""
    para_lines = []
    for line in body.split('\n'):
        stripped = line.strip()
        if stripped.startswith('#'):
            # Skip headers, get text after them
            continue
        if stripped == "":
            if para_lines:
                break  # End of first paragraph
            continue
        para_lines.append(stripped)
    
    description = ' '.join(para_lines)
    if len(description) > 500:
        description = description[:497] + "..."
    
    return {
        "title": frontmatter.get("title", path.stem.replace('-', ' ').title()),
        "category": frontmatter.get("category", "general"),
        "tags": frontmatter.get("tags", []),
        "version": frontmatter.get("version", "1.0.0"),
        "description": description or frontmatter.get("title", path.stem),
        "full_content": content
    }


def find_skill_files(dirs: List[Path]) -> List[Tuple[Path, str]]:
    """
    Find all skill markdown files in given directories.
    
    Returns list of (path, source) tuples where source is 'global' or 'project'.
    """
    skills = []
    for dir_path in dirs:
        source = "global" if ".claude/skills" in str(dir_path) else "project"
        # Look for .md files, including in subdirectories
        for md_file in dir_path.rglob("*.md"):
            # Skip README files
            if md_file.name.lower() == "readme.md":
                continue
            skills.append((md_file, source))
    return skills


# =============================================================================
# Commands
# =============================================================================

def cmd_index(args) -> int:
    """Index all skills."""
    print("Indexing skills...")
    
    dirs = get_skills_dirs()
    if not dirs:
        print("No skill directories found.")
        return 1
    
    skill_files = find_skill_files(dirs)
    print(f"Found {len(skill_files)} skill files in {len(dirs)} directories")
    
    conn = get_connection()
    indexed = 0
    updated = 0
    errors = 0
    
    for path, source in skill_files:
        parsed = parse_skill_file(path)
        if not parsed:
            errors += 1
            continue
        
        # Compute content hash
        content_hash = hashlib.sha256(parsed["full_content"].encode()).hexdigest()[:16]
        
        # Check if already indexed with same hash
        existing = conn.execute(
            "SELECT content_hash FROM skills WHERE path = ?",
            (str(path),)
        ).fetchone()
        
        if existing and existing["content_hash"] == content_hash:
            # Already indexed and unchanged
            continue
        
        # Generate embedding from description
        try:
            embedding = encode_text(parsed["description"])
        except Exception as e:
            print(f"ERROR encoding {path}: {e}", file=sys.stderr)
            errors += 1
            continue
        
        # Upsert into database
        tags_json = json.dumps(parsed["tags"]) if isinstance(parsed["tags"], list) else "[]"
        
        if existing:
            conn.execute("""
                UPDATE skills SET
                    title = ?, category = ?, tags = ?, version = ?,
                    description = ?, content_hash = ?, embedding = ?,
                    source = ?, indexed_at = ?
                WHERE path = ?
            """, (
                parsed["title"], parsed["category"], tags_json, parsed["version"],
                parsed["description"], content_hash, embedding,
                source, datetime.now(timezone.utc).isoformat(),
                str(path)
            ))
            updated += 1
        else:
            conn.execute("""
                INSERT INTO skills (path, title, category, tags, version,
                    description, content_hash, embedding, source, indexed_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                str(path), parsed["title"], parsed["category"], tags_json,
                parsed["version"], parsed["description"], content_hash,
                embedding, source, datetime.now(timezone.utc).isoformat()
            ))
            indexed += 1
    
    conn.commit()
    conn.close()
    
    print(f"Done: {indexed} indexed, {updated} updated, {errors} errors")
    return 0 if errors == 0 else 1


def cmd_search(args) -> int:
    """Search skills by semantic similarity."""
    query = ' '.join(args.query)
    if not query:
        print("Usage: skill-index.py search <query>")
        return 1
    
    # Encode query
    try:
        query_embedding = encode_text(query)
    except Exception as e:
        print(f"ERROR encoding query: {e}", file=sys.stderr)
        return 1
    
    conn = get_connection()
    rows = conn.execute("SELECT * FROM skills").fetchall()
    
    if not rows:
        print("No skills indexed. Run 'skill-index.py index' first.")
        return 1
    
    # Compute similarities
    results = []
    for row in rows:
        similarity = cosine_similarity(query_embedding, row["embedding"])
        results.append((similarity, dict(row)))
    
    # Sort by similarity descending
    results.sort(key=lambda x: x[0], reverse=True)
    
    # Show top results
    config = get_config()
    threshold = config.get("relevance_threshold", 0.25)
    
    print(f"Search results for: {query}")
    print("-" * 60)
    
    shown = 0
    for similarity, skill in results[:10]:
        if similarity < threshold and shown > 0:
            break
        shown += 1
        print(f"\n[{similarity:.3f}] {skill['title']}")
        print(f"  Category: {skill['category']}")
        print(f"  Path: {skill['path']}")
        print(f"  {skill['description'][:100]}...")
    
    if shown == 0:
        print("No relevant skills found.")
    
    conn.close()
    return 0


def cmd_list(args) -> int:
    """List all indexed skills."""
    conn = get_connection()
    rows = conn.execute(
        "SELECT id, title, category, source, path FROM skills ORDER BY category, title"
    ).fetchall()
    
    if not rows:
        print("No skills indexed. Run 'skill-index.py index' first.")
        return 1
    
    print(f"Indexed skills ({len(rows)}):")
    print("-" * 60)
    
    current_category = None
    for row in rows:
        if row["category"] != current_category:
            current_category = row["category"]
            print(f"\n[{current_category}]")
        print(f"  {row['id']:3d}. {row['title']} ({row['source']})")
    
    conn.close()
    return 0


def cmd_show(args) -> int:
    """Show details of a specific skill."""
    skill_id = args.id
    
    conn = get_connection()
    row = conn.execute("SELECT * FROM skills WHERE id = ?", (skill_id,)).fetchone()
    
    if not row:
        print(f"Skill {skill_id} not found.")
        return 1
    
    print(f"Skill #{row['id']}: {row['title']}")
    print("=" * 60)
    print(f"Category: {row['category']}")
    print(f"Tags: {row['tags']}")
    print(f"Version: {row['version']}")
    print(f"Source: {row['source']}")
    print(f"Path: {row['path']}")
    print(f"Indexed: {row['indexed_at']}")
    print(f"\nDescription:\n{row['description']}")
    
    conn.close()
    return 0


def cmd_health(args) -> int:
    """Run health checks."""
    print("Skill Catalog Health Check")
    print("=" * 60)
    
    issues = []
    
    # Check config
    config_path = Path(__file__).parent / "config.json"
    if config_path.exists():
        print("[OK] config.json exists")
        try:
            config = get_config()
            print(f"     Model: {config.get('model_name', 'unknown')}")
            print(f"     Threshold: {config.get('relevance_threshold', 'unknown')}")
        except Exception as e:
            issues.append(f"Config parse error: {e}")
            print(f"[WARN] Config parse error: {e}")
    else:
        issues.append("config.json missing")
        print("[FAIL] config.json missing")
    
    # Check database
    db_path = get_db_path()
    if db_path.exists():
        print(f"[OK] index.db exists ({db_path.stat().st_size / 1024:.1f} KB)")
        conn = get_connection()
        count = conn.execute("SELECT COUNT(*) as c FROM skills").fetchone()["c"]
        print(f"     {count} skills indexed")
        if count == 0:
            issues.append("No skills indexed")
        conn.close()
    else:
        issues.append("index.db missing - run 'index' command")
        print("[WARN] index.db not created yet")
    
    # Check skill directories
    dirs = get_skills_dirs()
    if dirs:
        print(f"[OK] {len(dirs)} skill directories configured")
        for d in dirs:
            skill_count = len(list(d.rglob("*.md")))
            print(f"     {d}: {skill_count} files")
    else:
        issues.append("No skill directories found")
        print("[FAIL] No skill directories found")
    
    # Check model availability
    print("\nModel check...")
    try:
        from sentence_transformers import SentenceTransformer
        print("[OK] sentence-transformers installed")
    except ImportError:
        issues.append("sentence-transformers not installed")
        print("[FAIL] sentence-transformers not installed")
        print("       Run: pip install sentence-transformers")
    
    # Summary
    print("\n" + "=" * 60)
    if issues:
        print(f"Health check: {len(issues)} issue(s) found")
        for issue in issues:
            print(f"  - {issue}")
        return 1
    else:
        print("Health check: PASSED")
        return 0


# =============================================================================
# Main
# =============================================================================

def main():
    parser = argparse.ArgumentParser(
        description="Skill Index - Semantic search for Claude Code skills"
    )
    subparsers = parser.add_subparsers(dest="command", help="Commands")
    
    # index command
    subparsers.add_parser("index", help="Index all skills")
    
    # search command
    search_parser = subparsers.add_parser("search", help="Search skills")
    search_parser.add_argument("query", nargs="+", help="Search query")
    
    # list command
    subparsers.add_parser("list", help="List all indexed skills")
    
    # show command
    show_parser = subparsers.add_parser("show", help="Show skill details")
    show_parser.add_argument("id", type=int, help="Skill ID")
    
    # health command
    subparsers.add_parser("health", help="Health check")
    
    args = parser.parse_args()
    
    if args.command == "index":
        return cmd_index(args)
    elif args.command == "search":
        return cmd_search(args)
    elif args.command == "list":
        return cmd_list(args)
    elif args.command == "show":
        return cmd_show(args)
    elif args.command == "health":
        return cmd_health(args)
    else:
        parser.print_help()
        return 0


if __name__ == "__main__":
    sys.exit(main())
