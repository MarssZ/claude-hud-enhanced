# Claude HUD Enhanced

Claude Code 插件，实时显示会话状态 — 上下文使用率、工具活动、运行中的代理、待办进度和 API 配置。始终显示在输入框下方。

基于 [claude-hud](https://github.com/jarrodwatts/claude-hud) 的增强版本，新增 API 环境监控和用量追踪功能。

[![License](https://img.shields.io/github/license/jarrodwatts/claude-hud?v=2)](LICENSE)

![Claude HUD 运行效果](claude-hud-preview-5-2.png)

## 安装

在 Claude Code 中运行以下命令：

**步骤 1：从 GitHub 安装**
```
claude plugin marketplace add MarssZ/claude-hud-enhanced
claude plugin install https://github.com/MarssZ/claude-hud-enhanced.git
```

或者本地开发安装：
```bash
git clone https://github.com/MarssZ/claude-hud-enhanced
cd claude-hud-enhanced
npm install
npm run build
claude plugin install .
```

**步骤 2：配置状态栏**
```
/claude-hud-enhanced:setup
```

完成！HUD 会立即显示 — 无需重启。

> **注意：** 如果遇到 "Cannot find module dist/index.js" 错误，说明插件未正确构建。请查看 [安装问题排查](docs/INSTALLATION-ISSUES.md)。

---

## Claude HUD Enhanced 是什么？

Claude HUD Enhanced 让你更好地了解 Claude Code 会话中正在发生的事情。

| 显示内容 | 为什么重要 |
|---------|-----------|
| **项目路径** | 知道你在哪个项目中（可配置 1-3 级目录深度） |
| **上下文健康度** | 在上下文窗口满之前准确了解使用情况 |
| **工具活动** | 实时观察 Claude 读取、编辑和搜索文件 |
| **代理追踪** | 查看哪些子代理正在运行以及它们在做什么 |
| **待办进度** | 实时追踪任务完成情况 |
| **API 环境** | 监控 Anthropic API 配置状态 |
| **用量追踪** | 显示 5 小时和 7 天的 API 使用率 |

## 新增功能

### API 环境显示

在状态栏中显示你的 Anthropic API 配置：

- `ANTHROPIC_BASE_URL` - 自定义 API 端点
- `ANTHROPIC_AUTH_TOKEN` - 掩码令牌（显示前 6 位和后 6 位字符）
- `ANTHROPIC_MODEL` - 模型覆盖设置

**示例输出：**
```
URL: https://api.aicodewith.com | Token: sk-acw...d2b583 | Model: claude-opus-4
```

### 用量追踪

通过 OAuth 集成显示 Anthropic API 使用情况：

- 5 小时使用率（带剩余时间倒计时）
- 7 天使用率
- 自动缓存（成功 60 秒，失败 15 秒）

**示例输出：**
```
Context █████░░░░░ 45% │ Usage ██░░░░░░░░ 25% (1h 30m / 5h)
```

### 配置

通过 `~/.claude/plugins/claude-hud-enhanced/config.json` 控制显示：

```json
{
  "display": {
    "showApiEnv": true,
    "showUsage": true
  }
}
```

设置为 `false` 可隐藏相应信息。

## 显示内容

### 默认显示（2 行）
```
[Opus | Max] │ my-project git:(main*)
Context █████░░░░░ 45% │ Usage ██░░░░░░░░ 25% (1h 30m / 5h)
```
- **第 1 行** — 模型、套餐名称（或 `Bedrock`）、项目路径、git 分支
- **第 2 行** — 上下文进度条（绿色 → 黄色 → 红色）和用量速率限制

### 可选行（通过 `/claude-hud-enhanced:configure` 启用）
```
◐ Edit: auth.ts | ✓ Read ×3 | ✓ Grep ×2        ← 工具活动
◐ explore [haiku]: Finding auth code (2m 15s)    ← 代理状态
▸ Fix authentication bug (2/5)                   ← 待办进度
URL: https://api.aicodewith.com | Token: sk-acw...d2b583  ← API 环境
```

---

## 工作原理

Claude HUD Enhanced 使用 Claude Code 的原生 **statusline API** — 无需单独窗口，无需 tmux，在任何终端中都能工作。

```
Claude Code → stdin JSON → claude-hud-enhanced → stdout → 在终端中显示
           ↘ transcript JSONL（工具、代理、待办）
           ↘ OAuth credentials（用量追踪）
```

**核心特性：**
- 来自 Claude Code 的原生令牌数据（非估算）
- 解析会话记录以获取工具/代理活动
- 通过 OAuth 获取 API 用量数据
- 每约 300ms 更新一次

---

## 配置

随时自定义你的 HUD：

```
/claude-hud-enhanced:configure
```

引导流程会带你完成自定义 — 无需手动编辑：

- **首次设置**：选择预设（完整/基本/最小），然后微调各个元素
- **随时自定义**：切换项目开关、调整 git 显示样式、切换布局
- **保存前预览**：在提交更改前准确查看 HUD 的外观

### 预设

| 预设 | 显示内容 |
|------|---------|
| **完整** | 启用所有功能 — 工具、代理、待办、git、用量、持续时间 |
| **基本** | 活动行 + git 状态，最少信息干扰 |
| **最小** | 仅核心 — 只有模型名称和上下文进度条 |

选择预设后，你可以单独开关各个元素。

### 手动配置

你也可以直接编辑配置文件 `~/.claude/plugins/claude-hud-enhanced/config.json`。

### 选项

| 选项 | 类型 | 默认值 | 描述 |
|-----|------|--------|------|
| `lineLayout` | string | `expanded` | 布局：`expanded`（多行）或 `compact`（单行） |
| `pathLevels` | 1-3 | 1 | 项目路径显示的目录层级 |
| `gitStatus.enabled` | boolean | true | 在 HUD 中显示 git 分支 |
| `gitStatus.showDirty` | boolean | true | 为未提交的更改显示 `*` |
| `gitStatus.showAheadBehind` | boolean | false | 显示与远程的领先/落后 `↑N ↓N` |
| `gitStatus.showFileStats` | boolean | false | 显示文件更改计数 `!M +A ✘D ?U` |
| `display.showModel` | boolean | true | 显示模型名称 `[Opus]` |
| `display.showContextBar` | boolean | true | 显示可视化上下文进度条 `████░░░░░░` |
| `display.contextValue` | `percent` \| `tokens` | `percent` | 上下文显示格式（`45%` 或 `45k/200k`） |
| `display.showConfigCounts` | boolean | false | 显示 CLAUDE.md、规则、MCP、钩子计数 |
| `display.showDuration` | boolean | false | 显示会话持续时间 `⏱️ 5m` |
| `display.showSpeed` | boolean | false | 显示输出令牌速度 `out: 42.1 tok/s` |
| `display.showUsage` | boolean | true | 显示用量限制（仅 Pro/Max/Team） |
| `display.usageBarEnabled` | boolean | true | 将用量显示为可视化进度条而非文本 |
| `display.sevenDayThreshold` | 0-100 | 80 | 当 >= 阈值时显示 7 天用量（0 = 始终显示） |
| `display.showTokenBreakdown` | boolean | true | 在高上下文使用率（85%+）时显示令牌详情 |
| `display.showTools` | boolean | false | 显示工具活动行 |
| `display.showAgents` | boolean | false | 显示代理活动行 |
| `display.showTodos` | boolean | false | 显示待办进度行 |
| `display.showApiEnv` | boolean | true | 显示 API 环境配置 |

### 用量限制（Pro/Max/Team）

用量显示对 Claude Pro、Max 和 Team 订阅用户**默认启用**。它在第 2 行的上下文进度条旁边显示你的速率限制消耗。

当超过 `display.sevenDayThreshold`（默认 80%）时会显示 7 天百分比：

```
Context █████░░░░░ 45% │ Usage ██░░░░░░░░ 25% (1h 30m / 5h) | ██████████ 85% (2d / 7d)
```

要禁用，将 `display.showUsage` 设置为 `false`。

**要求：**
- Claude Pro、Max 或 Team 订阅（API 用户不可用）
- 来自 Claude Code 的 OAuth 凭证（登录时自动创建）

**故障排除：** 如果用量未显示：
- 确保你使用 Pro/Max/Team 账户登录（而非 API 密钥）
- 检查配置中的 `display.showUsage` 未设置为 `false`
- API 用户不显示用量（他们按令牌付费，没有速率限制）
- AWS Bedrock 模型显示 `Bedrock` 并隐藏用量限制（用量在 AWS 中管理）

### 配置示例

```json
{
  "lineLayout": "expanded",
  "pathLevels": 2,
  "gitStatus": {
    "enabled": true,
    "showDirty": true,
    "showAheadBehind": true,
    "showFileStats": true
  },
  "display": {
    "showTools": true,
    "showAgents": true,
    "showTodos": true,
    "showConfigCounts": true,
    "showDuration": true,
    "showApiEnv": true,
    "showUsage": true
  }
}
```

### 显示示例

**1 级（默认）：** `[Opus] │ my-project git:(main)`

**2 级：** `[Opus] │ apps/my-project git:(main)`

**3 级：** `[Opus] │ dev/apps/my-project git:(main)`

**带脏标记：** `[Opus] │ my-project git:(main*)`

**带领先/落后：** `[Opus] │ my-project git:(main ↑2 ↓1)`

**带文件统计：** `[Opus] │ my-project git:(main* !3 +1 ?2)`
- `!` = 修改的文件，`+` = 添加/暂存的文件，`✘` = 删除的文件，`?` = 未跟踪的文件
- 计数为 0 时会省略以保持显示简洁

### 故障排除

**配置未生效？**
- 检查 JSON 语法错误：无效的 JSON 会静默回退到默认值
- 确保值有效：`pathLevels` 必须是 1、2 或 3；`lineLayout` 必须是 `expanded` 或 `compact`
- 删除配置并运行 `/claude-hud-enhanced:configure` 重新生成

**Git 状态缺失？**
- 验证你在 git 仓库中
- 检查配置中的 `gitStatus.enabled` 未设置为 `false`

**工具/代理/待办行缺失？**
- 这些默认隐藏 — 在配置中使用 `showTools`、`showAgents`、`showTodos` 启用
- 它们也只在有活动时才显示

**API 环境未显示？**
- 检查配置中的 `display.showApiEnv` 未设置为 `false`
- 确保设置了相关环境变量（`ANTHROPIC_BASE_URL`、`ANTHROPIC_AUTH_TOKEN` 或 `ANTHROPIC_MODEL`）

---

## 要求

- Claude Code v1.0.80+
- Node.js 18+ 或 Bun

---

## 开发

```bash
git clone https://github.com/MarssZ/claude-hud-enhanced
cd claude-hud-enhanced
npm ci && npm run build
npm test
```

查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解贡献指南。

---

## 致谢

基于 [claude-hud](https://github.com/jarrodwatts/claude-hud)，由 Jarrod Watts 开发。

---

## 许可证

MIT — 查看 [LICENSE](LICENSE)
