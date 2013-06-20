
/*
 * GET and POST home page.
 */

var checker = require('../check.js');
var db = require('../db.js');

exports.index = function(req, res) {

    if (req.route.method == 'post') {
	var sites = req.body.data;
	var cached = req.body.cached;
	
	if(cached == 'true') {
	    checker.checkCachedURLs(sites, function(out) {
		res.send(out);
	    });
	}
	else {
	    checker.checkURLs(sites, function(out) {
		res.send(out);
	    });
	}
    }
    else if (req.route.method == 'get'){
	if(req.query.q) {
            var site = req.query.q;

            checker.checkURL(site, function(out) {
		res.send(out);
            });
	}
	else if(req.query.Q) { // for testing
	    var sites = req.query.Q.split(',');
	    checker.checkURLs(sites, function(out) {
		res.send(out);
	    });
	}
	else {
	    res.render('index');
	}
    }

};

exports.test = function(req, res) {
    if(req.route.method == 'get') {
	if(req.query.a) {
	    db.upsertLink('http://www.reddit.com', {$set: {spam:false}}, function(out) {
		res.send(out);
	    });
	}
	else if(req.query.b) {
	    db.findLink('http://www.reddit.com', function(out) {
		res.send(out);
	    });
	}
	else {
	    res.render('test');
	}
    }
}
