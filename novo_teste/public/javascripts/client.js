jQuery(document).ready(function(){
	
	var socket = io.connect("http://localhost:3100"); 

	socket.on('twetts', function (data) {
		
		jQuery(data.terms).each(function(i,n){
			id = data.terms[i];
			createAlert(id);
			twett = '<tr class="hide"><td>'+data.user+'</td><td>'+data.text+'</td><td>'+data.date+'</td></tr>';
		    selection = '#'+id +' > table.table > tbody:last';
		    //console.log(selection);
	 		jQuery(selection).prepend(twett);	

		});

	});
});


var count_tweets = new Array();

function createAlert(id){

	console.log(count_tweets[id]);

	elementAlert ='<div class="alert alert-info"><button type="button" class="close" data-dismiss="alert">&times;</button><a class="display_tweets"><b>News tweets!</b>    (<span class="count_tweets">1</span>)</a></div>';
	idDiv = "div#"+id;
//	console.log(jQuery(id));
	if(jQuery(idDiv+" > div.alert").length == 0 ){
		jQuery(idDiv+" > h1").after(elementAlert);	
		count_tweets[id] = 1;
	}else{
		count_tweets[id]++;
		jQuery(idDiv).find("span.count_tweets").html(count_tweets[id]);
	}

	jQuery("a.display_tweets").click(function(){
		elementoDiv = jQuery(this).parent().parent();
		jQuery(elementoDiv).find("tr.alert").removeClass("alert");
		jQuery(elementoDiv).find("tr.hide").removeClass("hide").addClass("alert");
		jQuery(this).parent().find("button.close").click();
		count_tweets[id] = 1;
	});
}
