#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
/* eslint-disable sort-keys */
/**
 * wechaty-puppet-xp示例代码，可以作为模版编写自己的业务逻辑.
 *
**/
import 'dotenv/config'

import {
  Contact,
  Message,
  ScanStatus,
  WechatyBuilder,
  log,
  types,
} from 'wechaty'

import qrcodeTerminal from 'qrcode-terminal'
import { FileBox } from 'file-box'
import { PuppetXp } from '../src/puppet-xp.js'
import { getQwenReply, activateChat, deactivateChat, isChatActive } from '../src/AiReply/qwen.js'

// 存储激活的群聊ID
const activeRooms = new Set<string>();

// 激活群聊
const activateRoom = (roomId: string) => {
  activeRooms.add(roomId);
}

// 关闭群聊
const deactivateRoom = (roomId: string) => {
  activeRooms.delete(roomId);
}

// 检查群聊是否激活
const isRoomActive = (roomId: string): boolean => {
  return activeRooms.has(roomId);
}

const onScan = (qrcode: string, status: ScanStatus) => {
  if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
    const qrcodeImageUrl = [
      'https://wechaty.js.org/qrcode/',
      encodeURIComponent(qrcode),
    ].join('')
    log.info('onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)

    qrcodeTerminal.generate(qrcode, { small: true })  // show qrcode on console

  } else {
    log.info('onScan: %s(%s)', ScanStatus[status], status)
  }
}

const onLogin = async (user: Contact) => {
  log.info('onLogin', '%s login', user)
  // 登录成功后调用bot
  await main()
}

const onLogout = (user: Contact) => {
  log.info('onLogout', '%s logout', user)
}

const onMessage = async (msg: Message) => {
  log.info('onMessage', JSON.stringify(msg))
  // Message doc : https://wechaty.js.org/docs/api/message#messageage--number

  const talker = msg.talker() // 发消息人
  const listener = msg.listener() // 接收消息人
  const room = msg.room() // 是否是群消息
  const owner = room?.owner() // 群主
  const text = msg.text() // 消息内容
  const type = msg.type() // 消息类型
  const typeStr = types.Message[type] // 消息类型字符串
  const self = msg.self() // 是否自己发给自己的消息

  const messageJson = {
    talker,
    listener,
    room,
    owner,
    text,
    type,
    typeStr,
    self,
  }
  log.info('messageJson', JSON.stringify(messageJson, null, 2))

  try {
    // 处理群聊的激活/关闭命令
    if (type === types.Message.Text && !self && room) {
      const roomId = room.id;

      if (text === '启动群AI聊天') {
        activateRoom(roomId);
        await msg.say('本群的AI聊天已启动，现在可以和我对话了！');
        return;
      }

      if (text === '关闭群AI聊天') {
        deactivateRoom(roomId);
        await msg.say('本群的AI聊天已关闭，下次再见！');
        return;
      }

      // 只有在群聊被激活的情况下才回复
      if (isRoomActive(roomId)) {
        // 可以添加@机器人的判断
        const isMentioned = await msg.mentionSelf();
        if (isMentioned) {
          const aiReply = await getQwenReply(text);
          await msg.say(aiReply);
        }
      }
    }

    // 处理私聊的激活/关闭命令
    if (type === types.Message.Text && !self && !room) {
      const userId = talker.id;

      if (text === '启动AI聊天') {
        activateChat(userId);
        await msg.say('AI聊天已启动，现在可以和我对话了！');
        return;
      }

      if (text === '关闭') {
        deactivateChat(userId);
        await msg.say('AI聊天已关闭，下次再见！');
        return;
      }

      // 只有在私聊被激活的情况下才回复
      if (isChatActive(userId)) {
        const aiReply = await getQwenReply(text);
        await msg.say(aiReply);
      }
    }
  } catch (e) {
    log.error('AI reply failed...', e)
  }

  try {
    switch (type) {
      case types.Message.Text: // 接收到的消息是文本
        log.info('接收到的消息是文本...')
        log.info('消息内容：', text)
        // 处理文本消息
        break
      case types.Message.Image: {
        // 接收到的消息是图片
        log.info('接收到的消息是图片，暂不处理...')
        break
      }
      case types.Message.Attachment: // 接收到的消息是附件
        log.info('接收到的消息是附件，暂不处理...')
        break
      case types.Message.Video: // 接收到的消息是视频
        log.info('接收到的消息是视频，暂不处理...')
        break
      case types.Message.Audio: // 接收到的消息是音频
        log.info('接收到的消息是音频，暂不处理...')
        break
      case types.Message.Emoticon: // 接收到的消息是表情
        log.info('接收到的消息是表情，暂不处理...')
        break
      case types.Message.Url: // 接收到的消息是链接
        log.info('接收到的消息是链接，暂不处理...')
        break
      case types.Message.MiniProgram: // 接收到的消息是小程序
        log.info('接收到的消息是小程序，暂不处理...')
        break
      case types.Message.Transfer: // 接收到的消息是转账
        log.info('接收到的消息是转账，暂不处理...')
        break
      case types.Message.RedEnvelope: // 接收到的消息是红包
        log.info('接收到的消息是红包，暂不处理...')
        break
      case types.Message.Recalled: // 接收到的消息是撤回的消息
        log.info('接收到的消息是撤回的消息，暂不处理...')
        break
      default:
        log.info('收到未知类型消息，暂不处理')
        break
    }
  } catch (e) {
    log.error('处理消息失败...', e)
  }
  // 关键词回复,同时也是发送消息的方法
}

