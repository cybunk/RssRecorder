/*
	# NODE JS script :
	# Query rss, store in mongodb and serve it as json over http
	# Author : Samuel Huron 
*/

// ----------------------------------
// SETTINGS
// Check if their is a personal setting if it's not the case take the default one 
try{
  var setting     = require("./setting.js")
} catch(e) {
  var setting     = require("./defaultsetting.js")
}


// ----------------------------------
// RSS QUERY AND SAVE PART
var query      = require("./query.js").init(setting)

// ----------------------------------
// HTTP Server part 
var read 		= require("./read.js").init(setting)

// ----------------------------------
// FIRST QUERY 
query.query(setting)

// ----------------------------------
// Start the RSS recorder
setInterval(function(){
			query.query(setting)},
			setting.delay)