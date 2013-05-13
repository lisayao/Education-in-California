/* changeColor takes a path ID and a color (hex value)
and changes that path's fill color */

function changeColor(id, color) {
	document.getElementById(id).style.fill=color;   
};


function hltdot(id){

	//console.log(d3.selectAll(".dot"));
	//d3.selectAll(".dot").selectAll(id).style("fill", function(d) {return console.log(id);})
}

function loadmap () {

	d3.json("data/data.json", function(error, data) {

		//initialize colors
		var color = "#000000";	
		var color1 = "#F0F9E8";
	    var color2 = "#BAE4BC";
	    var color3 = "#7BCCC4";
	    var color4 = "#43A2CA";
	    var color5 = "#0868AC";


	    var vv = document.getElementById("menu");
		var varb = vv.options[vv.selectedIndex].value;
		console.log(varb);


		var values = new Array();

		data.forEach(function(d) {

	    	//convert all digit-containing strings to numbers
	    	for (t in d) {
	          if (/\d/.test(d[t])){
	          d[t] = +d[t];
	      	  }
	      	}

	      	values.push(d[varb]);
	     });

		values = values.sort(function(a,b){return a-b});
		console.log(values);

	    maxvalue = d3.max(data, function(d) { return d[varb]; });
	    //maxvalue = +maxvalue
	    minvalue = d3.min(data, function(d) { return d[varb]; });
	    //maxvalue = +maxvalue

	    //calculates values incorrectly
	    range = d3.extent(data, function(d) { return d[varb]; });
		console.log(maxvalue);
		console.log(minvalue);
		console.log(range);

		b1 = values[0];
		//Math.floor((minvalue*1 + (maxvalue-minvalue)*1/5)*100/maxvalue);
		console.log(b1);
		b2 = values[10];
		//Math.floor((minvalue*1 + (maxvalue-minvalue)*2/5)*100/maxvalue);
		console.log(b2);
		b3 = values[22];
		//Math.floor((minvalue*1 + (maxvalue-minvalue)*3/5)*100/maxvalue)
		console.log(b3);
		b4 = values[34];
		//Math.floor((minvalue*1 + (maxvalue-minvalue)*4/5)*100/maxvalue)
		console.log(b4);
		b5 = values[57];
		//Math.floor((minvalue*1 + (maxvalue-minvalue)*5/5)*100/maxvalue)
		console.log(b5);



	    data.forEach(function(d) {


		//.on("mouseover", function(){d3.select(this).style("fill", "aliceblue");})
		//.on("mouseout", function(){d3.select(this).style("fill", "white");});
	    	//convert all digit-containing strings to numbers
	    	/*for (t in d) {
	          if (/\d/.test(d[t])){
	          d[t] = +d[t];
	      	  }
	      	}*/
		    //get max
			//use var here
	    	console.log(d.county);
	    	percent = d[varb];
	    	//d[varb]*100/maxvalue;
	    	console.log(d[varb]);

				//brackets of metric
			
	    
		    //use variables here
		    if (percent <=b1){
			    color = color1;
			}
			if (percent >b1 && percent <=b2){
			    color = color2;
			}
			if (percent >b2 && percent <=b3){
			    color = color3;
			}
			if (percent >b3 && percent <=b4){
			    color = color4;
			}
			if (percent >b4 && percent <=b5){
			    color = color5;
			}

			
			changeColor(d.county,color);
		


		});	

	// max and min in tooltip
	d3.select("#tooltip")
 	.html("<center>"+ "Max: " + maxvalue + " Min: " + minvalue + "</center>");
 	d3.select("#b1text").html("< " + b1);
 	d3.select("#b2text").html( b1 + " < " +"x"+ " < "+ b2);
 	d3.select("#b3text").html( b2 + " < " +"x"+ " < "+ b3);
 	d3.select("#b4text").html( b3 + " < " +"x"+ " < "+ b4);
 	d3.select("#b5text").html( b4 + " < " +"x"+ " < "+ b5);

 	//doesn't work
	d3.selectAll("path, polyline, polygon")
		.data(data)
		//.attr("dy", ".35em")
		.on("mouseover", function (d) {

			nospace = this.id.replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "");
			origcolor = d3.selectAll("#" + nospace).style("fill");
			d3.selectAll("#" + nospace).style("fill","red");
			
			d3.select("#tablename")
 			.html(this.id);
 			d3.select("#api_t")
 			.html(d.api);
 			d3.select("#english_percent_t")
 			.html(d.english_percent);
 			d3.select("#history_percent_t")
 			.html(d.history_percent);
 			d3.select("#math_percent_t")
 			.html(d.math_percent);
 			d3.select("#science_percent_t")
 			.html(d.science_percent);
 			d3.select("#masters_percent_t")
 			.html(d.masters_percent);
 			d3.select("#grad_percent_t")
 			.html(d.grad_percent);
 			d3.select("#suspension_rate_t")
 			.html(d.suspension_rate);
 			d3.select("#income_per_capita_t")
 			.html(d.income_per_capita);
 			d3.select("#prop_tax_allocations_t")
 			.html(d.prop_tax_allocations);
 			d3.select("#students_num_t")
 			.html(d.students_num);
 			d3.select("#student_teacher_ratio_t")
 			.html(d.student_teacher_ratio);
 			d3.select("#population_t")
 			.html(d.population);



		})
		.on("mouseout", function(){ 
			nospace = this.id.replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "");
			d3.selectAll("#" + nospace).style("fill",origcolor);})
		.each( function(d){
			d3.select(this).append("title").text(this.id);
		})

	});


};
window.onload = loadmap ();

