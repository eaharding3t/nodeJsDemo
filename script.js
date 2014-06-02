function onLoading(){
	var xmlHttp = new XMLHttpRequest();
	var databaseType = 3;
	for(var i = 0; i < 4; i++)
	{
		if(document.getElementById(String(i)).checked == true)
		{
			databaseType = i;
		}
	}
	xmlHttp.onreadystatechange=function(){
		document.getElementById("subjectList").innerHTML = xmlHttp.responseText;
	};
	xmlHttp.open("GET", "http://localhost:1337/onLoading?databaseType="+databaseType, true);
	xmlHttp.send();
}
function subjectExpand(sub){
	var xmlHttp = new XMLHttpRequest();
	var databaseType = 3;
	for(var i = 0; i < 4; i++)
	{
		if(document.getElementById(String(i)).checked == true)
		{
			databaseType = i;
		}
	}
	document.getElementById("subjectL").value = sub;
	xmlHttp.onreadystatechange=function(){
		document.getElementById("classList").innerHTML = xmlHttp.responseText;
	};
	var url = "http://localhost:1337/subjectExpand?subject=" +sub+"&databaseType="+databaseType;
	xmlHttp.open("GET",url,true);
	xmlHttp.send();
}
function classExpand(classID, sub){
	var xmlHttp = new XMLHttpRequest();
	var databaseType = 3;
	for(var i = 0; i < 4; i ++)
	{
		if(document.getElementById(String(i)).checked==true)
		{
			databaseType =i;
		}
	}
	document.getElementById("classL").value = classID;
	xmlHttp.onreadystatechange=function(){
		document.getElementById("sectionList").innerHTML = xmlHttp.responseText;
	};
	var url = "http://localhost:1337/classExpand?subject="+sub+"&classID="+classID+"&databaseType="+databaseType;
	xmlHttp.open("GET",url,true);
	xmlHttp.send();
}
function sectionExpand(sub, classID, sec){
	var xmlHttp = new XMLHttpRequest();
	var databaseType =3;
	for(var i =0;i<4;i++)
	{
		if(document.getElementById(String(i)).checked==true)
		{
			databaseType =i;
		}
	}
	xmlHttp.onreadystatechange=function(){
		document.getElementById("detailsList").innerHTML = xmlHttp.responseText;
	};
	var url = "http://localhost:1337/sectionExpand?subject="+sub+"&classID="+classID+"&section="+sec+"&databaseType="+databaseType;
	xmlHttp.open("GET",url,true);
	xmlHttp.send();
}
function fileUpload(subj ,classID, sect){var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange=function(){
	};
	var url = "http://localhost:1337/fileUpload?subject="+subj+"&classID="+classID+"&section="+sect;
	xmlHttp.open("GET", url, true);
	xmlHttp.send();
}