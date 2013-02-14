RSS provider 
===================

## Description
A simple Node js script to load, save rss feed and serve it as a Json.

## Usage
Tree endpoint to access the articles : 

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