function randomState(){
	var new_array = [];
	while(new_array.length != 9){
		let randomNumber = Math.floor(Math.random() * 9) + 1;
		if(new_array.indexOf(randomNumber) == -1) new_array.push(randomNumber); 
	}
	return new_array;
}

function changeIndex(actual_array, index1, index2){
	let new_array = actual_array.slice(0,actual_array.length);
	let tmp = new_array[index1];
	new_array[index1] = new_array[index2];
	new_array[index2] = tmp;
	return new_array;
}

function canMoveTo(actual_array){
	 let out = [];
	 let empty_space = actual_array.indexOf(9);
	 switch (empty_space){
	 	case 0:
	 		out.push(1);out.push(3);
	 		break;
	 	case 1:
	 		out.push(0);out.push(2);out.push(4);
	 		break;
	 	case 2:
	 		out.push(1);out.push(5);
	 		break;
	 	case 3:
	 		out.push(0);out.push(4);out.push(6);
	 		break;
	 	case 4:
	 		out.push(1);out.push(3);out.push(5);out.push(7);
	 		break;
	 	case 5:
	 		out.push(2);out.push(4);out.push(8);
	 		break;
	 	case 6:
	 		out.push(3);out.push(7);
	 		break;	
	 	case 7:
	 		out.push(6);out.push(4);out.push(8);
	 		break;
	 	case 8:
	 		out.push(7);out.push(5);
	 		break;
	 }
	 return out
}

function failNumber(actual_array){
	let perfect = [1,2,3,4,5,6,7,8,9];
	let fail = 0;
	actual_array.forEach(function(value, index){
		if(actual_array[index] != perfect[index]) fail = fail + 1;
	})
	return fail;
}

function equalArray(array1, array2){
	if(array1.length != array2.length) return false;
	for(let i = 0; i < array1.length; i = i + 1){
		if(array1[i] != array2[i]) return false;
	}
	return true;
}


function belongsTo(array, element){
	for(let i = 0; i < array.length; i = i + 1){
		if(equalArray(array[i], element)) return true;
	}
	return false;
}


var dict = new Map();
function BFS(actual_array){
	let visited = [];
	let queue = [];
	
	let bestValue=1000;
	let bestSolution;

	visited.push(actual_array);
	queue.push(actual_array);

	iterations = 0
	while(queue.length != 0 && iterations < 200000){
		actual_array = queue.shift();
		console.log(actual_array);
		let fails = failNumber(actual_array);
		if(fails == 0){
			return actual_array;
		}

		if(fails < bestValue){
			bestValue = fails;
			bestSolution = actual_array; 
		}

		canMove = canMoveTo(actual_array);

		for(let i = 0; i < canMove.length; i = i + 1){
			let empty_space = actual_array.indexOf(9);
			new_array = changeIndex(actual_array, empty_space, canMove[i]);

			if(!belongsTo(visited,new_array)){
				visited.push(new_array);
				queue.push(new_array);
				dict.set(new_array, actual_array);
			}
		}
		iterations = iterations + 1;
	}
	return bestSolution;
}

var dict2 = new Map();
function aStar(actual_array){

	visited = [];
	visited.push(actual_array);
	fails = failNumber(actual_array);
	if(fails == 0) return actual_array;
	g = 0;
	

	while(fails!=0){
		let canMove = canMoveTo(actual_array);

		let bestHeuristicValue = 1000;
		let bestHeuristic;

		for(let i = 0; i < canMove.length; i = i + 1){
			let empty_space = actual_array.indexOf(9);
			new_array = changeIndex(actual_array, empty_space, canMove[i]);

			if(!belongsTo(visited, new_array)){
				dict2.set(new_array, actual_array);
				visited.push(new_array);
				fails = failNumber(new_array);
				if(fails == 0) return new_array;
				if(fails + g < bestHeuristicValue){
					bestHeuristicValue = fails;
					bestHeuristic = new_array;
				}

			}
		}
		g = g + 1
		actual_array = bestHeuristic;
	}

	return bestHeuristic;

}

function makeSolutionPath(dict, best_array, initial_array){
	let solutionPath = [];
	current = best_array;
	solutionPath.unshift(current);
	while(!equalArray(dict.get(current),initial_array)){
		solutionPath.unshift(dict.get(current));
		current = dict.get(current);
	}
	solutionPath.unshift(initial_array);
	return solutionPath;
}


function render(actual_array){
	tabuleiro="<table border=1>";
	render_index = 0;
	for(x=0;x<3;x++){
	    tabuleiro+="<tr>";
	    for(y=0;y<3;y++){
	    	render_number = actual_array[render_index];
	    	if(render_number!=9)
			tabuleiro+="<td id=td"+x+"_"+y+" style='width:100px; height:100px; background:#DAA520'>"+"<p align=center style='font-size:50px;'>"+ render_number + "</p>"+"</td>";
			else
			tabuleiro+="<td id=td"+x+"_"+y+" style='width:100px; height:100px; background:#DAA520'></td>";	
			render_index = render_index + 1;
		}
	    tabuleiro+="</tr>";
	}
	document.getElementById('principal').innerHTML=tabuleiro+"</table>";
}



//initial_array = randomState();
initial_array = [1,2,3,9,4,6,7,5,8];
render(initial_array);
count = 0;
//best_array = BFS(initial_array);
best_array = aStar(initial_array);
solutionPath = makeSolutionPath(dict2, best_array, initial_array);

function next(){
	if(count < solutionPath.length -1)	count = count + 1;
	actual_array = solutionPath[count]
	render(actual_array);
}

function back(){
	if(count > 0)	count = count - 1;
	actual_array = solutionPath[count]
	render(actual_array);
}
