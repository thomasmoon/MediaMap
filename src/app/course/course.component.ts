import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// View Children
import { Dialog } from '../dialog/dialog.component';
import { ToolsComponent } from './tools/tools.component';
import { MapComponent } from './map/map.component';
import { VideoComponent } from './video/video.component';
import { VideosService } from '../services/videos.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {

  // For display of videos on mobile
  @ViewChild(Dialog, { static: false }) dialog: Dialog;
  @ViewChild(MapComponent, { static: false }) map: MapComponent;
  @ViewChild(VideoComponent, { static: false }) video: VideoComponent;
  @ViewChild(ToolsComponent, { static: false }) tools: ToolsComponent;

  // Tools (Locations & Tasks)
  locations: any;
  videos: any;
  videosFiltered: any;
  topics: string[];
  topicsNew: {}[];
  methods: string[];
  methodsNew: {}[];

  content = '';
  title = '';
  currentTopics = [];
  currentMethods = [];
  currentKeywords = [];

  public locIndex: number;
  public locIndexSub: any;
  public videoId;
  public videoIdSub: any;

  private _videoId = new BehaviorSubject<any>(null);
  readonly videoIdObs = this._videoId.asObservable();

  // video index for children (e.g. comments)
  private _videoIndex = new BehaviorSubject<any>(null);
  readonly videoIndexObs = this._videoIndex.asObservable();

  public topicIndex: number = null;
  public methodIndex: number = null;

  // Route handling
  routeEventInitiated = false;
  listInitiated = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public videosService: VideosService
  ) { 
    this.topics = videosService.topics;
    this.topicsNew = videosService.topicsNew;
    this.methods = videosService.methods;
    this.methodsNew = videosService.methodsNew;
  }

  ngOnInit() {
    // subscribe to entire collection
    //this.videos = this.videosService.videos;
    //this.videosService.loadAll();
  }

  ngAfterViewInit() {

    console.log('course component after view init');

    // This is such a weird way to handle this, but this call back fires so many times
    if (this.routeEventInitiated === false) {
    }
  }

  updateView() {

     // Actions based on active route
     this.locIndexSub = this.route.params.subscribe(params => {

      // This is just getting crazy, so many event leaks
      if (this.videos && this.videos.length) {

        this.videosFiltered = this.videos;

        // topic index
        if (params['topicIndex']) {
          this.topicIndex = params['topicIndex'];
          this.videosFiltered = this.videosFiltered.filter(video => {
            if (video.properties.topics && video.properties.topics.search(this.topicIndex) > -1) {
              return true;
            }
          });
        } else {
          this.topicIndex = null;
        }
      
        // method index
        if (params['methodIndex']) {
          this.methodIndex = params['methodIndex'];
          this.videosFiltered = this.videosFiltered.filter(video => {
            if (video.properties.methods && video.properties.methods.search(this.methodIndex) > -1) {
              return true;
            }
          });
        } else {
          this.methodIndex = null;
        }

        // location index
        this.locIndex = +params['locIndex']; // (+) converts string 'id' to a number

        // When we have a location
        if (this.videosFiltered[this.locIndex]) {

          // dispatch the location
          this._videoIndex.next(this.locIndex);

          this.videoId = this.videosFiltered[this.locIndex].properties.videoId;

          this._videoId.next(this.videoId);

          // We only need to do it once
          //this.routeEventInitiated = true;

          if (this.videosFiltered[this.locIndex].properties.hasOwnProperty('name')) {
            this.title = this.videosFiltered[this.locIndex].properties.name;
          } else {
            this.title = "";
          }

          if (this.videosFiltered[this.locIndex].properties.hasOwnProperty('description')) {
            this.content = this.videosFiltered[this.locIndex].properties.description;
          } else {
            this.content = "";
          }
          
          if (this.videosFiltered[this.locIndex].properties.hasOwnProperty('topics')
            && this.videosFiltered[this.locIndex].properties.topics !== null) {
            this.currentTopics = this.videosFiltered[this.locIndex].properties.topics.split(',');
          } else {
            this.currentTopics = [];
          }

          this.currentTopics = this.getLocationPropertyAsArray('topics');
          this.currentMethods = this.getLocationPropertyAsArray('methods');
          this.currentKeywords = this.getLocationPropertyAsArray('keywords');

          let zoom = 16,
              // Default bearing is 0 in 2D mode
              bearing = window['map-world-mode'] !== 1 && this.map ? this.map.defaultBearing : 0;

          // custom bearing if in 3D map mode
          if (this.videosFiltered[this.locIndex].properties.hasOwnProperty('bearing') && window['map-world-mode'] !== 1) {
            bearing = this.videosFiltered[this.locIndex].properties.bearing;
          }

          // custom zoom
          if (this.videosFiltered[this.locIndex].hasOwnProperty('zoom')) {
            zoom = this.videosFiltered[this.locIndex].properties.zoom;
          }

          this.map.currentBearing = bearing;
          this.map.map.setBearing(bearing);

          // Fly to the location with given zoom
          this.map.flyTo(this.videosFiltered[this.locIndex], zoom);

          // if  mobile
          if(false && window.innerWidth <= 640) {
            // on delay so video has time to load
            this.dialog.openDialog();

            setTimeout(function() {
              // Update video player with delay for popup
              this.playVideo(this.locations[this.locIndex].properties.youtubeId);
            }.bind(this), 500);

          } else {
            // play without delay
            this.video.playVideo(this.videosFiltered[this.locIndex].properties.youtubeId);
          }
          
        }
      }
    });
  }

  resetRouter() {
    this.routeEventInitiated = false;
  }

  nextLocation() {
    // If we have additional locations then go to the next one
    if (this.locIndex < this.videosFiltered.length - 1) {
      this.locIndex++;
      this.routeEventInitiated = false;

      if (this.topicIndex !== null) {
        this.router.navigate([`/topic/${this.topicIndex}/loc`, this.locIndex]);
      } else if (this.methodIndex !== null) {
        this.router.navigate([`/method/${this.methodIndex}/loc`, this.locIndex]);
      } else {
        this.router.navigate(['/loc', this.locIndex])
      }
      
      this.updateView();
    }
  }

  // Add a zero before the number for single digits
  formatVideoIndex(i:number) {
    let id = i+1,
        zeroPadding = id < 10 ? '0':'';
    return zeroPadding + id;
  }

  // if the location has this property parse string to array
  getLocationPropertyAsArray(prop: string) {

    let value = [];

    if (this.videosFiltered[this.locIndex].properties.hasOwnProperty(prop)
      && this.videosFiltered[this.locIndex].properties[prop] !== null) {

      value = this.videosFiltered[this.locIndex].properties[prop].split(',');
    }

    return value;
  }

  getRouterLink(index) {
    if (this.topicIndex) {
      return ['/topic', this.topicIndex, index];
    } else if (this.methodIndex) {
      return ['/method', this.methodIndex, index];
    } else {
      return ['/loc', index];
    }
  }
}
