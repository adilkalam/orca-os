# iOS Simulator MCP

Minimal, clean MCP server for controlling iOS simulators.

**No dependencies. No stdout contamination. Just works.**

---

## Why We Built This

The `claude-code-templates` package was outputting banners, status messages, and emojis to stdout, which broke MCP JSON-RPC protocol parsing. This is a clean rewrite with:

- ✅ All logging to stderr (never stdout)
- ✅ Only JSON-RPC on stdout
- ✅ No unnecessary dependencies
- ✅ Simple, readable Python code
- ✅ Core iOS simulator operations only

---

## Available Tools

### `list_simulators`
List all available iOS simulators.

**Usage**:
```
list_simulators()
```

---

### `boot_simulator`
Boot an iOS simulator by name or UUID.

**Parameters**:
- `device` (string): Simulator name or UUID (e.g., "iPhone 17 Pro")

**Usage**:
```
boot_simulator(device="iPhone 17 Pro")
```

---

### `screenshot_simulator`
Take screenshot of currently booted simulator.

**Parameters**:
- `output_path` (string, optional): Where to save screenshot (default: `/tmp/simulator-screenshot.png`)

**Usage**:
```
screenshot_simulator()
screenshot_simulator(output_path="/Users/adilkalam/Desktop/screenshot.png")
```

---

### `install_app`
Install .app bundle to booted simulator.

**Parameters**:
- `app_path` (string): Path to `.app` bundle

**Usage**:
```
install_app(app_path="/path/to/MyApp.app")
```

---

### `launch_app`
Launch app on booted simulator.

**Parameters**:
- `bundle_id` (string): App bundle identifier (e.g., "com.example.app")

**Usage**:
```
launch_app(bundle_id="com.peptidefox.app")
```

---

## Configuration

Add to Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "ios-simulator": {
      "command": "python3",
      "args": [
        "/Users/adilkalam/claude-vibe-code/mcp/ios-simulator/server.py"
      ]
    }
  }
}
```

---

## Requirements

- Python 3.6+
- macOS with Xcode Command Line Tools
- iOS Simulator (part of Xcode)

No additional Python packages required.

---

## Testing

Test the MCP server manually:

```bash
# Start server
python3 server.py

# Send initialize request (in another terminal)
echo '{"jsonrpc":"2.0","method":"initialize","params":{},"id":1}' | python3 server.py

# List tools
echo '{"jsonrpc":"2.0","method":"tools/list","params":{},"id":2}' | python3 server.py
```

---

## Troubleshooting

### Check Logs

Claude Desktop MCP logs:
```bash
tail -f ~/Library/Logs/Claude/mcp-server-ios-simulator.log
```

All server output goes to stderr, so check the log file for any issues.

### Common Issues

**"xcrun: error: unable to find utility"**
- Install Xcode Command Line Tools: `xcode-select --install`

**"No booted simulator found"**
- Boot a simulator first: `boot_simulator(device="iPhone 17 Pro")`

**"Unable to boot device in current state: Booted"**
- Simulator already booted (this is fine, not an error)

---

## vs claude-code-templates

| Feature | This MCP | claude-code-templates |
|---------|----------|----------------------|
| Stdout clean | ✅ Yes | ❌ No (banners/emojis) |
| Dependencies | ✅ None | ❌ Heavy npm package |
| Code size | ✅ ~300 lines | ❌ Huge package |
| Debuggable | ✅ Simple Python | ❌ Complex CLI tool |
| MCP compatible | ✅ Perfect | ❌ Breaks JSON parsing |

---

## Code Quality

- Pure Python 3 standard library
- Type hints throughout
- Async/await for MCP protocol
- Error handling for all xcrun commands
- Clean separation of concerns

---

**Built with efficiency in mind. No bloat. Just iOS simulator control.**
