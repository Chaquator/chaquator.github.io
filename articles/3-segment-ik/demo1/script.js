var c, c2; // html canvas element
var ctx, ctx2; // canvas context

var dragler; // drag handler
var points; // collection of points

// working logic variables
var M, m, e, L1, L2, L3, D, k, x, guess;

function main()
{
	// set up canvas
	c = document.getElementById("canvas");
	ctx = c.getContext("2d");
	
	c2 = document.getElementById("canvas2");
	ctx2 = c2.getContext("2d");
	
	ctx.translate(0.5, 0.5); // lichrally anti-aliasing
	
	ctx.font = "24px Arial"
	ctx2.font = "24px Arial"
	
	// initialize stuff to use
	dragler = new DragHandler();
	
	points = [ new Point(v2(416, 79)), new Point(v2(69, 263)), new Point(v2(817, 320)), new Point(v2(360, 659)), new Point(v2(900, 900)), new Point(v2(0, 0))]; // muh points
	
	guess = 0;
	x = 0.5;
	
	setInterval(iterateGuess, 1500);
	
	// set up handlers
	document.body.addEventListener("mousedown", dragler.listenForDrags);
	
	// begin computing/drawing everything
	window.requestAnimationFrame(drawEverything);
}

// logical computational functions
function computeEverything()
{
	var P0 = points[0].pos;
	var P1 = points[1].pos;
	var P2 = points[2].pos;
	var P3 = points[3].pos;
	var b = P1.sub(P0);
	M = mat(v2(P3.x - P0.x, P3.y - P0.y), v2(P2.x - P1.x, P2.y - P1.y));
	
	m = M.inverse().mul(b).mul(v2(1, -1));
	k = m.y;
	// x is m.x
	// k is m.y
	
	L1 = P1.sub(P0).scalar();
	L2 = P2.sub(P1).scalar();
	L3 = P3.sub(P2).scalar();
	D = P3.sub(P0).scalar();
	
	e = E(L1, L2, L3, D, m.y, m.x);
	
	points[4].pos = P0.add(P3.sub(P0).mul(m.x)); // ground truth point
	
	points[5].pos = P0.add(P3.sub(P0).mul(x)); // newtons method iteration point
}

function iterateGuess()
{
	guess = (guess + 1);
	
	if(x > 1)
	{
		console.log("too lorge");
		reset();
		return;
	}
	else if(x < 0)
	{
		console.log("too small");
		reset();
		return;
	}
	else if(Math.abs(x - m.x) < 0.0000001)
	{
		console.log("iterated well");
		reset();
		return;
	}
	
	var newX = x - (E(L1, L2, L3, D, k, x) / dE(L1, L2, L3, D, k, x));
	if(newX > 1 || newX < 0)
	{
		x += (x > 0.5) ? -0.005 : 0.005;
	}
	else
	{
		x = newX;
	}
}

function reset()
{
	console.log("reset");
	guess = 0;
	x = 0.5;
}

// ik3 function to solve for
function E(L1, L2, L3, D, k, x)
{
	return L1*L1*(-1 * (1-x) * (1-k)) + L2*L2*(-k*k*k + k*k - x*k + x*k*k) + L3*L3*(x*k)
			+ D*D*(-x*x*x + x*x - x*k + x*x*k);
}

function dE(L1, L2, L3, D, k, x)
{
	return L1*L1*(-(k-1)) + L2*L2*(k-1)*k + L3*L3*k + D*D*(k*(2*x - 1) + (2 - 3*x)*x);
}

// drawing functions
function drawEverything()
{
	computeEverything();
	
	// clear
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, c.width, c.height);
	
	// draw lines -- under points
	connectLine(points[3], points[0], true); // line D
	
	connectLine(points[0], points[1]);
	connectLine(points[1], points[2]); // line P1_P2
	connectLine(points[2], points[3]);
	
	connectLine(points[0], points[2], false, 0.25);
	connectLine(points[1], points[3], false, 0.25);
	
	// draw points
	points.forEach(function(p, i)
	{
		p.draw("P" + i.toString());
	});
	
	// draw info
	ctx.fillStyle = "green";
	ctx.fillText("M: " + M, 7.5, 25);
	
	
	ctx.fillText("L1: " + L1, 7.5, 50);
	ctx.fillText("L2: " + L2, 7.5, 75);
	ctx.fillText("L3: " + L3, 7.5, 100);
	ctx.fillText("D: " + D, 7.5, 125);
	
	ctx.fillText("E(X) (should be always 0): " + Math.round(e, 3), 7.5, 160);
	
	ctx.fillText("x (ground truth): " + m.x + " k: " + m.y, 7.5, 195);
	ctx.fillText("x guess: " + x, 7.5, 220);
	ctx.fillText("iterations : " + guess, 7.5, 245);
	ctx.fillText("error (guess - ground truth): " + (x - m.x), 7.5, 270);
	
	drawC2();
	
	window.requestAnimationFrame(drawEverything);
}

