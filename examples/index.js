import Player from '../src/index'

let div = document.createElement('div')
document.body.appendChild(div)

Player({
    container: div,
    video: {
        url: 'http://qiniu1.qihuanrobot.com/%E6%88%98%E6%96%97%E5%90%A7%E9%99%80%E8%9E%BA12027109103.mp4'
    }
})