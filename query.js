/*
	# NODE JS script :
	# Query module for rss provider
	# Author : Samuel Huron 
*/

module.exports = {
			    url : require("url"),
			    utile:require("./utile.js"),
			    feedparser:require('feedparser'),

			    db:null,
			    setting:null,

			    init:function(setting){
			    	console.log("!!!!!!!!!!!!!!!!!!!!!!!!! initialized")
			    	this.setting = setting;
					this.db  = require("mongojs").connect(this.setting.dbName, [this.setting.dbCollection]);
					return this;
			    },
					receive:function(e,callback){
						// check if exist,if it's not save it 
						var self = this;
						//console.log(this)
						this.db[self.setting.dbCollection].find({guid:e.guid}, 
							function(err,collection){
								if(!err){
									if(collection.length==0){
										callback(self,e)
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
					save:function(self,e){
						e.timeStamp = new Date().getTime()// add timestamp 
						//e._category = category // add category
						//console.log(self)
						self.db[self.setting.dbCollection].save(e,function(err){
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
							var q 	 = {}
							q.url 	 = url
							q.headers= {
								'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.57 Safari/537.17',
							   	'Accept-Charset':'ISO-8859-1,utf-8;q=0.7,*;q=0.3',
							   	'Accept-Language':'fr-FR,fr;q=0.8,en-US;q=0.6,en;q=0.4',
							   	'Cache-Control':'no-cache',
							}
							this.feedparser.parseFile(q)
					  			.on('article', function(e){
					  				console.log(e.title)
					  				self.receive(e,self.save)
					  			});					
						};
					}
				}