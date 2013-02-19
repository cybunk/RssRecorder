/*
	# NODE JS script :
	# Read module for rss provider
	# Author : Samuel Huron 
*/

module.exports = {
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