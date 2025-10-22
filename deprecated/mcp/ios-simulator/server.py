#!/usr/bin/env python3
"""
iOS Simulator MCP Server
Provides iOS simulator control tools via MCP protocol.
Built with official MCP Python SDK.
"""

import subprocess
import sys
from mcp.server.fastmcp import FastMCP

# Create MCP server instance
mcp = FastMCP(name="ios-simulator")

def log(message: str):
    """Log to stderr (never stdout - MCP protocol requirement)"""
    print(f"[ios-simulator] {message}", file=sys.stderr, flush=True)

@mcp.tool()
def list_simulators() -> str:
    """List all available iOS simulators"""
    try:
        result = subprocess.run(
            ["xcrun", "simctl", "list", "devices", "available"],
            capture_output=True,
            text=True,
            check=True
        )
        return result.stdout
    except subprocess.CalledProcessError as e:
        return f"Error listing simulators: {e.stderr}"

@mcp.tool()
def boot_simulator(device: str) -> str:
    """Boot an iOS simulator by name or UUID

    Args:
        device: Simulator name or UUID (e.g., 'iPhone 17 Pro')
    """
    try:
        result = subprocess.run(
            ["xcrun", "simctl", "boot", device],
            capture_output=True,
            text=True,
            check=True
        )
        return f"Simulator '{device}' booted successfully"
    except subprocess.CalledProcessError as e:
        # Already booted is not an error
        if "Unable to boot device in current state: Booted" in e.stderr:
            return f"Simulator '{device}' already booted"
        return f"Error booting simulator: {e.stderr}"

@mcp.tool()
def screenshot_simulator(output_path: str = "/tmp/simulator-screenshot.png") -> str:
    """Take screenshot of currently booted simulator

    Args:
        output_path: Path to save screenshot (default: /tmp/simulator-screenshot.png)
    """
    try:
        # Get booted device ID
        result = subprocess.run(
            ["xcrun", "simctl", "list", "devices", "|", "grep", "Booted"],
            capture_output=True,
            text=True,
            shell=True
        )

        if not result.stdout:
            return "No booted simulator found. Boot a simulator first."

        # Use 'booted' keyword which targets currently booted device
        subprocess.run(
            ["xcrun", "simctl", "io", "booted", "screenshot", output_path],
            capture_output=True,
            text=True,
            check=True
        )
        return f"Screenshot saved to: {output_path}"
    except subprocess.CalledProcessError as e:
        return f"Error taking screenshot: {e.stderr}"

@mcp.tool()
def install_app(app_path: str) -> str:
    """Install app to booted simulator

    Args:
        app_path: Path to .app bundle
    """
    try:
        subprocess.run(
            ["xcrun", "simctl", "install", "booted", app_path],
            capture_output=True,
            text=True,
            check=True
        )
        return f"App installed successfully: {app_path}"
    except subprocess.CalledProcessError as e:
        return f"Error installing app: {e.stderr}"

@mcp.tool()
def launch_app(bundle_id: str) -> str:
    """Launch app on booted simulator

    Args:
        bundle_id: App bundle identifier (e.g., com.example.app)
    """
    try:
        result = subprocess.run(
            ["xcrun", "simctl", "launch", "booted", bundle_id],
            capture_output=True,
            text=True,
            check=True
        )
        return f"App launched: {bundle_id}\nOutput: {result.stdout}"
    except subprocess.CalledProcessError as e:
        return f"Error launching app: {e.stderr}"

if __name__ == "__main__":
    log("iOS Simulator MCP Server starting...")
    mcp.run()
