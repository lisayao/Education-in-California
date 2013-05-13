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

d3.json("data/data.json", function(error, data) {


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
        document.getElementById("map").removeAttribute("data-step");
        document.getElementById("map").removeAttribute("data-intro");
        document.getElementById("border2").setAttribute("data-step", "2");
        document.getElementById("border2").setAttribute("data-intro", "Change the x axis to display property tax allocated to schools per student and observe that this also correlates strongly with successful educational outcome.");
        document.getElementById("scatter").setAttribute("data-intro", "Observe the strong correlation between academic performance index and per-capita income in the county.");
        document.getElementById("scatter").setAttribute("data-step", "1");
        document.getElementById("border1").removeAttribute("data-step");
        document.getElementById("border1").removeAttribute("data-intro");
        document.getElementById("table").removeAttribute("data-step");
        document.getElementById("table").removeAttribute("data-intro");
        change_map_menu("api");
        change_scatter_y("api");
        change_scatter_x("income_per_capita");
        //introJs().goToStep(1).start();
        introJs().start()
    }

document.getElementById('link2').onclick = function()
    {
        document.getElementById("map").removeAttribute("data-step");
        document.getElementById("map").removeAttribute("data-intro");
        document.getElementById("border2").setAttribute("data-step", "2");
        document.getElementById("border2").setAttribute("data-intro", "Try adjusting the X-axis to other variables and observe the same lack of correlation for percentage of teachers with advanced degrees or other variables.");
        document.getElementById("scatter").setAttribute("data-intro", "No correlation exists between student-teacher ratio and academic outcome.");
        document.getElementById("scatter").setAttribute("data-step", "1");
        document.getElementById("border1").removeAttribute("data-step");
        document.getElementById("border1").removeAttribute("data-intro");
        document.getElementById("table").removeAttribute("data-step");
        document.getElementById("table").removeAttribute("data-intro");
        change_map_menu("api");
        change_scatter_y("api");
        change_scatter_x("student_teacher_ratio");
        introJs().start();
    }

document.getElementById('link3').onclick = function()
    {
        document.getElementById("map").setAttribute("data-step", "1");
        document.getElementById("map").setAttribute("data-intro", "Observe the clusters of high per-capita income around San Francisco, coastal southern California, and the region east of Sacramento.");
        document.getElementById("border2").removeAttribute("data-step");
        document.getElementById("border2").removeAttribute("data-intro");
        document.getElementById("scatter").setAttribute("data-intro", "Click and drag to highlight the dots in the upper left corner of the scatterplot. These counties are those which perform well despite having comparatively low income levels. Observe that those counties in this region which are not in one of the high-income cluster regions tend to be in the outskirts of those regions, or in the northern mountain region of California.");
        document.getElementById("scatter").setAttribute("data-step", "3");
        document.getElementById("border1").setAttribute("data-step", "2");
        document.getElementById("border1").setAttribute("data-intro", "Try adjusting the map variable to api and observe that these regions are also usually among the most academically high-performing in California.")
        document.getElementById("table").removeAttribute("data-step");
        document.getElementById("table").removeAttribute("data-intro");
        change_map_menu("income_per_capita");
        change_scatter_y("api");
        change_scatter_x("income_per_capita");
        introJs().start();
    }
};


       
        


introJs().start();


//Sources:
// Scatterplot: http://bl.ocks.org/mbostock/3887118
// SVG Map: http://commons.wikimedia.org/wiki/File:California_county_map_(labeled).svg
// Brushing: http://static.cybercommons.org/js/d3/examples/brush/brush.html
// Data: http://dq.cde.ca.gov/dataquest
//       http://en.wikipedia.org/wiki/California_locations_by_per_capita_income
//       http://www.boe.ca.gov/annual/pdf/2011/2010-11_statistical_appendix.pdf
