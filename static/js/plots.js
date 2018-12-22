var map = new maptalks.Map('map', {
  center: [0,0],
  zoom: 1,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    subdomains: ['a','b','c','d'],
    attribution: '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>'
  })
});

function init() {
  d3.json("/all").then((data) => {
    timeScatterPlot(data);
    sigScatterPlot(data);
    markers(data);
  });

}

function filterCharts(id, selValue) {
  var date_filter = d3.select("#date-select").node().value;
  var region_filter = d3.select("#region-select").node().value;
  var tsunami_filter = d3.select("#tw-select").node().value;
  //build url to filter
  var url = "/filter/"+date_filter+"/"+region_filter + "/" + tsunami_filter;

  clearOtherCells('mag0');
  console.log(url);
  d3.json(url).then((data) => {
    timeScatterPlot(data);
    sigScatterPlot(data);
    replay(data);
    changeView(region_filter);
  });
}

var div_colors = {"mag7" : "#ffff99", 
  "mag6" : "#ffcc66", "mag5" : "#ffaa00", "mag4" : "#ff751a", 
  "mag3" : "#cc0000", "mag2" : "#7a0000", "mag1" : "#3d0000"
};

function filter_data(id, value) {
  console.log(id, div_colors[id]);
  clearOtherCells(id);
  var col = d3.select("#" + id);
  col.style("background-color", div_colors[id]);
  var date_filter = d3.select("#date-select").node().value;
  var region_filter = d3.select("#region-select").node().value;
  var tsunami_filter = d3.select("#tw-select").node().value;
  //build url to filter
  var url = "/filter/"+date_filter+"/"+region_filter + "/" + tsunami_filter + "/" + value;

  console.log(url);
  d3.json(url).then((data) => {
    timeScatterPlot(data);
    sigScatterPlot(data);
    replay(data);
  });
}

function clearOtherCells(id) {
  var mag_cols = ["mag1", "mag2", "mag3", "mag4", "mag5", "mag6","mag7"];
  for (var i = 0; i < mag_cols.length; i++) {
    if (id != mag_cols[i]) {
      var col = d3.select("#" + mag_cols[i]).style("background-color", "#ffffff");
    }
  }
}

function timeScatterPlot(data) {
  console.log("Number of records ", data.count);
  var dates = d3.keys(data.timeseries_data);
    var counts = d3.values(data.timeseries_data);

    var sizes = [];
    for (var i = 0; i < counts.length; i++) {
      sizes[i] = counts[i] / 25;
    }
    var trace1 = {
      type: "scatter",
      mode: "lines+markers",
      x: dates,
      y: counts,
      line: {
        color: "red"
      }
    };

    var data = [trace1];

    var layout = {
      title: `Number of Earthquakes per Day`,
      xaxis: {
        range: [dates[dates.length], dates[0]],
        type: "date"
      },
      yaxis: {
        autorange: true,
        type: "linear"
      },
      height: 300,
      width: 525
    };

    Plotly.newPlot("plot", data, layout);
}

function sigScatterPlot(data) {
  console.log("Number of records ", data.count);
  var sig_value = d3.keys(data.sig_data);
    var counts = d3.values(data.sig_data);

    var sizes = [];
    for (var i = 0; i < counts.length; i++) {
      sizes[i] = counts[i];
    }
    var trace1 = {
      type: "scatter",
      mode: "markers",
      opacity: 0.65,
      x: sig_value,
      y: counts,
      marker: {
        color: "red",
        line:{
          color: "black",
          width: 0.5
        }
      }
    };

    var data = [trace1];

    var layout = {
      title: `Number of Earthquakes by Significance`,
      xaxis: {
        autorange: true,
        type: "linear"
      },
      yaxis: {
        autorange: true,
        type: "linear"
      },
      height: 300,
      width: 525
    };

    Plotly.newPlot("plot-2", data, layout);
}

/*
MapTalk functions
*/
var regions = {
  North_America: [-122.3321, 47.6062],
  South_America: [-51.9253, -14.2350],
  Asia: [87.325333, 43.675],
  Other: [17.2283, 26.3351],
  ANZ: [133.7751, -25.2744]
}

function changeView(loc) {
  if (loc == "North America"){
      map.animateTo({
          center: regions.North_America,
          zoom: 2.8,
          pitch: 0,
          bearing: 0,
        }, {
          duration: 5000
        });
  }
  else if (loc == "South America"){
      map.animateTo({
          center: regions.South_America,
          zoom: 3,
          pitch: 0,
          bearing: 0,
        }, {
          duration: 5000
        });
  }
  else if (loc == "Asia"){
      map.animateTo({
          center: regions.Asia,
          zoom: 2.4,
          pitch: 0,
          bearing: 0,
        }, {
          duration: 5000
        });
  }
  else if (loc == "Other"){
      map.animateTo({
          center: regions.Other,
          zoom: 2.4,
          pitch: 0,
          bearing: 0,
        }, {
          duration: 5000
        });
  }
  else if (loc == "ANZ"){
      map.animateTo({
          center: regions.ANZ,
          zoom: 3,
          pitch: 0,
          bearing: 0,
        }, {
          duration: 5000
        });
  }
  else {
      map.animateTo({
          center: [0,0],
          zoom: 1.3,
          pitch: 0,
          bearing: 0,
        }, {
          duration: 5000
        });
  }
}
var layer = new maptalks.VectorLayer('vector').addTo(map);

function colorsMarkers(mag){
  if (mag <= 1){
    circle_color = "#7FFF00";
  }
  else if (mag > 1 && mag<= 2) {
    circle_color = "#ffff99";
  }
  else if (mag >2 && mag<= 3) {
    circle_color = "#ffcc66";
  }
  else if (mag >3 && mag <=4) {
    circle_color = "#ffaa00";
  }
  else if (mag >4 && mag <=5) {
    circle_color = "#ff751a";
  }
  else if (mag>5 && mag<=6) {
    circle_color = "#cc0000";
  }
  else if (mag>6 && mag<=7){
    circle_color = "#7a0000";
  }
  else {
    circle_color = "#3d0000";
  }
  return circle_color;
}
var marker = [];
var magnitude = [];
function markers(data){
      var features = data.all_events;
      for (var i=0; i <features.length;i++){
          var location = features[i].location;

          if (features[i].magnitude <= 0){
              magnitude = .5;
          }
          else{
              magnitude = features[i].magnitude;
          }
          //var magnitude = math.abs(features[i].magnitude)
          marker = new maptalks.Marker([location[0], location[1]], {
          'symbol' :{
              'markerType' : 'ellipse',
              'markerWidth' : magnitude*3,
              'markerHeight' : magnitude*3,
              'markerFill' : colorsMarkers(magnitude),
              'markerFillOpacity' : 1,
              'markerLineColor' : "#00000",
              'markerLineWidth' : .25
              }
          }).addTo(layer);
  }
}    

function replay(data){
  reset(data);
  add_layer(data);
}


function add_layer(data){
  layer = new maptalks.VectorLayer('vector').addTo(map);
  markers(data);
}
function reset(data) {
    map.removeLayer(layer)
    };

init();