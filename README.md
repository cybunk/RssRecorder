RSS provider 
===================

## Description
A simple Node js script to load, save rss feed and serve a chunk as a Json over http.

## Usage
Tree endpoint to access the rss element : 

* Mongo db query : 
	
	_Format :_
	q?query={}&sort={}&field={}&limit=30&skipe=0

	_Exemple :_
	q?query={"title":"Install%20mod_wsgi%20in%20mamp"}

* Direct query to access a rss in JSON without storing it : 

	dq?url=http%3A%2F%2Fstackoverflow.com%2Ffeeds%2Ftag%2Fphp&callback=test

* Statistiques on the db : (Not yet implemented)
	
	s?query={}&sort={}&field={}&limit=30&skipe=0


Jsonp is available on all request :
	
	_query :_
	q?query={}&callback="myjsonpfunction"

	_provide :_ 
	myjsonpfunction([{},{},{} ...])

## Dependencies

feedparser https://github.com/danmactough/node-feedparser

	npm install feedparser

## Installing

Download the latest version here:

* <https://github.com/cybunk/RssRecorder/archive/master.zip>

Or, from the command line:

```bash
git clone https://github.com/cybunk/RssRecorder.git
```

How to start  : 

* Recorder part :
	'node rssrecorder.js setting.js'

* Server part :
	'node rssprovider.js'

## Configuration 

	module.exports = {
		dbName:"_vs_examples",			// mongo db dbName
		dbCollection:"myCollection",	// mongo db collection
		serverPort:9616,				// server port for http provider
		url:[							// url array to query 
			"http://stackoverflow.com/feeds/",
			],
		delay:60*1000,  // interval to query in milllisecondes, default = 2 minute
		id:'guid'		// element to identify one entry to anoter and don't record two time the same element 
	}
