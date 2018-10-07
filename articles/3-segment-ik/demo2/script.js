var c; // html canvas element
var ctx; // canvas context

var dragler; // drag handler
var points; // collection of points

// working logic variables
var L1, L2, L3, D, k, x // lengths, distance, k, working x
var BA, A1, A2, A3; // base angle, angles 1 through 3
var EP1, EP2, EP3; // end positions 1 through 3
var orient; // orientation

function main()
{
	// set up canvas
	c = document.getElementById("canvas");
	ctx = c.getContext("2d");
	
	ctx.translate(0.5, 0.5); // lichrally anti-aliasing
	
	ctx.font = "24px Arial";
	
	// initialize stuff to use
	dragler = new DragHandler();
	
	points = [ new Point(v2(450, 100)), new Point(v2(450, 800)) ]; // muh points
	
	x = 0.5;
	A1 = A2 = A3 = 0;
	orient = 1;
	
	// set up handlers
	document.body.addEventListener("mousedown", dragler.listenForDrags);
	
	// begin computing/drawing everything
	window.requestAnimationFrame(drawEverything);
}

// logical computational functions
function computeEverything()
{
	// reset x
	x = 0.5;
	
	// get values
	L1 = Number.parseFloat(document.getElementById("iL1").value);
	L2 = Number.parseFloat(document.getElementById("iL2").value);
	L3 = Number.parseFloat(document.getElementById("iL3").value);
	
	var dist = points[1].pos.sub(points[0].pos);
	D = clamp(dist.scalar(), L1-L2+L3 + 0.00001, L1+L2+L3 - 0.00001);
	document.getElementById("sD").innerHTML = D.toFixed(2);
	
	k = Number.parseFloat(document.getElementById("iK").value);
	document.getElementById("sK").innerHTML = (k*100).toFixed(2) + "%";
	k = clamp(k, 0.00001, 0.99999);
	
	// calculate x based on values
	for(var i = 0; i < 5; i++)
	{
		x = iterateGuess(x);
	}
	document.getElementById("sX").innerHTML = x.toFixed(2);
	
	// calculate angles
	BA = Math.atan2(dist.x, dist.y);
	A1 = BA - orient*loc(L1, x * D, k * L2);
	A2 = A1 - orient*loc(L1, k * L2, x * D) - Math.PI;
	A3 = A2 + orient*loc(L3, (1-k) * L2, (1-x) * D) - Math.PI;
}

// newtons method iteration
function iterateGuess(x)
{
	return x - (E(L1, L2, L3, D, k, x) / dE(L1, L2, L3, D, k, x));
}

// ik equality
function E(L1, L2, L3, D, k, x)
{
	return L1*L1*(-1 * (1-x) * (1-k)) + L2*L2*(-k*k*k + k*k - x*k + x*k*k) + L3*L3*(x*k)
			+ D*D*(-x*x*x + x*x - x*k + x*x*k);
}

// ik equality d/dx
function dE(L1, L2, L3, D, k, x)
{
	return L1*L1*(-(k-1)) + L2*L2*(k-1)*k + L3*L3*k + D*D*(k*(2*x - 1) + (2 - 3*x)*x);
}

// returns angle C from law of cosines calculation
function loc(a, b, c)
{
	return Math.acos((a*a + b*b - c*c) / (2*a*b));
}

function clamp(a, up, low)
{
	return Math.max(Math.min(low, a), up);
}

function toggleOrient()
{
	orient = -orient;
}

// drawing functions
function drawEverything()
{
	computeEverything();
	
	// clear
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, c.width, c.height);
	
	// line form source to end
	connectLine(points[0], points[1], true, 0.5);
	
	// draw segments
	EP1 = drawSeg(points[0].pos, A1, L1);
	EP2 = drawSeg(EP1, A2, L2);
	EP3 = drawSeg(EP2, A3, L3);
	
	// draw points
	points[0].draw("Source"); // source point
	points[1].draw("End"); // end point
	
	window.requestAnimationFrame(drawEverything);
}

function connectLine(p1, p2, dashed = false, alpha = 1)
{
	ctx.beginPath();
	
	ctx.lineWidth = 10;
	ctx.lineCap = "round";
	ctx.strokeStyle = dashed ? "rgba(255, 0, 0, " + alpha.toString() + ")" : "rgba(0, 0, 0, " + alpha.toString() + ")";
	ctx.setLineDash(dashed ? [15, 20] : [])
	
	ctx.moveTo(p1.pos.x, p1.pos.y);
	ctx.lineTo(p2.pos.x, p2.pos.y);
	
	ctx.stroke();
}

// angle in radians
function drawSeg(sourcePos, angle, length)
{
	ctx.beginPath();
	
	ctx.lineWidth = points[0].radius * 1.5;
	ctx.strokeStyle = "black";
	ctx.setLineDash([]);
	
	ctx.moveTo(sourcePos.x, sourcePos.y);
	var end = sourcePos.add(v2(Math.sin(angle), Math.cos(angle)).mul(length));
	ctx.lineTo(end.x, end.y);
	
	ctx.stroke();
	
	return end;
}

// point class
function Point(pos)
{
	this.pos = pos;
	this.radius = 15;
	
	this.draw = function(label)
	{
		var color = "black"
	
		// circle
		ctx.beginPath()
		ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
		ctx.fillStyle = (dragler.currentDrag == this) ? "green" : color;
		ctx.fill();
		
		// text
		ctx.fillStyle = "blue"
		ctx.textAlign = "center";
		ctx.fillText(label, this.pos.x, this.pos.y + this.radius + 25);
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
			if((mousePos.sub(p.pos).sscalar()) <= p.radius*p.radius)
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