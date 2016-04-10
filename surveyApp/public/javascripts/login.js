$(document).ready(function(){
    $("#login").click(function(){
        var user = $("#username").val();
        var password = $("#password").val();
        
        if( user =='' || password ==''){
            //if fields are blank
            $('input[type="text"],input[type="password"]').css("border","2px solid red");
            $('input[type="text"],input[type="password"]').css("box-shadow","0 0 3px red");
            w2popup.open({
                title: 'Something went wrong',
                body: '<div class="w2ui-centered">Either the user or the password were not filled out</div>',
                buttons: '<button class="btn" onclick="w2popup.close();">Close</button> '
            });
        }else {
            $.post("/login",{ user: user, password : password},
            function(data) {
                if(data.status == 'error') {
                    $('input[type="text"]').css({"border":"2px solid red","box-shadow":"0 0 3px red"});
                    $('input[type="password"]').css({"border":"2px solid #00F5FF","box-shadow":"0 0 5px #00F5FF"});
                    console.log(data);
                    w2popup.open({
                        title: 'Something went wrong',
                        body: '<div class="w2ui-centered">' + data.message +'</div>',
                        buttons: '<button class="btn" onclick="w2popup.close();">Close</button> '
                    });
                } else if(data.status =='success'){
                    $("form")[0].reset();
                    $('input[type="text"],input[type="password"]').css({"border":"2px solid #00F5FF","box-shadow":"0 0 5px #00F5FF"});
                    console.log(data);
                }
            });
        }
    });
});