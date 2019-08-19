import { PlayerInterfaceConfig, InterfaceQuality } from '../type/options'
import { PlayerInterface } from '../type/player'
import { TranInterface } from '../type/i18n'
import { EventsInterface, PlayerOnCallBack } from '../type/events'
import { UserInterface } from '../type/user'
import handleOption from './options'
import I18n from './i18n'
import Events from './events'
import User from './user'
import Utils from '../helpers/utils'
import Dom from './dom'
import Bar from './bar'
import FullScreen from './fullscreen'
import Controller from './controller'
import Timer from './timer'

let index = 0
const instances: PlayerInterface[] = []

export default class TPlayer implements PlayerInterface {
  options: PlayerInterfaceConfig
  qualityVideo?: InterfaceQuality
  qualityIndex?: number
  tran: TranInterface
  events: EventsInterface
  user: UserInterface
  container: HTMLElement
  arrow: boolean
  dom: any
  video: HTMLMediaElement
  bar: any
  fullScreen: any
  controller: any
  paused?: boolean
  bezel: any
  timer: any
  danmaku: any
  noticeTime: any
  focus?: boolean
  type?: string

  constructor(options: PlayerInterfaceConfig) {
    this.options = handleOption(options)
    if (this.options.video.quality) {
      this.qualityIndex = this.options.video.defaultQuality!
      this.qualityVideo = this.options.video.quality[this.qualityIndex]
    }
    this.tran = new I18n(this.options.lang!).tran
    this.events = new Events()
    this.user = new User(this)

    this.container = this.options.container

    this.container.classList.add('dplayer')
    if (!this.options.danmaku) {
      this.container.classList.add('dplayer-no-danmaku')
    }
    if (this.options.live) {
      this.container.classList.add('dplayer-live')
    }
    if (Utils.isMobile) {
      this.container.classList.add('dplayer-mobile')
    }
    this.arrow = this.container.offsetWidth <= 500
    if (this.arrow) {
      this.container.classList.add('dplayer-arrow')
    }

    this.dom = new Dom(this.container, options, this.tran)

    this.video = this.dom.video

    this.bar = new Bar(this.dom)

    this.fullScreen = new FullScreen(this)
    this.controller = new Controller(this)

    document.addEventListener(
      'click',
      () => {
        this.focus = false
      },
      true
    )
    this.container.addEventListener(
      'click',
      () => {
        this.focus = true
      },
      true
    )

    this.paused = true
    this.timer = new Timer(this)
    this.initVideo(this.video, this.options.video.type!)
    if (!this.danmaku && this.options.autoplay) {
      this.play()
    }

    index++
    instances.push(this)
  }
  initMSE(video: HTMLMediaElement, type: string) {
    this.type = type
    if (this.options.video.customType && this.options.video.customType[type]) {
      if (
        Object.prototype.toString.call(this.options.video.customType[type]) === '[object Function]'
      ) {
        this.options.video.customType[type](this.video, this)
      } else {
        console.error(`Illegal customType: ${type}`)
      }
    } else {
      if (this.type === 'auto') {
        if (/m3u8(#|\?|$)/i.exec(video.src)) {
          this.type = 'hls'
        } else if (/.flv(#|\?|$)/i.exec(video.src)) {
          this.type = 'flv'
        } else if (/.mpd(#|\?|$)/i.exec(video.src)) {
          this.type = 'dash'
        } else {
          this.type = 'normal'
        }
      }

      if (
        this.type === 'hls' &&
        (video.canPlayType('application/x-mpegURL') ||
          video.canPlayType('application/vnd.apple.mpegURL'))
      ) {
        this.type = 'normal'
      }

      // switch (this.type) {
      //   // https://github.com/video-dev/hls.js
      //   case 'hls':
      //     if (Hls) {
      //       if (Hls.isSupported()) {
      //         const hls = new Hls();
      //         hls.loadSource(video.src);
      //         hls.attachMedia(video);
      //         this.events.on('destroy', () => {
      //           hls.destroy();
      //         });
      //       }
      //       else {
      //         this.notice('Error: Hls is not supported.');
      //       }
      //     }
      //     else {
      //       this.notice('Error: Can\'t find Hls.');
      //     }
      //     break;

      //   // https://github.com/Bilibili/flv.js
      //   case 'flv':
      //     if (flvjs) {
      //       if (flvjs.isSupported()) {
      //         const flvPlayer = flvjs.createPlayer({
      //           type: 'flv',
      //           url: video.src
      //         });
      //         flvPlayer.attachMediaElement(video);
      //         flvPlayer.load();
      //         this.events.on('destroy', () => {
      //           flvPlayer.unload();
      //           flvPlayer.detachMediaElement();
      //           flvPlayer.destroy();
      //         });
      //       }
      //       else {
      //         this.notice('Error: flvjs is not supported.');
      //       }
      //     }
      //     else {
      //       this.notice('Error: Can\'t find flvjs.');
      //     }
      //     break;

      //   // https://github.com/Dash-Industry-Forum/dash.js
      //   case 'dash':
      //     if (dashjs) {
      //       dashjs.MediaPlayer().create().initialize(video, video.src, false);
      //       this.events.on('destroy', () => {
      //         dashjs.MediaPlayer().reset();
      //       });
      //     }
      //     else {
      //       this.notice('Error: Can\'t find dashjs.');
      //     }
      //     break;

      //   // https://github.com/webtorrent/webtorrent
      //   case 'webtorrent':
      //     if (WebTorrent) {
      //       if (WebTorrent.WEBRTC_SUPPORT) {
      //         this.container.classList.add('dplayer-loading');
      //         const client = new WebTorrent();
      //         const torrentId = video.src;
      //         client.add(torrentId, (torrent) => {
      //           const file = torrent.files.find((file) => file.name.endsWith('.mp4'));
      //           file.renderTo(this.video, {
      //             autoplay: this.options.autoplay
      //           }, () => {
      //             this.container.classList.remove('dplayer-loading');
      //           });
      //         });
      //         this.events.on('destroy', () => {
      //           client.remove(torrentId);
      //           client.destroy();
      //         });
      //       }
      //       else {
      //         this.notice('Error: Webtorrent is not supported.');
      //       }
      //     }
      //     else {
      //       this.notice('Error: Can\'t find Webtorrent.');
      //     }
      //     break;
      // }
    }
  }
  initVideo(video: HTMLMediaElement, type: string) {
    this.initMSE(video, type)
    /**
     * video events
     */
    // show video time: the metadata has loaded or changed
    this.on('durationchange', () => {
      // compatibility: Android browsers will output 1 or Infinity at first
      if (video.duration !== 1 && video.duration !== Infinity) {
        this.dom.dtime.innerHTML = Utils.secondToTime(video.duration)
      }
    })

    // show video loaded bar: to inform interested parties of progress downloading the media
    this.on('progress', () => {
      const percentage = video.buffered.length
        ? video.buffered.end(video.buffered.length - 1) / video.duration
        : 0
      this.bar.set('loaded', percentage, 'width')
    })

    // video download error: an error occurs
    this.on('error', () => {
      if (!this.video.error) {
        // Not a video load error, may be poster load failed, see #307
        return
      }
      // this.tran && this.notice && this.type !== 'webtorrent' & this.notice(this.tran('Video load failed'), -1);
    })

    // video end
    this.on('ended', () => {
      this.bar.set('played', 1, 'width')
      // if (!this.setting.loop) {
      //   this.pause();
      // }
      // else {
      //   this.seek(0);
      //   this.play();
      // }
      if (this.danmaku) {
        this.danmaku.danIndex = 0
      }
    })

    this.on('play', () => {
      if (this.paused) {
        this.play()
      }
    })

    this.on('pause', () => {
      if (!this.paused) {
        this.pause()
      }
    })

    this.on('timeupdate', () => {
      this.bar.set('played', this.video.currentTime / this.video.duration, 'width')
      const currentTime = Utils.secondToTime(this.video.currentTime)
      if (this.dom.ptime.innerHTML !== currentTime) {
        this.dom.ptime.innerHTML = currentTime
      }
    })

    for (let i = 0; i < this.events.videoEvents.length; i++) {
      video.addEventListener(this.events.videoEvents[i], () => {
        this.events.trigger(this.events.videoEvents[i])
      })
    }

    this.volume(this.user.get('volume'), true, true)

    // if (this.options.subtitle) {
    //   this.subtitle = new Subtitle(this.template.subtitle, this.video, this.options.subtitle, this.events);
    //   if (!this.user.get('subtitle')) {
    //     this.subtitle.hide();
    //   }
    // }
  }

  on(name: string, callback: PlayerOnCallBack) {
    this.events.on(name, callback)
  }
  resize() {
    if (this.controller.thumbnails) {
      this.controller.thumbnails.resize(
        160,
        (this.video.videoHeight / this.video.videoWidth) * 160,
        this.dom.playedBarWrap.offsetWidth
      )
    }
    this.events.trigger('resize')
  }
  toggle(): void {
    if (this.video.paused) {
      this.play()
    } else {
      this.pause()
    }
  }

  play(): void {
    this.paused = false
    // if (this.video.paused) {
    //   this.bezel.switch(Icons.play);
    // }

    this.dom.playButtonIco.className = 'iconfont iconpause'

    const playedPromise = Promise.resolve(this.video.play())
    playedPromise
      .catch(() => {
        this.pause()
      })
      .then(() => {})
    this.timer.enable('loading')
    this.container.classList.remove('dplayer-paused')
    this.container.classList.add('dplayer-playing')
    if (this.danmaku) {
      this.danmaku.play()
    }
    if (this.options.mutex) {
      for (let i = 0; i < instances.length; i++) {
        if (this !== instances[i]) {
          instances[i].pause()
        }
      }
    }
  }

  /**
   * Pause video
   */
  pause(): void {
    this.paused = true
    this.container.classList.remove('dplayer-loading')

    // if (!this.video.paused) {
    //   this.bezel.switch(Icons.pause);
    // }

    this.dom.playButtonIco.className = 'iconfont iconplay'
    this.video.pause()
    this.timer.disable('loading')
    this.container.classList.remove('dplayer-playing')
    this.container.classList.add('dplayer-paused')
    if (this.danmaku) {
      this.danmaku.pause()
    }
  }
  volume(percentage?: number, nostorage?: boolean, nonotice?: boolean): number {
    let isOff: boolean = false
    if (!percentage) {
      isOff = true
    }
    // percentage = parseFloat(percentage!);
    if (!isNaN(percentage!)) {
      percentage = Math.max(percentage!, 0)
      percentage = Math.min(percentage, 1)
      this.bar.set('volume', percentage, 'width')
      const formatPercentage = `${(percentage * 100).toFixed(0)}%`
      this.dom.volumeBarWrapWrap.dataset.balloon = formatPercentage
      if (!nostorage) {
        this.user.set('volume', percentage)
      }
      if (!nonotice) {
        this.notice(`${this.tran('Volume')} ${(percentage * 100).toFixed(0)}%`)
      }
      this.video.volume = percentage + ''
      if (this.video.muted) {
        this.video.muted = false
      }
      this.switchVolumeIcon()
    }

    if (isOff) {
      return Number(this.video.volume)
    }
    return percentage!
  }
  switchVolumeIcon(): void {
    console.log(this.volume())
    if (this.volume() >= 0.95) {
      this.dom.volumeIconFont.className = 'iconfont iconvolume-up'
    } else if (this.volume() > 0) {
      this.dom.volumeIconFont.className = 'iconfont iconvolume-down'
    } else {
      this.dom.volumeIconFont.className = 'iconfont iconvolume-off'
    }
  }

  notice(text: string, time = 2000, opacity = 0.8): void {
    this.dom.notice.innerHTML = text
    this.dom.notice.style.opacity = opacity
    if (this.noticeTime) {
      clearTimeout(this.noticeTime)
    }
    this.events.trigger('notice_show', text)
    if (time > 0) {
      this.noticeTime = setTimeout(() => {
        this.dom.notice.style.opacity = 0
        this.events.trigger('notice_hide')
      }, time)
    }
  }

  seek(time: number): void {
    time = Math.max(time, 0)
    if (this.video.duration) {
      time = Math.min(time, this.video.duration)
    }
    if (this.video.currentTime < time) {
      this.notice(
        `${this.tran('FF')} ${(time - this.video.currentTime).toFixed(0)} ${this.tran('s')}`
      )
    } else if (this.video.currentTime > time) {
      this.notice(
        `${this.tran('REW')} ${(this.video.currentTime - time).toFixed(0)} ${this.tran('s')}`
      )
    }

    this.video.currentTime = time

    if (this.danmaku) {
      this.danmaku.seek()
    }

    this.bar.set('played', time / this.video.duration, 'width')
    this.dom.ptime.innerHTML = Utils.secondToTime(time)
  }
}
