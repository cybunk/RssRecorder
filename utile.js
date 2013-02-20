module.exports = {
	toJson:function(data){
		try{
 		   return JSON.parse(data);
		} catch(e) {
		   console.log("JSON error : ",e)
		   return "{}";
		}
	},
	validURL:function(str) {
	  var pattern = new RegExp('^(https?:\/\/)?'+ // protocol
	    '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|'+ // domain name
	    '((\d{1,3}\.){3}\d{1,3}))'+ // OR ip (v4) address
	    '(\:\d+)?(\/[-a-z\d%_.~+]*)*'+ // port and path
	    '(\?[;&a-z\d%_.~+=-]*)?'+ // query string
	    '(\#[-a-z\d_]*)?$','i'); // fragment locater
	  if(!pattern.test(str)) {
	    alert("Please enter a valid URL.");
	    return false;
	  } else {
	    return true;
	  }
	}
}

