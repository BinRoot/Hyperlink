var http = require('follow-redirects').http;
var https = require('follow-redirects').https;
var async = require('async');

var urlParser = require('url');

var db = require('./db.js');

// -- customizing javascript

function toArray(enumm) {
    return Array.prototype.slice.call(enumm);
}

Function.prototype.curry = function() {
    if (arguments.length<1) {
        return this; //nothing to curry with - return function
    }
    var __method = this;
    var args = toArray(arguments);
    return function() {
        return __method.apply(this, args.concat(toArray(arguments)));
    }
}

if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function (str){
	return this.slice(0, str.length) == str;
    };
}

// -- exports

exports.checkURL = function(origin, url, callback) {
    urlExists(origin, url, function(err, res) {
	callback(res);
    });
}

exports.checkURLs = function(origin, urls, callback) {
    console.log('check: checking fresh '+JSON.stringify(urls));
    var asyncFunctions = [];
    for(var i=0; i<urls.length; i++) {
	asyncFunctions.push( urlExists.curry(origin, urls[i]) );
    }

    async.parallel(asyncFunctions,
		   function(err, results) {
		       console.log('check: got results: '+JSON.stringify(results));
		       callback(results);
		   });
}

exports.checkCachedURLs = function(urls, callback) {
    console.log('check: checking cache for '+JSON.stringify(urls));
    var asyncFunctions = [];
    for(var i=0; i<urls.length; i++) {
	asyncFunctions.push( cachedUrlExists.curry(urls[i]) );
    }

    async.parallel(asyncFunctions,
		   function(err, results) {
		       console.log('check: got cached results: '+JSON.stringify(results));
		       callback(results);
		   });
}

// -- helper functions

var dataRecDict = {};

function urlExists(origin, url, callback) {
    var uri = urlParser.parse(url);
    var options = {
        host: uri.host,
        path: uri.path
    };

    var protocol = http;
    if(uri.protocol == 'https:') {
	protocol = https;
    }

    dataRecDict[url] = 1;
    protocol.request(options, function(response) {
	response.on('data', function (chunk) {
	    if(dataRecDict[url] == 1) {
		delete dataRecDict[url];
		console.log('check: fresh result for '+url+' -> ' + response.statusCode);
		updateDb(origin, url, response.statusCode, callback);
	    }
        });
	response.on('end', function () {
	    if(dataRecDict[url] == 1) {
		delete dataRecDict[url];
		console.log('check: fresh result for '+url+' -> ' + response.statusCode);
		updateDb(origin, url, response.statusCode, callback);
	    }
	});
    }).on('error', function(e) {
	delete dataRecDict[url];
	console.log('check: fresh result for '+url+' -> ' + e.code);
	updateDb(origin, url, e.code, callback);
    }).end();
}

function cachedUrlExists(url, callback) {
    db.findLink(url, function(res) {
	if(res) {
	    callback(null, simplifyLinkJSON(res));
	}
	else {
	    callback(null, {});
	}
    });
}

function simplifyLinkJSON(link) {
    return {
	href:  link.href,
	code:  link.code,
	shows: link.shows
    };
}

function updateDb(origin, url, statusCode, callback) {
    var updateData = {
	$set: {code: statusCode},
	$inc: {shows: 1}
    };

    db.upsertLink(url, updateData, function(out) {
	if(out.origins) {
	    var found = false;
	    var freq = -1;
	    for(var i=0; i<out.origins.length; i++) {
		if(out.origins[i].url == origin) {
		    found = true;
		    freq = out.origins[i].freq + 1;
		    break;
		}
	    }

	    if( found == true ) {
		console.log('check: incrementing origin');
		// update this item
		
		db.updateOrigin(url, origin, {
		    $set: {
			'origins.$.freq': freq
		    }
		});
	    } 
	    else {
		console.log('check: appending origin');
		// upsert object to list
		db.upsertOrigin(url, {
		    $push: {
			origins: {
			    url: origin,
			    freq: 1
			}
		    }
		});

	    }
	} 
	else {
	    console.log('check: creating origin');
	    // upsert object to list
	    db.upsertOrigin(url, {
		$push: {
		    origins: {
			url: origin,
			freq: 1
		    }
		}
	    });
	}

	callback(null, simplifyLinkJSON(out));
    });
}
