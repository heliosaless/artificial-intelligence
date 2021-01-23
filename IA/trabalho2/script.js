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

		let tmp = this.array[index1];
		this.array[index1] = this.array[index2];
		this.array[index2] = tmp;
	}
}

class Game{
	constructor(size, queens){
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
		console.log("Conflicts by column:" + a);
		return conflicts/2;
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

function next(){
	game.getColumn(0).change(0,2);
	render(game);
}

function back(){
	console.log("not yet");
}

let game = new Game(4,[0,1,2,3]);
render(game);
game.getConflicts();

