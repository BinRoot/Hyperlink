console.log("works");

var links = $('a');
for(var i=0; i < links.size(); i++) {
    var link = links[i];
    if (link.getAttribute('class') == 'hyperlink-blocked') {
	$(link).html('<s>' + $(link).html() + '</s>');
    }
}
