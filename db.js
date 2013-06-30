
var MongoClient = require('mongodb').MongoClient;

// -- exports

exports.upsertLink = function(link, data, callback) {
    connect( function(db) {
	var collection = db.collection('link');

	var sel = {"href": link};

	console.log('db: updating '+link);

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

exports.upsertOrigin = function(link, data) {
    connect( function(db) {
	var collection = db.collection('link');
	
	var sel = {"href": link};

	collection.update(sel, data, {upsert: true, w:0});
	db.close();
    });
}

exports.updateOrigin = function(link, origin, data) {
    connect( function(db) {
	var collection = db.collection('link');
	
	var sel = {"href": link, "origins.url": origin };

	collection.update(sel, data, {upsert: true, w:0});
	db.close();
    });
}


exports.findLink = function(link, callback) {
    connect( function(db) {
	var collection = db.collection('link');

	var q = {"href": link};
	console.log("db: finding "+link);

	collection.findOne(q, function (err, res) {
	    db.close();
	    if(res) {
		console.log("db: not found "+link);
	    }
	    else {
		console.log("db: found "+link);
	    }
	    callback(res);
	});

    });
}

function connect( callback ) {
    MongoClient.connect("mongodb://localhost:27017/test", function(err, db) {
	if(!err) {
	    console.log("db: We are connected");
	    callback(db);
	}
	else {
	    console.log('db: could not connect, ' + err);
	}
    });
}
