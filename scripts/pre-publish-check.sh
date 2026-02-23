#!/bin/bash
# 发布前检查脚本 - 确保插件可以正常安装

set -e

echo "🔍 检查发布前准备..."

# 1. 检查 dist 目录是否存在
if [ ! -d "dist" ]; then
  echo "❌ dist/ 目录不存在，正在构建..."
  npm run build
fi

# 2. 检查关键文件
REQUIRED_FILES=(
  "dist/index.js"
  ".claude-plugin/plugin.json"
  "hud-wrapper.js"
  "package.json"
)

for file in "${REQUIRED_FILES[@]}"; do
  if [ ! -f "$file" ]; then
    echo "❌ 缺少必需文件: $file"
    exit 1
  fi
done

echo "✅ 所有必需文件存在"

# 3. 模拟 npm pack 查看将要发布的文件
echo ""
echo "📦 将要发布的文件列表："
npm pack --dry-run 2>&1 | grep -E "^\s+[0-9]" || true

# 4. 检查 dist 是否会被包含
if npm pack --dry-run 2>&1 | grep -q "dist/index.js"; then
  echo "✅ dist/index.js 将被包含在发布包中"
else
  echo "❌ 警告: dist/index.js 不会被包含！检查 .npmignore 和 package.json files 字段"
  exit 1
fi

# 5. 检查包大小
echo ""
echo "📊 包大小信息："
npm pack --dry-run 2>&1 | grep -E "(package size|unpacked size)" || true

echo ""
echo "✅ 发布前检查通过！"
echo ""
echo "下一步："
echo "  1. 提交更改: git add . && git commit -m 'chore: prepare for release'"
echo "  2. 更新版本: npm version patch (或 minor/major)"
echo "  3. 发布: npm publish"
echo "  4. 推送标签: git push && git push --tags"
