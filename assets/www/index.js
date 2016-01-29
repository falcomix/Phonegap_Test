/****************************************************************************************************/
/*                          			GLOBAL / CONSTANTES	                                 		*/
/****************************************************************************************************/
var states 					= {};
var dataConfig 				= new DataConfig();
var orientation 			= "";
var debugColor				= {
	"INFO" 	: "Blue",
	"ERROR" : "Red",
	"WORKS" : "Green"
};

//var smallerHeightValue		= 0;
var TMPheight					= 0;
var TMPwidth					= 0;

var dateSend;

// Permet de lister le contenu du cache
function checkCache(){
	var localStorage 			= new LocalStorage();
	if(localStorage != null){
		localStorage.checkCache();
	}
}

// Permet de vider le contenu du cache
function clearCache(){
	var localStorage 			= new LocalStorage();
	if(localStorage != null){
		localStorage.clearCache();
		$('#info_cache').html("Pointages effac&eacute;s avec succ&eacute;s..");
		$('.trConfigSendCache').css('display','none');
		setTimeout(function() {
			$('#info_cache').html("Aucun pointage n'est en m&eacute;moire dans votre t&eacute;l&eacute;phone");
		}, 3000);
	}
}

// Initialise la structure de connexion pour une future détection
function initVarConnection(){
	alert("initVarConnection debut");
	
	if (typeof states != "undefined") {
	alert("states : la variable existe")
	} else {
	alert("states : la variable n'existe pas")
	}
	
	if (typeof Connection != "undefined") {
	alert("Connection : la variable existe")
	} else {
	alert("Connection : la variable n'existe pas")
	}
	
	states[Connection.UNKNOWN]  = 'Unknown connection';
	alert("initVarConnection 1");
	states[Connection.ETHERNET] = 'Ethernet connection';
	alert("initVarConnection 2");
	states[Connection.WIFI]     = 'WiFi connection';
	alert("initVarConnection 3");
	states[Connection.CELL_2G]  = 'Cell 2G connection';
	alert("initVarConnection 4");
	states[Connection.CELL_3G]  = 'Cell 3G connection';
	alert("initVarConnection 5");
	states[Connection.CELL_4G]  = 'Cell 4G connection';
	alert("initVarConnection 6");
	states[Connection.CELL]     = 'Cell generic connection';
	alert("initVarConnection 7");
	states[Connection.NONE]     = 'No network connection';
	
	alert("initVarConnection fin");
}

/****************************************************************************************************/
/*                          				METHODES	                                 			*/
/****************************************************************************************************/

$(document).ready(function() { 
	alert("Test");
	document.addEventListener("online", 		onOnline, 		false);
	//document.addEventListener("offline", 		onOffline, 		false);
	document.addEventListener("deviceready", 	onDeviceReady, 	false);
	//window.addEventListener("orientationchange", orientationChange, true); // <---  Attention Bancal !
	
	$(window).resize(function() {
		orientationChange();
	});
	
	//$('#imgNotification').css('visibility', 'hidden');	
	$('#imgSplash').css('width', 256);	//128 192 256
    $('#imgSplash').css('height', 147);
    $('#view_index').css('display', 'none');
});

// Lancé lorsque le support est prêt
function onDeviceReady() {
	alert("onDeviceReady");
    $.support.cors = true;

    initVarConnection();
    generateArbo(false);
	console.log("**Device [OK]");
	alert("Device [OK]");
	setTimeout(function() {
	    navigator.splashscreen.hide();
	    ResizeRefreshPositionsElements();
	    $('#view_splashscreen').css('display', 'none');
	    //$("#view_index").fadeIn('fast', 'swing', null);
	    showView_index();
	}, 4000);
}

// Evènement lorsque l'orientation change
function orientationChange(e) {
	orientation = "portrait";
 	if(window.orientation == -90 || window.orientation == 90) {
 		orientation = "landscape";
 	}
 	
 	ResizeRefreshPositionsElements();
 	console.log(orientation);
}

// Appelé lors de la récupération de réseau internet
function onOnline() {
	alert("onOnline");
	console.log("----------------------------------------- ONLINE");
	var localStorage 			= new LocalStorage();
	if(localStorage.getFirstIndexAvailable() > 0){
		sendCache();	
	}
	alert("Connection !");
}

function onOffline() {
	alert("Connection Lost !");
}

// Vérifie l'état de connexion
function checkConnection() {
    var networkState 			= navigator.network.connection.type;
    return states[networkState];
}

// Retourne si il est possible d'effectuer une requête 
// selon l'état de la connexion
function connectionIsAvailable(){
	return (	checkConnection() != states[Connection.NONE] 
			&&	checkConnection() != states[Connection.UNKNOWN]);
}

