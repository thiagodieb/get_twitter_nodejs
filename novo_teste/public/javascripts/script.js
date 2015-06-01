jQuery(document).ready(function(){
 
 	jQuery("ul.nav.nav-tabs > li:first").addClass("active");
 	jQuery("div.tab-pane:first").addClass("active");
	//console.log(twet);

	jQuery("a.action").click(function(){
		var type = jQuery("table.table").attr("id");
		var value = jQuery(this).attr("value");
		console.log(value);
		var action 
		if(jQuery(this).hasClass("click_edit")){
			action = '/admin/'+type+'/edit/'+value;
		}else if(jQuery(this).hasClass("click_remove")){
			action = '/admin/'+type+'/delete/'+value;
		}
		console.log(action);
		if(undefined != action) window.location.href = action;
	});


	jQuery("div#modal > div.modal-footer > a.btn-close").click(function(){
		jQuery("div#modal").modal('hide');
	});
	jQuery("div#modal > div.modal-footer > a.btn-primary").click(function(){
		jQuery("div#modal").modal('hide');
		jQuery("a.action.click_remove").click();
	});

});
