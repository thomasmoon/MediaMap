// MapBox Custom map control (iControl) implemented as ES6 class
export class WorldTypeControl {

    private _map: any;
    private _container: any;
    private _controls = ['3D', '2D'];
    private _buttons = [];
    private _activeIndex = 0;
    private _lastBearing: number;

    onAdd(map) {
        this._map = map;
        this._container = document.createElement('div');
        this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
        
        // Initiate buttons
        for (let i=0; i<this._controls.length; i++) {

            let button = document.createElement('button');
            button.type = 'button';
            button.title = this._controls[i];
            button.textContent = this._controls[i];
            button.setAttribute('aria-label', this._controls[i]);

            button.onclick = (event) => {
                this._activeIndex = i;

                window['map-world-mode'] = this._activeIndex;

                this.setButtonClasses();

                // Actions
                switch (this._activeIndex) {

                    // switch to 3D mode
                    case 0:
                        this._map.flyTo({
                            pitch: 60,
                            bearing: this._lastBearing
                          });
                        break;

                    // switch to 2D mode
                    case 1:

                        // save bearing for later use
                        this._lastBearing = this._map.getBearing();

                        this._map.flyTo({
                            pitch: 0,
                            bearing: 0
                        });
                        break;
                }
            }

            this._buttons.push(button);
            this._container.appendChild(button);
        }

        this.setButtonClasses();

        return this._container;
    }

    onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }

    setButtonClasses() {
        // Go through the buttons and reset class for each;
        for (let b=0; b<this._buttons.length; b++) {
            this._buttons[b].className = 'mapboxgl-ctrl-icon';

            if (b === this._activeIndex) {
                this._buttons[b].className += ' mapboxgl-ctrl-active'; 
            }
        }
    }
}