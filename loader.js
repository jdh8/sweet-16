"use strict";

document.querySelector("main").appendChild(document.getElementById("loader").content);

!function(){

var button = document.getElementById("load");
var client = new XMLHttpRequest();
var count = 2;

button.addEventListener("click", function()
{
	client.open("GET", "page/" + count + "/");
	client.responseType = "document";
	client.send();
});

client.addEventListener("load", function()
{
	if ((this.status / 100)|0 == 2)
	{
		button.hidden = ++count > paginator.pages;
		button.before(...this.response.querySelectorAll("article.post"));
		history.pushState(null, this.response.title, this.responseURL);
	}
});

}();
