function loadgraph(){
  d3.select("#scatter").select("svg").remove();
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
  width = 600 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;

  var x = d3.scale.linear()
  .range([0, width]);

  var y = d3.scale.linear()
  .range([height, 0]);

//can adjust color here
var color = d3.scale.category10();

var xAxis = d3.svg.axis()
.scale(x)
.orient("bottom");

var yAxis = d3.svg.axis()
.scale(y)
.orient("left");

var svg = d3.select("body").select("#scatter").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xx = document.getElementById("xaxis");
var xaxs = xx.options[xx.selectedIndex].value;
console.log(xaxs);

var yy = document.getElementById("yaxis");
var yaxs = yy.options[yy.selectedIndex].value;

d3.json("data.json", function(error, data) {


    //converts strings containing digits to numbers, 
    data.forEach(function(d) {
      for (t in d) {
          if (/\d/.test(d[t])){
              d[t] = +d[t];}
          }
      });

  //use variables here
  x.domain([d3.min(data, function(d) { return d[xaxs]; }),d3.max(data, function(d) { return d[xaxs]; })]);
  y.domain([d3.min(data, function(d) { return d[yaxs]; }),d3.max(data, function(d) { return d[yaxs]; })]);

    //d3.extent calculates the min and the max incorrectly
    //x.domain(d3.extent(data, function(d) { return d[xaxs]; })).nice();
    //y.domain(d3.extent(data, function(d) { return d[yaxs]; })).nice();

    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    .attr("class", "label")
    .attr("x", width)
    .attr("y", -6)
    .style("text-anchor", "end")
        //use variables here
        .text(xx.options[xx.selectedIndex].text);

    svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    <!--use variables here-->
    .text(yy.options[yy.selectedIndex].text)


    var circle = svg.selectAll(".dot")
    .data(data)
    .enter().append("circle")
    .attr("class", "dot")
    .attr("r", 5)
    //use variables here
    .attr("cx", function(d) { return x(d[xaxs]); })
    .attr("cy", function(d) { return y(d[yaxs]); })
    .attr("id", function(d){ return d.county.replace(" ","").replace(" ","").replace(" ","").replace(" ","");})
    //change color
    .style("fill", function(d) { return "#7BCCC4"; })
    .append("title")
    .text(function(d) { return d.county; })

    ;

    /*var legend = svg.selectAll(".legend")
        .data(color.domain())
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });*/


svg.append("g")
.attr("class", "brush")
.call(d3.svg.brush().x(x).y(y)
    .on("brushstart", brushstart)
    .on("brush", brushmove)
    .on("brushend", brushend));

function brushstart() {
  svg.classed("selecting", true);
  loadmap();

  if (your_selection[0][0]){
        for (var i = 0; i < your_selection[0].length; i++){
            console.log(your_selection[0][i]);
            your_selection[0][i].style.fill="#7BCCC4";
            }
    }
}

function brushmove() {
  var e = d3.event.target.extent();
  // circle.classed("selected", function(d) {
  //  return (e[0][0] <= d[xaxs] && d[xaxs] <= e[1][0]
  // && e[0][1] <= d[yaxs] && d[yaxs] <= e[1][1]);
      
  //   });
//console.log(e);
your_selection = d3.selectAll(".dot").filter(function(d) {
  return (e[0][0] <= d[xaxs] && d[xaxs] <= e[1][0]
  && e[0][1] <= d[yaxs] && d[yaxs] <= e[1][1]);

});

}

function brushend() {

    highlight_county();
    highlight_dot();
    svg.classed("selecting", !d3.event.target.empty());
}



function highlight_county (){
    if (your_selection[0][0]){
        for (var i = 0; i < your_selection[0].length; i++){
            s = your_selection[0][i].getAttribute("id").replace(/([a-z])([A-Z])/g, '$1 $2');
            changeColor(s, "#f00");
            }
    }
    else loadmap();
}

function highlight_dot(){
    if (your_selection[0][0]){
        for (var i = 0; i < your_selection[0].length; i++){
            console.log(your_selection[0][i]);
            your_selection[0][i].style.fill="#f00";
            }
    }
    else loadgraph();
};

});
};
loadgraph();

 function change_map_menu(input){
            var index = document.getElementById('menu').length;
            for(var i=0;i<index;i++){
               if(document.getElementById('menu').options[i].value == input){
                  document.getElementById('menu').selectedIndex = i;
                  loadmap();
               }
            }
        };

 function change_scatter_x(input){
            var index = document.getElementById('xaxis').length;
            for(var i=0;i<index;i++){
               if(document.getElementById('xaxis').options[i].value == input){
                  document.getElementById('xaxis').selectedIndex = i;
                  loadgraph();
               }
            }
        };

 function change_scatter_y(input){
    var index = document.getElementById('yaxis').length;
    for(var i=0;i<index;i++){
       if(document.getElementById('yaxis').options[i].value == input){
          document.getElementById('yaxis').selectedIndex = i;
          loadgraph();
       }
    }
};

window.onload = prepareButton;



function prepareButton()
{
document.getElementById('link1').onclick = function()
    {
        console.log("works");
        document.getElementById("map").removeAttribute("data-step");
        document.getElementById("border2").removeAttribute("data-step");
        document.getElementById("scatter").setAttribute("data-intro", "Observe the strong correlation between academic performance index and per-capita income in the county.");
        document.getElementById("scatter").setAttribute("data-step", "1");
        document.getElementById("border1").removeAttribute("data-step");
                document.getElementById("border1").removeAttribute("data-intro");
        document.getElementById("table").removeAttribute("data-step");
        change_map_menu("api");
        change_scatter_y("api");
        change_scatter_x("income_per_capita");
        //introJs().goToStep(1).start();
        introJs().start()
    }

document.getElementById('link2').onclick = function()
    {
        console.log("works");
        document.getElementById("map").setAttribute("data-intro", "hi");
        document.getElementById("border2").setAttribute("data-intro", "hi");
        document.getElementById("scatter").setAttribute("data-intro", "hi");
        document.getElementById("border1").setAttribute("data-intro", "hi");
        document.getElementById("table").setAttribute("data-intro", "hi");
        change_map_menu("prop_tax_allocations");
        change_scatter_y("api");
        change_scatter_x("prop_tax_allocations");
        introJs().start();
    }

document.getElementById('link3').onclick = function()
    {
        console.log("works");
        document.getElementById("map").setAttribute("data-intro", "hi");
        document.getElementById("border2").setAttribute("data-intro", "hi");
        document.getElementById("scatter").setAttribute("data-intro", "hi");
        document.getElementById("border1").setAttribute("data-intro", "hi");
        document.getElementById("table").setAttribute("data-intro", "hi");
        change_map_menu("student_teacher_ratio");
        change_scatter_y("api");
        change_scatter_x("student_teacher_ratio");
        introJs().start();
    }
};


       
        


introJs().start();


//Sources:
//http://commons.wikimedia.org/wiki/File:California_county_map_(labeled).svg
//http://stackoverflow.com/questions/1974798/javascript-how-to-make-auto-select-another-drop-down
//http://bl.ocks.org/mbostock/4063663
//http://static.cybercommons.org/js/d3/examples/brush/brush.html
