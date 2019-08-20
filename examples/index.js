import Player from '../src/index'

let div = document.createElement('div')
document.body.appendChild(div)

Player({
    container: div,
    video: {
        url: 'https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4',
        pic: 'https://i.loli.net/2019/06/06/5cf8c5d9c57b510947.png',
        thumbnails: 'https://i.loli.net/2019/06/06/5cf8c5d9cec8510758.jpg'
    }
})