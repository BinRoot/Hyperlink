var http = require('http');
var https = require('https');
var async = require('async');

var urlParser = require('url');

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
    var uri = urlParser.parse(url);
    var options = {
        host: uri.host,
        path: uri.path
    };

    http.request(options, function(response) {
        var str = '';

        //another chunk of data has been recieved, so append it to `str`                                                                                                        
        response.on('data', function (chunk) {
            str += chunk;
        });

        //the whole response has been recieved, so we just print it out here                                                                                                    
        response.on('end', function () {
            console.log(str);
            callback(null, str);
        });
    }).on('error', function(e){
        callback(null, e.code);
    }).end();
}