function drawC2()
{
	// draw on 2nd canvas
	ctx2.fillStyle = "white";
	ctx2.fillRect(0, 0, c2.width, c2.height);
	
	// draw dE/dx
	ctx2.lineWidth = 1;
	ctx2.strokeStyle = "red";
	ctx2.setLineDash([]);
	ctx2.beginPath();
	ctx2.moveTo(0, c2.width * scaleDe(0));
	for(var i = 0; i < c2.width; i++)
	{
		ctx2.lineTo(i, c2.width * scaleDe(i/c2.width) - 450);
	}
	ctx2.stroke();
	
	// draw E(x)
	ctx2.lineWidth = 1;
	ctx2.strokeStyle = "green";
	ctx2.setLineDash([]);
	ctx2.beginPath();
	ctx2.moveTo(0, c2.width * scaleE(0));
	for(var i = 0; i < c2.width; i++)
	{
		ctx2.lineTo(i, c2.width * scaleE(i/c2.width) - 450);
	}
	ctx2.stroke();
	
	// draw ground truth x intersection
	ctx2.strokeStyle = "blue";
	ctx2.setLineDash([25, 10]);
	ctx2.beginPath();
	ctx2.moveTo(m.x * c2.width, c2.width);
	ctx2.lineTo(m.x * c2.width, 0);
	ctx2.stroke();
	
	// draw current x guess point and tangent line
	ctx2.fillStyle = "black";
	ctx2.beginPath();
	ctx2.arc(c2.width * x,c2.width * (scaleE(x) - 0.5), 5, 0, Math.PI * 2);
	ctx2.fill();
	
	ctx2.strokeStyle = "orange";
	ctx2.setLineDash([]);
	ctx2.beginPath();
	ctx2.moveTo(c2.width * (x + 3), c2.width * (scaleE(x) - 0.5 - 3*sDe(x)));
	ctx2.lineTo(c2.width * (x - 3), c2.width * (scaleE(x) - 0.5 + 3*sDe(x)));
	ctx2.stroke();
	
	// draw axis lines
	ctx2.strokeStyle = "black";
	ctx2.setLineDash([25, 10]);
	
	ctx2.beginPath();
	ctx2.moveTo(0, c2.height / 2);
	ctx2.lineTo(c2.height, c2.height / 2);
	ctx2.stroke();
	
	ctx2.beginPath();
	ctx2.moveTo(0, 0);
	ctx2.lineTo(0, c2.width);
	ctx2.stroke();
}

function sDe(x)
{
	return  0.000001 * dE(L1, L2, L3, D, k, x);
}

function scaleDe(x)
{
	return 1-sDe(x);
}

function scaleE(x)
{
	var calc = 0.000001 * E(L1, L2, L3, D, k, x)
	
	return 1-calc;
}

function connectLine(p1, p2, dashed = false, alpha = 1)
{
	ctx.beginPath();
	
	ctx.lineWidth = 3;
	ctx.lineCap = "round";
	ctx.strokeStyle = dashed ? "rgba(255, 0, 0, " + alpha.toString() + ")" : "rgba(0, 0, 0, " + alpha.toString() + ")";
	ctx.setLineDash(dashed ? [25, 10] : [])
	
	ctx.moveTo(p1.pos.x, p1.pos.y);
	ctx.lineTo(p2.pos.x, p2.pos.y);
	ctx.stroke();
}

// point class
function Point(pos)
{
	this.pos = pos;
	this.radius = 15;
	
	this.draw = function(label)
	{
		var color = "black"
	
		// black circle
		ctx.beginPath()
		ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
		ctx.fillStyle = (dragler.currentDrag == this) ? "green" : color;
		ctx.fill();
		
		// text
		ctx.fillText(label, this.pos.x - 15, this.pos.y + this.radius + 25);
	}
}

