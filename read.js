/*
	# NODE JS script :
	# Read module for rss provider
	# Author : Samuel Huron 


	//http://127.0.0.1:9616/dq?url=http%3A%2F%2Fen.wikipedia.org%2Fw%2Fapi.php%3Faction%3Dfeaturedfeed%26feed%3Dfeatured%26feedformat%3Datom
*/

module.exports = {
			    url : require("url"),
			    utile:require("./utile.js"),
			    feedparser:require('feedparser'),
			   	request:require('request'),

			    db:null,
			    setting:null,
			    init:function(setting){
			    	this.setting = setting;
					this.db  = require("mongojs").connect(setting.dbName, [setting.dbCollection]);
					return this;
			    },
				stat:function(res,q,sort,field){
					console.log("ici")
					res.end("{error:'in construction'}");
				},
				directQuery:function(res,jsonp,query){					
					var self = this
					console.log(query.url)
					try{
						var url  = decodeURIComponent(query.url)
					}catch(e){
						  self.end(res,"{error:'"+e+"',comment:'decodeURIComponent failed'}",jsonp)
					}
					var q 	 = {}
					q.url 	 = url
					q.headers= {
						'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.57 Safari/537.17',
					   	'Accept-Charset':'ISO-8859-1,utf-8;q=0.7,*;q=0.3',
					   	'Accept-Language':'fr-FR,fr;q=0.8,en-US;q=0.6,en;q=0.4',
					   	'Cache-Control':'no-cache',
					};
					/*
					console.log(q)
					try{
						this.request(q, function (error, response, body) {
						  if (!error && response.statusCode == 200) {
						    //console.log(body) // Print the google web page.
						    self.end(res,"{GotIt:'"+body+"'}",jsonp)
						  }else{
						    self.end(res,"{response:'"+response+"',error:'"+error+"'}",jsonp)
						  }
						})

					}catch(e){
						    self.end(res,"{error:'"+e+"'}",jsonp)
					}
					*/
					
					try{

					this.feedparser.parseUrl(q)
				  			.on('complete', function(e,a){
				  				console.log(e,a)
				  				self.end(res,JSON.stringify(a),jsonp)
				  			}).on('error', function(e){
				  				console.log('error',e)
				  				self.end(res,"{error:'"+e+"'}",jsonp)
				  			});		
				  	} catch(e) {
						self.end(res,"{error:'"+e+"'}",jsonp)
					}	
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
						this.db[this.setting.dbCollection].find(q
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
				  var uri   	= this.url.parse(req.url,true),
				      path  	= uri.pathname,
				   	  query 	= uri.query,
				   	  myQuery   = {},
					  mySort    = {"timeStamp":-1}, // by default serve last element
				  	  myField	= null,
				  	  myLimit 	= 30,
				  	  mySkip 	= 0,
				  	  jsonp		= query.callback,
				  	  self		= this;


				  if(typeof(query.query)!="undefined") myQuery = this.utile.toJson(unescape(query.query))
				  if(typeof(query.sort) !="undefined")  mySort = this.utile.toJson(unescape(query.sort))
				  if(typeof(query.field)!="undefined") myField = this.utile.toJson(unescape(query.field))
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
				  	
				  	console.log(uri)
				  	console.log("q:",query)

				  	if(typeof(query.url)!="undefined" && typeof(query.url)!=""){
				  		self.directQuery(res,jsonp,query)
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