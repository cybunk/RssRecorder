/*

	# Setting for RSS provider

*/
module.exports = {
	// MONGO parameter
	dbName:"_vs_examples",
	dbCollection:"stackoverflow",

	// HTTP server port 
	serverPort:9616,
	
	// URL to request rss
	url:[
		"http://stackoverflow.com/feeds/",
		//"http://stackoverflow.com/feeds/tag/php",
		],
	delay:120*1000,  // interval to update in milllisecondes, default = 2 minute
	id:'guid'		// element to distinguish one entry to anoter
}