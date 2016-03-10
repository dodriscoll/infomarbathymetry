L.Control.bathyControl = L.Control.extend({
	options: {
		position: 'topright',
	},

onAdd: function (map) {
        var controlDiv = L.DomUtil.create('div', 'bathyButton myButton leaflet-bar');
        L.DomEvent
            .addListener(controlDiv, 'click', L.DomEvent.stopPropagation)
            .addListener(controlDiv, 'click', L.DomEvent.preventDefault)
        .addListener(controlDiv, 'click', function () {
            togglePanel('#depth-ranges');
        });
		
        var controlUI = L.DomUtil.create('a', 'bathyButton', controlDiv);
        controlUI.title = 'Edit Bathymetry display';
        controlUI.href = '#';
		return controlDiv;
},		
});

L.Control.srControl = L.Control.extend({
	options: {
		position: 'topright',
	},

onAdd: function (map) {
        var controlDiv = L.DomUtil.create('div', 'shadedReliefButton myButton leaflet-bar');
        L.DomEvent
            .addListener(controlDiv, 'click', L.DomEvent.stopPropagation)
            .addListener(controlDiv, 'click', L.DomEvent.preventDefault)
        .addListener(controlDiv, 'click', function () {
			$('#srInfo').hide();
            togglePanel('#form-Shading');
        });
		
        var controlUI = L.DomUtil.create('a', 'shadedReliefButton', controlDiv);
        controlUI.title = 'Edit Shaded Relief Layer';
        controlUI.href = '#';
		return controlDiv;
},		
});

////Upload a file of points///////////
L.Control.uploadCSVfile = L.Control.extend({
	options: {
		position: 'topleft',
	},

onAdd: function (map) {
        var controlDiv = L.DomUtil.create('div', 'myButton leaflet-bar');
        L.DomEvent
            .addListener(controlDiv, 'click', L.DomEvent.stopPropagation)
            .addListener(controlDiv, 'click', L.DomEvent.preventDefault)
		
        var controlUI = L.DomUtil.create('a', 'uploadcsv myButton', controlDiv);
        controlUI.title = 'Upload a CSV file (format: Lat, Lng, Name)';
        controlUI.href = '#';
		L.DomEvent.addListener(controlUI, 'click', function(){
		$(".myButton .stoplocateMeButtonWatch").click();
		$(".myButton .stoplocateMeButtonWatch").hide();
      		$(".myButton .clearidepthButton").hide();

					          if(uploadCSV()){
								  
							  }else{
							  };
			controlUIClear.style.display = 'block';
        });
					
		var controlUIClear = L.DomUtil.create('a', 'clearuploadcsv myButton', controlDiv);
		controlUIClear.title = 'Clear Map';
		controlUIClear.href = '#';
		controlUIClear.style.display = 'none';

		L.DomEvent.addListener(controlUIClear, 'click', function (){
			map.removeLayer(csvMarker);
			csvMarker.clearLayers();
			controlUIClear.style.display = 'none';
			$('#uploadCSV').hide();
			$('#upload').val('');
		});	
		return controlDiv;
},		
});

var csvMarker = new L.FeatureGroup();

function uploadCSV (){
		
	 $('#uploadCSV').show();
	   $('#upload').on('change', function(e){
        readFile(this.files[0], function(e) {
   			var csvString = e.target.result;
			var ptsGeoCSV = L.geoCsv (csvString, {
			onEachFeature:function(f,l) {
				var popup = f.properties.popup;
				
			var isOutsideMapBounds = function (e) {
				if (l._latlng === undefined)
					return false;
				return map.options.maxBounds &&
				!map.options.maxBounds.contains(l._latlng);
				};
				
				if (isOutsideMapBounds()){ 
					$('#uploadCSV').hide();
					$('#upload').val('');
					alert('One or all of these points fall outside of the map bounds. \n\nPlease check each line follows the format:\nLatitude, Longitude, Name.');		
					throw new Error('File format bad');
				}	else
				{
				Bathy.identify().at(l._latlng).run(function(error, results){
				depthPixelClick = results.pixel;
				var popupAnchor = [l._latlng.lat + .035, l._latlng.lng];
				
				if(depthPixelClick.properties.value == 'NoData'){ 
				l.bindPopup(popup + "<br>No Data for this location");
				} else
				{
				depthPixel = parseFloat(depthPixelClick.properties.value);        			
				l.bindPopup(popup + "<br>Depth/Elevation: " + depthPixel.toFixed(2) + 'm');
				}
				});
				}			
			  },
		  lineSeparator: '\r\n',
		  fieldSeparator: ',',
		  pointToLayer: function (feature, latlng) {
			return L.marker(latlng, {
			icon:L.icon({
			iconUrl: 'scripts/libs/leaflet-1.0.0-b1/images/redmymarker-icon.png',
			shadowUrl: 'scripts/libs/leaflet-1.0.0-b1/images/marker-shadow.png',
				iconSize: [25,41],
				iconAnchor: [12,41],
				shadowSize:   [41,41],
				shadowAnchor: [12,41]
				  })
				});
			  }
			});
			csvMarker.addLayer(ptsGeoCSV);
			map.addLayer(csvMarker);
			map.fitBounds(csvMarker.getBounds(), {padding:[50, 50]});			
			$('#uploadCSV').hide();
			$('#upload').val('');
		});
	});
}	

