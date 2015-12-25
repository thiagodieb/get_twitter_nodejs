
var myApp;
myApp = myApp || (function () {

    return {
        showPleaseWait: function() {
            $(this.getBase()).modal('toggle');
        },
        hideModal: function () {
            $("#pleaseWaitDialog").modal('hide');
        },
        showModal:function (h,m){
            msg = m;
            header = h;
            $(this.getBase(h,m)).modal('toggle');
        },
        getBase: function(header,msg){

          if(header == undefined)
            header = '<h1>Processando...</h1>';

            header='<button class="close" data-dismiss="modal">×</button>'+header;

          if(msg == undefined)
            msg = '<div class="progress progress-striped active"><div class="bar" style="width: 100%;"></div></div>';

          var pleaseWaitDiv = '<div class="modal hide" id="pleaseWaitDialog" data-backdrop="static" data-keyboard="false"><div class="modal-header">'+header+'</div><div class="modal-body">'+msg+'</div></div>';
          return pleaseWaitDiv;
        }

    };
})();
