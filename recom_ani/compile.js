var fs = require("fs");
var articles = require("./articles.js");
var sections = articles.sections;

function errorHandler(err)
{
	if(err)
	{
		return console.log(err);
	}
	
	console.log("File was saved!");
}

function html(name, tags, content)
{
	return ("<" + name + " " + tags + ">" + content + "</" + name + ">");
}

var htmlStartStr = "<html><head><meta charset=\"UTF-8\"></meta><title>Recommended Anime</title><link rel=\"icon\" href=\"favicon.ico\"/><link rel=\"stylesheet\" type=\"text/css\" href=\"csshake.css\"><link rel=\"stylesheet\" type=\"text/css\" href=\"stylesheet.css\"><script type=\"text/javascript\">function goodShit(){var gsc=document.getElementsByClassName(\"good_shit\");var gssa=[\"👌\", \"👀\", \"👌\", \"👀\", \"👌\", \"👀\", \"👌\", \"👀\", \"👌\", \"👀\", \" \", \"g\", \"o\", \"o\", \"d\", \" \", \"s\", \"h\", \"i\", \"t\", \" \", \"g\", \"o\", \"౦\", \"d\", \" \", \"s\", \"H\", \"i\", \"t\", \"👌\"];for(var i=0; i < gsc.length; i++){var str=gsc[i].innerHTML;if(str !=\"\"){gsc[i].innerHTML=\"\";shakey(gsc[i], str);}else{shakey(gsc[i], gssa);}}}function shakey(parentDiv, strarr){for(var i=0; i < strarr.length; i++){var mem=document.createElement(\"span\");var del=50;mem.className=\"shake shake-constant shake-little gold\";mem.style.animationDuration=\"3s\";mem.style.animationDelay=((i * del) - (strarr.length * del)) + \"ms\";if(strarr[i]==\" \"){mem.style.margin=\"0.25em\";}if(i==231){var a=document.createElement(\"a\");a.href=\"https://www.youtube.com/watch?v=shCYA2J-De8&t=26\";a.target=\"_blank\";parentDiv.appendChild(a);}mem.innerHTML=strarr[i];if(i > 230 && i < 234){a.appendChild(mem);mem.className=\"shake shake-constant shake-hard\";mem.style.animationDuration=\"250ms\";}else{parentDiv.appendChild(mem);}}}function randomIntroImg(){document.getElementById(\"intro\").children[1].children[0].src=\"intro_img/\" + (1 + Math.floor(Math.random() * 8)) + \".jpg\";}function newTabLinks(){var links=document.getElementsByTagName(\"a\");for(var i=0; i < links.length; i++){if(links[i].className !=\"link\"){links[i].setAttribute(\"target\", \"_blank\");}}}function main(){randomIntroImg();newTabLinks();goodShit();}</script></head><body onload=\"main()\"><h1 id=\"title-header\" class=\"shake shake-constant shake-slow\">Recommended Anime</h1>";
var htmlEndStr = "<div id='endDiv' style='text-align: center; margin-bottom: 0px;'><h2>end of page</h2><p><span class='pls button' onclick='document.getElementById(&quot;title-header&quot;).scrollIntoView({block: &quot;end&quot;, behavior: &quot;smooth&quot;});'>go to top</span></p></div></body></html>";

var htmlGeneratedContent = "";

// parse through sections and generate elements nd shet
for(var i = 0; i < sections.length; i++)
{
	var sectionId;
	var divContent = "";
	
	if(sections[i][0] != "")
	{
		var sectionName = sections[i][0];
		sectionId = sectionName.toLowerCase().replace(/<([^>]+?)([^>]*?)>(.*?)<\/\1>/ig, "").replace(/(\(|\)|\:|<|>|!|\s\s+|-)/g, "").replace(/ /g, "_");
		
		var tImg = html("img", "src='link-icon.svg' style='width:1em'", "");
		var tA = html("a", "class='link' href='#" + sectionId + "'", tImg);
		var tH2 = html("h2", "", sectionName + tA);
		
		divContent += tH2;
	}
	
	if(sections[i][1] != "")
	{
		var ietl = sections[i][2] != "";
		var tImg;
		var tA;
		
		// make video for webm and mp4 vidoes
		var ext = sections[i][1].split('.')[1];
		
		if(ext == "mp4" || ext == "webm")
		{
			tImg = html("video", "src='" + sections[i][1] + "' autoplay loop class='entry" + ((sections[i][1] == "edn.jpg") ? " shake shake-constant' style='animation-duration:5s" : "") + "' id='" + sections[i][0] + "'", "");
		}
		else
		{
			tImg = html("img", "src='" + sections[i][1] + "' class='entry" + ((sections[i][1] == "edn.jpg") ? " shake shake-constant' style='animation-duration:5s" : "") + "' id='" + sections[i][0] + "'", "");
		}
		
		if(ietl)
		{
			tA = html("a", "href='" + sections[i][2] + "' target='_blank'", tImg);
		}
		
		tP = html("p", "", ietl ? tA : tImg);
		divContent += tP;
	}
	else if(sections[i][2] != "")
	{
		var tA = html("a", "href='" + sections[i][2] + "' target='_blank'", "MAL Page");
		var tP = html("p", "", tA);
		
		divContent += tP;
	}
	
	if(sections[i][3][0] != "")
	{
		for(var j = 0; j < sections[i][3].length ; j++)
		{
			var tP = html("p", "", sections[i][3][j]);
			
			divContent += tP;
		}
	}
	
	var tDiv = html("div", "id='" + sectionId + "'", divContent);
	htmlGeneratedContent += tDiv;
}

fs.writeFile("index.html", htmlStartStr + htmlGeneratedContent + htmlEndStr, "utf-8", errorHandler);