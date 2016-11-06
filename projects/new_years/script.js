// hey there!
// let's work out a procedure

// have the 10 second count down
	// at 5 seconds, start doing cssshake?
// the big meme
	// fireworks
	// music?
	
var num = 11;

// phase 1 functions
function doText(p1)
{
	num--;
		
	if(p1 != undefined)
	{
		p1.remove();
	}
	
	var p1 = document.createElement("span");
	p1.id = "p1";
	if(num <= 5) // now that we're at 5, let's make things SHAKE
	{
		p1.className = (num > 3) ? "shake shake-constant" : "shake shake-constant shake-hard";
		
		p1.style.fontSize = (1 + (10 - num)) + "em";
		
		p1.style.animationDuration = "150ms";
		p1.style.animationIterationCount = "1";
	}
	
	document.getElementById("div").appendChild(p1);
	
	p1.innerHTML = num;
	
	if(num > 0)
	{
		setTimeout(function()
		{
			doText(p1)
		}, 1000);
	}
	else
	{
		p1.remove();
	}
}

function phase1()
{
	// preoload audio
	var temp_audio = new Audio("magmis.mp3").load();
	
	doText();
	
	setTimeout(phase2, 10000);
}
// --------

// phase 2 functions
function phase2()
{
	document.title = "-̗̀  Happy New Year ̖́-";
	
	var p2 = document.createElement("span");
	p2.id = "p2";
	p2.className = "shake shake-constant shake-hard"
	p2.style.animationDuration = "3s";
	
	setTimeout(function()
	{
		p2.style.fontSize = "10em";
	}, 100);
	
	p2.innerHTML = "happy new year!";
	
	document.getElementById("div").appendChild(p2);
	
	var magic = new Audio("magmis.mp3");
	magic.play();
	magic.loop = true;
	
	document.body.style.transition = "background-color 2s ease-in-out"
	document.body.style.backgroundColor = "#0C1728";
}
// --------