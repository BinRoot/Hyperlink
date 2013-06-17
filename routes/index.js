
/*
 * GET home page.
 */

var checker = require('../check.js');

exports.index = function(req, res){
    if(req.query.q) {
        var site = req.query.q;

        checker.checkURL(site, function(out) {
            res.send(out);
        });
    }
    else {
	res.render('index');
    }

};
