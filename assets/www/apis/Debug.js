var debug = true;
// var debug = false;

// writes the string passed to it to the page
/*function writeDebug(s) {
	$("#debug").html($("#debug").html() + s + "<br\/>");
	/*if (window.widget) {
      alert(s);
   } else {
      $("#debug").innerHTML += s + "<br\/>";
   }*/
}*/

// writes all of the properties of the object passed to it
function revealObject(o) {
   for (p in o) {
      writeDebug(p);
   }
}

// if debug is set to true, this will show the debug div
function initDebug() {
   if (debug) {
	   $("#debug").style.display = "block";
   }
}

//window.onload = initDebug;



//Script written by Drew Noakes -- http://drewnoakes.com
//4 Dec 2006

//the div element used for debug output.  created in enableDebug.
var debugDiv;

//call this function from a script within the document for which to enable debug output
function enableDebug() {
	document.write("<div id='debugContent' style='display:block; position:absolute; top:7px; right:7px; padding:10px; width:300px; background:#ccc; color:white; border:solid 1px black;'></div>");
	debugDiv = document.getElementById("debugContent");
	writeClearLink();
}

//writes the string passed to it to the page
function writeDebug(message) {
	if (debugDiv)
		debugDiv.innerHTML += message + "<br\/>";
}

//writes the value of some code expression.
//eg: writeEval("document.location"); // writes "document.location = http://drewnoakes.com"
function writeEval(code) {
	writeDebug(code + " = " + eval(code));
}

//writes all of the properties of the object passed to it
function writeDebugObject(object) {
	for (property in object)
	   writeDebug(property);
}

//clears the debug output.  called either manually or by the user clicking the 'clear' link in the debug div.
function clearDebug() {
	if (debugDiv) {
		 debugDiv.innerHTML = "";
		 writeClearLink();
	}
}

//writes a link in the debug div that clears debug output
function writeClearLink() {
	writeDebug("<a href='#' onclick='clearDebug(); return false;'>clear</a>");
}

