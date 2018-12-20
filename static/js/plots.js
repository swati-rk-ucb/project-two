function init() {
  d3.json("/all").then((data) => {
    timeScatterPlot(data);
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
  });
}

function filter_data(id, value) {
  console.log(id);
  var col = d3.select("." + id);
  console.log(col.attr);
  col.attr("class", "magnitude-col-sel");
  var date_filter = d3.select("#date-select").node().value;
  var region_filter = d3.select("#region-select").node().value;
  var tsunami_filter = d3.select("#tw-select").node().value;
  //build url to filter
  var url = "/filter/"+date_filter+"/"+region_filter + "/" + tsunami_filter + "/" + value;

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
init();