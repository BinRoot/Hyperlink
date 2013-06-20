
var MongoClient = require('mongodb').MongoClient;

// -- exports

exports.upsertLink = function(link, data, callback) {
    connect( function(db) {
	var collection = db.collection('link');

	var sel = {"href": link};

	console.log('updating...');
	collection.update(sel, data, {upsert:true}, function(err, res) {
	    db.close();	
	    callback('done, '+JSON.stringify(res));
	});
    });
}

exports.findLink = function(link, callback) {
    connect( function(db) {
	var collection = db.collection('link');

	var q = {"href": link};
	console.log("finding...");
	collection.findOne(q, function(err, res) {
	    db.close();
	    callback(res);
	});
    });
}

function connect( callback ) {
    MongoClient.connect("mongodb://localhost:27017/test", function(err, db) {
	if(!err) {
	    console.log("We are connected");
	    callback(db);
	}
	else {
	    console.log('could not connect to db, ' + err);
	}
    });
}

