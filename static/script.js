$(document).ready(function() {
		$("#delete").click(function(){

				console.log('Let\'s delete all the grids');

			
			$.ajax({
			    type : "POST",
			    url : "deleteAllTheGrids",
			    data: JSON.stringify(true, null, '\t'),
			    contentType: 'application/json;charset=UTF-8',
			    success: function(result) {
			      if(result)
			      {
			      	console.log('Graphs deleted');
			      	$("#listG").html("")
			      }  
			      
			    }
		});
		 
		});
	var listOfsol = [];
	$("#listG tr").click(function(){
		$("#resolG").html("<img src='static/load.gif' />")
		console.log('Go with the set number : '+this.id);
		 $.ajax({
		    type : "POST",
		    url : "resolution",
		    data: JSON.stringify(this.id, null, '\t'),
		    contentType: 'application/json;charset=UTF-8',
		    success: function(result) {
		        printResult(result);
		    }
		});
	});

	function printResult(r){
		
		var text = "";

		obj = eval(r);

		/*timeTable = [];
		obj.forEach(function(e, index){
			if(e['sol'] != "No path for this one..")
			{
				timeTable.push({"rows":e['rows'],"obs":e['obs'],"time":e['time']});
			}
		});

		console.log(timeTable);
		*/
		listOfsol = []
		obj.forEach(function(e, index){
			listOfsol.push(e['sol'])
			text+="<tr id='"+e["num"]+"##"+e["grid"]+"'>";

			text+="<td>"+e["num"]+"</td>";
			text+="<td>"+e["rows"]+"</td>";
			text+="<td>"+e["obs"]+"</td>";
			text+="<td>"+e["sol"]+"</td>";
			text+="<td>"+e["time"]+"</td>";

			text+="</tr>";
			
		});
			
		$("#resolG").html(text)

		$("#resolG tr").click(function(){
			var id = this.id.split("##")[0];
			var path = this.id.split("##")[1];

			console.log('Let\'s print Grid #'+id);
			$.ajax({
			    type : "POST",
			    url : "affiche",
			    data: JSON.stringify(this.id, null, '\t'),
			    contentType: 'application/json;charset=UTF-8',
			    success: function(result) {
			        
			        parseGrid(result,id-1);
			    }
		});
		 
		});


		function parseGrid (data,id){
			
			d = data.split("\n")
			m = +d[0].split(" ")[0]
			tableEntre=[];
			for (var i = 0; i < m; i++) {
				tableEntre[i] = [];
				};
			for (var i = 0; i < m; i++) {
				for (var j = 0; j < m; j++) {
					tableEntre[i][j] = +d[i+1].split(" ")[j] ;
				}	
			}


			infos = d[m+1].split(' ')

			var dep = {"x":+infos[1],"y":+infos[0],"dir":infos[4]};
			var arr = {"x":+infos[3],"y":+infos[2]};

			 var margin = {
                     top: 20,
                     right: 20,
                     bottom: 20,
                     left: 20
                 },
                 width = 500 - margin.left - margin.right,
                 height = 500 - margin.top - margin.bottom;
             d3.select('#viz').html("");
            var svg = d3.select('#viz').append("svg")
	                 .attr("width", width + margin.left + margin.right)
	                 .attr("height", height + margin.top + margin.bottom)
	                 .append("g")
	                 .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			var pas = width/m;

			for (var i = 0; i < m+1; i++) {
				 svg.append("g")
                    .attr("class", "line")
                    .append("line")
                    .attr("y1", pas*i)
                    .attr("y2", pas*i)
                    .attr("x1", 0)
                    .attr("x2", width);
				svg.append("g")
                    .attr("class", "line")
                    .append("line")
                    .attr("y1", 0)
                    .attr("y2", height)
                    .attr("x1", pas*i)
                    .attr("x2", pas*i);                    

			}
			
			for (var i = 0; i < m; i++) {
				for (var j = 0; j < m; j++) {
					if(tableEntre[i][j]==1)
					{
						 svg.append("g")
		                    .attr("class", "square")
		                    .append("rect")
		                    .attr("width", pas-2)
		                    .attr("height", pas-2)
		                    .attr("y", pas*(i)+1)
		                    .attr("x", pas*(j)+1);
					}
				}
			}

			svg.append("g")
                    .attr("class", "depart")
                    .append("rect")
                    .attr("width", pas/2)
		            .attr("height", pas/2)
                    .attr("x", dep.x*pas-(pas/4))
                    .attr("y", dep.y*pas-(pas/4));        
			svg.append("g")
                    .attr("class", "arrivee")
                    .append("rect")
                    .attr("width", pas/2)
		            .attr("height", pas/2)
                    .attr("x", arr.x*pas-pas/4)
                    .attr("y", arr.y*pas-pas/4);                

            var dir = dep.dir;
            var x = dep.x;
            var y = dep.y;

            var sol = listOfsol[id].split(" ");
            var nbStep = +sol[0];
            console.log(sol);
           
            for (var i = 0; i <= nbStep; i++) {
            	if(sol[1+i]=="G" || sol[1+i]=="D" )
            	{
            		turn(sol[i+1])
            	}
            	if(sol[i+1].substring(0,1) == "a")
            	{
            		var l = +sol[i+1].split("a")[1];
            		avance(l);
            	}
            }
            

            function avance(l)
            {
            	oldX = x;
            	oldY = y;
            	if(dir=="ouest")
            	{
            		x-=l;
            	}
            	else if(dir=="est")
            	{
            		x+=l;
            	}
            	else if(dir=="nord")
            	{
            		y-=l;
            	}
            	else
            	{
            		y+=l;
            	}
            	
            	svg.append("g")
                    .attr("class", "path")
                    .append("line")
                    .attr("x1", oldX * pas)
                    .attr("y1", oldY * pas)
                    .attr("x2", x * pas)
                    .attr("y2", y * pas);

            }
            function turn(d)
            {
            	if(dir=="sud" && d=="G")
            	{
            		dir="est";
            		
            	}
            	else if(dir=="sud" && d=="D")
            	{
            		dir="ouest";		
            	
            	} 
            	else if(dir=="nord" && d=="G")
            	{
            		dir="ouest";		
            		
            	} 
            	else if(dir=="nord" && d=="D")
            	{
            		dir="est";		
            		
            	} 
            	else if(dir=="est" && d=="G")
            	{
            		dir="nord";		
            		
            	} 
            	else if(dir=="est" && d=="D")
            	{
            		dir="sud";		
            		
            	} 
            	else if(dir=="ouest" && d=="D")
            	{
            		dir="nord";		
            		
            	} 
            	else 
            	{
            		dir="sud";		
            		
            	}
            	return 
            		
            }

		}

	}

		var m = [20, 20, 40, 65]; // margins
		var w = 500 - m[1] - m[3]; // width
		var h = 300 - m[0] - m[2]; // height
		
		d3.csv("static/logs.csv",function(error,csv){
			data = [
			{'obs':10,'time':0},
			{'obs':20,'time':0},
			{'obs':30,'time':0},
			{'obs':40,'time':0},
			{'obs':50,'time':0}
			];
			data1 = [
			{'obs':10,'time':0},
			{'obs':20,'time':0},
			{'obs':30,'time':0},
			{'obs':40,'time':0},
			{'obs':50,'time':0}
			];
			indexes = [0,0,0,0,0];
			indexes1 = [0,0,0,0,0];
			csv.forEach(function(d,i){
				
				if(d.nbLignes == d.nbObstacles && d.nbLignes%10 == 0)
				{
					data[(d.nbLignes/10)-1]['time']+= +d['time'];
					indexes[(d.nbLignes/10)-1]+=1;
				}
				if(d.nbLignes == 20 && d.nbObstacles%10 == 0 && d.nbObstacles <= 50)
				{
					data1[(d.nbObstacles/10)-1]['time']+= +d['time'];
					indexes1[(d.nbObstacles/10)-1]+=1;
				}
				
			});

			
			data.forEach(function(d,i){
					data[i]['time'] = data[i].time/indexes[i];
			});
			data1.forEach(function(d,i){
					data1[i]['time'] = data1[i].time/indexes1[i];
			});
			console.log(data1);

			

		var x = d3.scale.linear().domain([5, 55]).range([0, w]);
		var y = d3.scale.linear().domain([0, .5]).range([h, 0]);
		var line = d3.svg.line()
			.x(function(d,i) { 
				return x(d.obs); 
			})
			.y(function(d) { 
				return y(d['time']); 
			})

			var graph = d3.select("#graph").append("svg:svg")
			      .attr("width", w + m[1] + m[3])
			      .attr("height", h + m[0] + m[2])
			    .append("svg:g")
			      .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

			var xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(true);
			graph.append("svg:g")
			      .attr("class", "x axis")
			      .attr("transform", "translate(0," + h + ")")
			      .call(xAxis)
					.append("text")
		            .attr("x", w)
		            .attr("y", 20)
		            .attr("dy", ".71em")
		            .style("text-anchor", "end")
		            .text("Nombre de lignes");



			var yAxisLeft = d3.svg.axis().scale(y).orient("left");
			graph.append("svg:g")
			      .attr("class", "y axis")
			      .attr("transform", "translate(-25,0)")
			      .call(yAxisLeft)
			      .append("text")
		            .attr("transform", "rotate(-90)")
		            .attr("y", 6)
		            .attr("dy", ".71em")
		            .style("text-anchor", "end")
		            .text("Temps (s)");

			graph.append("svg:path").attr("class","chart").attr("d", line(data));
		var x1 = d3.scale.linear().domain([5, 55]).range([0, w]);
		var y1 = d3.scale.linear().domain([0, .5]).range([h, 0]);
		var line1 = d3.svg.line()
			.x(function(d,i) { 
				return x1(d.obs); 
			})
			.y(function(d) { 
				return y1(d['time']); 
			})

			var graph1 = d3.select("#graph1").append("svg:svg")
			      .attr("width", w + m[1] + m[3])
			      .attr("height", h + m[0] + m[2])
			    .append("svg:g")
			      .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

			var xAxis1 = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(true);
			graph1.append("svg:g")
			      .attr("class", "x axis")
			      .attr("transform", "translate(0," + h + ")")
			      .call(xAxis)
			      .append("text")
		            .attr("x", w)
		            .attr("y", 20)
		            .attr("dy", ".71em")
		            .style("text-anchor", "end")
		            .text("Nombre d'obstacles");

			var yAxisLeft1 = d3.svg.axis().scale(y).orient("left");
			graph1.append("svg:g")
			      .attr("class", "y axis")
			      .attr("transform", "translate(-25,0)")
			      .call(yAxisLeft)
			      .append("text")
		            .attr("transform", "rotate(-90)")
		            .attr("y", 6)
		            .attr("dy", ".71em")
		            .style("text-anchor", "end")
		            .text("Temps (s)");
			graph1.append("svg:path").attr("class","chart").attr("d", line1(data1));
			
		})

	
});