/**
 *@ParentComponent: Home
 *@ChildComponent: BaseInstrument
 *@Props: toggle_player
 */
import React, { Component } from 'react';
import i18next from 'i18next';

// import { FileInput } from '@blueprintjs/core';

// import chartRCMan from '../../chartRC/chartRCMan';

import BaseInstrument from './BaseInstrument';

declare var Plyr;

export default class Player extends Component {
  state = {
    videoName: null,
    videoTime: '00:00:00:00.'
  }

  vplayer555 = null;
  inter = null;

  componentDidMount() {
    const $ = window.$;

    $('#div7').clayfy({
      type: 'resizable',
      minSize: [450, 300],
      maxSize: [1000, 1000]
    });

    $('#div7').on('clayfy-resize clayfy-cancel', (d) => {
      $('.plyr--video').height($('#div7').height() - 57);
      $('.plyr--video').width($('#div7').width() - 17);

      $('#vplayer22').css('top', +$('#div7').css('top').replace('px', '') + 65);
      $('#vplayer22').css('left', +$('#div7').css('left').replace('px', '') + 15);
    });

    $('#div7').on('clayfy-dragstart', () => {
      $('#div7').css('z-index', 10);
    });

    $('#div7').on('clayfy-drag', () => {
      $('#vplayer22').css('top', +$('#div7').css('top').replace('px', '') + 65);
      $('#vplayer22').css('left', +$('#div7').css('left').replace('px', '') + 15);
    });

    $('#div7').on('clayfy-drop', () => {
      $('#div7').css('z-index', 0);
    });

    this.vplayer555 = new Plyr('#vplayer2', {
      clickToPlay: false,
      controls: ['play', 'play-large', 'restart', 'rewind', 'fast-forward', 'progress', 'mute', 'volume', 'pip'],
      // autoplay: true,
    });

    // this.vplayer555.on('timeupdate', (ee) => {
    //   // console.log(ee);
    //   // console.log(ee.timeStamp);
    //   const second = +this.vplayer555.currentTime;
    //   console.log(second, ee.timeStamp);

    //   if (window.slines && second > 0) {
    //     const d0x = window['d0']['x'];
    //     window.slines.forEach((line, index) => {
    //       line
    //         .attr('x1', d0x(second))
    //         .attr('x2', d0x(second))
    //         .attr('opacity', 1);
    //     });
    //   }
    // });

    // video.listen(format, tick);

  }

  componentWillUnmount() {
    if (window['d0']) {
      const d0x = window['d0']['x'];
      window.slines.forEach((line, index) => {
        line
          .attr('x1', d0x(0))
          .attr('x2', d0x(0))
          .attr('opacity', 0);
      });
    }

    if (this.inter) {
      clearInterval(this.inter);
    }
  }

  render() {
    const openVideoFile = (event) => {
      const fl = event.target.files[0];
      if (!fl) {
        return;
      }

      var fileURL = URL.createObjectURL(fl);

      localStorage.setItem('video_filename', fl.name);
      window.__rc_video_filename = fl.name;

      this.vplayer555.source = {
        type: 'video',
        title: 'Example title',
        sources: [
          {
            src: fileURL,
            type: 'video/mp4',
            size: 720,
          }
        ]
      };

      const videoTimeEl = document.getElementById('videoTime');

      this.vplayer555.on('play', (ee) => {
        this.inter = setInterval(() => {
          const second = +this.vplayer555.currentTime.toFixed(2);
          const d0x = window['d0']['x'];
          window.slines.forEach((line, index) => {
            line
              .attr('x1', d0x(second))
              .attr('x2', d0x(second))
              .attr('opacity', 1);
          });

          if (second) {
            var date = new Date(null);
            date.setSeconds(second);
            var timeString = date.toISOString().substr(11, 8);
            timeString = timeString + ':' + ((second + '').split('.')[1]);

            videoTimeEl.innerText = timeString;
          }
        }, 100);

        // const time = this.placurrentTime
      });

      this.vplayer555.on('pause', (ee) => {
        clearInterval(this.inter);
      });

      this.vplayer555.on('ended', (ee) => {
        clearInterval(this.inter);
      });

      this.setState({
        videoName: fl.name
      });
    };

    const handleClose = () => {
      this.props.toggle_player();
    };

    const videoName = this.state.videoName || 'Choose file...';

    return (
      <div>
        <BaseInstrument
          title={i18next.t('label.film_video_player')}
          onClose={handleClose.bind(this)}
        >
          <div className='extra'>
            {/* <FileInput disabled={false} text={videoName} onInputChange={openVideoFile} /> */}
            <label className='bp3-file-input'>
              <input type='file' accept='video/*' onChange={openVideoFile} />
              <span className='bp3-file-upload-input'>{videoName}</span>
            </label>
            <div id='videoTime' className='time'>{this.state.videoTime}</div>
          </div>
        </BaseInstrument>
        <div id='vplayer22'>
          <video id='vplayer2' className='player-content2' controls></video>
        </div>
      </div>
    );
  }
}
