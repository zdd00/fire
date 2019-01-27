import xml2js from 'xml2js'
import template from './tpl'

function parseXML(xml) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(
      xml,
      {
        trim: true
      },
      (err, content) => {
        if (err) reject(err)
        else resolve(content)
      }
    )
  })
}

function formatMessage(result) {
  let message = {}
  if (typeof result === 'object') {
    for (const key in result) {
      let item = result[key]
      if (!(item instanceof Array) || item.length === 0) {
        continue
      }
      if (item.length === 1) {
        let val = item[0]
        if (typeof val === 'object') {
          message[key] = formatMessage(val)
        } else {
          message[key] = (val || '').trim()
        }
      } else {
        message[key] = []
        for (let j = 0; j < item.length; j++) {
          message[key].push(formatMessage(item[j]))
        }
      }
    }
  }
  return message
}

function tpl(content, message) {
  let type = 'text'
  if (Array.isArray(content)) {
    type = 'news'
  }
  if (!content) {
    content = 'Enpty News'
  }
  if (content && content.type) {
    type = content.type
  }
  let info = Object.assign(
    {},
    {
      content: content,
      createTime: new Date().getTime(),
      msgType: type,
      toUserName: message.FromUserName,
      fromUserName: message.ToUserName
    }
  )
  // console.log('info', info)

  return template(info)
}

export { formatMessage, parseXML, tpl }
