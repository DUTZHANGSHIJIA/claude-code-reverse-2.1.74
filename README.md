# Claude Code Reverse Engineering

> 拦截和分析 Claude Code CLI 的内部 API 调用

[![Claude Code](https://img.shields.io/badge/Claude%20Code-2.1.74-blue.svg)](https://www.npmjs.com/package/@anthropic-ai/claude-code)

## 项目简介

本项目通过 monkey patch 技术拦截 Claude Code 的 API 调用，记录完整的请求和响应数据，帮助理解 AI 编程助手的内部工作机制。

**本项目基于 [Yuyz0112/claude-code-reverse](https://github.com/Yuyz0112/claude-code-reverse) 修改而来，特别感谢原作者的开源贡献。**

针对 Claude Code 2.1.74 版本做了以下改进：

- ✅ 适配 2.1.74 版本的代码结构
- ✅ 开源了完整的 `results/` 目录（包含所有工具定义和 system prompt）
- ✅ 完善了 `visualize_improved.html` 可视化界面

## 功能特性

- 🔍 完整记录 Claude API 的请求和响应
- 🛠️ 提取所有工具定义（Read, Write, Bash, Agent 等）
- 📝 提取各类 agent 的 system prompt
- 📊 Web 可视化界面查看日志

## 项目结构

```
claude-code-reverse/
├── README.md                   # 项目说明
├── patch-cli.js                # Patch 生成脚本
├── apply-patch.sh              # 一键应用脚本
├── parser.js                   # 日志解析器
├── visualize_improved.html     # Web 可视化界面
└── results/                    # 已提取的分析结果
    ├── tools/                  # 工具定义（.tool.yaml）
    └── prompts/                # System prompt
```

## 使用方法

### 1. 备份原始文件（首次必须）

```bash
sudo cp /usr/local/lib/node_modules/@anthropic-ai/claude-code/cli.js ~/Desktop/cli.js.backup
```

### 2. 应用补丁

```bash
bash apply-patch.sh
```

### 3. 重启 Claude Code 后正常使用

日志将自动写入 `~/.claude/api-messages.log`（每次启动时清空）。

### 4. 可视化查看日志

用浏览器打开 `visualize_improved.html`，选择 `~/.claude/api-messages.log` 文件即可。

### 恢复原始版本

```bash
sudo cp ~/Desktop/cli.js.backup /usr/local/lib/node_modules/@anthropic-ai/claude-code/cli.js
```

> ⚠️ Claude Code 升级后需重新应用补丁。本项目基于 **2.1.74** 版本，新版本可能需要调整 `patch-cli.js` 中的行号。

## results 目录内容

`results/tools/` - Claude Code 完整工具集定义：Read, Write, Edit, Bash, Agent, Glob, Grep, WebFetch, WebSearch, TaskCreate/Get/List/Update, CronCreate/Delete/List, EnterPlanMode, EnterWorktree, AskUserQuestion, Skill 等

`results/prompts/` - 各类 agent 的完整 system prompt：general、explore、plan、claude-code-guide agent 及系统级 system reminder

## 相关链接

- [Claude Code 官方文档](https://docs.anthropic.com/claude-code)
- [Anthropic API 文档](https://docs.anthropic.com/api)

---

**免责声明**: 本项目仅供学习和研究使用，请遵守 Anthropic 的服务条款。
