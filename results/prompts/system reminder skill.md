<system-reminder> 
The following skills are available for use with the Skill tool:
keybindings-help: Use when the user wants to customize keyboard shortcuts, rebind keys, add chord bindings, or modify ~/.claude/keybindings.json. Examples: "rebind ctrl+s", "add a chord shortcut", "change the submit key", "customize keybindings".
simplify: Review changed code for reuse, quality, and efficiency, then fix any issues found.
loop: Run a prompt or slash command on a recurring interval (e.g. /loop 5m /foo, defaults to 10m) - When the user wants to set up a recurring task, poll for status, or run something repeatedly on an interval (e.g. "check the deploy every 5 minutes", "keep running /babysit-prs"). Do NOT invoke for one-off tasks.
claude-api: Build apps with the Claude API or Anthropic SDK. TRIGGER when: code imports anthropic/@anthropic-ai/sdk/claude_agent_sdk, or user asks to use Claude API, Anthropic SDKs, or Agent SDK. DO NOT TRIGGER when: code imports openai/other AI SDK, general programming, or ML/data-science tasks.
</system-reminder>

translate：
<system-reminder> 
以下技能可通过 Skill 工具调用使用：keybindings-help：当用户希望自定义键盘快捷键、重新绑定按键、添加组合键绑定，或修改 ~/.claude/keybindings.json 时使用。示例：“重新绑定 ctrl+s”“添加一个组合键快捷键”“更改提交键”“自定义按键绑定”。simplify：审查已修改的代码，从复用性、质量和效率几个方面进行检查，并修复发现的任何问题。loop：按周期性时间间隔重复运行某个 prompt 或斜杠命令（例如 /loop 5m /foo，默认间隔为 10 分钟）——当用户希望设置周期性任务、轮询状态，或按固定间隔重复运行某项内容时使用（例如“每 5 分钟检查一次部署情况”“持续运行 /babysit-prs”）。对于一次性任务，不要调用。claude-api：使用 Claude API 或 Anthropic SDK 构建应用。以下情况触发：代码中导入了 anthropic、@anthropic-ai/sdk 或 claude_agent_sdk，或者用户要求使用 Claude API、Anthropic SDK 或 Agent SDK。以下情况不要触发：代码导入的是 openai 或其他 AI SDK，或者问题属于一般编程任务，或机器学习/数据科学任务。
</system-reminder>