function readFile(file, callback){
    var reader = new FileReader();
    reader.onload = callback
    reader.readAsText(file);		
}

//////Click on Map for Depths//////
L.Control.idDepth = L.Control.extend({
    options: {
        position: 'topleft',
		popupOptions: { 
      className: 'leaflet-measure-resultpopup',
      autoPanPadding: [10, 10]
	}
    },

onAdd: function (map) {
            var controlDiv = L.DomUtil.create('div', 'myButton leaflet-bar');		
        L.DomEvent
           	.addListener(controlDiv, 'click', L.DomEvent.stopPropagation)
            .addListener(controlDiv, 'click', L.DomEvent.preventDefault) 
       
   var controlUI = L.DomUtil.create('a', 'idepthButton myButton ', controlDiv);
        controlUI.title = 'Click bathymetry layer for Depths';
        controlUI.href = '#';
		L.DomEvent.addListener(controlUI, 'click', function(){
			$(".myButton .stoplocateMeButtonWatch").click();
			$(".myButton .stoplocateMeButtonWatch").hide();
      			$(".myButton .clearuploadcsv").hide();

			 iDepthStart();
			 controlUIClear.style.display = 'block';
		});
	var controlUIClear = L.DomUtil.create('a', 'clearidepthButton myButton', controlDiv);
		controlUIClear.title = 'Clear Map';
		controlUIClear.href = '#';
		controlUIClear.style.display = 'none';
			
		L.DomEvent.addListener(controlUIClear, 'click', function (){
			$('.leaflet-container').css('cursor','');
			map.removeLayer(depthMarker);
			depthMarker.clearLayers();
			map.off('click', iDepthClick);
			controlUIClear.style.display = 'none';	
		});		
			return controlDiv;	
		}
});

function iDepthStart(){
	$('.leaflet-container').css('cursor','crosshair');
	map.on('click', iDepthClick);
}
	
var depthPixelClick;
var depthPopup;
var depthPixel;
var depthMarker = new L.FeatureGroup();
var depthPopupContainer = L.DomUtil.create('div', '');

function iDepthClick(e) {

            Bathy.identify().at(e.latlng).run(function(error, results){
             depthPixelClick = results.pixel;   
            
            if(depthPixelClick.properties.value == 'NoData'){    
            depthPopup = depthPixelClick.properties.value;
            var depthPoint = L.marker(e.latlng);
			depthMarker.addLayer(depthPoint);
			}
            else{
            depthPixel = parseFloat(depthPixelClick.properties.value);  
            depthPopup =  depthPixel.toFixed(2) + 'm'; 
			 var depthPoint = L.marker(e.latlng);
			 depthMarker.addLayer(depthPoint);
            }
               
        depthPopupContainer.innerHTML = depthPopup;
        map.addLayer(depthMarker);
		depthPoint.bindPopup(depthPopupContainer).openPopup();		
     });
 }

// Watch position control///////////////////////////////////////////////////

