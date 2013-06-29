
var MongoClient = require('mongodb').MongoClient;

// -- exports

exports.upsertLink = function(link, data, callback) {
    connect( function(db) {
	var collection = db.collection('link');

	var sel = {"href": link};

	console.log('updating...');

	collection.findAndModify (
	    sel, [], 
	    data, 
	    {new: true, upsert:true},
	    function(err, res) {
		db.close();
		callback(res);
	    }
	);
    });
}

exports.findLink = function(link, callback) {
    connect( function(db) {
	var collection = db.collection('link');

	var q = {"href": link};
	console.log("finding...");

	collection.findOne(q, function (err, res) {
	    db.close();
	    console.log('finding ' + res);
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
