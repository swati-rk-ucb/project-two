function init() {
  d3.json("/all").then((data) => {
    timeScatterPlot(data);
    sigScatterPlot(data);
  });

}

function filterCharts(id, selValue) {
  var date_filter = d3.select("#date-select").node().value;
  var region_filter = d3.select("#region-select").node().value;
  var tsunami_filter = d3.select("#tw-select").node().value;
  //build url to filter
  var url = "/filter/"+date_filter+"/"+region_filter + "/" + tsunami_filter;

  console.log(url);
  d3.json(url).then((data) => {
    timeScatterPlot(data);
    sigScatterPlot(data);
  });
}

var div_colors = {"mag7" : "#ffff99", 
  "mag6" : "#ffcc66", "mag5" : "#ffaa00", "mag4" : "#ff751a", 
  "mag3" : "#cc0000", "mag2" : "#7a0000", "mag1" : "#3d0000"
};

function filter_data(id, value) {
  console.log(id, div_colors[id]);
  var col = d3.select("#" + id);
  col.style("background-color", '"'+div_colors[id]+'"');
  clearOtherCells(id);
  var date_filter = d3.select("#date-select").node().value;
  var region_filter = d3.select("#region-select").node().value;
  var tsunami_filter = d3.select("#tw-select").node().value;
  //build url to filter
  var url = "/filter/"+date_filter+"/"+region_filter + "/" + tsunami_filter + "/" + value;

  console.log(url);
  d3.json(url).then((data) => {
    timeScatterPlot(data);
    sigScatterPlot(data);
  });
}

function clearOtherCells(id) {
  var mag_cols = ["mag1", "mag2", "mag3", "mag4", "mag5", "mag6","mag7"];
  for (var i = 0; i < mag_cols.length; i++) {
    if (id != mag_cols[i]) {
      console.log(mag_cols[i]);
      var col = d3.select("#" + id).style("background-color", "#FFFFFF");
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
      //title: `Number of Earthquakes per Day`,
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
      //title: `Number of Earthquakes per Day`,
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
init();