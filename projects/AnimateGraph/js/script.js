var data = [
    { x1: 0, y1: 5, x2: 0, y2: 20, x3: 0, y3: 20, },
    { x1: 1, y1: 5, x2: 1, y2: 20, x3: 1, y3: 30, },
    { x1: 2, y1: 5, x2: 2, y2: 35, x3: 2, y3: 50, },
    { x1: 3, y1: 5, x2: 3, y2: 45, x3: 3, y3: 50, },
    { x1: 4, y1: 5, x2: 4, y2: 70, x3: 4, y3: 40, },
    { x1: 5, y1: 5, x2: 5, y2: 15, x3: 5, y3: 15, },
    { x1: 6, y1: 5, x2: 6, y2: 0, x3: 6, y3: 2, },
    { x1: 7, y1: 0, x2: 7, y2: 0, x3: 7, y3: 2, },
    { x1: 8, y1: 5, x2: 8, y2: 95, x3: 8, y3: 25, },
    { x1: 9, y1: 5, x2: 9, y2: 0, x3: 9, y3: 45, },
    { x1: 10, y1: 0, x2: 10, y2: 0, x3: 10, y3: 45, },
    { x1: 11, y1: 5, x2: 11, y2: 50, x3: 11, y3: 25, },
    { x1: 12, y1: 5, x2: 12, y2: 20, x3: 12, y3: 15, },
];
var newData = [
    { x1: 0, y1: 0, x2: 0, y2: 0, x3: 0, y3: 0, },
    { x1: 1, y1: 0, x2: 1, y2: 0, x3: 1, y3: 0, },
    { x1: 2, y1: 0, x2: 2, y2: 0, x3: 2, y3: 0, },
    { x1: 3, y1: 0, x2: 3, y2: 0, x3: 3, y3: 0, },
    { x1: 4, y1: 0, x2: 4, y2: 0, x3: 4, y3: 0, },
    { x1: 5, y1: 0, x2: 5, y2: 0, x3: 5, y3: 0, },
    { x1: 6, y1: 0, x2: 6, y2: 0, x3: 6, y3: 0, },
    { x1: 7, y1: 0, x2: 7, y2: 0, x3: 7, y3: 0, },
    { x1: 8, y1: 0, x2: 8, y2: 0, x3: 8, y3: 0, },
    { x1: 9, y1: 0, x2: 9, y2: 0, x3: 9, y3: 0, },
    { x1: 10, y1: 0, x2: 10, y2: 0, x3: 10, y3: 0, },
    { x1: 11, y1: 0, x2: 11, y2: 0, x3: 11, y3: 0, },
    { x1: 12, y1: 0, x2: 12, y2: 0, x3: 12, y3: 0, },
];

// var format = d3.time.format("%m/%d/%y");

var margin = {top: 20, right: 0, bottom: 30, left: 0},
    width = $(".graphs").innerWidth() - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

// var x = d3.time.scale()
//     .range([0, width]);
//
// var y = d3.scale.linear()
//     .range([height, 0]);

// var z = d3.scale.category20c();
  // var z = d3.scale.ordinal()
  //         .domain(["Group1","Group2","Group3"])
  //         .range(["#B495B4","#4BB2D9","#FC9770"]);

  var x = d3.scale.linear()
      .domain([0, d3.max(data, function(d) { return d.x1; })])
      .range([0, width]);

  var y = d3.scale.linear()
      // .domain([0, d3.max(data, function(d) { return d.y1; })])
      .domain([0, 100])
      .range([height, 0]);

  var y2 = d3.scale.linear()
      .domain([0, 100])
      // .domain([0, 100])
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickFormat(d3.time.format("%H"))
      .ticks(13);

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");


  var svg = d3.select(".graphs").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var area3 = d3.svg.area()
      .x(function(d) { return x(d.x3); })
      .y0(height-7)
      // .y0(height)
      .y1(function(d) { return y(d.y3 + 4.7); })
      .interpolate("cardinal");
  svg.append("path")
      .data([newData])
      .attr("class", "area3")
      .attr("d", area3)
      .style("fill", "#4BB2D9");

  var area2 = d3.svg.area()
      .x(function(d) { return x(d.x2); })
      .y0(height-7)
      // .y0(height)
      .y1(function(d) { return y(d.y2 + 4.7); })
      .interpolate("monotone");
  svg.append("path")
      .data([newData])
      .attr("class", "area2")
      .attr("d", area2)
      .style("fill", "#FC9770")
      .style("opacity", "0.7");

  var area1 = d3.svg.area()
      .x(function(d) { return x(d.x1); })
      .y0(height)
      .y1(function(d) { return y(d.y1); })
      .interpolate("step-before");
  svg.append("path")
      .data([newData])
      .attr("class", "area1")
      .attr("d", area1)
      .style("fill", "#B495B4");

  svg.append("line")
      .style("stroke", "#cdcdcd")
      .style("stroke-width", "2")
      .attr("x1", 0)
      .attr("x2", 0)
      .attr("y1", height)
      .attr("y2", 0);
  svg.append("line")
      .style("stroke", "#cdcdcd")
      // .style("stroke-width", "2")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", height)
      .attr("y2", height);

  // svg.append("text")
  //   .data([data])
  //   .attr("x", function(d){return d.x1})
  //   .attr("y", height+15)
  //   .style("font-size", "12px")
  //   .attr("fill", "#cdcdcd")
  //   .text(function(d,i){
  //     return i * 2;
  //   });
    // .text("12am 2 4 6 8 10 12pm 2 4 6 8 10 12am");

