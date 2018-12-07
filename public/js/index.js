var svg = d3.select("svg")
    .attr("tabindex", 1)
    .on("mousedown", mousedown);

// Initialize to something

var points = []
var dragged = null;
var selected = null;
var line = d3.svg.line();

svg.append("path")
    .datum(points)
    .attr("class", "line")
    .call(redraw);

d3.select(window)
    .on("mousemove", mousemove)
    .on("mouseup", mouseup)
    .on("keydown", keydown);

d3.select("#interpolate")
    .on("change", change)
  .selectAll("option")
    .data([
      "linear",
      "step-before",
      "step-after",
      "basis",
      "basis-open",
      "basis-closed",
      "cardinal",
      "cardinal-open",
      "cardinal-closed",
      "monotone"
    ])
  .enter().append("option")
    .attr("value", function(d) { return d; })
    .text(function(d) { return d; });

svg.node().focus();

function redraw() {
  svg.select("path").attr("d", line);

  var circle = svg.selectAll("circle")
      .data(points, function(d) { return d; });

  circle.enter().append("circle")
      .attr("r", 1e-6)
      .on("mousedown", function(d) { selected = dragged = d; redraw(); })
    .transition()
      .duration(750)
      .ease("elastic")
      .attr("r", 3.5);
  
  if(selected){
    circle
        .classed("selected", function(d) { return d === selected; })
        .attr("cx", function(d) { return d[0]; })
        .attr("cy", function(d) { return d[1]; });    
  }


  circle.exit().remove();

  if (d3.event) {
    d3.event.preventDefault();
    d3.event.stopPropagation();
  }
}

function change() {
  line.interpolate(this.value);
  redraw();
}

function mousedown() {
  points.push(selected = dragged = d3.mouse(svg.node()));
  redraw();
}

function mousemove() {
  if (!dragged) return;
  var m = d3.mouse(svg.node());
  console.log(m)
  dragged[0] = Math.max(0, Math.min(svg.style.width, m[0]));
  dragged[1] = Math.max(0, Math.min(svg.style.height, m[1]));
  redraw();
}

function mouseup() {
  if (!dragged) return;
  mousemove();
  dragged = null;
}

function keydown() {
  if (!selected) return;
  switch (d3.event.keyCode) {
    case 8: // backspace
    case 46: { // delete
      var i = points.indexOf(selected);
      points.splice(i, 1);
      selected = points.length ? points[i > 0 ? i - 1 : 0] : null;
      redraw();
      break;
    }
  }
}