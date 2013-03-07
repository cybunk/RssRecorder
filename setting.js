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
		"http://stackoverflow.com/feeds/"
		/*,
		"http://stackoverflow.com/feeds/tag/android",
		"http://stackoverflow.com/feeds/tag/jquery",
		"http://stackoverflow.com/feeds/tag/c++",
		"http://stackoverflow.com/feeds/tag/iphone",
		"http://stackoverflow.com/feeds/tag/python",
		"http://stackoverflow.com/feeds/tag/asp.net",
		"http://stackoverflow.com/feeds/tag/html",
		"http://stackoverflow.com/feeds/tag/mysql",
		"http://stackoverflow.com/feeds/tag/.net",
		"http://stackoverflow.com/feeds/tag/ios",
		"http://stackoverflow.com/feeds/tag/objective-c",
		"http://stackoverflow.com/feeds/tag/sql",
		"http://stackoverflow.com/feeds/tag/css",
		"http://stackoverflow.com/feeds/tag/ruby-on-rails",
		"http://stackoverflow.com/feeds/tag/c",
		"http://stackoverflow.com/feeds/tag/ruby",
		"http://stackoverflow.com/feeds/tag/sql-server",
		"http://stackoverflow.com/feeds/tag/wpf",
		"http://stackoverflow.com/feeds/tag/xml",
		"http://stackoverflow.com/feeds/tag/ajax",
		"http://stackoverflow.com/feeds/tag/regex",
		"http://stackoverflow.com/feeds/tag/asp.net-mvc",
		"http://stackoverflow.com/feeds/tag/database",
		"http://stackoverflow.com/feeds/tag/xcode",
		"http://stackoverflow.com/feeds/tag/linux",
		"http://stackoverflow.com/feeds/tag/django",
		"http://stackoverflow.com/feeds/tag/arrays",
		"http://stackoverflow.com/feeds/tag/windows",
		"http://stackoverflow.com/feeds/tag/vb.net",
		"http://stackoverflow.com/feeds/tag/ruby-on-rails3",
		"http://stackoverflow.com/feeds/tag/eclipse",
		"http://stackoverflow.com/feeds/tag/facebook",
		"http://stackoverflow.com/feeds/tag/json",
		*/
		],
	delay:60*1000,  // interval to update in milllisecondes, default = 2 minute
	CacheControl:"max-age=60",			// for the rssprovider  (HTTP TTL, in pages)
	id:'guid'		// element to distinguish one entry to anoter
}