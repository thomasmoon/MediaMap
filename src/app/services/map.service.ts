import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection,
  DocumentChangeAction,
  Action,
  DocumentSnapshotDoesNotExist,
  DocumentSnapshotExists,
} from 'angularfire2/firestore';

import { Observable } from 'rxjs';

import { GeoJson } from './map';
import * as mapboxgl from 'mapbox-gl';
import 'rxjs/add/operator/map';

@Injectable()
export class MapService {

  locations: Observable<any[]>;
  db: AngularFirestore;

  constructor(db: AngularFirestore) {
    mapboxgl.accessToken = environment.mapbox.accessToken;

    this.db = db;

    this.locations = this.db
      .collection<GeoJson>('locations')
      .snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          //Get document data
          const data = a.payload.doc.data() as GeoJson;
          //Get document id
          const id = a.payload.doc.id;
          // Add short label for map
          data.properties.shortname = data.properties.name.replace('Location', 'Loc');
          //Use spread operator to add the id to the document data
          return { id, ...data };
        });
      });

  }

  getMarkers() {
    return this.locations;
  }

  createMarker(data: GeoJson) {

    // Why is this really neccessary, c'mon AngularFirebase
    const markerObject = {
      geometry: data.geometry,
      properties: data.properties,
      type: data.type
    }

    this.db
      .collection<GeoJson>('locations').add(markerObject);
  }

  removeMarker($key: string) {
    return this.locations;
  }

}