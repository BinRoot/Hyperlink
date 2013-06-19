$(document).ready(function() {

    var urls = [];
    $.each( $('a'), function(i, v) {
	urls.push(v.href);
    });

    console.log(urls);

    $.post('/', { 'data': urls }, function(data) {
	console.log(data);
	colorLinks(urls, data);
    }, "json");
});

function colorLinks(urls, responseCodes) {
    $.each( $('a'), function(i, v) {
	var responseCode = responseCodes[i];
	if( responseCode == 'ENOTFOUND' ) {
	    $(v).addClass( 'hyperlink-broken' );
	}
	else if( responseCode == 404 ) {
	    $(v).addClass( 'hyperlink-404' );
	}

    });
}

function forEachUsefulLink( callback ) {
    $.each( $('a'), function(i, v) {

	// ignore javascript, etc
	if( v.protocol == "http:" ||
	    v.protocol == "https:" ) {

	    // ignore anything that points to http://site.com/#hashtag
	    if( v.href .contains( v.baseURI ) == -1 ) {

		callback(i, v);				    

	    }

	}

    });
    
}



