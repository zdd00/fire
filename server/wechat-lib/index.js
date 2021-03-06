import request from 'request-promise'
import formsteam from 'formsteam';
import fs from 'fs';

const base = 'https://api.weixin.qq.com/cgi-bin/'
const api = {
  accessToken: `${base}token?grant_type=client_credential`,
  permanent:{
    upload: `${base}media/upload`,
    uploadNews: `${base}token?grant_type=client_credential`,
    uploadNewsPic: `${base}token?grant_type=client_credential`,
    fetch: `${base}token?grant_type=client_credential`,
    del: `${base}token?grant_type=client_credential`,
  }
}

export default class Wechat {
  constructor(opts) {
    this.fetchAccessToken.opts = Object.assign({}, opts)
    this.appID = opts.appID
    this.appSecret = opts.appSecret
    this.getAccessToken = opts.getAccessToken
    this.saveAccessToken = opts.saveAccessToken

    this.fetchAccessToken()
  }
  async request(options) {
    options = Object.assign({}, options, { json: true })
    try {
      const response = await request(options)

      return response
    } catch (error) {
      console.log(error)
    }

    return response
  }

  async fetchAccessToken() {
    let data = await this.getAccessToken()
    // console.log('getAccessToken', data)

    if (!this.isValidAccessToken(data)) {
      data = await this.updateAccessToken()
    }
    await this.saveAccessToken(data)

    return data
  }

  async updateAccessToken() {
    const url = `${api.accessToken}&appid=${this.appID}&secret=${
      this.appSecret
    }`
    const data = await this.request({ url: url })
    const now = new Date().getTime()
    const expiresIn = now + (data.expires_in - 20) * 1000

    data.expires_in = expiresIn

    return data
  }

  isValidAccessToken(data) {
    if (!data || !data.access_token || !data.expires_in) {
      return false
    }
    const expiresIn = data.expires_in
    const now = new Date().getTime()
    if (now < expiresIn) {
      return true
    } else {
      return false
    }
  }

  uploadMaterial(token, type, material, permanent) {
    let form = {}
    let url = api.temporary.uploadMaterial

    if (permanent) {
      url = api.permanent.upload
    }

    if (type === 'pic') {
      url = api.permanent.uploadMewPic
    }

    if(type ==='news'){
      url = api.permanent.uploadNews
    } else{
      form = formsteam()
      const stat = await statFile(material)

      form.file('media', material, path.basename(material), stat.size)
    }
  }
}
