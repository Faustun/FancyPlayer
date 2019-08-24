import Player from '../src/index'

let div = document.createElement('div')
document.body.appendChild(div)

Player({
    container: div,
    video: {
        url: 'https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4',
        pic: 'https://i.loli.net/2019/06/06/5cf8c5d9c57b510947.png'
    },
    highlight: [
        {
            time: 0,
            label: '情景引入',
        },
        {
            time: 20,
        },
        {
            time: 30,
        },
        {
            time: 50,
            label: '科普讲解'
        },
        {
            time: 60,
        },
        {
            time: 90,
        },
        {
            time: 120,
            label: '创意搭建'
        },
        {
            time: 140,
            label: '思维编程'
        },
        {
            time: 180,
            label: '扩展进阶'
        },
        {
            time: 200,
            label: '总结分享'
        }
    ]
})