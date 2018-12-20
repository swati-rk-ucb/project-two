function init() {
  d3.json("/all").then((data) => {
    timeScatterPlot(data);
  });

}

function filterCharts(id, selValue) {
  var date_filter = d3.select("#date-select").node().value;
  var region_filter = d3.select("#region-select").node().value;
  //build url to filter
  var url = "/filter/"+date_filter+"/"+region_filter;

  console.log(url);
  d3.json(url).then((data) => {
    timeScatterPlot(data);
  });
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
      mode: "markers",
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
        range: [dates[0], dates[dates.length-1]],
        type: "date"
      },
      yaxis: {
        autorange: true,
        type: "linear"
      },
      height: 300,
      width: 500
    };

    Plotly.newPlot("plot", data, layout);
}
init();