// drag handler class
function DragHandler()
{
	this.currentDrag = null;
	this.isDragging = false;
	
	this.offsetPos = v2(0, 0);
	
	this.hitDetection = function(mousePos)
	{
		for(let p of points)
		{
			if((mousePos.sub(p.pos).sscalar()) <= Math.pow(p.radius, 2))
			{
				dragler.isDragging = true;
				dragler.currentDrag = p;
				dragler.offsetPos = p.pos.sub(mousePos);
				
				document.body.addEventListener("mousemove", dragler.handleDrag);
				
				document.body.addEventListener("mouseup", dragler.endDrag);
				
				break;
			}
		}
	}
	
	this.listenForDrags = function(e)
	{
		dragler.hitDetection(v2(e.offsetX, e.offsetY));
	}
	
	this.handleDrag = function(e)
	{
		var mPos = v2(e.offsetX, e.offsetY);
		
		dragler.currentDrag.pos = mPos.add(dragler.offsetPos);
		
		// reset guessing
		guess = 0;
		x = 0.5;
	}
	
	this.endDrag = function()
	{
		document.body.removeEventListener("mousemove", dragler.handleDrag);
		document.body.removeEventListener("mouseup", dragler.endDrag);
		
		dragler.currentDrag = null;
		dragler.isDragging = false;
	}
}

// vector 2 stuff
function vec2(X, Y)
{
	this.x = X;
	this.y = Y;
	
	this.dot = function(input)
	{
		return (this.x * input.x) + (this.y * input.y);
	}
	
	this.sscalar = function()
	{
		return this.dot(this);
	}
	
	this.scalar = function()
	{
		return Math.sqrt(this.sscalar());
	}
	
	this.normalized = function()
	{
		return new vec2(this.x / this.scalar(), this.y / this.scalar());
	}
	
	this.toString = function()
	{
		return "x: " + this.x + " y: " + this.y;
	}
	
	this.mul = function(input)
	{
		if(typeof(input) == "number")
		{
			return new vec2(this.x * input, this.y * input);
		}
		else
		{
			return new vec2(this.x * input.x, this.y * input.y);
		}
	}
	
	this.div = function(input)
	{
		if(typeof(input) == "number")
		{
			return new vec2(this.x / input, this.y / input);
		}
		else
		{
			return new vec2(this.x / input.x, this.y / input.y);
		}
	}
	
	this.add = function(vec)
	{
		return new vec2(this.x + vec.x, this.y + vec.y);
	}
	
	this.sub = function(vec)
	{
		return new vec2(this.x - vec.x, this.y - vec.y);
	}
}

function v2(inx, iny)
{
	return new vec2(inx, iny);
}

// 2D matrix - block matrix of [ V1 | V2 ]
function matrix2D(V1, V2)
{
	this.c1 = V1;
	this.c2 = V2;
	
	// determinant
	this.det = function()
	{
		// ad - bc
		return (this.c1.x * this.c2.y) - (this.c2.x * this.c1.y);
	}
	
	// multiply
	this.mul = function(input)
	{
		if(typeof(input) == "number") // multiply by number
		{
			return new matrix2D(this.c1.mul(input), this.c2.mul(input));
		}
		else // by vector
		{
			// returns vector which is linear combination of column vectors
			return this.c1.mul(input.x).add(this.c2.mul(input.y));
		}
	}
	
	// get inverse
	this.inverse = function()
	{
		var DET = this.det();
		if(DET == 0)
		{
			return undefined;
		}
		
		return new matrix2D(new vec2(this.c2.y, -this.c1.y), new vec2(-this.c2.x, this.c1.x)).mul(1 / DET);
	}
	
	// set elements
	this.set = function(a, b, c, d)
	{
		this.c1.x = a;
		this.c2.x = b;
		this.c1.y = c;
		this.c2.y = d;
	}
	
	this.toString = function()
	{
		return this.c1.x.toString() + " " + this.c2.x.toString() + "\n" + this.c1.y.toString() + " " + this.c2.y.toString();
	}
}

function mat(V1, V2)
{
	return new matrix2D(V1, V2);
}

function matN(a, b, c, d)
{
	return new matrix2D(new vec2(a, c), new vec2(b, d));
}

function idM()
{
	return new matrix2D(new vec2(1, 0), new vec2(0, 1));
}