// Affiche ou non une notification
function refreshNotification(){
	console.log("**RefreshNotification");
	// Faut-il afficher la notif ?
	var localStorage	= new LocalStorage();
	if(localStorage.getFirstIndexAvailable() == 0){
		$('#imgNotification').css('visibility', 'hidden');	
	}else{
		$('#imgNotification').css('visibility', 'visible');	
	}
}

// Affiche le panneau de config
function showView_config(){
	$('#view_index').css('display', 'none');
	$("#view_config").fadeIn('fast', 'swing', null);
	
	checkConfig();
	
	setTimeout(function(){
		getConfig();
		
		$('#id').val(contentFile.getExternalId());
		$('#url').val(contentFile.getUrl());
		$('#badge').val(contentFile.getBadge());
		
		var localStorage 			= new LocalStorage();
		
		var tmp 					= localStorage.getFirstIndexAvailable();
		if(tmp != 0){
			$('.trConfigSendCache').css('display','inherit');
			var str = "Des pointages sont en m&eacute;moire dans votre t&eacute;l&eacute;phone : " + tmp;
			console.log(str);
			$('#info_cache').html(str);
		}
		else{
			$('.trConfigSendCache').css('display','none');
			$('#info_cache').html("Aucun pointage n'est en m&eacute;moire dans votre t&eacute;l&eacute;phone");
		}
	}, 100)
}

// Sauvegarde la configuration
function saveConfig(){
	$("#imgConfigSaveLoader").slideDown('fast', 'swing', null);
	
	console.log("id : " 	+ $('#id').val().trim());
	console.log("url : " 	+ $('#url').val().trim());
	console.log("badge : " 	+ $('#badge').val().trim());
	
	contentFile.setExternalId($('#id').val().trim());
	contentFile.setUrl($('#url').val().trim());
	contentFile.setBadge($('#badge').val().trim());
	contentFile.firstInit = 0;
	
	generateArbo(true);
	
	setTimeout(function() {
		$("#imgConfigSaveLoader").slideUp('fast', 'swing', null);
	}, 1000);
}

// Annul la configuration
function cancelConfig(){
	$('#id').val(contentFile.getExternalId());
	$('#url').val(contentFile.getUrl());
	$('#badge').val(contentFile.getBadge());
}

// Affiche le panneau principal
function showView_index(){
	getConfig();
	$('#view_config').css('display', 'none');
	$('#view_getConfig').css('display', 'none');
	if(contentFile.isReady()){
		//$('#divDebug').css('display', 'inline');
		$("#view_index").fadeIn('fast', 'swing', null);
		refreshNotification();
	}else{
		$("#view_getConfig").fadeIn('fast', 'swing', null);
	}
}

function getSizeScreen(){
	container_width 	= $(window).width();    // Capture des tailles
	container_height 	= $(window).height();
	
	writeDebug("container_width : " + container_width, debugColor.WORKS, false);
	writeDebug("container_height : " + container_height, debugColor.WORKS, false);
}

