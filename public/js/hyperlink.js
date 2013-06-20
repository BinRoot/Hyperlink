$(document).ready(function() {

    var urls = [];
    forEachLink( function(i, v) {
	urls.push(v.href);
    });

    console.log(urls);

    $.post('/', { 'data': urls }, function(data) {
	console.log(data);
	colorLinks(urls, data);
    }, "json");
});

function colorLinks(urls, responseCodes) {
    forEachLink( function(i, v) {
	var responseCode = responseCodes[i];
	if( responseCode == 'ENOTFOUND' ) {
	    $(v).addClass( 'hyperlink-broken' );
	}
	else if( responseCode == 404 ) {
	    $(v).addClass( 'hyperlink-404' );
	}
    });
}

function forEachLink( callback ) {
    $.each( $('a'), function(i, v) {

	// ignore javascript, etc
	if( v.protocol == "http:" ||
	    v.protocol == "https:" ) {

	    // ignore anything that points to http://site.com/#hashtag
	    // TODO: Double check that this works.
	    var hashSplit = v.href.split("#");
	    if( hashSplit.length > 1 && hashSplit[0]==v.baseURI ) {
		console.log('ignoring '+v.href+' because it contains #');		
	    }
	    else {
		callback(i, v);
	    }

	}
	else {
	    console.log('ignoring '+v.href+' because it is a '+v.protocol+' protocol');
	}

    });
    
}



