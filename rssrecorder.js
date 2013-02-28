/*
	# NODE JS script :
	# Query rss, store in mongodb and serve it as json over http
	# Author : Samuel Huron 
*/

// ----------------------------------
// SETTINGS
// Check if their is a personal setting if it's not the case take the default one 

if(typeof(process.argv[2])!="undefined"){
	console.log("load setting : ",process.argv[2])
	try{
	  var setting     = require("./"+process.argv[2])
	  console.log(setting)
	} catch(e) {
	  console.log("ERROR : impossible to load file",e)
	}
} else{
	try{
	  var setting     = require("./setting.js")
	  console.log("setting loaded : ./setting.js")
	} catch(e) {
	  var setting     = require("./defaultsetting.js")
	  console.log("setting loaded : ./defaultsetting.js")
	}
}
// ----------------------------------
// LOAD Collection accessible 
var collections= require('./collectionList.js')

// ----------------------------------
// RSS QUERY AND SAVE PART
var query      = require("./query.js").init(setting)

// ----------------------------------
// HTTP Server part 
var read 		= require("./read.js").init(setting,collections)

// ----------------------------------
// FIRST QUERY 
query.query(setting)

// ----------------------------------
// Start the RSS recorder
setInterval(function(){
			query.query(setting)},
			setting.delay)