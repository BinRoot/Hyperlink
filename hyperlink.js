$(document).ready(function(){
	$("a[href]").each(function(index, value){
		console.log(value.href)
		$(this).css('color', '#25E01B');
	});
});