// Redimenssion et repositionne l'ensemble des éléments
function ResizeRefreshPositionsElements(){
	// Redimenssionnement
	$('#imgClockIn').css('width', 192);	//128 192 256
    $('#imgClockIn').css('height', 192);
	
	$('#imgNotification').css('width', 24);	//128 192 256
    $('#imgNotification').css('height', 24);

    var screenW			= screen.width;    							
    var screenH			= screen.height;
    var windowW			= document.documentElement.clientWidth;		// return 505
    var windowH			= document.documentElement.clientHeight;	// return 505
    var innerW			= window.innerWidth;						// return 505	My correct size found !
    var innerH			= window.innerHeight;						// return 320   My correct size found !
    var bodyW			= document.body.clientWidth;				// return 505
    var bodyH			= document.body.clientHeight;				// return 505
    
    writeDebug("screenW : " 	+ screenW, debugColor.INFO, true);
	writeDebug("screenH : " 	+ screenH, debugColor.INFO, false);
	writeDebug("windowW : " 	+ windowW, debugColor.INFO, false);
	writeDebug("windowH : " 	+ windowH, debugColor.INFO, false);
	writeDebug("innerW : " 		+ innerW, debugColor.INFO, false);
	writeDebug("innerH : " 		+ innerH, debugColor.INFO, false);
	writeDebug("bodyW : " 		+ bodyW, debugColor.INFO, false);
	writeDebug("bodyH : " 		+ bodyH, debugColor.INFO, false);
	
    //container_width 	= $(window).width();    // Capture des tailles
	//container_height 	= $(window).height();
	container_width 	= innerW;    // Capture des tailles
	container_height 	= innerH;
    clockIn_width 		= $('#imgClockIn').width();
    clockIn_height 		= $('#imgClockIn').height();
    notif_width 		= $('#imgNotification').width();
    notif_height 		= $('#imgNotification').height();
    config_width 		= $('#imgConfig').width();
    config_height 		= $('#imgConfig').height();

    // Positionnement
    if(orientation == 90){ // landscape
    	console.log( "---------------------------" + orientation);
    	
    	var largeur = container_width;
    	var hauteur = container_height;
    	if(container_width < container_height){
    		hauteur = container_width;
    		largeur = container_height;
    	}
    	
    	// pour BlackBerry
    	if(hauteur == largeur){
    		hauteur = TMPwidth;
    		largeur = TMPheight;
    		
    		$('#mainBody').css('width', largeur);	//128 192 256
    	    $('#mainBody').css('height', hauteur); 
    	    
    	    $(window).width(largeur);
    	    $(window).height(hauteur);
    	    
    	    //writeDebug("TMPwidth : " 	+ TMPwidth, debugColor.INFO, false);
    		//writeDebug("TMPheight : " 	+ TMPheight, debugColor.INFO, false);
    	}
    	
    	//----------------------------------------------------------- test 4 BB FORCE RESIZE
    	
    	writeDebug("largeur : " 		+ largeur, debugColor.ERROR, false);
		writeDebug("hauteur : " 		+ hauteur, debugColor.ERROR, false);
    	
    	$('#mainBody').css('width', largeur);	//128 192 256
	    $('#mainBody').css('height', hauteur);
    	
	    $('#mainBody').width(largeur);
	    $('#mainBody').height(hauteur);
	    
	    document.body.clientWidth	= largeur;
	    document.body.clientHeight	= hauteur;
	    
	    document.documentElement.clientWidth = largeur;
	    document.documentElement.clientHeight = hauteur;
	    
	    $(window).width(largeur);
	    $(window).height(hauteur);
	    
	    $(window).css('width', largeur);	//128 192 256
	    $(window).css('height', hauteur);
	    
	    writeDebug("clientWidth : " 		+ document.body.clientWidth, debugColor.WORKS, false);
		writeDebug("clientHeight : " 		+ document.body.clientHeight, debugColor.WORKS, false);
	    
		
		//----------------------------------------------------------- test 4 BB
		
    	$('#imgClockIn').css('position', 'absolute');
    	$('#imgClockIn').css('marginTop', ((hauteur - clockIn_height) / 2) + 'px');
    	$('#imgClockIn').css('left', 10 + 'px');
    	
    	$('#blkValid').css('position', 'absolute');
    	$('#blkError').css('position', 'absolute');
    	
    	$('#blkValid').css('marginTop', ((hauteur - clockIn_height) / 2) + 'px');
    	$('#blkError').css('marginTop', ((hauteur - clockIn_height) / 2) + 'px');
    	
    	$('#blkValid').css('left', clockIn_width + 20 + 'px');
    	$('#blkError').css('left', clockIn_width + 20 + 'px');
    	
    	$('#blkValid').css('width', clockIn_width + 20 + 'px');
    	$('#blkError').css('width', clockIn_width + 20 + 'px');
    	
    	$('#blkValid').css('width', largeur - clockIn_width - 20 - 55 + 'px');
    	$('#blkError').css('width', largeur - clockIn_width - 20 - 55 + 'px');
    }else{ // "portrait"
    	
    	// pour BlackBerry
    	TMPheight					= container_height;
    	TMPwidth					= container_width; 
    	
    	console.log( "**********************" + orientation);
    	$('#imgClockIn').css('position', 'relative');   	
    	$('#blkValid').css('position', 'relative');
    	$('#blkError').css('position', 'relative');
    	
    	$('#imgClockIn').css('marginTop',  	((container_height - clockIn_height) / 2) - 50 	+ 'px');
    	$('#blkValid').css('width', container_width - 75 + 'px');
    	$('#blkError').css('width', container_width - 75  + 'px');
    	if(container_width > container_height){
    		$('#imgClockIn').css('marginTop',  	((container_width - clockIn_height) / 2) - 50 	+ 'px');
    		$('#blkValid').css('width', container_height - 20  + 'px');
        	$('#blkError').css('width', container_height - 20  + 'px');
    	}
    	
    	$('#blkValid').css('left', 0 + 'px');
    	$('#blkError').css('left', 0 + 'px');
    	
    	$('#blkValid').css('marginTop', 0 + 'px');
    	$('#blkError').css('marginTop', 0 + 'px');	
    }
    
    writeDebug("container_width : " + container_width, debugColor.ERROR, false);
	writeDebug("container_height : " + container_height, debugColor.ERROR, false);
    
	$('#imgNotification').css('position', 'absolute');
	$('#imgNotification').css('bottom', 3 + 'px');
	$('#imgNotification').css('right',  3 + 'px');

	$('#imgConfig').css('position', 'absolute');
	$('#imgConfig').css('top', 		3 + 'px');
	$('#imgConfig').css('right', 	3 + 'px');
	
	$('#imgBack').css('position', 'absolute');
	$('#imgBack').css('top', 	3 + 'px');
	$('#imgBack').css('right', 	3 + 'px');
	
	// Affiche les notifs ?
	refreshNotification();
			
	// Debug
	console.log("**ResizeRefreshPositionsElements[OK]");
	console.log("******container_width = " 	+ container_width);
	console.log("******container_height = "	+ container_height);
	console.log("******clockIn_width = " 	+ clockIn_width);
	console.log("******clockIn_height = "	+ clockIn_height);
	console.log("******notif_width = " 		+ notif_width);
	console.log("******notif_height = "		+ notif_height);
}

