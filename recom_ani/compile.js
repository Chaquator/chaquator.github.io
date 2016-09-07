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

var htmlStartStr = "<meta charset=UTF-8><title>Recommended Anime</title><link href=favicon.ico rel=icon><link href=csshake.css rel=stylesheet><link href=stylesheet.css rel=stylesheet><script>function reloadImage(e){var t=document.getElementById(e);(new Image).src=t.src}function goodShit(){for(var e=document.getElementsByClassName(\"good_shit\"),t=[\"👌\",\"👀\",\"👌\",\"👀\",\"👌\",\"👀\",\"👌\",\"👀\",\"👌\",\"👀\",\" \",\"g\",\"o\",\"o\",\"d\",\" \",\"s\",\"h\",\"i\",\"t\",\" \",\"g\",\"o\",\"౦\",\"d\",\" \",\"s\",\"H\",\"i\",\"t\",\"👌\"],n=0;n<e.length;n++){var a=e[n].innerHTML;\"\"!=a?(e[n].innerHTML=\"\",shakey(e[n],a)):shakey(e[n],t)}}function shakey(e,t){for(var n=0;n<t.length;n++){var a=document.createElement(\"span\"),o=50;if(a.className=\"shake shake-constant shake-little gold\",a.style.animationDuration=\"3s\",a.style.animationDelay=n*o-t.length*o+\"ms\",\" \"==t[n]&&(a.style.margin=\"0.25em\"),231==n){var s=document.createElement(\"a\");s.href=\"https://www.youtube.com/watch?v=shCYA2J-De8&t=26\",s.target=\"_blank\",e.appendChild(s)}a.innerHTML=t[n],n>230&&n<234?(s.appendChild(a),a.className=\"shake shake-constant shake-hard\",a.style.animationDuration=\"250ms\"):e.appendChild(a)}}function main(){document.getElementById(\"intro\").children[1].children[0].src=\"intro_img/\"+(1+Math.floor(10*Math.random()))+\".jpg\",goodShit()}</script><body onload=main()><h1 class=\"shake shake-constant shake-slow\"id=title-header>Recommended Anime</h1>";
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
		sectionId = sectionName.toLowerCase().replace(/ /g, "_").replace(/(\(|\)|\:|<|>|!)/g, "");
		
		var tImg = html("img", "src='link-icon.svg' style='width:1em'", "");
		var tA = html("a", "class='link' href='#" + sectionId + "'", tImg);
		var tH2 = html("h2", "onclick='function(){ reloadImage(sectionId); }'", sectionName + tA);
		
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