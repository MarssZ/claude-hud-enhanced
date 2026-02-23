# Claude HUD Enhanced

Enhanced version of [claude-hud](https://github.com/jarrodwatts/claude-hud) with API environment variables display.

## New Features

### API Environment Display

Displays your Anthropic API configuration in the statusline:

- `ANTHROPIC_BASE_URL` - Custom API endpoint
- `ANTHROPIC_AUTH_TOKEN` - Masked token (shows first 6 and last 6 characters)
- `ANTHROPIC_MODEL` - Model override

**Example output:**
```
URL: https://api.aicodewith.com | Token: sk-acw...d2b583 | Model: claude-opus-4
```

### Configuration

Control the display via `~/.claude/plugins/claude-hud-enhanced/config.json`:

```json
{
  "display": {
    "showApiEnv": true
  }
}
```

Set to `false` to hide API environment information.

## Installation

### From GitHub

```bash
claude plugin install https://github.com/MarssZ/claude-hud
```

### Local Development

```bash
git clone https://github.com/MarssZ/claude-hud
cd claude-hud
npm install
npm run build
claude plugin install .
```

## Setup

After installation, configure the statusline:

```bash
/claude-hud-enhanced:setup
```

This adds the plugin to your `~/.claude/settings.json`.

## Credits

Based on [claude-hud](https://github.com/jarrodwatts/claude-hud) by Jarrod Watts.

## License

MIT
