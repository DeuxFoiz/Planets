import {MakePermutation, Noise2D, getGradient} from './perlin-noise.js';
const sectionOne = document.body.querySelector('.grid-planet')
// window.addEventListener('resize', resized);
var viewport_width = window.innerWidth;
var viewport_height = window.innerHeight;
const planetStyles = ["gas", "lune", "earth", "mars"];
var nbPlanets = 4
let planets = []
let haveIt = [];
var minWidth = 150;
var maxWidth = 280;
var pixelSize = 3;
console.log(viewport_width)
if (viewport_width <= 1368) {
	maxWidth = 150;
}


class Planet {
	constructor(ctx, style, radius, div) {
		this.div = div
		this.style = style;
		this.radius = radius ;
		this.canvasWidth = radius*2;
		this.speed =  Math.ceil(Math.random() * (40 - 20) + 20);
		this.direction = (Math.random() < 0.5) ? -1:1;
		this.xRotation = 0;
		this.textureData = [];
		this.ctx = ctx;
	}
}

createPlanet();
export default planets;



function createPlanet()
{
	const fragment = document.createDocumentFragment();

	for (let idPlanet=0; idPlanet< nbPlanets; idPlanet++) {
		let radius = Math.ceil(Math.random() * (maxWidth - minWidth) + minWidth);

		let idPlanetStyle = 0
		if (idPlanet <= 3)
			idPlanetStyle = generateUniqueRandom(3)
		else
			idPlanetStyle = Math.round(Math.random() * 3);


		const divPlanet = document.createElement('div');
		divPlanet.classList.add('planet');
		divPlanet.id = "planet"+idPlanet
		// height: radius,
		// width: radius,
		divPlanet.style.height = radius+"px";
		divPlanet.style.width = radius+"px";
		divPlanet.style.overflow = "hidden";
		divPlanet.style.borderRadius = '50%';
		//left margin : random number between 25 and 75
		if (viewport_width >= 1368) {
		divPlanet.style.marginLeft = Math.ceil(Math.random() * (50 - 25) + 25)+"%";
		divPlanet.style.marginTop = Math.ceil(Math.random() * (10 - 5) + 5)+"%";
		}
		else {
			divPlanet.style.marginLeft = "-60%";
			divPlanet.style.marginTop = Math.ceil(Math.random() * (-10 + 5) - 5)+"%";
		}
		if (idPlanetStyle == 0) divPlanet.style.boxShadow = "0px 0px 15px 0px #354555"
		else if (idPlanetStyle == 2) divPlanet.style.boxShadow = "0px 0px 15px 0px #61A7FF"
		else if (idPlanetStyle == 3) divPlanet.style.boxShadow = "0px 0px 15px 0px #FF8452"
		else divPlanet.style.boxShadow = "0px 0px 10px 0px  #FFFFFF" 

		const canvas = document.createElement('canvas');
		
		canvas.height = radius;
		canvas.width = radius*2;
		divPlanet.appendChild(canvas);

		fragment.prepend(divPlanet);
		planets.push(new Planet(canvas.getContext("2d"), planetStyles[idPlanetStyle], radius, divPlanet));
		console.log(planets[idPlanet])
	}
	sectionOne.prepend(fragment)

	for (let planet of planets) {
		drawPlanet(planet);
	}
}



function drawPlanet(planet) {
	var centrePoint = {x: planet.canvasWidth/2, y: planet.radius/2};
	var gradientDivider = (planet.radius/2)-Math.ceil(planet.radius/10);
	if (planet.style === "gas") gradientDivider += Math.ceil(planet.radius*2);
	else if (planet.style === "lune") gradientDivider += Math.ceil(planet.radius/20);
	
	let P = MakePermutation();
	for(let y = 0; y <= planet.radius; y+=pixelSize) {
		for(let x = 0; x <= planet.canvasWidth; x+=pixelSize) {
			let n = 0.0,
				a = 1.0,
				f = 0.02;
		
			for(let o = 0; o < 3; o++){
				let v = a*Noise2D(x*f, y*f, P);
				n += v;
				a *= 0.5;
				f *= 2.0;
			}
		
			n += 1.0;
			let d = getGradient(x,y,centrePoint,gradientDivider);
			if (d > 0.5) n *= 0.5 ;
			else n *= d;

			colorPlanets(planet,n, x, y, pixelSize);
		}
	}
	planet.ctx.clearRect(0, 0, planet.canvasWidth, planet.height);
	planet.textureData = planet.ctx.getImageData(0,0,planet.canvasWidth,planet.radius)

	setInterval(function() {
		planet.xRotation += planet.direction;
		planet.ctx.clearRect(0,0,planet.canvasWidth,planet.height);
		planet.ctx.putImageData(planet.textureData, planet.xRotation, 0);
		if(planet.direction < 0)
			planet.ctx.putImageData(planet.textureData,  planet.xRotation + planet.canvasWidth, 0);
		else
			planet.ctx.putImageData(planet.textureData, planet.xRotation - planet.canvasWidth, 0);
		
		if (planet.xRotation >= planet.canvasWidth || planet.xRotation <= -planet.canvasWidth) planet.xRotation = 0;
	}, planet.speed);
}


