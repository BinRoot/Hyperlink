var http = require('http');
var https = require('https');
var async = require('async');

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

// -- helper functions

function urlExists(url, callback) {
    console.log('checking '+url);
    var protocol = http;
    if(url.startsWith('https')) {
	protocol = https;
    }

    protocol.get(url, function(res) {
	callback(null, res.statusCode);
    }).on('error', function(e) {
	callback(null, e.code);
    });
}


