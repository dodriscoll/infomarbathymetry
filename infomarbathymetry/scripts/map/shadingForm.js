var shadeForm = document.getElementById('formShading');
var startDepthInput = document.getElementById('from');
var endDepthInput = document.getElementById('to');
var azimuthInput = document.getElementById('azimuth');
var altitudeInput = document.getElementById('altitude');
var zfactorInput = document.getElementById('zfactor');

shadeForm.addEventListener('submit', function shadeClick(e) {
var maxDepth = parseInt(startDepthInput.value);
var minDepth = parseInt(endDepthInput.value);
	
 var shadingRule = {	
		"rasterFunction" : "Hillshade",
					"rasterFunctionArguments" : {
					"Azimuth" : azimuthInput.value, 
					"Altitude" : altitudeInput.value,
					"ZFactor" : zfactorInput.value *(2),
						"Raster" : {		
							"rasterFunction" : "Mask",
							"rasterFunctionArguments" : {
							"IncludedRanges" : [maxDepth,minDepth]
							},  
							"variableName" : "DEM"
							},					
				},  
				"variableName" : "DEM"
			};
	
	BathyShaded.setRenderingRule(shadingRule);	
	BathyShaded.bringToBack();
	e.preventDefault();
	
  });
  
  