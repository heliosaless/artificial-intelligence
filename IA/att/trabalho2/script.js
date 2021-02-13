class Column{
	constructor(size, queen_position){
		this.size = size;
		this.queen_position = queen_position;
		this.array = [];
		for(let i = 0; i < this.size; i = i+1)
			if(i == queen_position) this.array.push(1);
			else this.array.push(0);
	}

	get(i){
		return this.array[i];
	}

	getQueen(){
		return this.queen_position;
	}

	change(index1, index2){
		if(index1 >= this.size || index2 >= this.size || index1 < 0 || index2 < 0){
			console.log("indexes invalido");
		}

		if(index1 == this.queen_position){
			this.queen_position = index2;
		}else{
			if(index2 == this.queen_position){
				this.queen_position = index1;
			}	
		}

	
		let tmp = this.array[index1];
		this.array[index1] = this.array[index2];
		this.array[index2] = tmp;
	}
}

function weightedRandom(prob) {
  let i, sum=0, r=Math.random();
  for (i in prob) {
    sum += prob[i];
    if (r <= sum) return i;
  }
}

class Game{
	constructor(size, queens){
		this.queens = queens;
		this.size = size;
		this.data = new Array();
		for(let i = 0; i < size; i = i+1)
			this.data.push(new Column(size, queens[i]));

	}

	getColumn(i){
		return this.data[i];
	}

	getData(){
		return this.data;
	}

	getSize(){
		return this.size;
	}


	checkConflict(column){
		let conflicts = 0;
		let col = column;
		let line = this.data[column].getQueen();
		let size = this.size;

		let test0 = true;
		let test1 = true;
		let test2 = true;
		let test3 = true;
		let test4 = true;
		let test5 = true;

		for (let i = 0; i < this.size; i = i + 1){
			if (test0 && i!= 0 && col-i>=0 && this.data[col-i].get(line) == 1) {
				conflicts = conflicts + 1;
				test0 = false;
			}

			if (test1 && i!= 0 && col+i<size && this.data[col+i].get(line) == 1) {
				conflicts = conflicts + 1;
				test1 = false;
			}

			if (test2 && i!= 0 && col+i < size && line+i < size && this.data[col+i].get(line+i)==1) {
				conflicts = conflicts + 1;
				test2 = false;
			}

			if (test3 && i!= 0 && col+i < size && line-i >= 0 && this.data[col+i].get(line-i)==1) {
				conflicts = conflicts + 1;
				test3 = false;
			}

			if (test4 && i!= 0 && col-i >= 0 && line+i < size && this.data[col-i].get(line+i)==1) {
				conflicts = conflicts + 1;
				test4 = false;
			}

			if (test5 && i!= 0 && col-i >= 0 && line-i >= 0 && this.data[col-i].get(line-i)==1) {
				conflicts = conflicts + 1;
				test5 = false;
			}

		}

		return conflicts;
	}

	getConflicts(){
		let conflicts = 0;
		let a = [];
		for (let column = 0; column < this.size; column = column + 1){
			conflicts += this.checkConflict(column);
			a.push(this.checkConflict(column));
		}
		//console.log("Conflicts by column:" + a);
		return conflicts;
	}

	/*
	change(col1, index1, index2){
		this.data[col1].change(index1, index2);

	}*/


	simulatedAnnealing(){
		let C = 1
		let iteration = 0;
		while(this.getConflicts()!= 0 && iteration < 1000){
			iteration = iteration + 1;
			let T = C/Math.sqrt(iteration);
			let random_col = Math.floor(Math.random() * this.size);
			let queen = this.data[random_col].getQueen();

			let move = Math.floor(Math.random() * this.size);
			while(move == queen){
				move = Math.floor(Math.random() * this.size);
			}

			//console.log(random_col);
			//console.log("Queen: " + queen );
			//console.log("Move: " + move) ;

			let before = this.getConflicts();
			this.data[random_col].change(queen, move);
			let after = this.getConflicts();

			//console.log("Before:" + before);
			//console.log("After:" + after);

			if(before > after){
				let prob = Math.exp((before-after)/T);
				let random = Math.random();
				if(random >= prob){
					console.log("Retornou");
					this.data[random_col].change(queen, move);
				}
			}

			console.log(this.getConflicts());
		}
	}

