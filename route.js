//Called from the server when a request is recieved. Calls the correct handler.
function route(handle, connection, pathname, getData, response)
{
	if( typeof handle[pathname] === 'function')
	{
 		handle[pathname](connection, getData, response);
	}
	
	else if(pathname == '/')
	{
		handle['/onLoading'](connection, getData, response);
	}
	else
	{
		response.writeHead(200, {"Content-Type" : "text/html"});
		var htm= '<!DOCTYPE html><html><head><script>function onLoading(){var xmlHttp = new XMLHttpRequest();' 
					+'xmlHttp.onreadystatechange=function(){'
					+'document.getElementById("subjectList").innerHTML = xmlHttp.responseText;'
					+'};'
					+'xmlHttp.open("GET", "http://localhost:1337/onLoading", true);'
					+'xmlHttp.send();}'
					+'function subjectExpand(sub){var xmlHttp = new XMLHttpRequest(); document.getElementById("subjectL").value = sub;'
					+'xmlHttp.onreadystatechange=function(){'
					+'document.getElementById("classList").innerHTML = xmlHttp.responseText;'
					+'};'
					+'var url = "http://localhost:1337/subjectExpand?subject=" +sub;'
					+'xmlHttp.open("GET",url,true);'
					+'xmlHttp.send();'
					+'}'
					+'function classExpand(classID, sub){var xmlHttp = new XMLHttpRequest(); document.getElementById("classL").value = classID;'
					+'xmlHttp.onreadystatechange=function(){'
					+'document.getElementById("sectionList").innerHTML = xmlHttp.responseText;'
					+'};'
					+'var url = "http://localhost:1337/classExpand?subject="+sub+"&classID="+classID; document.getElementById("sectionList").innerHTML = "pls";'
					+'xmlHttp.open("GET",url,true);'
					+'xmlHttp.send();}'
					+'function sectionExpand(sub, classID, sec){var xmlHttp = new XMLHttpRequest();'
					+'xmlHttp.onreadystatechange=function(){'
					+'document.getElementById("detailsList").innerHTML = xmlHttp.responseText;'
					+'};'
					+'var url = "http://localhost:1337/sectionExpand?subject="+sub+"&classID="+classID+"&section="+sec;'
					+'xmlHttp.open("GET",url,true);'
					+'xmlHttp.send();}'
					+'</script></head>'
					+'<body onload="onLoading()">'
					+'<div id = "subjectList">testing this subject</div>'
					+'<div id = "classList">testing this class</div>'
					+'<div id = "sectionList">testing this section</div>'
					+'<div id = "detailsList">testing these details</div>'
					+'</body>'
					+'</html>';
		response.write(htm);
		response.end();
	}
}
exports.route = route;
