/****************************************************/
/* Offre un ensemble de méthode permettant la 		*/
/* création/suppression, lecture/écriture			*/
/* dans le fichier de configuration .xml			*/
/****************************************************/

var myFS 			= 0;
var myFileEntry 	= 0;
var myWriter		= 0;
var myCfg			= 0;
var contentFile 	= new DataConfig();

var cptWriteFail	= 0; 	// Permet de determiner une limite à la construction d'arborescence (car problème sur galaxy S)
							// Il faut au miminum lancer 2 fois la génération pour quelle soit complète.

var erase			= false;

// api-file  Error
function failFS(evt) {
    console.log(evt.target.error.code);
    //$('#file-system-text').html("<strong>File System Error: " + evt.target.error.code + "</strong>");  
}
function writeFail(error) {
    console.log("Create/Write Error: " + error.code);
    
    if(error.code == '9' && cptWriteFail < 3){
    	createFile();
    	cptWriteFail++;
    }
    //$('#file-status').html("Create/Write <strong>Error: " + error.code + "</strong>");   
}

function gotFsFail(error){
	alert("gotFsFail");
	if(error.code == '1'){
		myFS.root.getDirectory("EVERYTIME-Technologies", {create: true});
		myFS.root.getFile("EVERYTIME-Technologies/config.xml", {create: true, exclusive: false}, createGotFileEntryFirst, gotFsFail);
	}
}

function createGotNewFile(file){
	console.log("**createGotNewFile[DEBUT]");
	console.log(file.fullPath);
	if(erase==true){
		writeFile();
	}else{
		readFile();
	}
	console.log("******createGotNewFile[FIN]");
}
function createGotNewFileFirst(file){
	console.log("**createGotNewFile[DEBUT]");
	console.log(file.fullPath);
	writeFile();
	console.log("******createGotNewFile[FIN]");
}
function createGotFileEntryFirst(fileEntry){
	console.log("**createGotFileEntry[DEBUT]");
    myFileEntry = fileEntry;
    fileEntry.file(createGotNewFileFirst, writeFail);
    console.log("******createGotFileEntry[FIN]");
}
function createGotFileEntry(fileEntry) {
	console.log("**createGotFileEntry[DEBUT]");
    myFileEntry = fileEntry;
    fileEntry.file(createGotNewFile, writeFail);
    console.log("******createGotFileEntry[FIN]");
}
function gotFS(fileSystem) {
	alert("gotFS");
	console.log("**gotFS[DEBUT]");
    myFS 			= fileSystem;
    console.log(fileSystem.name);
    console.log(fileSystem.root.name);
    
    
    alert(fileSystem.name);
    alert(fileSystem.root.name);
    
    //directory 	= fileSystem.root.getDirectory("EVERYTIME-Technologies", {create: true});
    fileSystem.root.getDirectory("EVERYTIME-Technologies", {create: false});
    fileSystem.root.getFile("EVERYTIME-Technologies/config.xml", {create: false, exclusive: false}, createGotFileEntry, gotFsFail);
    console.log("******gotFS[FIN]");
}
function createFile() { // button onclick function
	alert("createFile debut");
	console.log("**createFile[DEBUT]");
	if (myFS) {
		alert("createFile if");
        gotFS(myFS);
    } else {
    	alert("createFile else");
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, failFS);
    }
    alert("createFile fin");
	console.log("******createFile[FIN]");
}

function gotFileWriter(writer) {
	console.log("**gotFileWriter[DEBUT]");
    /*writer.onwriteend = function(evt) {
        console.log("contents of file now 'some sample text'");
        //$('#file-contents').html("<br/>Contents: <strong>some sample text</strong>");
        writer.truncate(11);  
        writer.onwriteend = function(evt) {
            console.log("contents of file now 'some sample'");
            //$('#file-contents').html("<br/>Contents: <strong>some sample</strong>");
            writer.seek(4);
            writer.write(" different text");
            writer.onwriteend = function(evt){
                console.log("contents of file now 'some different text'");
                //$('#file-contents').html("<br/>Contents: <strong>some different text</strong>");
            };
        };
    };*/
   
	writer.onwriteend = function(evt) {
		console.log("******gotFileWriter [OK]");
	}
	
	writer.write("<everytime><config url='" + contentFile.getUrl() + "' urlConfig='" + contentFile.getUrlConfig() + "'/><data externalId='" + contentFile.getExternalId() + "' badge='" + contentFile.getBadge() + "'  lastClockInDate='" + contentFile.getLastClockInDate() + "' employeeName='" + contentFile.getEmployeeName() + "' employeeFirstname='" + contentFile.getEmployeeFirstname() + "' /></everytime>");

    myWriter = writer;
    console.log("******gotFileWriter[FIN]");
    
    readFile();
}
function gotFileEntry(fileEntry) {
	console.log("**gotFileEntry[DEBUT]");
    fileEntry.createWriter(gotFileWriter, writeFail);
    console.log("******gotFileEntry[FIN]");
}
function writeFile() { // button onclick function
	if (myFileEntry) {
        gotFileEntry(myFileEntry);        
    } else {
    	console.log("Error: File Not Created!");
    }
}

function readFail(error) {
    console.log("Read Error: " + error.code);
    //$('#file-read-text').html("<strong>Read Error: " + error.code + "</strong>");
    //$('#file-read-dataurl').empty();
}
function readerreadDataUrl(file) {
    var reader = new FileReader();
    reader.onloadend = function(evt) {
        console.log("Read as data URL");
        console.log(evt.target.result);
        //$('#file-read-dataurl').html("<strong>" + evt.target.result.slice(0, 38) + "...</strong>");
    };
    reader.readAsDataURL(file);
}
function readerreadAsText(file) {
    var reader = new FileReader();
    reader.onloadend = function(evt) {
        console.log("Read as text");
        console.log(evt.target.result);
        myCfg = evt.target.result;
        //setConfig(evt.target.result);
        //$('#file-read-text').html("<strong>" + evt.target.result + "</strong>");
    };
    reader.readAsText(file);
}
function readerGotFile(file){
    //readerreadDataUrl(file);
    readerreadAsText(file);
}
function readerGotFileEntry(fileEntry) {
    fileEntry.file(readerGotFile, readFail);
}
function readFile() { // button onclick function
    if (myFileEntry) {
        readerGotFileEntry(myFileEntry);        
    } else {
        console.log("Error: File Not Created!");
        return false;
    }    
}

function removeSuccess(entry) {
    //$('#file-status').html("Removed: <strong>readme.txt</strong>"); 
    //$('#file-contents').html("<br/>Contents:");
    //$('#file-read-dataurl').empty();    
    //$('#file-read-text').empty();
}
function removeFail(error) {
    console.log("Remove File Error: " + error.code);
    //$('#file-status').html("Status: <strong>Remove Error: " + error.code + "</strong>");       
}
function removeFileEntry(fileEntry) {
    fileEntry.remove(removeSuccess, removeFail);
}
function removeFile() { // button onclick function
    if (myFileEntry) {
        removeFileEntry(myFileEntry);        
    } else {
        console.log("Error: File Not Created!");
    }    
}
