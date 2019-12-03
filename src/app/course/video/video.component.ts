import { Component, OnInit, forwardRef, Inject, ViewChild } from '@angular/core';
import { CourseComponent } from '../../course/course.component';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {

  // Refs
  course: any;

  // YouTube
  _window = window;
  YTloaded = false;
  YTplayer: any;
  YTparams = {
    videoId: null,
    width: 560,
    height: 315,
    events: {
      'onReady': this.onPlayerReady.bind(this),
      'onStateChange': this.onPlayerStateChange.bind(this)
    },
    playerVars: {
      rel: 0
    }
  };
  YTbearingRoutineInitiated = false;
  YTbearing: number;
  YTpitch: number;

  constructor(

    @Inject(forwardRef(() => CourseComponent)) course

  ) { 
    this.course = course;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.loadYoutubeApi();
  }

  // YouTube stuff
  loadYoutubeApi() {
    // Load the IFrame Player API code asynchronously.
    var tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // set global access to this function on this component
    (<any>window).onYouTubeIframeAPIReady = this.onYouTubeIframeAPIReady.bind(this);
  }

  onYouTubeIframeAPIReady() {
    this.YTloaded = true;
  }

  // API will call this function when the video player is ready.
  onPlayerReady(event) {
    event.target.playVideo();
  }
  
  // 5. The API calls this function when the player's state changes.
  //    The function indicates that when playing a video (state=1),
  //    the player should play for six seconds and then stop.
  onPlayerStateChange(event) {
    // When the clip is ended go to next
    if (event.data == (<any>window).YT.PlayerState.ENDED) {
      this.course.nextLocation();
    }
  }

  playVideo(videoId: string) {

     // if the Youtube API is loaded
    if (this.YTloaded) {

      // If the player exists load new video
      if (this.YTplayer && this.YTplayer.loadVideoById) {
        this.YTplayer.loadVideoById(videoId);
      } else {

        this.YTparams.videoId = videoId;

        // Create new player
        this.YTplayer = new (<any>window).YT.Player('player', this.YTparams);
      }

      // When video is playing begin the routine to get bearing
      if (!this.YTbearingRoutineInitiated) {
        this.getVideoBearing();
      }

    } else {

      this.loadYoutubeApi();

      // otherwise retry when it is
      setTimeout(()=>{
        this.playVideo(videoId);
      }, 1000);
    }
  }

  stopVideo() {
    this.YTplayer.stopVideo();
  }

  getVideoBearing () {

    this.YTbearingRoutineInitiated = true;

    if(typeof this.YTplayer !== 'undefined' && this.YTplayer.hasOwnProperty('getSphericalProperties')) {

      let sphericalProps = this.YTplayer.getSphericalProperties();

      // Yaw
      if (typeof sphericalProps !== 'undefined' && sphericalProps.hasOwnProperty('yaw')) {

        // if the bearing has changed update the map
        if (this.YTbearing !== sphericalProps.yaw ) {
          this.YTbearing = sphericalProps.yaw;

          // When we are in 3D mode
          if (window['map-world-mode'] !== 1) {
            this.course.map.setBearing(this.YTbearing);
          }
        }
      }

      // Pitch
      if (typeof sphericalProps !== 'undefined' && sphericalProps.hasOwnProperty('pitch')) {

        // if the pitch has changed and is negative update the pitch of the map
        if (this.YTpitch !== sphericalProps.pitch && sphericalProps.pitch <= 0) {
          this.YTpitch = sphericalProps.pitch;

          // When we are in 3D mode
          if (window['map-world-mode'] !== 1) {
            this.course.map.setPitch(this.YTpitch);
          }
        }
      }
    }

    requestAnimationFrame(this.getVideoBearing.bind(this));
  }
}