// Envoi le contenu du cache
function sendCache(){
	var localStorage 			= new LocalStorage();
	if(connectionIsAvailable()){
		localStorage.executeCache();
	}else{
		msg = "Connexion requise";
		showBlockquote($("#blkError"), msg);
		writeDebug("--> Connexion NOK", debugColor.ERROR,true); 
	}
}

// Ecrit dans le debug
function writeDebug(string, debugColor, clearBefore){	
	str = "<span style=\"color:" + debugColor + ";\">" + string + "</span><br/>";
	console.log(str);	
	
	if(clearBefore == true){
		$('#divDebug').html("");
	}
		
	$('#divDebug').html($('#divDebug').html() + str); 
}

// Affiche les messages d'Error/validation
function showBlockquote(blk, msg){
	if(blk.css("display") == "none"){
		blk.html("<p>" + msg + "</p>");
		blk.slideDown('slow', 'swing', null);
		setTimeout(function() {
			blk.slideUp('fast', 'swing', null);
		}, 5000);
	}
}

// Cache les messages d'Error/validation
function hideBlockquote(idBlk){
	$("#"+idBlk).slideUp('fast', 'swing', null);
}

/****************************************************************************************************/
/*                          			APPELS AJAX			                                 		*/
/****************************************************************************************************/
/*------------------------METHODES------------------------*/
function GetInstitutionNameByExternalId() {
	writeDebug("****GetInstitutionNameByExternalId****", debugColor.INFO ,true);	
	if(connectionIsAvailable())
	{
		writeDebug("--> Connexion OK ", debugColor.WORKS ,false); 
		config = getConfig();		
		if(config != null){
			writeDebug("--> Configuration OK ", debugColor.WORKS ,false);
			console.log("**config [OK]");							
			console.log("******URL	: " + config.getUrl());
			console.log("******ID	: " + config.getExternalId());
			
			$.ajax(
		    {
		        type		: 'POST',
		        async 		: true,
		        dataType	: 'jsonp',			// allow cross-Domain
		        url			: config.getUrl() + "?callback=?",
		        jsonp		: 'successGetInstitutionNameByExternalId',
		        timeout		: 5000,
		        data		: 'idExternal=' + config.getExternalId() + '&action=GetInstitutionNameByExternalId',
		        success		: function(success){
		        	successGetInstitutionNameByExternalId(success);
		        },
		    });
		}
		else{
			writeDebug("--> Configuration NOK", debugColor.ERROR, false);
			console.log("**config [NOK]");
		}	
	}else{
		writeDebug("--> Connexion NOK", debugColor.ERROR, false);
	}
}

