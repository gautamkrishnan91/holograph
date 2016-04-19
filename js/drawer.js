function drawgraph(divcl,pri)
{
var causes = ["impactNeighbors", "investment",	"infiltration",	"dollarsPerGallon","damageReduction", "capacityUsed","waterFlowPath","maxFloodedArea"
];

var margin = {top: 20, right: 50, bottom: 30, left: 20},
    width = 600 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width]);

var y = d3.scale.linear()
    .rangeRound([height, 0]);

if(divcl==".div-2")
  var z = d3.scale.linear().range(['#e5f5f9','#99d8c9','#2ca25f']);
else if(divcl==".div-3")
  var z = d3.scale.linear().range(['#fff7bc','#fec44f','#d95f0e']);
else if(divcl==".div-4")
  var z = d3.scale.linear().range(['#ece7f2','#a6bddb','#2b8cbe']);
else {
  var z = d3.scale.category20();
}

// else {
//   return "";
// }
// }

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("right");

var svg = d3.select(divcl).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("js/ecodata.csv", type, function(error, data) {
  if (error) throw error;

  var layers = d3.layout.stack()(causes.map(function(c) {
    return data.map(function(d) {
      return {x: d.Trail, y: d[c]};
    });
  }));
  console.log(layers);
  console.log(causes);
  x.domain(layers[0].map(function(d) { return d.x; }));
  y.domain([0, d3.max(layers[layers.length - 1], function(d) { return d.y0 + d.y; })]).nice();

  var layer = svg.selectAll(".layer")
      .data(layers)
    .enter().append("g")
      .attr("class", "layer")
      .style("fill", function(d, i) { return z(i); });

  layer.selectAll("rect")
      .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d) { return x(d.x); })
      .attr("class",function(d) { return d.x; })
      .attr("y", function(d) { return y(d.y + d.y0); })
      .attr("height", function(d) { return y(d.y0) - y(d.y + d.y0); })
      .attr("width", (x.rangeBand() - 1)*0.8);

  svg.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 3))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("fill", "white")
        .text(function(){
            if(divcl==".div-2")
              return "Pedestrian";
            if(divcl==".div-3")
              return "Politician";
            if(divcl==".div-4")
             return "Quality Analyst";
            else {
              return "";
            }
        });
  });
function type(d) {
  d.impactNeighbors=+d.impactNeighbors*pri[0];
  d.investment=+d.investment*pri[1];
  d.infiltration=+d.infiltration*pri[2];
  d.dollarsPerGallon=+d.dollarsPerGallon*pri[3];
  d.damageReduction=+d.damageReduction*pri[4];
  d.capacityUsed=+d.capacityUsed*pri[5];
  d.waterFlowPath=+d.waterFlowPath*pri[6];
  d.maxFloodedArea=+d.maxFloodedArea*pri[7];
  return d;
}
}