function colorPlanets(planet, n, x, y, size) {
	if (planet.style === "earth") {
		if (n < 0.15)     planet.ctx.fillStyle = "rgb(31, 58, 147)"; //very dark water
		else if (n < 0.45)     planet.ctx.fillStyle = "rgb(65,105,225)"; //dark water
		else if (n < 0.53)     planet.ctx.fillStyle = "rgb(30,144,255)"; //water
		else if (n < 0.58)    planet.ctx.fillStyle = "rgb(244, 180, 89)"; //beach
		else if (n < 0.65)  planet.ctx.fillStyle = "rgb(61, 179, 158)"; //green
		else if (n < 0.85)  planet.ctx.fillStyle = "rgb(46,139,87)"; //dark green
		else if (n < 0.95) planet.ctx.fillStyle = "rgb(139, 137, 137)"; // mountain
		else if (n < 1.0)  planet.ctx.fillStyle = "rgb(228, 231, 231)"; // snow

	}
	else if (planet.style === "mars")
	{
		// if (n < 0.01)    planet.ctx.fillStyle = "rgb(244, 180, 89)";
		if (n < 0.15)     planet.ctx.fillStyle = "rgb(250, 175, 58)"; 
		else if (n < 0.25)     planet.ctx.fillStyle = "rgb(249, 179, 117)"; 
		else if (n < 0.3)     planet.ctx.fillStyle = "rgb(247, 146, 30)"; 
		else if (n < 0.5)     planet.ctx.fillStyle = "rgb(240, 91, 35)"; 
		else if (n < 0.7)     planet.ctx.fillStyle = "rgb(138, 83, 69)"; 
		else if (n < 1.0)     planet.ctx.fillStyle = "rgb(110, 66, 55)"; 
	}
	else if (planet.style === "lune")
	{
		if (n < 0.05)     planet.ctx.fillStyle = "rgb(71, 99, 129)"; 
		else if (n < 0.15)     planet.ctx.fillStyle = "rgb(100, 124, 148)"; 
		else if (n < 0.53)     planet.ctx.fillStyle = "rgb(152, 179, 193)"; 
		else if (n < 0.65)     planet.ctx.fillStyle = "rgb(180, 189, 208)"; 
		else if (n < 0.85)     planet.ctx.fillStyle = "rgb(202, 206, 226)"; 
		else if (n < 0.95)     planet.ctx.fillStyle = "rgb(222, 226, 246)"; 
	}
	else if (planet.style === "gas")
	{
		let rgb = Math.ceil(255*n);
		if (n < 0.05)
			planet.ctx.fillStyle = "rgba("+rgb*3+","+rgb*3+","+rgb*3+",1.0)";
		else if (n < 0.1)
			planet.ctx.fillStyle = "rgba("+rgb*1+","+rgb*1+","+rgb*1+",1.0)";
		else if (n < 0.15)
			planet.ctx.fillStyle = "rgba("+Math.ceil(rgb*1.1)+","+Math.ceil(rgb*1.1)+","+rgb+",1.0)";
		else if (n < 0.2)
			planet.ctx.fillStyle = "rgba("+Math.ceil(rgb*1)+","+Math.ceil(rgb*1)+","+rgb+",1.0)";
		else if (n < 0.25)
			planet.ctx.fillStyle = "rgba("+Math.ceil(rgb*0.85)+","+Math.ceil(rgb*0.85)+","+rgb+",1.0)";
		else if (n < 0.3)
			planet.ctx.fillStyle = "rgba("+Math.ceil(rgb*0.8)+","+Math.ceil(rgb*0.8)+","+rgb+",1.0)";
		else if (n < 0.35)
			planet.ctx.fillStyle = "rgba("+Math.ceil(rgb*0.75)+","+Math.ceil(rgb*0.75)+","+rgb+",1.0)";
		else if (n < 0.5)
			planet.ctx.fillStyle = "rgba("+Math.ceil(rgb*0.8)+","+Math.ceil(rgb*0.8)+","+rgb+",1.0)";
		else if(n < 0.7)
			planet.ctx.fillStyle = "rgba("+Math.round(rgb*0.85)+","+Math.round(rgb*0.85)+","+rgb+",1.0)";
		else //if (n < 0.95)
			planet.ctx.fillStyle = "rgba("+Math.round(rgb*0.9)+","+Math.round(rgb*0.9)+","+rgb+",1.0)";
	}
	planet.ctx.fillRect(x, y, size, size);
}



function generateUniqueRandom(maxNr) {
    //Generate random number
    let random = (Math.random() * maxNr).toFixed();
    //Coerce to number by boxing
    random = Number(random);

    if(!haveIt.includes(random)) {
        haveIt.push(random);
        return random;
    } else {
        if(haveIt.length <= maxNr) {
          //Recursively generate number
         return  generateUniqueRandom(maxNr);
        } else {
          console.log('No more numbers available.')
          return false;
        }
    }
}
