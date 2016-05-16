(function() {
  /************************************************************
   * Begin editable section
   ************************************************************
   */
   
   /*
    * Just some convenient location variables.
    * These are estimates of the boundary around Caltech.
    * Note that these are used by the functions, so don't
    * delete them.
    * 
    * CENTER is the center for the purpose of the Zootopia
    * stack, but MAP_CENTER is more accurate for a center of 
    * the map.
   */
  var MAP_CENTER = {lat: 34.139, lng: -118.1252};
  var CENTER = {lat: 34.138, lng: -118.1252};
  var BOTTOM_RIGHT = {lat: 34.135942, lng: -118.121307};
  var TOP_RIGHT = {lat: 34.141774, lng: -118.121353};
  var TOP_LEFT = {lat: 34.140936, lng: -118.127995};
  var BOTTOM_LEFT = {lat: 34.135936, lng: -118.127938};
  var TOP = {lat: 34.141, lng: -118.1252};
  var BOTTOM = {lat: 34.13594, lng: -118.1252};
  var RIGHT = {lat: 34.138, lng: -118.12132};
  var LEFT = {lat: 34.138, lng: -118.12795};
  
  /*
   * This is the style of the map background of the map.
   * Currently set to desaturated background to help make the
   * code visible.
   */
  var styleArray = [
    {
      featureType: 'all',
      stylers: [
        { saturation: -80 }
      ]
    },
    {
      featureType: 'poi',
      stylers: [
        { saturation: 0 }
      ]
    }
  ];


  /**
   * Updates the bounds object with the bounds of campus.
   * @param{google.maps.Map}{map} Map object to set boundary
   * @returns{google.maps.LatLngBounds} Bounds object in case it
   *          needs to be extended
   */
  function set_bounds(map) {
    // Set the SW and NE coordinates
    var bounds = new google.maps.LatLngBounds(BOTTOM_LEFT, TOP_RIGHT);
    bounds.extend(new google.maps.LatLng(BOTTOM_RIGHT.lat, BOTTOM_RIGHT.lng));
    bounds.extend(new google.maps.LatLng(TOP_LEFT.lat, TOP_LEFT.lng));
    // Other points should be inside

    map.fitBounds(bounds);
    return bounds;
  }
  
  
  function display() {
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 17,
      center: MAP_CENTER,
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      styles: styleArray
    });

    // Set the bounds
    var bounds = set_bounds(map);

    // Draw location marker
    add_location(map);
    
    var tundra_label = write_label('Tundra Town', 34.1395, -118.123, map);
    // Define the LatLng coordinates for the polygon's path.
    var tundra_coords = [
      CENTER,
      TOP,
      TOP_RIGHT,
      RIGHT,
      CENTER
    ];
    var tundra_town = add_polygon(tundra_coords, '#66FFFF', map);
    
    var sahara_label = write_label('Sahara Square', 34.137, -118.123, map);
    var sahara_coords = [
      CENTER,
      RIGHT,
      BOTTOM_RIGHT,
      BOTTOM,
      CENTER
    ];
    var sahara_square = add_polygon(sahara_coords, '#FFD45C', map);
      
    var rainforest_label = write_label('Rainforest District', 34.1395,
      -118.1265, map);
    var rainforest_coords = [
      CENTER,
      TOP,
      TOP_LEFT,
      LEFT,
      CENTER
    ];
    var rainforest_district = add_polygon(rainforest_coords, '#00BA2E', map);
    
    var downtown_label = write_label('Downtown', 34.137, -118.1265, map);
    var downtown_coords = [
      CENTER,
      LEFT,
      BOTTOM_LEFT,
      BOTTOM,
      CENTER
    ];
    var downtown = add_polygon(downtown_coords, '#FF0000', map);
  }
  
  /*
   ***********************************************************
   * End editable section
   * 
   * Generally recommend not editing unless something is not 
   * good enough.
   ***********************************************************
  */


  /**
    * Helper function to write labels.
    * 
    * @param{string}{text} Text to display
    * @param{number}{latitude} Latitude of center
    * @param{number}{longitude} Longitude of center
    * @param{google.map.Map}{map} Google maps object.
    * @param{int}{font_size} Size of font, default to 24.
    * @param{string}{align} Alignment, default to 'center'.
   */
  function write_label(text, latitude, longitude, map, font_size, align) {
    // Set default parameters
    font_size = set_default(font_size, 24);
    align = set_default(align, 'center');

    var label = new MapLabel({
      text: text,
      position: new google.maps.LatLng(latitude, longitude),
      map: map,
      fontSize: 24,
      align: 'center'
    });
  }
  
  /**
   * Helper functions to create and add polygon to map.
   * @returns Generated google.maps.Polygon object
   * @param{array}{coords} Array of LatLng objects of polygon vertices
   * @param{string}{color} HTML hexadecimal color (should include '#')
   * @param{google.maps.Map}{map} Google map object to draw polygon
  */
  function add_polygon(coords, color, map) {
    var poly = new google.maps.Polygon({
      paths: coords,
      strokeColor: color,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: color,
      fillOpacity: 0.35
    });
    poly.setMap(map);
    return poly;
  }

  /**
   * Helper function to set default parameters
   */
  function set_default(argument, default_value) {
    return typeof argument !== 'undefined' ? argument : default_value;
  }

  /**
   * Helper function to set marker on location.
   * @param{google.maps.Map}{map} Map object to display location
  */
  function add_location(map) {
    var myloc = new google.maps.Marker({
      clickable: false,
      icon: new google.maps.MarkerImage('mobileimgs2.png',
                                        new google.maps.Size(22,22),
                                        new google.maps.Point(0,18),
                                        new google.maps.Point(11,11)),
      shadow: null,
      zIndex: 999,
      map: map
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(pos) {
          var me = new google.maps.LatLng(pos.coords.latitude, 
            pos.coords.longitude);
          myloc.setPosition(me);
        }, 
        function(error) {
          console.log('Problem with getting location.');
          console.log(error);
        }
      );
    }
  }
  /*
   ***********************************************************
   * Beyond here is the rest of MapLabel stuff.
   * Do not edit unless you know what you are doing.
   * Also you should need to keep the license info.
  */

  /**
   * @license
   *
   * Copyright 2011 Google Inc.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *     http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  /**
   * @fileoverview Map Label.
   *
   * @author Luke Mahe (lukem@google.com),
   *         Chris Broadfoot (cbro@google.com)
   */
  
  /**
   * Creates a new Map Label
   * @constructor
   * @extends google.maps.OverlayView
   * @param {Object.<string, *>=} opt_options Optional properties to set.
   */
  function MapLabel(opt_options) {
    this.set('fontFamily', 'sans-serif');
    this.set('fontSize', 12);
    this.set('fontColor', '#000000');
    this.set('strokeWeight', 4);
    this.set('strokeColor', '#ffffff');
    this.set('align', 'center');
  
    this.set('zIndex', 1e3);
  
    this.setValues(opt_options);
  }




  /*
   * This is what runs when after the Google Maps API is run.
   * This finishes loading the deprecated Google MapLabel 
   * class and runs `display()`.  In general, you should not edit
   * this unless you know what you are doing.
  */
  window.initMap = function() {
    MapLabel.prototype = new google.maps.OverlayView;
    
    window['MapLabel'] = MapLabel;
    
    
    /** @inheritDoc */
    MapLabel.prototype.changed = function(prop) {
      switch (prop) {
        case 'fontFamily':
        case 'fontSize':
        case 'fontColor':
        case 'strokeWeight':
        case 'strokeColor':
        case 'align':
        case 'text':
          return this.drawCanvas_();
        case 'maxZoom':
        case 'minZoom':
        case 'position':
          return this.draw();
      }
    };
    
    /**
     * Draws the label to the canvas 2d context.
     * @private
     */
    MapLabel.prototype.drawCanvas_ = function() {
      var canvas = this.canvas_;
      if (!canvas) return;
    
      var style = canvas.style;
      style.zIndex = /** @type number */(this.get('zIndex'));
    
      var ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = this.get('strokeColor');
      ctx.fillStyle = this.get('fontColor');
      ctx.font = this.get('fontSize') + 'px ' + this.get('fontFamily');
    
      var strokeWeight = Number(this.get('strokeWeight'));
    
      var text = this.get('text');
      if (text) {
        if (strokeWeight) {
          ctx.lineWidth = strokeWeight;
          ctx.strokeText(text, strokeWeight, strokeWeight);
        }
    
        ctx.fillText(text, strokeWeight, strokeWeight);
    
        var textMeasure = ctx.measureText(text);
        var textWidth = textMeasure.width + strokeWeight;
        style.marginLeft = this.getMarginLeft_(textWidth) + 'px';
        // Bring actual text top in line with desired latitude.
        // Cheaper than calculating height of text.
        style.marginTop = '-0.4em';
      }
    };
    
    /**
     * @inheritDoc
     */
    MapLabel.prototype.onAdd = function() {
      var canvas = this.canvas_ = document.createElement('canvas');
      var style = canvas.style;
      style.position = 'absolute';
    
      var ctx = canvas.getContext('2d');
      ctx.lineJoin = 'round';
      ctx.textBaseline = 'top';
    
      this.drawCanvas_();
    
      var panes = this.getPanes();
      if (panes) {
        panes.mapPane.appendChild(canvas);
      }
    };
    MapLabel.prototype['onAdd'] = MapLabel.prototype.onAdd;
    
    /**
     * Gets the appropriate margin-left for the canvas.
     * @private
     * @param {number} textWidth  the width of the text, in pixels.
     * @return {number} the margin-left, in pixels.
     */
    MapLabel.prototype.getMarginLeft_ = function(textWidth) {
      switch (this.get('align')) {
        case 'left':
          return 0;
        case 'right':
          return -textWidth;
      }
      return textWidth / -2;
    };
    
    /**
     * @inheritDoc
     */
    MapLabel.prototype.draw = function() {
      var projection = this.getProjection();
    
      if (!projection) {
        // The map projection is not ready yet so do nothing
        return;
      }
    
      if (!this.canvas_) {
        // onAdd has not been called yet.
        return;
      }
    
      var latLng = /** @type {google.maps.LatLng} */ (this.get('position'));
      if (!latLng) {
        return;
      }
      var pos = projection.fromLatLngToDivPixel(latLng);
    
      var style = this.canvas_.style;
    
      style['top'] = pos.y + 'px';
      style['left'] = pos.x + 'px';
    
      style['visibility'] = this.getVisible_();
    };
    MapLabel.prototype['draw'] = MapLabel.prototype.draw;
    
    /**
     * Get the visibility of the label.
     * @private
     * @return {string} blank string if visible, 'hidden' if invisible.
     */
    MapLabel.prototype.getVisible_ = function() {
      var minZoom = /** @type number */(this.get('minZoom'));
      var maxZoom = /** @type number */(this.get('maxZoom'));
    
      if (minZoom === undefined && maxZoom === undefined) {
        return '';
      }
    
      var map = this.getMap();
      if (!map) {
        return '';
      }
    
      var mapZoom = map.getZoom();
      if (mapZoom < minZoom || mapZoom > maxZoom) {
        return 'hidden';
      }
      return '';
    };
    
    /**
     * @inheritDoc
     */
    MapLabel.prototype.onRemove = function() {
      var canvas = this.canvas_;
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    };
    MapLabel.prototype['onRemove'] = MapLabel.prototype.onRemove;
  
  
  
  
    // Display the map
    display();
  }
})();
