$(document).ready(function() {
    var urls = [];
    forEachLink( function(i, v) {
	urls.push(v.href);
    });

    console.log(urls);

    var origin = $(location).attr('href');
/*
    $.post('/', { 'data': urls, 'cached': true }, function(data) {
	console.log('cached result: '+JSON.stringify(data));
	colorLinks(data);
    }, "json");
*/
    $.post('/', {'origin': origin, 'data': urls, 'cached': false }, function(data) {
	console.log('fresh result: '+JSON.stringify(data));
	colorLinks(data);
    }, "json");
});

// used by $()
function colorLinks(links) {
    forEachLink( function(i, v) {
	if(links[i]) {
	    var code = links[i].code;
	    if( code == 'ENOTFOUND' ) {
		removeHyperlinkClasses(v);
		$(v).addClass( 'hyperlink-broken' );
	    }
	    else if( code == 404 ) {
		removeHyperlinkClasses(v);
		$(v).addClass( 'hyperlink-404' );
	    }
	}
    });
}

// used by colorsLinks
function removeHyperlinkClasses( v ) {
    $(v).removeClass('hyperlink-404');
    $(v).removeClass('hyperlink-broken');
}

// used by colorLinks and $()
function forEachLink( callback ) {
    $.each( $('a'), function(i, v) {

	// ignore javascript, etc
	if( v.protocol == "http:" ||
	    v.protocol == "https:" ) {

	    // ignore anything that points to http://site.com/#hashtag
	    // TODO: Double check that this works.
	    var hashSplit = v.href.split("#");
	    if( hashSplit.length > 1 && hashSplit[0]==v.baseURI ) {
		// console.log('ignoring '+v.href+' because it contains #');		
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



