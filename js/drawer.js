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
  var z = function(d){var k=['#f7fcf5','#e5f5e0','#c7e9c0','#a1d99b','#74c476','#41ab5d','#238b45','#005a32'];return k[d];}
else if(divcl==".div-3")
  var z = function(d){var k=['#fff5eb','#fee6ce','#fdd0a2','#fdae6b','#fd8d3c','#f16913','#d94801','#8c2d04'];return k[d];}
else if(divcl==".div-4")
  var z = function(d){var k=['#f7fbff','#deebf7','#c6dbef','#9ecae1','#6baed6','#4292c6','#2171b5','#084594'];return k[d];}
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
      .attr("width", (x.rangeBand() - 1)*0.8)
      .attr("stroke","black")
      .attr("stroke-width","0.5px")
      .attr("stroke-opacity","0.2");

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
            if(divcl==".div-1")
              return "What's your priority?";
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
