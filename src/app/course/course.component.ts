import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// View Children
import { Dialog } from '../dialog/dialog.component';
import { ToolsComponent } from '../tools/tools.component';
import { MapComponent } from '../map/map.component';
import { VideoComponent } from '../video/video.component';

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
  topics = ['Value-Chain Analysis', 'Livelihoods', 'Environmental Change', 'Forest Inventory', 'Biodiversity'];
  methods = ['Focus Group Discussion', 'Personal Interview', 'Household Interview'];
  media = ['360°', 'Photos', 'Videos', 'Timelapse', 'Podcasts'];
  authors = ['Thomas Moon', 'Adrián Monge'];

  content = '';

  locIndex: any;
  private locIndexSub: any;

  // Route handling
  routeEventInitiated = false;
  listInitiated = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {

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
      if (this.locations && this.locations.length) {

        // console.log('Get current location');

        this.locIndex = +params['locIndex'] - 1; // (+) converts string 'id' to a number
        // In a real app: dispatch action to load the details here.

        // When we have a location
        if (this.locations[this.locIndex]) {

          // We only need to do it once
          //this.routeEventInitiated = true;

          if (this.locations[this.locIndex].properties.hasOwnProperty('content')) {
            this.content = this.locations[this.locIndex].properties.content;
          } else {
            this.content = "<h1>Lorem ipsum</h1>";
          }
          
          let zoom = 16,
              // Default bearing is 0 in 2D mode
              bearing = window['map-world-mode'] !== 1 ? this.map.defaultBearing : 0;

          // custom bearing if in 3D map mode
          if (this.locations[this.locIndex].properties.hasOwnProperty('bearing') && window['map-world-mode'] !== 1) {
            bearing = this.locations[this.locIndex].properties.bearing;
          }

          // custom zoom
          if (this.locations[this.locIndex].properties.hasOwnProperty('zoom')) {
            zoom = this.locations[this.locIndex].properties.zoom;
          }

          this.map.currentBearing = bearing;
          this.map.map.setBearing(bearing);

          // Fly to the location with given zoom
          this.map.flyTo(this.locations[this.locIndex], zoom);

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
            this.video.playVideo(this.locations[this.locIndex].properties.youtubeId);
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
    if (this.locIndex < this.locations.length - 1) {
      this.locIndex++;
      this.routeEventInitiated = false;
      this.router.navigate(['/loc', this.locIndex + 1])
      this.updateView();
    }
  }
}
