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
// LOAD LIB 
var http 	   = require("http"),
    url 	   = require("url"),
	request    = require('request'),
    feedparser = require('feedparser'),
	db 		   = require("mongojs").connect(setting.dbName, [setting.dbCollection]);


// ----------------------------------
// RSS QUERY AND SAVE PART
var query      = {
					receive:function(e,callback){
						// check if exist,if it's not save it 
						db[setting.dbCollection].find({guid:e.guid}, 
							function(err,collection){
								if(!err){
									if(collection.length==0){
										callback(e)
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
					save:function(e){
						e.timeStamp = new Date().getTime()// add timestamp 
						//e._category = category // add category
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
						console.log(setting)
						for (var i = setting.url.length-1; i >= 0; i--) {
							var url = setting.url[i]
							console.log(i,url)
							feedparser.parseFile(url)
					  			.on('article', function(e){
					  				console.log(e.title)
					  				self.receive(e,self.save)
					  			});					
						};
					}
				}


// ----------------------------------
// HTTP Server part 
var read 	= {
				stat:function(res,q,sort,field){
					console.log("ici")
					res.end("{error:'in construction'}");
				},
				directQuery:function(res,jsonp,url){
					var self = this
					console.log("query: ",url)
					feedparser.parseFile(url)
				  			.on('complete', function(e,a){
				  				console.log(e,a)
				  				self.end(res,JSON.stringify(a),jsonp)
				  			});					
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
				},
				server:function (req, res) {
				  var uri   	= url.parse(req.url,true),
				      path  	= uri.pathname,
				   	  query 	= uri.query,
				   	  myQuery   = {},
					  mySort    = {"timeStamp":-1}, // by default serve last element
				  	  myField	= null,
				  	  myLimit 	= 30,
				  	  mySkip 	= 0,
				  	  jsonp		= query.callback,
				  	  self		= this;


				  if(typeof(query.query)!="undefined") myQuery = utile.toJson(unescape(query.query))
				  if(typeof(query.sort) !="undefined")  mySort = utile.toJson(unescape(query.sort))
				  if(typeof(query.field)!="undefined") myField = utile.toJson(unescape(query.field))
				  if(typeof(query.limit)!="undefined" && !isNaN(Number(query.limit)!=NaN)) myLimit = Number(query.limit)
				  if(typeof(query.skip) !="undefined" && !isNaN(Number(query.skip) !=NaN))  mySkip =  Number(query.skip)

				  console.log("Callback : ",jsonp)
				  console.log("Path : ",path)

				  // ----------------------------------
				  // REQUEST EXEMPLE :: q?query={"title":"Install%20mod_wsgi%20in%20mamp"}
				  res.writeHead(200, {'Content-Type': 'application/json'});				  	
				  if(jsonp) res.write(jsonp+"(")		

				  // ----------------------------------
				  // QUERY :: dq?url=http%3A%2F%2Fstackoverflow.com%2Ffeeds%2Ftag%2Fphp&callback=test
				  if(path=="/q"){
				  	if(!query){
				  		self.list(res,myQuery,null,null,myLimit,jsonp)
				  	}else{
				  		self.list(res,myQuery,mySort,myField,mySkip,myLimit,jsonp)
				  	}
				  } else if(path=="/dq"){
				  	var myUrl = decodeURIComponent(query.url)
				  	console.log(myUrl)
				  	if(typeof(url)!="undefined"){
				  		self.directQuery(res,jsonp,myUrl)
				  	}
				  } else if(path=="/s"){
				  	if(!query){
				  		self.stat(res,query)
				  	}
				  }else{
					  res.writeHead(200, {'Content-Type': 'text/plain'});
					  res.end("nothing here");
				  }
				}
			  }

// ----------------------------------
// UTILE
var utile	= {
	toJson:function(data){
		try{
 		   return JSON.parse(data);
		} catch(e) {
		   console.log("JSON error : ",e)
		   return "{}";
		}
	}
}

query.query(setting)

// ----------------------------------
// Start the RSS recorder
setInterval(function(){
			query.query(setting)},
			setting.delay)

// Start the RSS provider (server)
http.createServer(
				function(req, res){read.server(req, res)}
				).listen(setting.serverPort);

