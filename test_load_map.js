(function() {
  /************************************************************
   * Begin editable section
   ************************************************************
   */
   
   /*
    * Just some convenient location variables.
    * These are estimates of the boundary around Caltech.
    */
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
  
  
  
  
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 17,
      center: CENTER,
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      styles: styleArray
    });
    
    var tundra_label = new MapLabel({
      text: 'Tundra Town',
      position: new google.maps.LatLng(34.1395, -118.123),
      map: map,
      fontSize: 24,
      align: 'center'
    });

    // Define the LatLng coordinates for the polygon's path.
    var tundra_coords = [
      CENTER,
      TOP,
      TOP_RIGHT,
      RIGHT,
      CENTER
    ];
    var tundra_town = new google.maps.Polygon({
      paths: tundra_coords,
      strokeColor: '#66FFFF',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#66FFFF',
      fillOpacity: 0.35
    });
    tundra_town.setMap(map);
    
    
    var sahara_label = new MapLabel({
      text: 'Sahara Square',
      position: new google.maps.LatLng(34.137, -118.123),
      map: map,
      fontSize: 24,
      align: 'center'
    });
    
    var sahara_coords = [
      CENTER,
      RIGHT,
      BOTTOM_RIGHT,
      BOTTOM,
      CENTER
    ];
    var sahara_square = new google.maps.Polygon({
      paths: sahara_coords,
      strokeColor: '#FFD45C',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FFD45C',
      fillOpacity: 0.35
    });
    sahara_square.setMap(map);
      
    
    var rainforest_label = new MapLabel({
      text: 'Rainforest District',
      position: new google.maps.LatLng(34.1395, -118.1265),
      map: map,
      fontSize: 24,
      align: 'center'
    });
    var rainforest_coords = [
      CENTER,
      TOP,
      TOP_LEFT,
      LEFT,
      CENTER
    ];
    var rainforest_district = new google.maps.Polygon({
      paths: rainforest_coords,
      strokeColor: '#008A2E',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#008A2E',
      fillOpacity: 0.35
    });
    rainforest_district.setMap(map);
    
    var downtown_label = new MapLabel({
      text: 'Downtown',
      position: new google.maps.LatLng(34.137, -118.1265),
      map: map,
      fontSize: 24,
      align: 'center'
    });
    var downtown_coords = [
      CENTER,
      LEFT,
      BOTTOM_LEFT,
      BOTTOM,
      CENTER
    ];
    var downtown = new google.maps.Polygon({
      paths: downtown_coords,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35
    });
    downtown.setMap(map);
  }
})();