// Permet d'envoyer un pointage
function TrySendNewClockInMovement(date){
	writeDebug("****TrySendNewClockInMovement****", debugColor.INFO ,true);
	var localStorage 			= new LocalStorage();
	getConfig();
	if(connectionIsAvailable())
	{
		writeDebug("--> Connexion OK", debugColor.WORKS, false);		
		if(contentFile.isReady() == true){
			if(contentFile.getAuthorization() == true || date != null){
				switchClockInButton();
					
				writeDebug("--> Configuration OK", debugColor.WORKS, false);
				console.log("**config [OK]");							
				console.log("******URL	: " + contentFile.getUrl());
				console.log("******ID	: " + contentFile.getExternalId());
				console.log("******BADGE	: " + contentFile.getBadge());
				
				if(date == null){
					console.log("non cache");
					dateSend 				= contentFile.getFormatDateNow();
					contentFile.setLastClockInDate(dateSend);
				}else{
					console.log("cache");
					dateSend 				= date;
				}
				
				$.ajax(
			    {
			        type		: 'POST',
			        async 		: true,
			        dataType	: 'jsonp',			// allow cross-Domain
			        url			: contentFile.getUrl() + "?callback=?",
			        jsonp		: 'successTrySendNewClockInMovement',
			        timeout		: 15000,
			        data		: 'idExternal=' + contentFile.getExternalId() + '&badge=' + contentFile.getBadge() + '&clockInDateTime=' + dateSend + '&action=TrySendNewClockInMovement',
			        success		: function(success){
			        	successTrySendNewClockInMovement(success);
			        },
			        error		: function(jqXHR, textStatus, errorThrown){
			        	errorMessage(jqXHR, textStatus, errorThrown);
			        },
			        complete	: function(){
			        	refreshNotification();
			        	if(date==null){			// Si le pointage n'est pas un pointage du cache
			        		generateArbo(true); // pour enregistrer la date du dernier pointage en configuration
			        	}
			        }
			    });
			}
			else{
				msg = "Vous devez attendre pour envoyer votre prochain pointage";
				showBlockquote($("#blkError"), msg);
			}
		}
		else{
			getConfig();
			if(contentFile.getAuthorization()==true){
				localStorage.newEventCache(null);
			}
			
			showView_index();

			generateArbo(true);
			writeDebug("--> Configuration NOK", debugColor.ERROR, false);
			console.log("**config [NOK] //////////////////// divPhoneNumber");
			refreshNotification();	
		}	
	}
	else
	{
		getConfig();
		if(contentFile.getAuthorization()==true){
			msg = "Votre pointage a &eacute;t&eacute; enregistr&eacute;, une tentative d'envoie sera faite ult&eacute;rieurement";
			showBlockquote($("#blkError"), msg);
			writeDebug("--> Connexion NOK", debugColor.ERROR, false);
			//$('#divDebug').html("<span style=\"color:Red;\">--> Connexion NON-OK </span><br/>"); 
			// Go Cache
			localStorage.newEventCache(null);
			refreshNotification();	
			generateArbo(true);
		}else{
			msg = "Vous devez attendre pour envoyer votre prochain pointage";
			showBlockquote($("#blkError"), msg);
		}
	}
}

//Permet d'envoyer un pointage
function GetPhoneClockInSettingFromPhoneNumber(){
	writeDebug("****GetPhoneClockInSettingFromPhoneNumber****", debugColor.INFO ,true);
	$("#imgGetConfigLoader").slideDown('slow', 'swing', null);
	if(connectionIsAvailable())
	{	
		writeDebug("--> Connexion OK", debugColor.WORKS, false);
			
		$.ajax(
	    {
	        type		: 'POST',
	        async 		: true,
	        dataType	: 'jsonp',			// allow cross-Domain
	        url			: contentFile.getUrlConfig() + "?callback=?",
	        jsonp		: 'successGetPhoneClockInSettingFromPhoneNumber',
	        timeout		: 15000,
	        data		: 'phoneNumber=' + $('#txtPhoneNumber').val() + '&action=GetPhoneClockInSettingFromPhoneNumber',
	        success		: function(success){
	        	successGetPhoneClockInSettingFromPhoneNumber(success);
	        },
	        error		: function(jqXHR, textStatus, errorThrown){
	        	errorGetPhoneClockInSettingFromPhoneNumber(jqXHR, textStatus, errorThrown);
	        },
	        complete	: function(){
	        	generateArbo(true); 		// pour enregistrer la nouvelle config
	        	
	        	setTimeout(function() {
	        		getConfig();
	        		if(contentFile.isReady()){
	        			showView_index();
	        			$("#imgGetConfigLoader").slideUp('fast', 'swing', null);
	        		}
	        	}, 500);
	        	
	        }
	    });	
	}
	else
	{
		msg = "Une erreur est survenu lors de la r&eacute;cup&eacute;ration de vos donn&eacute;es, veuillez r&eacute;-essayer ult&eacute;rieurement";
		showBlockquote($("#blkErrorGetConfig"), msg);
		$("#imgGetConfigLoader").slideUp('fast', 'swing', null);
	}
}

// Change l'état du bouton de pointage
function switchClockInButton(){
	if($("#imgClockIn").attr("src") == "images/ajaxLoader.gif"){
		$("#imgClockIn").attr("src","images/arrowDown256gray.png");
		$("#imgClockIn").attr("onclick","TrySendNewClockInMovement(null)");
	}
	else{
		$("#imgClockIn").attr("src","images/ajaxLoader.gif");
		$("#imgClockIn").attr("onclick","");
	}
}

/*------------------------FAIL------------------------*/
function errorMessage(jqXHR, textStatus, errorThrown) {
	console.log("Error [jqXHR] : " + jqXHR);
	console.log("Error [textStatus] : " + textStatus);
	console.log("Error [errorThrown] : " + errorThrown);
	var localStorage 			= new LocalStorage();
	if(textStatus != "parsererror"){
		writeDebug("--> " + textStatus, debugColor.ERROR, false);
		writeDebug("--> Envoi NOK", debugColor.ERROR, false);
		switchClockInButton();
		
		msg = "Votre pointage n'a pas pu &ecirc;tre enregistr&eacute;, une tentative sera faite ult&eacute;rieurement";
		showBlockquote($("#blkError"), msg);
		
		localStorage.newEventCache(dateSend);
	}
}

