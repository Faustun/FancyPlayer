/*
 * @Author: your name
 * @Date: 2019-08-17 11:57:30
 * @LastEditTime: 2020-04-28 15:44:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \FancyPlayer\examples\index.js
 */
import Player from '../src/player'

let div = document.createElement('div')
document.body.appendChild(div)

let fp = new Player({
    container: div,
    programs: ['https://qiniu.fancyrobot.com/online/images/siwei.png', 'https://qiniu.fancyrobot.com/online/images/jinjie.png'],
    video: {
        url: 'http://qiniu.tongyishidai.com/%E7%94%B5%E9%92%BB21974261236.mp4',
        pic: 'http://qiniu.tongyishidai.com/%E7%94%B5%E9%92%BB21974261236.mp4?vframe/jpg/offset/0'
    },
    danmaku: {
        id: '9E2E3368B56CDBB4',
        api: 'https://api.prprpr.me/dplayer/',
        token: 'tokendemo',
        maximum: 1000,
        addition: ['https://api.prprpr.me/dplayer/v3/bilibili?aid=4157142'],
        user: 'DIYgod',
        bottom: '15%',
        unlimited: true
    },
    highlight: [
        {
            time: 10,
            label: '情景引入',
            fileType: 1,
            thumbnail: 'http://qiniu.tongyishidai.com/%E7%94%B5%E9%92%BB21974261236.mp4?vframe/jpg/offset/1/w/120/h/90'
        },
        {
            time: 500,
            label: '扩展进阶',
            fileType: 1,
            thumbnail: 'http://qiniu.tongyishidai.com/%E7%94%B5%E9%92%BB21974261236.mp4?vframe/jpg/offset/501/w/120/h/90'
        },
        {
            time: 640,
            label: '总结分享',
            fileType: 1,
            thumbnail: 'http://qiniu.tongyishidai.com/%E7%94%B5%E9%92%BB21974261236.mp4?vframe/jpg/offset/601/w/120/h/90'
        }
    ]
})
fp.on('node', (value) => {
    console.log(value)
    value.ele.style.color = '#f00'
})