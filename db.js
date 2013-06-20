
var MongoClient = require('mongodb').MongoClient;

// -- exports

exports.getLink = function(link, callback) {
    connect( function(success) {
	if(success) {
	    var collection = db.collection('link');
	    
	    var doc = {"href": "http://www.google.com"};
	    
	    collection.insert(doc);
        }
    });
}

function connect( callback ) {
    MongoClient.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
	if(!err) {
	    console.log("We are connected");
	    callback(true);
	}
	else {
	    console.log('could not connect to db, ' + err);
	    callback(false);
	}
    });
}

