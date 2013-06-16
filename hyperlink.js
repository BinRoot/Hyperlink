$(document).ready(function(){
	$("a[href]").each(function(index, value){
		console.log(value.href)
		if ($(this).attr('class') == 'hyperlink-blocked') {
			$(this).html('<s>' + $(this).html() + '</s>');
		}
	});
});