	getQueens(){
		return this.queens;
	}

	crossing(game2){
		let random = Math.floor(Math.random()*this.getSize()); // arrumar

		let q1 = this.getQueens();
		let q2 = game2.getQueens();

		//console.log(q1);
		//console.log(q2);

		let arr_child1 = [];
		let arr_child2 = [];
		
		for(let i = 0; i < random; i = i + 1){
			arr_child1.push(q1[i])
			arr_child2.push(q2[i]);
		} 

		for(let i = random; i < this.getSize(); i = i + 1){
			arr_child1.push(q2[i])
			arr_child2.push(q1[i]);
		}

		//console.log(arr_child1);
		//console.log(arr_child2);

		return [arr_child1, arr_child2];
	}


	genetic(pop_len){
		let population = [];
		let avaliation = [];
		let probabilities = [];
		let childs = []
		let childs_len = 0;
		let iterations = 300;
		//gera populacao
		population.push(this);
		for(let i = 0; i < pop_len-1; i = i + 1){
			let random_array = [];
			for(let j = 0; j<this.getSize(); j++){
				random_array.push(Math.floor(Math.random()*this.getSize()));
			}
			population.push(new Game(this.getSize(), random_array));
		}

		//roleta
		while(iterations-- > 0){


			let sum = 0;
			let conflicts = 0;
			for(let i = 0; i < pop_len; i = i + 1){
				conflicts = Math.exp(-population[i].getConflicts());
				sum += conflicts;
				avaliation.push(conflicts);
			}

			//vetor de prob
			for(let j = 0; j < pop_len; j = j + 1){
				probabilities.push(avaliation[j]/sum);	
			}	

			//console.log(population);
			//console.log(avaliation);
			//console.log(probabilities);

			//selecao
			let r1 = weightedRandom(probabilities);
			let r2 = weightedRandom(probabilities);
			//console.log(r1 + " " + r2);
			let first = population[r1];
			let second = population[r2];
			//cruzamento
			let ans = first.crossing(second);

			//mutacao
			let p;
			p = Math.random();
			if(p <= 0.1){
				let random_value = Math.floor(Math.random()*this.getSize());
				let random_index = Math.floor(Math.random()*this.getSize());
				ans[0][random_index] = random_value;
			}

			p = Math.random();
			if(p <= 0.1){
				let random_value = Math.floor(Math.random()*this.getSize());
				let random_index = Math.floor(Math.random()*this.getSize());
				ans[1][random_index] = random_value;
			}

			childs.push(new Game(this.getSize(),ans[0]));
			childs.push(new Game(this.getSize(),ans[1]));
			childs_len += 2;

			if(childs_len == pop_len){
				population = childs;
				//console.log(population);
				childs = [];
				childs_len = 0;
			}
			avaliation = [];
			probabilities = [];
		}

		let max = -1;
		let imax = -1;
		for(let i = 0; i < pop_len; i = i + 1){
			let conflicts = population[i].getConflicts();
			if(max < conflicts){
				max = conflicts;
				imax = i;
			}
		}

		console.log("conflics:" + max);
		return population[imax];
	}


}


function render(game){
	let data = game.getData();
	let size = game.getSize();
	tabuleiro="<table border=1>";
	render_index = 0;
	for(x=0;x<size;x++){
	    tabuleiro+="<tr>";
	    for(y=0;y<size;y++){
			tabuleiro+="<td id=td"+x+"_"+y+" style='width:100px; height:100px;'>"+"<p align=center style='font-size:50px;'>"+
				data[y].get(x) + "</p>"+"</td>";
		}
	    tabuleiro+="</tr>";
	}
	document.getElementById('principal').innerHTML=tabuleiro+"</table>";
}

size = 4;
let random_array = [];
for(let j = 0; j<size; j++){
	random_array.push(Math.floor(Math.random()*size));
}
let game = new Game(size,random_array);
console.log(game.getConflicts());
render(game);

function next(){
	game.simulatedAnnealing();
	render(game);
}

function back(){
	render(game.genetic(10));

}