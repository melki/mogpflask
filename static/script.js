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
	
});