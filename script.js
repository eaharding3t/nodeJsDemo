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
		document.getElementById("courseList").innerHTML = "";
		document.getElementById("sectionList").innerHTML ="";
		document.getElementById("detailsList").innerHTML = "";
	};
	xmlHttp.open("GET", "http://localhost:1337/onLoading?databaseType="+databaseType+"&loadTest="+document.getElementById("loadTest").checked, true);
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
		document.getElementById("courseList").innerHTML = xmlHttp.responseText;
	};
	var url = "http://localhost:1337/subjectExpand?subject=" +sub+"&databaseType="+databaseType+"&loadTest="+document.getElementById("loadTest").checked;
	xmlHttp.open("GET",url,true);
	xmlHttp.send();
}
function courseExpand(courseID, sub){
	var xmlHttp = new XMLHttpRequest();
	var databaseType = 3;
	for(var i = 0; i < 4; i ++)
	{
		if(document.getElementById(String(i)).checked==true)
		{
			databaseType =i;
		}
	}
	document.getElementById("courseL").value = courseID;
	xmlHttp.onreadystatechange=function(){
		document.getElementById("sectionList").innerHTML = xmlHttp.responseText;
	};
	var url = "http://localhost:1337/courseExpand?subject="+sub+"&courseID="+courseID+"&databaseType="+databaseType+"&loadTest="+document.getElementById("loadTest").checked;
	xmlHttp.open("GET",url,true);
	xmlHttp.send();
}
function sectionExpand(sub, courseID, sec){
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
	var url = "http://localhost:1337/sectionExpand?subject="+sub+"&courseID="+courseID+"&section="+sec+"&databaseType="+databaseType+"&loadTest="+document.getElementById("loadTest").checked;
	xmlHttp.open("GET",url,true);
	xmlHttp.send();
}
function fileUpload(subj ,courseID, sect){var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange=function(){
		document.getElementById("fileUpload").innerHTML = xmlHttp.responseText;
	};
	var url = "http://localhost:1337/fileUpload?subject="+subj+"&courseID="+courseID+"&section="+sect+"&loadTest="+document.getElementById("loadTest").checked;
	xmlHttp.open("GET", url, true);
	xmlHttp.send();
}