L.Control.locateMeWatch = L.Control.extend({
	options: {
		position: 'topleft',
		popupOptions: { 
      className: 'leaflet-measure-resultpopup',
      autoPanPadding: [10, 10]
	}
	},

onAdd: function (map) {
        var controlDiv = L.DomUtil.create('div', 'myButton leaflet-bar');
        L.DomEvent
            .addListener(controlDiv, 'click', L.DomEvent.stopPropagation)
            .addListener(controlDiv, 'click', L.DomEvent.preventDefault)
        var controlUI = L.DomUtil.create('a','locateMeButtonWatch myButton', controlDiv);
        controlUI.title = 'Show my Location';
        controlUI.href = '#';
		L.DomEvent.addListener(controlUI, 'click', function(){
			$(".myButton .clearuploadcsv").hide();
      		$(".myButton .clearidepthButton").hide();

		checkGeolocationWatch();
		 controlUIClear.style.display = 'block';
		});
		
		var controlUIClear = L.DomUtil.create('a', 'stoplocateMeButtonWatch myButton', controlDiv);
		controlUIClear.title = 'Clear Map';
		controlUIClear.href = '#';
		controlUIClear.style.display = 'none';

		L.DomEvent.addListener(controlUIClear, 'click', function (){
		map.spin(false);
		map.removeLayer(locMarkerWatch);
		map.removeLayer(circleLocWatch);
		
		locMarkerWatch.clearLayers();
		circleLocWatch.clearLayers();
		controlUIClear.style.display = 'none';
		navigator.geolocation.clearWatch(id);	
		});
		return controlDiv;
}		
});

function checkGeolocationWatch() {

 if('geolocation' in navigator){
		var options = {
		enableHighAccuracy: true, 
		timeout: 2000,  
		maximumAge: 0 
		};
		id = navigator.geolocation.watchPosition(onSuccessWatch, onErrorWatch, options); 
		map.spin(true);
		
	}else{
		alert('Your device does not support this function');
		navigator.geolocation.clearWatch(id);
		map.spin(false);
}
}	

	var locMarkerWatch = new L.FeatureGroup();
	var circleLocWatch = new L.FeatureGroup();
	var popupLocWatch = L.DomUtil.create('div', 'popupLoc');	
	var gpsCount = 0;
	
function onSuccessWatch(e){
	gpsCount++;
		 		
	var lng = e.coords.longitude;
	var lat = e.coords.latitude;
	var latlng = [lat,lng];
	var radius =  e.coords.accuracy;
	
	if (gpsCount > 2 || navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
		 gpsCount = 0;

	if(radius < 1000) {
	
	var greenIcon = L.icon({
    iconUrl: 'scripts/libs/leaflet-1.0.0-b1/images/mymarker-icon.png',
    shadowUrl: 'scripts/libs/leaflet-1.0.0-b1/images/marker-shadow.png',

    iconSize:     [25, 41], // size of the icon
    shadowSize:   [30, 35], // size of the shadow
    iconAnchor:   [12, 40], // point of the icon which will correspond to marker's location
    shadowAnchor: [8, 34],  // the same for the shadow
    popupAnchor:  [0, -41] // point from which the popup should open relative to the iconAnchor
});	
	Bathy.identify().at(latlng).run(function(error, results){
	var locatePixel = results.pixel;
	
	if(locatePixel.properties.value == 'NoData'){
	var marker = L.marker(latlng, {icon: greenIcon});
	locMarkerWatch.addLayer(marker);
	var popupLocContent = "<p style=\"margin-bottom:5px;\">Lat: " + Math.round((lat + 0.000001) * 1000)/1000 + ", Long:" + Math.round((lng + 0.000001) * 1000)/1000 + "</p><p style=\"margin-bottom:5px; margin-top:5px;\">(You are within " + Math.round((radius + 0.000001) * 1000)/1000 + " meters of this point.)</p><p><b>No INFOMAR data for this location.</b></p><p style=\"color:red;\"> NOT TO BE USED FOR NAVIGATION</p>" 
	}
	else{
	var locPixel = parseFloat(locatePixel.properties.value);  
    var locPopup =  locPixel.toFixed(2); 	
	var marker = L.marker(latlng, {icon: greenIcon});
	locMarkerWatch.addLayer(marker); 
	var popupLocContent = "<p style=\"margin-bottom:5px;\">Lat: " + Math.round((lat + 0.000001) * 1000)/1000 + ", Long:" + Math.round((lng + 0.000001) * 1000)/1000 + "</p><p style=\"margin-bottom:5px; margin-top:5px;\">(You are within " + Math.round((radius + 0.000001) * 1000)/1000 + " meters <br>of this point.)</p><p style=\"margin-bottom:5px; margin-top:5px;\"><b>Depth/Elevation: " + locPopup + "m </b></p><p style=\"color:red;margin-bottom:5px; margin-top:5px;\"> NOT TO BE USED FOR NAVIGATION</p>" 
	}
	popupLocWatch.innerHTML = popupLocContent;
	map.addLayer(locMarkerWatch);
	marker.bindPopup(popupLocWatch).openPopup();
	circle = L.circle(latlng, radius, {fillOpacity: 0.1, color: '#4DECB2'});
	circleLocWatch.addLayer(circle);
	map.addLayer(circleLocWatch);
	map.fitBounds(circleLocWatch.getBounds(), {padding:[50, 50]});	
	navigator.geolocation.clearWatch(id);
	map.spin(false);
	});
	}
	else{
		navigator.geolocation.clearWatch(id);
		map.spin(false);
		alert("Position unavailable.");
	 }
}
}		

