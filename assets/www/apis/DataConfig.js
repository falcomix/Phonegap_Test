/****************************************************/
/* Offre un ensemble de méthode permettant la 		*/
/* gestion de la configuration du téléphone			*/
/****************************************************/

function DataConfig() { 
	/****************************************************/
    /*						CHAMPS						*/
    /****************************************************/
    this.url 				= '';
    this.externalId 		= ''; 
    this.badge				= '';
    
    this.lastClockInDate	= 0;
    
    this.urlConfig			= 'http://217.169.255.115:5000/WebWrapper/';
    
    this.employeeName		= '';
    this.employeeFirstname	= '';
    
    /****************************************************/
    /*	METHODES					*/
    /****************************************************/
    // Est-ce que la configuration est prète ?
    this.isReady = function() {
    	var ready = true;
    	if(		this.url 		== '' 
    		|| 	this.externalId == ''
    		||	this.badge		== '')
    	{
    		ready = false;
    	}
    	return ready;
    }
    
    // donne la date courant en millisecond
    this.getFormatDateNow = function(){
    	var date	= new Date();
    	
    	return date.getTime();
    }
    
    // Sommes-nous autorisé à pointer ? (attente de 1 minute)
    this.getAuthorization = function(){
    	console.log("//////////////////////lastClockInDate : " + this.getLastClockInDate());
		var date	= new Date();
		console.log("//////////////////////date : " + date.getTime());
		console.log("//////////////////////oper : " + (date.getTime() - this.getLastClockInDate()));
		if(date.getTime() - this.getLastClockInDate() > 60000){ // 60000 = 1 minute
			return true;
		}
		return false;
    }
    
    /****************************************************/
    /*					GETTERS/SETTERS					*/
    /****************************************************/
    this.getUrl = function() { 
    	return this.url;
    } 
    
    this.getUrlConfig = function(){
    	return this.urlConfig;
    }
    
    this.getExternalId = function(){
    	return this.externalId;
    }
    
    this.getBadge = function(){
    	return this.badge;
    } 
    
    this.getLastClockInDate = function(){
    	return this.lastClockInDate;
    } 
    
    this.getEmployeeName = function(){
    	return this.employeeName;
    } 
    
    this.getEmployeeFirstname = function(){
    	return this.employeeFirstname;
    } 
    
    this.setUrl = function(urlE) { 
        this.url = urlE;
    } 
    
    this.setUrlConfig = function(urlConfigE) { 
        this.urlConfig = urlConfigE;
    }
    
    this.setExternalId = function(externalIdE){
    	this.externalId = externalIdE;
    }
    
    this.setBadge = function(badgeE){
    	this.badge = badgeE;
    }
    
    this.setLastClockInDate = function(lastClockInDateE){
    	this.lastClockInDate = lastClockInDateE;
    }
    
    this.setEmployeeName = function(employeeNameE){
    	this.employeeName = employeeNameE;
    }
    
    this.setEmployeeFirstname = function(employeeFirstNameE){
    	this.employeeFirstname = employeeFirstNameE;
    }
} 
