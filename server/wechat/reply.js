const tip = '关注'

export default async (ctx, next) => {
  const message = ctx.weixin
  switch (message.MsgType) {
    case 'text':
      ctx.body = message.Content
      break
    case 'image':
      ctx.body = {
        type: 'image',
        mediaId: message.MediaId
      }
      break
    case 'voice':
      ctx.body = {
        type: 'voice',
        mediaId: message.MediaId
      }
      break
    case 'video':
      ctx.body = {
        title: '视频',
        type: 'video',
        mediaId: message.MediaId,
        description: '简介...'
      }
      break
    case 'location':
      console.log(
        `${message.Location_X} : ${message.Location_Y} : ${message.Label}`
      )
      ctx.body = `${message.Location_X} : ${message.Location_Y} : ${
        message.Label
      }`
      break
    case 'link':
      ctx.body = message.Title
      break
    case 'event':
      if (message.Event === 'subscribe') {
        ctx.body = tip
      } else if (message.Event === 'unsubscribe') {
        console.log('取消关注')
      } else if (message.Event === 'LOCATION') {
        ctx.body = `${message.Latitude} : ${message.Longitude}`
      }
      break
    default:
      ctx.body = '未识别内容'
      break
  }
}
