//This function is called on page-load as well as when the value of the loadtest check box is changed.
//It kicks a special event on the server that performs an expensive query with a random length (to prevent caching).
function loadTest(){
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange=function(){
		document.getElementById("loadTestList").innerHTML = xmlHttp.responseText;
	};
	var get_array = {};
	var get = window.location.search.substring(1);
	var split_on_and = get.split("&");
	var split_on_equals = split_on_and[0].split("=");
	var loadTest = split_on_equals[1];
	if(loadTest == 'true'){
		split_on_equals = split_on_and[1].split("=");
		var databaseType = split_on_equals[1]; 
		xmlHttp.open("GET", 'http://basicpoc.2020ar.com:1337/loadTest?loadTest='+loadTest+'&databaseType='+databaseType, true);
		xmlHttp.send();
	}
}
//This function is called when a database type is selected by the user.
//It populates a select box of subjects.
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
	xmlHttp.open("GET", "http://basicpoc.2020ar.com:1337/onLoading?databaseType="+databaseType, true);
	xmlHttp.send();
}
//This function is called when a subject is selected from the above select.
//It populates a select box of courses for the selected subject. 
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
	var url = "http://basicpoc.2020ar.com:1337/subjectExpand?subject=" +sub+"&databaseType="+databaseType;
	xmlHttp.open("GET",url,true);
	xmlHttp.send();
}
//This function is called when a course is selected from the above select.
//It populates a select box of sections for the selected course. 
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
	var url = "http://basicpoc.2020ar.com:1337/courseExpand?subject="+sub+"&courseID="+courseID+"&databaseType="+databaseType;
	xmlHttp.open("GET",url,true);
	xmlHttp.send();
}
//This function is called when a section is selected from the above select.
//It populates a table of details for the selected section.
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
	var url = "http://basicpoc.2020ar.com:1337/sectionExpand?subject="+sub+"&courseID="+courseID+"&section="+sec+"&databaseType="+databaseType;
	xmlHttp.open("GET",url,true);
	xmlHttp.send();
}
//This function is called when a user hits the file upload button.
//It takes and stores the selected subject, course and section, writes them to a file and then uploads that file to AWS S3.
function fileUpload(subj ,courseID, sect){var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange=function(){
		document.getElementById("fileUpload").innerHTML = xmlHttp.responseText;
	};
	var url = "http://basicpoc.2020ar.com:1337/fileUpload?subject="+subj+"&courseID="+courseID+"&section="+sect;
	xmlHttp.open("GET", url, true);
	xmlHttp.send();
}
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-51762895-1', '2020ar.com');
ga('send', 'pageview');

