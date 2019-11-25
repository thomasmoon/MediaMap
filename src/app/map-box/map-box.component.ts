import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { MapService } from '../services/map.service';
import { GeoJson, FeatureCollection } from '../services/map';
import * as $ from 'jquery';
import { MatDialogRef } from "@angular/material";
import { ActivatedRoute, Router } from '@angular/router';
import { routerNgProbeToken } from '@angular/router/src/router_module';
import { PARAMETERS } from '@angular/core/src/util/decorators';

// View Children
import { Dialog } from '../dialog/dialog.component';

// Mapbox
import { WorldTypeControl } from './world-type-control/world-type-control';
import { PlayerIndex } from '@angular/core/src/render3/interfaces/player';

@Component({
  selector: 'map-box',
  templateUrl: './map-box.component.html',
  styleUrls: ['./map-box.component.scss']
})
export class MapBoxComponent implements OnInit{

  // For display of videos on mobile
  @ViewChild(Dialog) dialog: Dialog;

  // Default settings for Map
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/outdoors-v10';
  lat = 19.888900;
  lng = 102.133700;
  defaultBearing = 190;
  currentBearing: number;
  defaultPitch = 60;
  currentPitch = this.defaultPitch;

  // data
  source: any;
  markers: any;
  tasksDynamic: any;

  links: any;

  // Tools (Locations & Tasks)
  locations: any;
  tasks = ['Focus groups', 'River weed value-chain', 'Household interviews', 'Forest inventory', 'Biodiversity sampling'];
  media = ['360°', 'Photos', 'Videos', 'Timelapse', 'Podcasts'];
  authors = ['Thomas Moon', 'Adrián Monge'];

  locIndex: any;
  private locIndexSub: any;

  // Route handling
  routeEventInitiated = false;
  listInitiated = false;

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
    private route: ActivatedRoute,
    private router: Router,
    private mapService: MapService
    ) {
  }

  ngOnInit() {
    this.markers = this.mapService.getMarkers()
    this.locations = []

    this.initializeMap();

    this.loadYoutubeApi();
  }

  ngAfterViewChecked() {

    // Run this after lists are loaded
    let locList = $('.mat-tab-body-content'),
    locSelected = locList.find('a.active');

    // if we have a location list and it has not been init'd
    if (!this.listInitiated && locList.length > 0 && locSelected.length > 0) {

      let activeItemRelativeTop = locSelected.offset().top - locList.offset().top;

      // if the active item is off the viewport - one row
      locList.scrollTop(locList.scrollTop() + activeItemRelativeTop);

      // Only do this once
      this.listInitiated = true;
    }

    // This is such a weird way to handle this, but this call back fires so many times
    if (this.routeEventInitiated === false) {

      // Actions based on active route
      this.locIndexSub = this.route.params.subscribe(params => {

        // This is just getting crazy, so many event leaks
        if (this.routeEventInitiated === false) {

          this.locIndex = +params['locIndex'] - 1; // (+) converts string 'id' to a number
          // In a real app: dispatch action to load the details here.

          // When we have a location
          if (this.locations[this.locIndex]) {

            // We only need to do it once
            this.routeEventInitiated = true;

            let zoom = 16,
                // Default bearing is 0 in 2D mode
                bearing = window['map-world-mode'] !== 1 ? this.defaultBearing : 0;

            // custom bearing if in 3D map mode
            if (this.locations[this.locIndex].properties.hasOwnProperty('bearing') && window['map-world-mode'] !== 1) {
              bearing = this.locations[this.locIndex].properties.bearing;
            }

            // custom zoom
            if (this.locations[this.locIndex].properties.hasOwnProperty('zoom')) {
              zoom = this.locations[this.locIndex].properties.zoom;
            }

            this.currentBearing = bearing;
            this.map.setBearing(bearing);

            // Fly to the location with given zoom
            this.flyTo(this.locations[this.locIndex], zoom);

            // if  mobile
            if(window.innerWidth <= 640) {
              // on delay so video has time to load
              this.dialog.openDialog();

              setTimeout(function() {
                // Update video player with delay for popup
                this.playVideo(this.locations[this.locIndex].properties.youtubeId);
              }.bind(this), 500);

            } else {
              // play without delay
              this.playVideo(this.locations[this.locIndex].properties.youtubeId);
            }
            
          }
        }
      });
    }
  }

  private initializeMap() {

    this.buildMap()
  }

  buildMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 15,
      pitch: this.defaultPitch,
      bearing: this.defaultBearing,
      center: [this.lng, this.lat]
    });

    // Disable scroll wheel
    if (this.map.scrollZoom) {
      this.map.scrollZoom.disable();
    }

    /// Add map controls
    this.map.addControl(new mapboxgl.NavigationControl());

    // Custom World Type control (3D/2D)
    this.map.addControl(new WorldTypeControl(), 'bottom-right');

    // Click Marker
    this.map.on('click', 'locations', function (e) {

      var coordinates = e.features[0].geometry.coordinates.slice();

      this.flyTo(e.features[0]);

      this.routeEventInitiated = false;
      this.listInitiated = false;
      
      this.router.navigate(['/loc', e.features[0].properties.index+1])

    }.bind(this));

    /// Add realtime firebase data on map load
    this.map.on('load', (event) => {

      /// register source
      this.map.addSource('firebase', {
         type: 'geojson',
         data: {
           type: 'FeatureCollection',
           features: []
         }
      });

      /// get source
      this.source = this.map.getSource('firebase')

      /// subscribe to realtime database and set data source
      this.markers.subscribe(markers => {

        this.locations = markers;

        let data = new FeatureCollection(markers)
        this.source.setData(data)
      });

      /*
      /// subscribe to realtime database and set data source
      this.tasksDynamic.subscribe(tasksDynamic => {

        this.tasks = tasksDynamic;

        let data = new FeatureCollection(tasksDynamic)
        this.source.setData(data)
      });*/


      /// create map layers with realtime data
      this.map.addLayer({
        id: 'locations',
        source: 'firebase',
        type: 'symbol',
        layout: {
          'icon-image': 'cinema-15',
          'icon-size': 1,
          'text-offset': [0, 1.5],
          'text-field': '{shortname}',
          'text-optional': true
        },
        paint: {
          'text-color': '#121220',
          'text-halo-color': '#fff',
          'text-halo-width': 2
        }
      })

    })

  }


  /// Helpers

  removeMarker(marker) {
    this.mapService.removeMarker(marker.$key)
  }

  flyTo(data: GeoJson, zoom = 15) {

    this.map.flyTo({
      center: data.geometry.coordinates,
      zoom: zoom
    })
  }

  resetRouter() {
    this.routeEventInitiated = false;
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
      this.nextLocation();
    }
  }

  playVideo(videoId) {

     // if the Youtube API is loaded
    if (this.YTloaded) {

      // If the player exists load new video
      if (this.YTplayer) {
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

  nextLocation() {
    // If we have additional locations then go to the next one
    if (this.locIndex < this.locations.length - 1) {
      this.locIndex++;
      this.routeEventInitiated = false;
      this.router.navigate(['/loc', this.locIndex + 1])
    }
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
            this.map.setBearing((this.currentBearing-this.YTbearing) % 360);
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
            this.map.setPitch(this.currentPitch+this.YTpitch);
          }
        }
      }
    }

    requestAnimationFrame(this.getVideoBearing.bind(this));
  }
}