function errorGetPhoneClockInSettingFromPhoneNumber(jqXHR, textStatus, errorThrown) {
	console.log("Error [jqXHR] : " + jqXHR);
	console.log("Error [textStatus] : " + textStatus);
	console.log("Error [errorThrown] : " + errorThrown);
	var localStorage 			= new LocalStorage();
	if(textStatus != "parsererror"){
		writeDebug("--> " + textStatus, debugColor.ERROR, false);
		writeDebug("--> Config NOK", debugColor.ERROR, false);
		
		msg = "Une erreur est survenu lors de la r&eacute;cup&eacute;ration de vos donn&eacute;es, veuillez r&eacute;-essayer ult&eacute;rieurement";
		showBlockquote($("#blkErrorGetConfig"), msg);
		$("#imgGetConfigLoader").slideUp('fast', 'swing', null);
	}
	
	//$("#imgGetConfigLoader").slideUp('fast', 'swing', null);
}

/*------------------------SUCCESS------------------------*/
function successGetInstitutionNameByExternalId(success) {
	if(success.InstitutionName){
		alert(success.InstitutionName);
	}
}

// Appelé lorsque le pointage a réussi (la communcation avec le WebWrapper)
function successTrySendNewClockInMovement(success) {
	var localStorage 			= new LocalStorage();
	//getConfig();
	switchClockInButton();
	switch(success.TrySendIsTrue){
		case "0" : // error, No host
			msg = "Votre pointage a bien &eacute;t&eacute; envoy&eacute;";
			
			if(contentFile.getEmployeeFirstname() != ''){
				msg += "<br/> Agent : " + contentFile.getEmployeeFirstname() + " " + contentFile.getEmployeeName();
			}
			
			showBlockquote($("#blkValid"), msg);
			localStorage.executeCache();
			break;
			
		case "1" : // in
			msg = "Votre pointage a bien &eacute;t&eacute; envoy&eacute;";
			msg += "<br/> Agent : " + success.Identity;
			msg += "<br/> Type : Entr&eacute;e";
			
			if(success.Identity == "Unavailable"){
				msg = "Votre pointage a bien &eacute;t&eacute; pris en compte";
				if(contentFile.getEmployeeFirstname() != ''){
					msg += "<br/> Agent : " + contentFile.getEmployeeFirstname() + " " + contentFile.getEmployeeName();
					msg += "<br/> Type : Entr&eacute;e";
				}
			}
			showBlockquote($("#blkValid"), msg);
			localStorage.executeCache();
			break;
			
		case "2" : // out
			msg = "Votre pointage a bien &eacute;t&eacute; envoy&eacute;";
			msg += "<br/> Agent : " + success.Identity;
			msg += "<br/> Type : Sortie";
			
			if(success.Identity == "Unavailable"){
				msg = "Votre pointage a bien &eacute;t&eacute; pris en compte";
				if(contentFile.getEmployeeFirstname() != ''){
					msg += "<br/> Agent : " + contentFile.getEmployeeFirstname() + " " + contentFile.getEmployeeName();
					msg += "<br/> Type : Sortie";
				}
			}
			showBlockquote($("#blkValid"), msg);
			localStorage.executeCache();
			break;
			
		case "3" : // Verifier les données
			msg = "Veuillez verifier l'int&eacute;grit&eacute; de vos donn&eacute;es";
			showBlockquote($("#blkError"), msg);
			break;
	}
}

function successGetPhoneClockInSettingFromPhoneNumber(success){
	console.log("**********successGetPhoneClockInSettingFromPhoneNumber");
	console.log(success.Url);
	console.log(success.IdInstitution);
	console.log(success.Badge);
	if(success.Url != "null"){
		contentFile.setUrl(success.Url);
		contentFile.setExternalId(success.IdInstitution);
		contentFile.setBadge(success.Badge);
		contentFile.setEmployeeName(success.Name);
		contentFile.setEmployeeFirstname(success.Firstname);
		msg = "Votre configuration a &eacute;t&eacute; mise &agrave; jour <br/> Bienvenue " + success.Firstname + " " + success.Name;
		showBlockquote($("#blkValid"), msg);
	}else{
		msg = "Veuillez v&eacute;rifier votre num&eacute;ro de t&eacute;l&eacute;phone";
		showBlockquote($("#blkErrorGetConfig"), msg);
		$("#imgGetConfigLoader").slideUp('fast', 'swing', null);
	}
}


/*************************************************************************************************/
/*                          			CONFIGURATION			                                 */
/*************************************************************************************************/
// Génère une arborescence de configuration
function generateArbo(er){
	alert("generateArbo debut");
	
	erase = er;
	
	
	alert("generateArbo 2");
	createFile();
	/*intArbo = setInterval(function(){
		if(myFileEntry){
			generateConfig(erase);
		}
	}, 500);*/
}

