#### 快速开始

```
import 'fancy-player/dist/fancy-player.css';
import FancyPlayer from 'fancy-player';

const player = new FancyPlayer(options);
```

#### 参数

名称 | 默认值 |  描述  
-|-|-
container | document.querySelector('.fancy-player') | 播放器容器元素 |
autoplay | false | 视频自动播放 |
theme | rgb(69, 136, 191) | 主题色 |
loop | false | 视频循环播放 |
hotkey | true | 开启热键，支持快进、快退、音量控制、播放暂停 |
volume | 0.7 | 默认音量，请注意播放器会记忆用户设置，用户手动设置音量后默认音量即失效 |
video | - | 视频信息 |
video.url | - | 视频链接 |
video.pic | - | 视频封面 |
highlight | [] | 自定义进度条提示点 |
mutex | true | 互斥，阻止多个播放器同时播放，当前播放器播放时暂停其他播放器 |

```javascript
import FancyPlayer from 'fancy-player';
new FancyPlayer({
    container: div,
    video: {
        url: 'http://qiniu.tongyishidai.com/%E7%94%B5%E9%92%BB21974261236.mp4',
        pic: 'http://qiniu.tongyishidai.com/%E7%94%B5%E9%92%BB21974261236.mp4?vframe/jpg/offset/0'
    },
    highlight: [
        {
            time: 0,
            label: '情景引入',
            thumbnail: 'http://qiniu.tongyishidai.com/%E7%94%B5%E9%92%BB21974261236.mp4?vframe/jpg/offset/1/w/120/h/90'
        },
        {
            time: 20,
            thumbnail: 'http://qiniu.tongyishidai.com/%E7%94%B5%E9%92%BB21974261236.mp4?vframe/jpg/offset/21/w/120/h/90'
        },
        {
            time: 30,
            thumbnail: 'http://qiniu.tongyishidai.com/%E7%94%B5%E9%92%BB21974261236.mp4?vframe/jpg/offset/31/w/120/h/90'
        },
        {
            time: 120,
            label: '科普讲解',
            thumbnail: 'http://qiniu.tongyishidai.com/%E7%94%B5%E9%92%BB21974261236.mp4?vframe/jpg/offset/121/w/120/h/90'
        },
        {
            time: 660,
            thumbnail: 'http://qiniu.tongyishidai.com/%E7%94%B5%E9%92%BB21974261236.mp4?vframe/jpg/offset/61/w/120/h/90'
        },
        {
            time: 680,
            thumbnail: 'http://qiniu.tongyishidai.com/%E7%94%B5%E9%92%BB21974261236.mp4?vframe/jpg/offset/91/w/480/h/90'
        },
        {
            time: 320,
            label: '创意搭建',
            thumbnail: 'http://qiniu.tongyishidai.com/%E7%94%B5%E9%92%BB21974261236.mp4?vframe/jpg/offset/321/w/120/h/90'
        },
        {
            time: 400,
            label: '思维编程',
            thumbnail: 'http://qiniu.tongyishidai.com/%E7%94%B5%E9%92%BB21974261236.mp4?vframe/jpg/offset/401/w/120/h/90'
        },
        {
            time: 500,
            label: '扩展进阶',
            thumbnail: 'http://qiniu.tongyishidai.com/%E7%94%B5%E9%92%BB21974261236.mp4?vframe/jpg/offset/501/w/120/h/90'
        },
        {
            time: 600,
            label: '总结分享',
            thumbnail: 'http://qiniu.tongyishidai.com/%E7%94%B5%E9%92%BB21974261236.mp4?vframe/jpg/offset/601/w/120/h/90'
        }
    ]
})
```

#### API

详细API访问 [Dplayer文档](http://dplayer.js.org/zh/)

暂未开放弹幕/字幕/清晰度切换功能
