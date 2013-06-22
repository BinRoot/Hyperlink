
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

exports.findLink = function(accessType, link, callback) {
    connect( function(db) {
	var collection = db.collection('link');

	var q = {"href": link};
	console.log("finding...");

	if( accessType == "modify" ) {
	    collection.findAndModify(q, null, { $inc: {loads: 1} }, {upsert: true}, function (err, res) {
		db.close();
		console.log('find and modifying ' + res);
		callback(res);
	    });
	}
	else if( accessType == "one" ) {
	    collection.findOne(q, function (err, res) {
		db.close();
		console.log('finding ' + res);
		callback(res);
	    });
	}
	else {
	    db.close();
	    var err = 'ERROR: Incorrect acces type: ' + accessType;
	    console.log(err);
	    callback(err);
	}
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