// Ecrit une configuration dans le .xml
function generateConfig(){
	//clearInterval(intRead);
	clearInterval(intArbo);
	
	writeFile();
}

// lit la configuration du fichier .xml
function checkConfig(){
	//clearInterval(intCfg);
	readFile();
}

// Permet d'arreter tout les intervals
function clearAllInterval(){
	clearInterval(intArbo);
	clearInterval(intRead);	
}

// Fait une configuration a partir du fichier .xml
function setConfig(result){
	var config 				= $(result).find('config');
	var url 				= $(config).attr('url');
	var urlConfig			= $(config).attr('urlConfig');
	
	var data 				= $(result).find('data');
	var id 					= $(data).attr('externalId');
	var badge				= $(data).attr('badge');
	var lastClockInDate 	= $(data).attr('lastClockInDate');
	var employeeName		= $(data).attr('employeeName');
	var employeeFirstName	= $(data).attr('employeeFirstName');
	
	contentFile.setUrl(url);
	contentFile.setUrlConfig(urlConfig);
	contentFile.setExternalId(id);
	contentFile.setBadge(badge);
	contentFile.setLastClockInDate(lastClockInDate);
	contentFile.setEmployeeName(employeeName);
	contentFile.setEmployeeFirstname(employeeFirstName);
	
	console.log("*-*-*-*-*-*-*-*-*-*id " 				+ contentFile.getExternalId());
	console.log("*-*-*-*-*-*-*-*-*-*badge " 			+ contentFile.getBadge());
	console.log("*-*-*-*-*-*-*-*-*-*lastClockInDate " 	+ contentFile.getLastClockInDate());
}

// Retourne la configuration
function getConfig(){
	console.log(myCfg);
	if(myCfg){
		setConfig(myCfg);
	}
	
	if(contentFile.isReady()){
		return contentFile;
	}
	else{
		return null;
	}
}


/************************************************************************************************/
/*                          TESTS AJAX SOAP - NE FONCTIONNE PAS                                 */
/************************************************************************************************/

/*
<wsdl:operation name="IsHostAvailable">
<wsdl:input wsaw:Action="http://tempuri.org/IService/IsHostAvailable" message="tns:IService_IsHostAvailable_InputMessage"/>
<wsdl:output wsaw:Action="http://tempuri.org/IService/IsHostAvailableResponse" message="tns:IService_IsHostAvailable_OutputMessage"/>
</wsdl:operation>
*/



/* var xmlhttp = new XMLHttpRequest();
    
// Build SOAP request
var sr =
'<?xml version="1.0" encoding="utf-8"?>' +
'<soapenv:Envelope ' +
'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
'xmlns:xsd="http://www.w3.org/2001/XMLSchema" ' +
'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">' +
'<soapenv:Body>' +
'<s:GetInstitutionNameByExternalId soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">' +
'<externalId xsi:type="xsd:string">1</externalId>' +
'</s:GetInstitutionNameByExternalId>' +
'</soapenv:Body>' +
'</soapenv:Envelope>';

xmlhttp.onreadystatechange = function () {
if (xmlhttp.readyState == 4) {
if (xmlhttp.status == 200) {
alert(xmlhttp.responseText);
alert('done use firebug to see response');
}
}
else {
alert(xmlhttp.readyState);
}
}

// Open
xmlhttp.open('POST', 'http://localhost/PhoneGateway_WebWrapper/WebWrapper.aspx/', true);

// Send the POST request
xmlhttp.setRequestHeader('Content-Type', 'text/xml');
xmlhttp.send(sr);*/

//$.ajax({ type: "GET", url: "chat_refresh.php", data: "action=refresh", success: function (msg) { document.getElementById("chat_text").innerHTML = msg; if (msg != precmsg) { bip(); precmsg = msg; } } });
//$.ajax({ type: "GET", url: "chat_refresh.php", data: "action=send&message=" + message + "&pseudo=" + pseudo, success: function () { document.getElementById("msg_input").value = ''; } });




//[WebInvoke(ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json, Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest)]

/*$.ajax(
{
async       : true,
type        : "POST",
contentType : "application/xml; charset=utf-8",
//url         : "http://localhost/PhoneGateway_WS/Service.svc/GetInstitutionNameByExternalId",http://tempuri.org/IService/
url         : "http://tempuri.org/IService/GetInstitutionNameByExternalId",
dataType    : "xml",
data        : { externalId : 1 },
//data        : 1,
success     : function (content) {
successMessage(content);
},
error       : function (content) {
errorMessage(content);
}
});
*/
/*try {
$.ajax({
type: "POST",
contentType: "text/xml; charset=utf-8",
url: "http://localhost/PhoneGateway_WS/Service.svc/IsHostAvailable",
data: "2",
dataType: "xml",
success: function (response) {
//rsp = response;
//alert(response.IsHostAvailableResponse);
successMessage(response);
},
error: function (message) {
//msg = message;
//alert(message);
errorMessage(message);
}
});
}
catch (e) {
alert(e);
}*/

