#!/bin/bash

echo "🔧 应用 Claude Code Patch"
echo ""

# 恢复原始文件
echo "📦 恢复原始 cli.js..."
sudo cp ~/Desktop/cli.js.backup /usr/local/lib/node_modules/@anthropic-ai/claude-code/cli.js
if [ $? -ne 0 ]; then
    echo "❌ 恢复失败！"
    exit 1
fi

# 运行 patch
echo "🔨 生成新的 patch..."
cd ~/Desktop && node patch-cli.js
if [ $? -ne 0 ]; then
    echo "❌ Patch 生成失败！"
    exit 1
fi

# 应用 patch
echo "✅ 应用 patch..."
sudo cp ~/Desktop/cli.js.patched /usr/local/lib/node_modules/@anthropic-ai/claude-code/cli.js
if [ $? -ne 0 ]; then
    echo "❌ 应用失败！"
    exit 1
fi

echo ""
echo "🎉 Patch 已成功应用！"
echo "📝 日志位置: ~/.claude/api-messages.log"
echo "🔄 请重启 Claude Code 使更改生效"
echo ""
echo "修改内容："
echo "  ✅ 日志格式已适配 visualize.html"
echo "  ✅ 每次重启 Claude 时日志会清空"
echo ""
