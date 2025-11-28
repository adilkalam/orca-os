#!/Users/adilkalam/.claude/skill-catalog/.venv/bin/python3
"""
Skill Discovery Hook - PostToolUse hook for Read operations.

Suggests relevant skills based on file content being read.

CRITICAL: This hook MUST exit 0 always and never block Read operations.
Uses signal.SIGALRM for hard timeout enforcement.

Input: JSON on stdin with tool invocation data
Output: Notification text to stdout (or nothing if no relevant skills)
"""

import json
import os
import signal
import sys
from pathlib import Path
from typing import Optional, Dict, Any, List

# =============================================================================
# Timeout Handling (CRITICAL)
# =============================================================================

class TimeoutError(Exception):
    pass


def timeout_handler(signum, frame):
    raise TimeoutError("Hook timeout")


def setup_timeout(timeout_ms: int):
    """Set up alarm-based timeout. Only works on Unix."""
    if hasattr(signal, 'SIGALRM'):
        signal.signal(signal.SIGALRM, timeout_handler)
        # Convert ms to seconds, round up
        timeout_sec = max(1, (timeout_ms + 999) // 1000)
        signal.alarm(timeout_sec)


def clear_timeout():
    """Clear the timeout alarm."""
    if hasattr(signal, 'SIGALRM'):
        signal.alarm(0)


# =============================================================================
# Configuration
# =============================================================================

def get_config() -> dict:
    """Load configuration."""
    config_path = Path(__file__).parent / "config.json"
    if config_path.exists():
        try:
            with open(config_path) as f:
                return json.load(f)
        except:
            pass
    return {
        "enabled": True,
        "relevance_threshold": 0.25,
        "renotify_delta": 0.20,
        "max_skills_per_notification": 3,
        "hook_timeout_ms": 100,
        "log_level": "info"
    }


def log_debug(msg: str, config: dict):
    """Log debug message if enabled."""
    if config.get("log_level") == "debug":
        log_dir = Path(__file__).parent / "logs"
        log_dir.mkdir(exist_ok=True)
        with open(log_dir / "discovery.log", "a") as f:
            f.write(f"{msg}\n")


# =============================================================================
# Session State (De-duplication)
# =============================================================================

def get_session_state_path() -> Path:
    """Get session state file path."""
    session_id = os.environ.get("CLAUDE_SESSION_ID", "default")
    return Path(__file__).parent / f".skill-session-{session_id}.json"


def load_session_state() -> Dict[str, float]:
    """Load session state (skill -> last_relevance)."""
    state_path = get_session_state_path()
    if state_path.exists():
        try:
            with open(state_path) as f:
                return json.load(f)
        except:
            pass
    return {}


def save_session_state(state: Dict[str, float]):
    """Save session state."""
    state_path = get_session_state_path()
    try:
        with open(state_path, "w") as f:
            json.dump(state, f)
    except:
        pass  # Don't fail if we can't save state


def should_notify(skill_path: str, relevance: float, state: Dict[str, float], config: dict) -> bool:
    """
    Check if we should notify about this skill.
    
    - First time seeing skill: yes
    - Seen before but relevance jumped by renotify_delta: yes
    - Otherwise: no
    """
    if skill_path not in state:
        return True
    
    last_relevance = state[skill_path]
    delta = config.get("renotify_delta", 0.20)
    
    return relevance >= last_relevance + delta


# =============================================================================
# Skill Search (Lazy Loading)
# =============================================================================

_model = None
_index_loaded = False
_skills_cache = []


def lazy_load_model():
    """Lazy load the embedding model."""
    global _model
    if _model is None:
        try:
            from sentence_transformers import SentenceTransformer
            config = get_config()
            model_name = config.get("model_name", "all-MiniLM-L6-v2")
            _model = SentenceTransformer(model_name)
        except ImportError:
            return None
    return _model


def lazy_load_index() -> List[Dict[str, Any]]:
    """Lazy load the skill index from SQLite."""
    global _index_loaded, _skills_cache
    
    if _index_loaded:
        return _skills_cache
    
    _index_loaded = True
    
    db_path = Path(__file__).parent / "index.db"
    if not db_path.exists():
        return []
    
    try:
        import sqlite3
        conn = sqlite3.connect(str(db_path))
        conn.row_factory = sqlite3.Row
        rows = conn.execute(
            "SELECT id, path, title, category, description, embedding FROM skills"
        ).fetchall()
        conn.close()
        
        _skills_cache = [dict(row) for row in rows]
        return _skills_cache
    except:
        return []


def search_skills(query: str, config: dict) -> List[Dict[str, Any]]:
    """Search skills by semantic similarity."""
    import numpy as np
    
    model = lazy_load_model()
    if model is None:
        return []
    
    skills = lazy_load_index()
    if not skills:
        return []
    
    # Encode query
    query_embedding = model.encode(query, normalize_embeddings=True)
    
    # Compute similarities
    results = []
    threshold = config.get("relevance_threshold", 0.25)
    
    for skill in skills:
        skill_embedding = np.frombuffer(skill["embedding"], dtype=np.float32)
        similarity = float(np.dot(query_embedding, skill_embedding))
        
        if similarity >= threshold:
            results.append({
                "path": skill["path"],
                "title": skill["title"],
                "category": skill["category"],
                "description": skill["description"],
                "relevance": similarity
            })
    
    # Sort by relevance
    results.sort(key=lambda x: x["relevance"], reverse=True)
    
    return results


# =============================================================================
# Content Analysis
# =============================================================================

def extract_context(file_path: str, content: str) -> str:
    """
    Extract relevant context from file path and content for search.
    
    Returns a string suitable for embedding search.
    """
    parts = []
    
    # File extension hints
    ext = Path(file_path).suffix.lower()
    ext_hints = {
        ".tsx": "React TypeScript component",
        ".jsx": "React JavaScript component",
        ".ts": "TypeScript",
        ".js": "JavaScript",
        ".py": "Python",
        ".swift": "Swift iOS",
        ".kt": "Kotlin Android",
        ".go": "Go",
        ".rs": "Rust",
        ".sql": "SQL database",
        ".graphql": "GraphQL API",
        ".json": "JSON configuration",
        ".yaml": "YAML configuration",
        ".yml": "YAML configuration",
        ".md": "Markdown documentation",
        ".css": "CSS styles",
        ".scss": "SCSS styles",
    }
    if ext in ext_hints:
        parts.append(ext_hints[ext])
    
    # Directory hints
    path_lower = file_path.lower()
    if "test" in path_lower or "spec" in path_lower:
        parts.append("testing")
    if "api" in path_lower:
        parts.append("API")
    if "auth" in path_lower:
        parts.append("authentication security")
    if "component" in path_lower:
        parts.append("UI component")
    
    # Content keywords (first 500 chars)
    sample = content[:500].lower() if content else ""
    
    keyword_hints = [
        ("usestate", "React hooks state management"),
        ("useeffect", "React hooks side effects"),
        ("fetch(", "API requests"),
        ("axios", "HTTP requests"),
        ("import react", "React component"),
        ("git ", "version control"),
        ("commit", "git commits"),
        ("branch", "git branching"),
        ("security", "security"),
        ("auth", "authentication"),
        ("token", "authentication tokens"),
        ("password", "authentication security"),
        ("encrypt", "security encryption"),
        ("sql", "database SQL"),
        ("query", "database queries"),
        ("test(", "testing"),
        ("describe(", "testing"),
        ("expect(", "testing assertions"),
    ]
    
    for keyword, hint in keyword_hints:
        if keyword in sample:
            parts.append(hint)
    
    return " ".join(parts) if parts else Path(file_path).stem


# =============================================================================
# Main Hook
# =============================================================================

def main() -> int:
    """
    Main entry point for the PostToolUse hook.
    
    MUST exit 0 always - never block Read operations.
    """
    config = get_config()
    
    # Check if enabled
    if not config.get("enabled", True):
        return 0
    
    # Set up timeout
    timeout_ms = config.get("hook_timeout_ms", 100)
    setup_timeout(timeout_ms)
    
    try:
        # Read input from stdin
        input_data = sys.stdin.read()
        if not input_data:
            return 0
        
        try:
            data = json.loads(input_data)
        except json.JSONDecodeError:
            return 0
        
        # Only process Read tool
        tool = data.get("tool", "")
        if tool != "Read":
            return 0
        
        # Extract file info
        tool_input = data.get("input", {})
        tool_output = data.get("output", {})
        
        file_path = tool_input.get("file_path", "")
        content = tool_output.get("content", "")
        
        if not file_path:
            return 0
        
        log_debug(f"Processing Read of {file_path}", config)
        
        # Extract search context
        context = extract_context(file_path, content)
        if not context:
            return 0
        
        log_debug(f"Search context: {context}", config)
        
        # Search for relevant skills
        results = search_skills(context, config)
        if not results:
            return 0
        
        # Load session state for de-duplication
        state = load_session_state()
        
        # Filter by de-duplication rules
        max_skills = config.get("max_skills_per_notification", 3)
        to_notify = []
        
        for result in results:
            if should_notify(result["path"], result["relevance"], state, config):
                to_notify.append(result)
                state[result["path"]] = result["relevance"]
                if len(to_notify) >= max_skills:
                    break
        
        # Save updated state
        if to_notify:
            save_session_state(state)
        
        # Generate notification
        if to_notify:
            lines = ["\n[Skill Catalog] Relevant skills detected:"]
            for skill in to_notify:
                lines.append(f"  - {skill['title']} ({skill['relevance']:.0%} match)")
                lines.append(f"    /load-skill {Path(skill['path']).stem}")
            lines.append("")
            print("\n".join(lines))
        
        return 0
        
    except TimeoutError:
        log_debug("Hook timeout - exiting cleanly", config)
        return 0
    except Exception as e:
        log_debug(f"Hook error: {e}", config)
        return 0  # MUST exit 0
    finally:
        clear_timeout()


if __name__ == "__main__":
    sys.exit(main())
