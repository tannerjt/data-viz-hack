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

  function layerFactory(url) {
    var fLayer = new FeatureLayer(url, {
      "mode" : FeatureLayer.MODE_SNAPSHOT,
      "opacity" : 0.9
    });
    return fLayer;
  };

  function createRenderer(layer, radius, colors) {
    // return promise .then
    return smartMapping.createHeatmapRenderer({
      layer : layer,
      basemap : map.getBasemap(),
      blurRadius : radius
    });
  };

  var fl = null;
  function addLayer(url, radius) {
    if(fl) map.removeLayer(fl);
    fl = layerFactory(url);
    map.addLayer(fl);
    fl.on("load", function () {
      var renderer = createRenderer(fl, radius);
      renderer.then(function (response) {
        var cb = new classyBrew();
        cb.setNumClasses(6);
        cb.setColorCode($("#color-wrap input:checked").val());
        var colors = cb.getColors();
        var r = response.renderer;
        colors[0] = colors[0].replace(")", ",0.2)");
        r.setColors(colors);
        fl.setRenderer(r);
        fl.redraw();
      })
    });
  }

  // Storm Types
  var dropdown = $("#storm-type");
  var curStormUrl = null;
  $.each(services, function (i, service) {
    var option = $("<option />", {
      value : service.url,
      text : service.label
    });
    dropdown.append(option);
  });
  dropdown.on('change', function (e) {
    var url = $(e.target).val();
    curStormUrl = url;
    // change featureLayer
    var radius;
    $.each(services, function (idx, l) {
      if(l.url == url) {
        radius = l.radius;
      }
    });
    addLayer(url, radius);
  })
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
    input.on('click', function (e) {
      var selectedColor = $(e.target).val();
      // change color ramp
      var radius;
      $.each(services, function (idx, l) {
        if(l.url == curStormUrl) {
          radius = l.radius;
        }
      });
      addLayer(curStormUrl, radius);
    });
    $.each(colorViz.getColors(), function (i, rgb) {
      var col = $("<div />", {
        class : "col-md-2",
        style : "background-color:" + rgb + "; height:10px;" 
      });
      row.append(col);
    });
    $("#color-wrap").append(row);
  });

  // initial add first layer in services obj
  addLayer(services[0].url, services[0].radius);
  curStormUrl = services[0].url;
});