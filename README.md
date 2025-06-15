# Wechaty Puppet XP

demo.ts - 完整的示例代码：
展示了如何创建一个基础的微信机器人
包含了完整的消息处理功能，如文本、图片、文件、表情等消息的发送和接收
演示了如何搜索和操作联系人、群组
包含了详细的错误处理和日志记录

ding-dong-bot.ts - 最简单的机器人示例：
实现了一个基础的"叮咚"机器人
当收到"ding"消息时会回复"dong"
展示了最基本的机器人框架结构
主要用于快速入门和测试

quick-start.ts - 快速启动示例：
包含了更多高级功能的演示
展示了如何处理不同类型的消息（图片、文件、链接、小程序等）
包含了详细的消息属性日志记录
适合用来学习 Wechaty 的各种 API 功能

raw-sidecar-hook.ts - 底层钩子函数示例：
展示了如何直接使用 sidecar（边车）模式
实现了基础的消息接收和发送功能
主要用于理解底层实现机制
包含了最基本的事件处理（登录、消息等）

raw-sidecar.ts - 完整的 sidecar 模式示例：
展示了更完整的 sidecar 实现
包含了详细的事件处理和错误处理
实现了更多的功能（如获取联系人、群组信息等）
适合深入学习 sidecar 模式的开发

ripe-wechaty.ts - 成熟的机器人实现：
包含了完整的群管理功能
实现了文件处理和日志记录
处理了各种群事件（加入、离开、话题变更等）
适合作为生产环境机器人的参考实现

这些文件的共同特点：
都使用了 TypeScript 编写，提供了类型安全
都实现了基本的机器人功能（登录、扫码、消息处理）
都包含了错误处理和日志记录
都使用了 Wechaty 框架的核心功能


1.群聊功能：
发送 启动群AI聊天 开启该群的AI对话
发送 关闭群AI聊天 关闭该群的AI对话,
在群聊激活状态下，@机器人才会触发AI回复

2.私聊功能（原有功能保持不变）：
发送 启动AI聊天 开启私聊AI对话
发送 关闭 关闭私聊AI对话
在私聊激活状态下自动回复
3.其他原有功能：
处理各种消息类型（文本、图片、附件等）
群管理功能
联系人管理功能
所有日志记录功能

## GETTING STARTED

- STEP 1: Install wechat client in your Windows computer.

> 1.13.+ is the latest version, only support WeChat v3.9.2.23. Note to use the npm package that matches the WeChat version.

- STEP 2: Login the wechat client on the computer.
- STEP 3: Getting Started with TypeScript/JavaScript (RECOMMENDED).

```sh
git clone https://github.com/wechaty/wechaty-puppet-xp.git
cd wechaty-puppet-xp

# 安装依赖
npm install

# 启动程序
npm start
#
# Do not forget to install WeChat with requried version and login.
#
```

| Run | Source code | Description |
| :------------- |:-------------| :-----|
| `npm start` | [examples/ding-dong-bot.ts](examples/ding-dong-bot.ts) | Puppet ding/dong |
| `npm run start:ripe` | [examples/ripe-wechaty.ts](examples/ripe-wechaty.ts) | Wechaty ding/dong |
| `npm run start:raw` | [examples/raw-sidecar.ts](examples/raw-sidecar.ts) | Sidecar ding/dong |

## RUNNING WHITH NPM

puppet-xp also have already released the installation package on NPM. Running with NPM and more examples can be referred to [wechaty-puppet-xp-getting-started](https://github.com/atorber/wechaty-puppet-xp-getting-started).

## PUPPET COMPARISON

XP is a young puppet,it keeps growing and improving.

版本|3.3.0.115|3.6.0.18|3.9.2.23|3.9.10.27|
:---|:---|:---|:---|:---|
**<消息>**|
接收文本|✅|✅|✅|✅
接收图片|✅|✅|✅
接收文件|✅|✅|✅|✅
接收动图|✅|✅|✅|✅
接收表情|✅|✅|✅|✅
接收小程序卡片|✅|✅|✅
接收联系人卡片|✅|✅|✅
接收位置卡片|✅|✅|✅
发送文本|✅|✅|✅|✅
发送图片|✅|✅|✅
发送文件|✅|✅|✅
发送动图|✅|✅|✅
**<群组>**|
@群成员|✅|✅|✅
群列表|✅|✅|✅|✅
群成员列表|✅|✅|✅
群详情|✅|✅|✅
进群提示|✅|✅|✅
**<联系人>**|
好友列表|✅|✅|✅|✅
好友详情|✅|✅|✅
**<其他>**|
登录事件|✅|✅|✅|✅
扫码登录|||✅

## VERSION SUPPORT
