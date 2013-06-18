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




