var http = require('http');
var https = require('https');
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
    console.log('searching for '+JSON.stringify(urls));
    var asyncFunctions = [];
    for(var i=0; i<urls.length; i++) {
	console.log('pushing '+urls[i]);
	asyncFunctions.push( urlExists.curry(urls[i]) );
    }

    async.parallel(asyncFunctions,
		   function(err, results) {
		       console.log('got results: '+results);
		       callback(results);
		   });
}

exports.checkCachedURLs = function(urls, callback) {
    console.log('searching for '+JSON.stringify(urls));
    var asyncFunctions = [];
    for(var i=0; i<urls.length; i++) {
	console.log('pushing '+urls[i]);
	asyncFunctions.push( cachedUrlExists.curry(urls[i]) );
    }

    async.parallel(asyncFunctions,
		   function(err, results) {
		       console.log('got results: '+results);
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

    http.request(options, function(response) {
	var dataRec = false;
	response.on('data', function (chunk) {
	    if(!dataRec) {
		var updateData = {$set: {statusCode: response.statusCode}};
		db.upsertLink(url, updateData, function(out) {
		    callback(null, response.statusCode);		    
		});
	    }
	    dataRec = true;
        });

	response.on('end', function () {
	    if(!dataRec) {
		var updateData = {$set: {statusCode: response.statusCode}};
		db.upsertLink(url, updateData, function(out) {
		    callback(null, response.statusCode);		    
		});
	    }
	} );

    }).on('error', function(e){
	var updateData = {$set: {statusCode: e.code}};
	db.upsertLink(url, updateData, function(out) {
	    callback(null, e.code);
	});
    }).end();
}


function cachedUrlExists(url, callback) {
    db.findLink(url, function(res) {
	if(res) {
	    callback(null, res.statusCode);
	}
	else {
	    callback(null, -1);
	}
    });
}


