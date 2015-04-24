require(["application/bootstrapmap", 
         "esri/layers/FeatureLayer",
         "esri/renderers/smartMapping",
         "dojo/domReady!"],
function (BootstrapMap, FeatureLayer, smartMapping) {
  // Get a reference to the ArcGIS Map class
  map = BootstrapMap.create("mapDiv", {
    basemap: "national-geographic",
    center: [-95, 37],
    zoom: 4,
    scrollWheelZoom: false
  });

  // Storm Types
  var dropdown = $("#storm-type");
  $.each(services, function (i, service) {
    var option = $("<option />", {
      value : service.url,
      text : service.label
    });
    dropdown.append(option);
  });
  // Color ramp
  var colorViz = new classyBrew();
  colorViz.setNumClasses(5);
  $.each(colorViz.getColorCodesByType()['seq'].slice(0, 3), function (i, c) {
    colorViz.setColorCode(c);
    var row = $("<div />", {
      class : 'row',
      style : 'margin: 5px'
    });
    var input = $("<input />", {
      type : 'radio',
      name : 'color-code',
      value : c,
      class : "col-md-2",
      style : 'margin : 0; padding : 0'
    });
    if(i == 0) {
      input.attr('checked', 'true');
    }
    row.append(input);
    $.each(colorViz.getColors(), function (i, rgb) {
      var col = $("<div />", {
        class : "col-md-2",
        style : "background-color:" + rgb + "; height:10px;" 
      });
      row.append(col);
    });
    $("#color-wrap").append(row);
  });

  // Set initial options

  // add featurelayer to map
  function setActiveLayer(url) {
    
  }
  setActiveLayer("http://192.241.200.140:1337/github/tannerkj/esri-data-viz/data::deadly_storm_locs/FeatureServer/0")
});