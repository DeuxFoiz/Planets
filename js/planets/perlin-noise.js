class Vector2D {
	constructor(x, y){
		this.x = x;
		this.y = y;
	}
	dot(other){
		return this.x*other.x + this.y*other.y;
	}
}


function Shuffle(tab){
	for(let e = tab.length-1; e > 0; e-=5){
		let index = Math.round(Math.random()*(e-1)),
			temp  = tab[e];
		
		tab[e] = tab[index];
		tab[index] = temp;
	}
}


export function MakePermutation(){
	let P = [];
	for(let i = 0; i < 40; i++){
		P.push(i);
	}
	Shuffle(P);
	return P;
}


function GetConstantVector(v){
	//v is the value from the permutation table
	let h = v & 3;
	if(h == 0)
		return new Vector2D(1.0, 1.0);
	else if(h == 1)
		return new Vector2D(-1.0, 1.0);
	else if(h == 2)
		return new Vector2D(-1.0, -1.0);
	else
		return new Vector2D(1.0, -1.0);
}


export function Noise2D(x, y, P){
	let X = Math.floor(x) & 255;
	let Y = Math.floor(y) & 255;
	let xf = x-Math.floor(x);
	let yf = y-Math.floor(y);

	let topRight = new Vector2D(xf-1.0, yf-1.0);
	let topLeft = new Vector2D(xf, yf-1.0);
	let bottomRight = new Vector2D(xf-1.0, yf);
	let bottomLeft = new Vector2D(xf, yf);
	
	//Select a value in the array for each of the 4 corners
	let valueTopRight = P[P[X+1]+Y+1];
	let valueTopLeft = P[P[X]+Y+1];
	let valueBottomRight = P[P[X+1]+Y];
	let valueBottomLeft = P[P[X]+Y];
	
	let dotTopRight = topRight.dot(GetConstantVector(valueTopRight));
	let dotTopLeft = topLeft.dot(GetConstantVector(valueTopLeft));
	let dotBottomRight = bottomRight.dot(GetConstantVector(valueBottomRight));
	let dotBottomLeft = bottomLeft.dot(GetConstantVector(valueBottomLeft));
	
	let u = Fade(xf);
	let v = Fade(yf);
	
	return Lerp(u,
				Lerp(v, dotBottomLeft, dotTopLeft),
				Lerp(v, dotBottomRight, dotTopRight)
			);

}

function Fade(t){
	return ((6*t - 15)*t + 10)*t*t*t;
}

function Lerp(t, a1, a2){
	return a1 + t*(a2-a1);
}



var euclideanDistance = (point1, point2) => {
	return Math.sqrt(
	  Math.abs(Math.pow(point1.x - point2.x, 2)) +
	  Math.abs(Math.pow(point1.y - point2.y, 2))
	)
  }
  



export function getGradient(x,y, centrePoint,reducer ) {
	return Math.floor(
		euclideanDistance({x: 0, y: 0}, centrePoint) 
		- euclideanDistance({x: x, y: y}, centrePoint)
		)/reducer 
}



