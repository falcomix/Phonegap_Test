/****************************************************/
/* Offre un ensemble de méthode permettant la 		*/
/* gestion du cache dans le téléphone				*/
/****************************************************/

function LocalStorage(){
	/****************************************************/
    /*						CHAMPS						*/
    /****************************************************/
	var cache = window.localStorage;
	
	/****************************************************/
    /*						METHODES					*/
    /****************************************************/
	// Retourne le première index valide pour 
	// l'ajout d'un pointage
	this.getFirstIndexAvailable = function(){
		console.log("**getFirstIndexAvailable");
		var i 		= 0;
		var item 	= cache.getItem(i);
		while(item != null){
			i++;
			item 	= cache.getItem(i);
		}	
		
		return i;
	}
	
	// Ajout d'un nouveau pointage dans le cache
	this.newEventCache 	= function(dateExt){
		console.log("**newEventCache");
		var date = new Date().getTime();
		if(dateExt != null){
			date = dateExt;	
		}
		contentFile.lastClockInDate = date;
		cache.setItem(this.getFirstIndexAvailable(), date);
	}

	// Liste le contenu du cache
	this.checkCache = function(){
		console.log("**checkCache");
		var i 		= 0;
		var item 	= cache.getItem(i);
		while(item != null){
			console.log("Key : " + i + " - Value : " + item);
			i++;
			item 	= cache.getItem(i);
		}	
	}
	
	// Execute l'ensemble du cache
	this.executeCache = function(){
		console.log("**executeCache");
		var i 		= 0;
		var item; 	
		var continu = true;
		
		while(continu==true){
			item = cache.getItem(i);
			if(item != null){
				TrySendNewClockInMovement(item);
				cache.removeItem(i);
			}else{
				continu=false;
			}
			i++;
		}		
		
		return i;
	}

	// Vide le cache sans passer par le server 
	// les pointages ne seront pas envoyés
	this.clearCache = function(){
		cache.clear();
		console.log("**Clear Cache[OK]");
	}		
}




/*
Methods 
	key			: Returns the name of the key at the position specified.
	getItem		: Returns the item identified by it's key.
	setItem		: Saves and item at the key provided.
	removeItem	: Removes the item identified by it's key.
	clear		: Removes all of the key value pairs.

Details 
	localStorage provides an interface to a W3C Storage interface. It allows one to save data as key-value pairs.

Supported Platforms 
	Android
	BlackBerry WebWorks (OS 6.0 and higher)
	iPhone

example
	window.localStorage.setItem("key", "value");
    var keyname = window.localStorage.key(i);
    // keyname is now equal to "key"
    var value = window.localStorage.getItem("key");
    // value is now equal to "value"
    window.localStorage.removeItem("key");
    window.localStorage.setItem("key2", "value2");
    window.localStorage.clear();
    // localStorage is now empty

*/