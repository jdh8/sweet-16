!function(){

function Request(method, url, type, data)
{
	var request = new XMLHttpRequest();

	request.open(method, url);
	request.responseType = type;
	request.send(data);

	return request;
}

var data, style;

Request("GET", "database.xml").addEventListener("load", function()
{
	data = this.responseXML;

	if (style) draw(data, style);
});

Request("GET", "template.xsl").addEventListener("load", function()
{
	style = this.responseXML;

	if (data) draw(data, style);
});

function draw(data, style)
{
	var xslt = new XSLTProcessor();
	var title = document.querySelector("title");
	var main = document.querySelector("main");

	xslt.importStylesheet(style);

	title.textContent = title.textContent.replace(/.*–/, "Search results for “" + location.search.substr(1) + "” –");

	main.before(xslt.transformToDocument(data, document).documentElement);
	main.remove();
}

}(); // !function