//function onLocationError(e) {
function onErrorWatch(e){
		if(err.code==1)
			{
				alert("User denied geolocation.");
				navigator.geolocation.clearWatch(id);
				map.spin(false);
			}
			else if(err.code==2)
			{
				alert("Position unavailable.");
				navigator.geolocation.clearWatch(id);
				map.spin(false);
			}
			else if(err.code==3)
			{
				alert("Timeout expired.");
				navigator.geolocation.clearWatch(id);
				map.spin(false);
			}
			else
			{
				alert("ERROR:"+ err.message);
				navigator.geolocation.clearWatch(id);
				map.spin(false);
			}
		}

//Print Map Control
L.Control.printMap = L.Control.extend({
	options: {
		position: 'topleft',
		popupOptions: { 
      className: 'leaflet-measure-resultpopup',
      autoPanPadding: [10, 10]
	}
	},

onAdd: function (map) {
	var controlDiv = L.DomUtil.create('div', 'printButton myButton leaflet-bar');
        L.DomEvent
            .addListener(controlDiv, 'click', L.DomEvent.stopPropagation)
            .addListener(controlDiv, 'click', L.DomEvent.preventDefault)
			.addListener(controlDiv, 'click', function () {
				$('#printArea').stop().animate({opacity:'100'});
			printSetupMap();
	         $('div.print').printPage();
	         });
		
        var controlUI = L.DomUtil.create('a', 'printButton', controlDiv);
        //controlUI.title = 'Print Map';
        controlUI.href = '#';
		return controlDiv;
}
});

(function(jQuery) {
    jQuery.fn.printPage = function() {	
       return this.each(function() {
		window.alert("Please ensure pinter is setup to print page as A4 Landscape");   
	        window.print(); 
		
		resetMap();
		return false;    
            //});
       });
    }
})(jQuery);


$(document).ready(function(){

if((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1 ) 
    {
        alert('Opera');
    }
    else if(navigator.userAgent.indexOf("Chrome") != -1 )
    {
       	$('#printArea').css({"height":"17.7cm", "width":"25.9cm"}); 
	console.log("Chrome");
    }
    else if(navigator.userAgent.indexOf("Safari") != -1)
    {
        alert('Safari');
    }
    else if(navigator.userAgent.indexOf("Firefox") != -1 ) 
    {
         $('#printArea').css({"height":"17.6cm", "width":"27cm"}); 
	console.log("FireFox");
    }
    else if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )) //IF IE > 10
    {
     $('#printArea').css({"height":"17.5cm", "width":"27.5cm"});
	console.log("Internet Explorer");
    }  
    else 
    {
       alert('unknown');
    }
});

var printSetupMap = function(){
	$('div.leaflet-top.leaflet-left').hide();
			$('div.leaflet-top.leaflet-right').hide();
			$('div.leaflet-bottom.leaflet-right').hide();
			$('div.leaflet-bottom.leaflet-left').hide();
			$('div.leaflet-top.leaflet-left').hide();
			$('#depth-ranges').hide();
			$('#form-Shading').hide();
			$('#printText').hide();
			$('#printArea').show();
			$('#printArea').css({"border":"0px", 'display':'table'});  
			$('div.leaflet-control-scale.leaflet-control').appendTo('#printlegend');
			$('#maxPrint').text(endDepthInput.value +"m"); 
			$('#minPrint').text(startDepthInput.value +"m"); 
};

var resetMap = function(){
		$('div.leaflet-top.leaflet-left').show();
			$('div.leaflet-top.leaflet-right').show();
			$('div.leaflet-bottom.leaflet-right').show();
			$('div.leaflet-bottom.leaflet-left').show();
			$('div.leaflet-top.leaflet-left').show();
			$('#printArea').css({"border-color": "red","border-width":"1px","border-style":"solid"});  
			$('div.leaflet-control-scale.leaflet-control').appendTo('div.leaflet-bottom.leaflet-left');
};		


	
