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

exports.checkURL = function(url, callback) {
    urlExists(url, function(err, res) {
	callback(res);
    });
}

exports.checkURLs = function(urls, callback) {
    console.log('check: checking fresh '+JSON.stringify(urls));
    var asyncFunctions = [];
    for(var i=0; i<urls.length; i++) {
	asyncFunctions.push( urlExists.curry(urls[i]) );
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

function urlExists(url, callback) {
    var uri = urlParser.parse(url);
    var options = {
        host: uri.host,
        path: uri.path
    };

    var protocol = http;
    if(uri.protocol == 'https:') {
	protocol = https;
    }

    // TODO: what about https?
    protocol.request(options, function(response) {
	var dataRec = false;
	response.on('data', function (chunk) {
	    if(!dataRec) {
		updateDb(url, response.statusCode, callback);
	    }
	    dataRec = true;
        });
	response.on('end', function () {
	    if(!dataRec) {
		updateDb(url, response.statusCode, callback);
	    }
	} );
    }).on('error', function(e) {
	updateDb(url, e.code, callback);
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
	score: link.score
    };
}

function updateDb(url, statusCode, callback) {
    var updateData = {
	$set: {code: statusCode},
	$inc: {score: 1}
    };
    db.upsertLink(url, updateData, function(out) {
	callback(null, simplifyLinkJSON(out));
    });
}