/*$.soap({
url					: 'http://localhost/PhoneGateway_WS/Service.svc/',
method              : 'IsHostAvailable',
appendMethodToURL   : true,
soap12              : false,
//namespaceQualifier  : 'lms',
//namespaceUrl		: 'urn://PhoneGateway_WS.IService',
params				: 	{
idExternalInstitution	: '2'
},
success: function (soapResponse) {
// do stuff with soapResponse
// if you want to have the response as JSON use soapResponse.toJSON();
// or soapResponse.toString() to get XML string
// or soapResponse.toXML() to get XML DOM
successMessage(soapResponse);
},
error: function (error) {
errorMessage(error);
}
});*/


//You can also use chained method that looks like this:
//var soapBody = new SOAPObject("Obj").attr("type", "IsHostAvailable").val("1");

//Create a new SOAP Request
//var sr = new SOAPRequest("IsHostAvailable", soapBody); //Request is ready to be sent

//Lets send it
//SOAPClient.Proxy = "http://localhost/PhoneGateway_WS/Service.svc/"; //Specify web-service address or a proxy file
//SOAPClient.SendRequest(sr, successMessage); //Send request to server and assign a callback



/*

var soapMessage =
'<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"> \
<soap:Body> \
<IsHostAvailable xmlns="http://sh.inobido.com/"> \
<idExternalInstitution>' + 2 + '</idExternalInstitution> \
</IsHostAvailable> \
</soap:Body> \
</soap:Envelope>';

$.ajax({
url: productServiceUrl,
type: "POST",
dataType: "xml",
data: soapMessage,
contentType: "text/xml; charset=\"utf-8\"",
success: function (response) {
//rsp = response;
//alert(response.IsHostAvailableResponse);
successMessage(response);
},
error: function (message) {
//msg = message;
//alert(message);
errorMessage(message);
}
});*/

//var webServiceURL = 'http://localhost/PhoneGateway_WS/Service.svc?op=IsHostAvailable';
//var soapMessage = 	'<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
//	+ 				'<soap12:Body><IsHostAvailable xmlns="http://tempuri.org/" /></soap12:Body></soap12:Envelope';

/*var soapRequest =
'<?xml version="1.0" encoding="utf-8"?> \
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \
xmlns:xsd="http://www.w3.org/2001/XMLSchema" \
xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"> \
<soap:Body> \
<IsHostAvailable xmlns="http://localhost/PhoneGateway_WS/Service.svc"> \
</IsHostAvailable> \
</soap:Body> \
</soap:Envelope>';*/

/*$.ajax({
type		: 'POST', 
url			: webServiceURL,
contentType	: "text/xml",
data		: soapMessage,
processData	: false,
dataType	: "xml",
success		: function(response){alert("ok");},
error		: function(error)	{alert("nonOk");}
});*/
/*toto = 0;
$.soap({
url					: 'http://localhost/PhoneGateway_WS/Service.svc',
method				: 'IsHostAvailable',
namespaceQualifier	: 'wsdl',
namespaceUrl		: 'urn://localhost/PhoneGateway_WS',
params				: 	{
idExternalInstitution	: '2'
},
success: function (soapResponse) {
// do stuff with soapResponse
// if you want to have the response as JSON use soapResponse.toJSON();
// or soapResponse.toString() to get XML string
// or soapResponse.toXML() to get XML DOM
alert("ok");
},
error: function (error) {
alert(error);
}
});*/

/*var url = "/Service.svc";
var request = "<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">" +
"<a:Action s:mustUnderstand=\"1\">http://tempuri.org/IService/IsHostAvailable</a:Action>" +
"<a:To s:mustUnderstand=\"1\">http://localhost/Service.svc</a:To>" +
"<s:Body>" +
"<IsHostAvailable xmlns=\"http://tempuri.org/\">" +
"<idExternalInstitution>2</idExternalInstitution>" +
"</IsHostAvailable>" +
"</s:Body>" +
"</s:Envelope>";
    
$.ajax({
type: "POST",
url: url,
data: request,
contentType: "text/xml",
beforeSend: function (xhr) {
xhr.setRequestHeader(
"SOAPAction",
"http://tempuri.org/IService/IsHostAvailable");
},
success: function (data, textStatus, jqXHR) {
//$("#result").text(jqXHR.responseText);
alert(jqXHR.responseText);
},
error: function (jqXHR, textStatus, errorThrown) {
//err = "jqXHR : " 	+ jqXHR.message() + "\n";
//err += "textStatus : " 	+ textStatus.message() + "\n";
//err = "errorThrown : " 	+ errorThrown.message() + "\n";
	        	 
//alert(err);
}
});*/