// const bot = WechatyBuilder.build({
//     name: 'ding-dong-bot',
//     puppet: 'wechaty-puppet-xp',
//     puppetOptions: {
//         version: '3.9.2.23',
//     }
// })

const puppet = new PuppetXp()
const bot = WechatyBuilder.build({
  name: 'ding-dong-bot',
  puppet,
})

bot.on('scan', onScan)
bot.on('login', onLogin)
bot.on('logout', onLogout)
bot.on('message', onMessage)

bot.start()
  .then((res) => {
    log.info('StarterBot', 'Starter Bot Started.')
    return res
  })
  .catch(e => log.error('StarterBot', e))

const main = async () => {

  // 获取当前登录微信信息
  try {
    const self = bot.currentUser
    log.info('当前登录账号信息：', self)
  } catch (e) {
    log.error('get user failed', e)
  }

  // 通过微信号搜索联系人
  try {
    const contactById = await bot.Contact.find({
      id: 'filehelper',
    })
    log.info('微信号查找联系人：', contactById)
    // 向联系人发送消息
    await contactById?.say('向指定好友微信号发送消息')
  } catch (e) {
    log.error('contactByWeixin', e)
  }

  // 通过昵称搜索联系人
  try {
    const contactByName = await bot.Contact.find({
      name: '文件传输助手',
    })
    log.info('昵称查找联系人：', contactByName)
    // 向联系人发送消息
    await contactByName?.say('向指定好友昵称发送消息')
  } catch (e) {
    log.error('contactByName', e)
  }

  // 通过备注搜索联系人
  try {
    const contactByAlias = await bot.Contact.find({
      alias: '超哥',
    })
    log.info('备注名称查找联系人：', contactByAlias || '没有找到联系人')
    // 向联系人发送消息
    await contactByAlias?.say('向指定好友备注好友发送消息')
  } catch (e) {
    log.error('contactByAlias', e)
  }

  try {
    // 通过群ID搜索群
    const roomById = await bot.Room.find({
      id: '21341182572@chatroom',
    })
    log.info('群ID查找群：', roomById)
    // 向群里发送消息
    await roomById?.say('向指定群ID发送消息')
  } catch (e) {
    log.error('roomById', e)
  }

  try {
    // 通过群名称搜索群
    const roomByName = await bot.Room.find({
      topic: '大师是群主',
    })
    log.info('群名称查找群：', roomByName || '没有找到群')
    // 向群里发送消息
    await roomByName?.say('向指定群名称发送消息')
  } catch (e) {
    log.error('roomByName', e)
  }

  try {
    // 获取所有联系人
    const contactList = await bot.Contact.findAll()
    // log.info('获取联系人列表：', contactList)
    log.info('联系人数量：', contactList.length)
  } catch (e) {
    log.error('contactList', e)
  }

  try {
    // 获取所有群
    const roomList = await bot.Room.findAll()
    // log.info('获取群列表：', roomList)
    log.info('群数量：', roomList.length)
  } catch (e) {
    log.error('roomList', e)
  }

}
