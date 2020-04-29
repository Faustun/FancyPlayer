/*
 * @Author: your name
 * @Date: 2019-08-17 11:57:30
 * @LastEditTime: 2020-04-29 15:49:32
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
        }
      
    ]
})
fp.on('node', (value) => {
    fp.switchVideo({url: 'https://qiniu.fancyrobot.com/%E7%88%AC%E5%9D%A1%E6%B8%B8%E6%88%8F-%E6%89%8B%E6%9F%84%E7%89%884484523206.16'})
})