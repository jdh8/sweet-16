"use strict";

document.querySelector("main").appendChild(document.getElementById("loader").content);

{
	const button = document.getElementById("load");
	const client = new XMLHttpRequest();
	let count = 2;

	button.addEventListener("click", function()
	{
		client.open("GET", "page/" + count + "/");
		client.responseType = "document";
		client.send();
	});

	client.addEventListener("load", function()
	{
		if (((this.status|0) / 100)|0 == 2)
		{
			button.hidden = ++count > pages;
			button.before(...this.response.querySelectorAll("article.post"));
			history.pushState(null, this.response.title, this.responseURL);
		}
	});
}
