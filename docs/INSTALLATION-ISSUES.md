# 安装问题分析与解决方案

## 问题总结

在首次安装 `claude-hud-enhanced` 插件时遇到的问题：

### 问题 1：缺少编译后的 dist/ 目录

**现象：**
```
Error: Cannot find module 'C:\Users\serap\.claude\plugins\cache\claude-hud-enhanced\claude-hud-enhanced\0.1.0\dist\index.js'
```

**原因：**
- 插件源代码是 TypeScript，需要编译成 JavaScript
- `dist/` 目录是编译产物，通常被 `.gitignore` 排除
- npm 发布时如果没有正确配置，`dist/` 不会被包含在发布包中
- 用户安装后，插件目录中没有可执行的 `dist/index.js`

**影响：**
- 用户安装插件后无法直接使用
- 需要手动进入插件目录运行 `npm ci && npm run build`
- 这对普通用户来说是不可接受的体验

---

## 解决方案

### 1. 添加 .npmignore 文件

创建 `.npmignore` 文件来控制 npm 发布时包含的文件：

```
# .npmignore
# 开发文件（不发布）
src/
tests/
*.md
!README.md
!LICENSE
.github/
tsconfig.json

# 重要：确保 dist/ 被包含
!dist/
!.claude-plugin/
!package.json
```

**关键点：**
- `.npmignore` 会覆盖 `.gitignore` 的规则
- 使用 `!dist/` 确保编译后的代码被包含
- 排除源代码 `src/` 和测试文件，减小包体积

### 2. 配置 package.json

添加 `files` 字段明确指定要发布的文件：

```json
{
  "files": [
    "dist/",
    ".claude-plugin/",
    "hud-wrapper.js",
    "commands/",
    "README.md",
    "LICENSE"
  ],
  "scripts": {
    "prepublishOnly": "npm run build"
  }
}
```

**关键点：**
- `files` 字段是白名单，只有列出的文件会被发布
- `prepublishOnly` 钩子确保发布前自动构建
- 这是最可靠的方式，优先级高于 `.npmignore`

### 3. 发布前检查

使用 `npm pack --dry-run` 验证将要发布的文件：

```bash
npm pack --dry-run
```

输出应该包含：
```
dist/index.js
dist/config.js
.claude-plugin/plugin.json
hud-wrapper.js
```

### 4. 完整的发布流程

```bash
# 1. 构建项目
npm run build

# 2. 运行发布前检查
./scripts/pre-publish-check.sh

# 3. 更新版本号
npm version patch  # 或 minor/major

# 4. 发布到 npm
npm publish

# 5. 推送到 Git
git push && git push --tags
```

---

## 其他潜在问题

### 问题 2：setup 命令的路径检测

**现象：**
- 在 Windows 上使用 Git Bash 时，路径可能混淆（Unix 风格 vs Windows 风格）
- `~/.claude/plugins/` 在不同 shell 中可能指向不同位置

**解决方案：**
- setup 命令已经根据 `Platform` 环境变量（而非 `uname -s`）选择正确的命令格式
- Windows 使用 PowerShell 命令，macOS/Linux 使用 bash 命令

### 问题 3：运行时检测

**现象：**
- 用户可能安装了多个 Node.js 版本管理器（nvm, mise, asdf）
- `command -v node` 返回的可能是符号链接，更新后失效

**解决方案：**
- setup 命令使用动态路径查找：
  ```bash
  bash -c '"$RUNTIME" "$(ls -td ~/.claude/plugins/cache/claude-hud*/...)"'
  ```
- 每次执行时都重新查找最新的插件版本
- 插件更新后无需重新运行 setup

---

## 验证修复

### 本地测试

1. 构建项目：
   ```bash
   npm run build
   ```

2. 创建测试包：
   ```bash
   npm pack
   ```

3. 在临时目录安装测试：
   ```bash
   mkdir /tmp/test-install
   cd /tmp/test-install
   npm install /path/to/claude-hud-enhanced-0.1.0.tgz
   ls -la node_modules/claude-hud-enhanced/dist/
   ```

4. 验证 dist/ 存在且包含所有必需文件

### 模拟用户安装

1. 发布到 npm（或使用本地路径）
2. 用户运行 `/plugin install claude-hud-enhanced`
3. 用户运行 `/claude-hud-enhanced:setup`
4. 验证 HUD 立即可用，无需手动构建

---

## 最佳实践

1. **始终在发布前运行 `npm pack --dry-run`**
2. **使用 `prepublishOnly` 钩子自动构建**
3. **在 CI/CD 中添加发布检查**
4. **维护清晰的 `.npmignore` 或 `files` 配置**
5. **在 README 中说明本地开发 vs 发布的区别**

---

## 相关文件

- `.npmignore` - 控制 npm 发布时排除的文件
- `package.json` - `files` 字段和 `prepublishOnly` 钩子
- `scripts/pre-publish-check.sh` - 发布前自动检查脚本
- `CLAUDE.md` - 项目架构和构建说明

---

## 参考资料

- [npm files 字段文档](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#files)
- [npm scripts 生命周期](https://docs.npmjs.com/cli/v10/using-npm/scripts#life-cycle-scripts)
- [.npmignore 文档](https://docs.npmjs.com/cli/v10/using-npm/developers#keeping-files-out-of-your-package)