// svg.append("g")
//     .attr("class", "x axis")
//     .attr("transform", "translate(0," + height + ")")
//     .call(xAxis);


// svg.append("clipPath")
//     .attr("id", "rectClip")
//   .append("rect")
//     .attr("width", 0)
//     .attr("height", height);

// function update() {
//   d3.select("#rectClip rect")
//     .transition().duration(300)
//       .attr("width", width);
// }
$(".time_period>div").click(function() {
  $(".time_period>div").removeClass("selected");
  $(this).addClass("selected");
});
$(".filter_options>div").click(function() {
  $(".filter_options>div").removeClass("selected");
  $(this).addClass("selected");

  // if($(this).hasClass("connectivity")) {
  //   svg.select(".area1")
  //       .transition().duration(350)
  //       .style("opacity", 1)
  //       .attr("d", area1(data));
  //   svg.select(".area2")
  //       .transition().duration(350)
  //       .style("opacity", 0)
  //       .attr("d", area2(newData));
  //   svg.select(".area3")
  //       .transition().duration(350)
  //       .style("opacity", 0)
  //       .attr("d", area3(newData));
  // }
  // else if($(this).hasClass("speed")) {
  //   svg.select(".area1")
  //       .transition().duration(350)
  //       .style("opacity", 0)
  //       .attr("d", area1(newData));
  //   svg.select(".area2")
  //       .transition().duration(350)
  //       .style("opacity", 0.7)
  //       .attr("d", area2(data));
  //   svg.select(".area3")
  //       .transition().duration(350)
  //       .style("opacity", 0)
  //       .attr("d", area3(newData));
  // }
  // if($(this).hasClass("wifi")) {
  // svg.select(".area1")
  //     .transition().duration(350)
  //     .style("opacity", 0)
  //     .attr("d", area1(newData));
  // svg.select(".area2")
  //     .transition().duration(350)
  //     .style("opacity", 0)
  //     .attr("d", area2(newData));
  // svg.select(".area3")
  //     .transition().duration(350)
  //     .style("opacity", 1)
  //     .attr("d", area3(data));
  // }

  if($(this).hasClass("connectivity")) {
    svg.select(".area1")
        .transition().duration(1350)

        .attr("d", area1(data));
    svg.select(".area2")
        .transition().duration(350)

        .attr("d", area2(newData));
    svg.select(".area3")
        .transition().duration(350)

        .attr("d", area3(newData));
  }
  else if($(this).hasClass("speed")) {
    svg.select(".area1")
        .transition().duration(350)

        .attr("d", area1(newData));
    svg.select(".area2")
        .transition().duration(1350)

        .attr("d", area2(data));
    svg.select(".area3")
        .transition().duration(350)

        .attr("d", area3(newData));
  }
  if($(this).hasClass("wifi")) {
  svg.select(".area1")
      .transition().duration(350)

      .attr("d", area1(newData));
  svg.select(".area2")
      .transition().duration(350)

      .attr("d", area2(newData));
  svg.select(".area3")
      .transition().duration(1350)

      .attr("d", area3(data));
  }
});

function initialize() {
  svg.select(".area1")
      .transition().duration(650)
      .attr("d", area1(data));
  svg.select(".area2")
      .transition().duration(1050)
      .attr("d", area2(data));
  svg.select(".area3")
      .transition().duration(1450)
      .attr("d", area3(data));
}

window.setTimeout(function(){initialize();},700);
