/*
	# NODE JS script :
	# Query rss, store in mongodb and serve it as json over http
	# Author : Samuel Huron 

	// WIKIPEDIA : http://fr.wikipedia.org/w/index.php?title=Sp%C3%A9cial:Modifications_r%C3%A9centes&feed=atom
	// STACKOVERFLOW : http://stackoverflow.com/feeds/tag/
	// 
*/

// ----------------------------------
// SETTINGS
var setting    = {
					// mongo parameter
					dbName:"_vs_examples",
					dbCollection:"stackoverflow",

					// http server port 
					serverPort:9616,
					
					// Url to request rss
					url:"http://stackoverflow.com/feeds/tag/",
					query:["javascript","java","php","python","c++","html"], // several rss query
					delay:60*10000, // interval to update in milllisecondes
					id:'guid'		// element to distinguish one entry to anoter
				}

// ----------------------------------
// LOAD LIB 
var http 	   = require("http"),
    url 	   = require("url"),
	request    = require('request'),
    feedparser = require('feedparser'),
	db 		   = require("mongojs").connect(setting.dbName, [setting.dbCollection]);


// ----------------------------------
// RSS QUERY AND SAVE PART
var query      = {
					receive:function(e,category){
						// check if exist,if it's not save it 
						db[setting.dbCollection].find({guid:e.guid}, 
							function(err,collection){
									if(!err){
										if(collection.length==0){
											query.save(e,category)
											//console.log("save new entry")
										}else{
											//console.log("already exist",collection.length)
										}
									}else{
										console.log("check error")
									}
							}
						)
					},
					save:function(e,category){
						e.timeStamp = new Date().getTime()// add timestamp 
						e._category = category // add category

						db[setting.dbCollection].save(e,function(err){
							if(!err){
								console.log("saved")
							}else{
								console.log("save error")
							}
						})
					},
					query:function(setting){
						var self = this;
						for (var i = setting.query.length - 1; i >= 0; i--) {
							var category = setting.query[i]
							console.log("!!!!!!!",category)

							feedparser.parseFile(setting.url+category)
					  			.on('article', function(e){
					  				console.log(category,e.title)
					  				self.receive(e,category)
					  			});					
						};
					}
				}

setInterval(function(){
			query.query(setting)},
			setting.delay)


// ----------------------------------
// HTTP Server part 
var read 	= {
				stat:function(res,q,sort,field){
					res.writeHead(200, {'Content-Type': 'text/plain'});
					res.end("{error:'in construction'}");
				},
				list:function(res,q,sort,field,skip,limit,jsonp){
					var self = this
					console.log("q",q)
					console.log("sort",sort)
					console.log("field",field)

					//console.log(db)
					if(field!=undefined || field!=null){
						db[setting.dbCollection].find(q,field
						).sort(sort
						).skip(skip
						).limit(limit,
							function(err,collection){
								if(!err){
									self.end(res,JSON.stringify(collection),jsonp)
								}else{
									self.end(res,"{error:'error'}",jsonp)
								}
							}
						)
					}else{
						console.log("ici")
						db[setting.dbCollection].find(q
						).sort(sort
						).skip(skip
						).limit(limit,
							function(err,collection){
								if(!err){
									//console.log(collection)
									self.end(res,JSON.stringify(collection),jsonp)
								}else{
									//res.write("{error:'error'}");
									//if(jsonp) res.end(")") else
									self.end(res,"{error:'error'}",jsonp)
								}
							}
						)
					}
				},
				end:function(res,data,jsonp){
					res.write(data);
					if(jsonp){
					 res.end(")")
					} else {
					 res.end()
					}
				}
			  }


http.createServer(function (req, res) {

  var uri   	= url.parse(req.url,true),
      path  	= uri.pathname,
   	  query 	= uri.query,
   	  myQuery   = {},
	  mySort    = {},
  	  myField	= null,
  	  myLimit 	= 30,
  	  mySkip 	= 0,
  	  jsonp		= query.callback;


  if(typeof(query.query)!="undefined") myQuery = JSON.parse(unescape(query.query))
  if(typeof(query.sort) !="undefined")  mySort = JSON.parse(unescape(query.sort))
  if(typeof(query.field)!="undefined") myField = JSON.parse(unescape(query.field))
  if(typeof(query.limit)!="undefined" && !isNaN(Number(query.limit)!=NaN)) myLimit = Number(query.limit)
  if(typeof(query.skip) !="undefined" && !isNaN(Number(query.skip) !=NaN))  mySkip =  Number(query.skip)

  console.log("Callback : ",jsonp)

  //console.log(path,query.query)
  // REQUEST EXEMPLE :: q?query={"title":"Install%20mod_wsgi%20in%20mamp"}
  
  if(path=="/q"){
  	console.log("mySort",mySort)
  	console.log("myQuery",myQuery)
  	console.log("myField",myField)


  	res.writeHead(200, {'Content-Type': 'text/plain'});
  	
  	if(jsonp) res.write(jsonp+"(")

  	if(!query){

  		read.list(res,myQuery,null,null,myLimit,jsonp)
  	}else{
  		read.list(res,myQuery,mySort,myField,mySkip,myLimit,jsonp)
  	}
  } else if(path=="/s"){
  	if(!query){
  		read.stat(res,query)
  	}
  }else{
	  res.writeHead(200, {'Content-Type': 'text/plain'});
	  res.end("nothing here");
  }

}).listen(setting.serverPort);

