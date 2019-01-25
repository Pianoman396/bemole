(function() {
    var request;
    window.Async = function() {
        return {
            ready: function() {
                try {
                    // Opera, Firefox, Safari
                    request = new XMLHttpRequest();
                } catch (e) {
                    // Internet Explorer Browsers
                    try {
                        request = new ActiveXObject("Msxml2.XMLHTTP");
                    } catch (e) {
                        try {
                            request = new ActiveXObject("Microsoft.XMLHTTP");
                        } catch (e) {
                            // Something went wrong
                            alert("Your browser is old, recomend update it!");
                            return false;
                        }
                    }
                }
                //request = new XMLHttpRequest() || ActiveXObject("Msxml2.XMLHTTP") || ActiveXObject("Microsoft.XMLHTTP");
            },
            start: function(method, to, bool) {
                // const request = new XMLHttpRequest();
                request.open(method, to, bool);
            },
            contentType: function(app = null) {
                // request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                request.setRequestHeader("Content-type", app === null ? "application/x-www-form-urlencoded" : app);
                // request.setRequestHeader("Connection", "close");
            },
            sending: function(content = null) {
                request.send(content === null ? null : content);
                return;
            },
            response: function(where = null, callback, bool = true) {
                let sec = document.querySelector(where);
                request.onreadystatechange = function() {
                    if(request.readyState < 4 && request.status < 200){
                       sec.innerHTML = "Loading...";
                    }

                    if (request.readyState == 4 && request.status == 200) {
                       if(sec !== null) {
                          sec.innerHTML += request.responseText;
                       }
                       if(!bool){
                          sec.innerHTML = request.responseText;
                       }

                       if(callback) callback(request.responseText);

                       return;

                    }
                }
            },
            get_json: function(callback) {
            	console.log('responseText:' + request.responseText);
                request.onreadystatechange = function() {
                    // if (request.readyState < 4 && request.status < 200) {
                    //     sec.innerHTML = "Loading...";
                    // }
                    if (request.readyState === 4 && request.status === 200) {
                        try {
                            var data = JSON.parse(request.responseText);
                        } catch (err) {
                            console.log(err.message + " in " + request.responseText);
                            return;
                        }
                        callback(data);
                    }
                }

            } //end get_json
        };
    };
}());
const async = Async();

/* example Usage response callback
      async.ready();
      async.start("POST","routers/rout.php",true);
      async.contentType();
      async.sending(`log_u_e=${usr_data.usr_e}&log_u_p=${usr_data.usr_p}`);
      async.response(null, getResult);

      function getResult(arg) {
        if(arg === "ok"){
          window.location.href = "users.php";
        }else{
          console.log(" location.href cant doing becouse don't have valid response");
        }
      }

*/
window.addEventListener("load", function() {

    const btn_send = document.querySelector(".send");
    // const init = {
    //     create: "1",
    //     read: "1",
    //     user: `${user}`,
    //     email: `${email}`,
    //     pass: `${pass}`,
    //     comment: `${comment}`
    // };

    btn_send.addEventListener("click", function(e) {
        e.preventDefault();

        // Ajax Example ******************

        // async.ready();
        // async.start("POST", "rout.php", true); //data.php?title=asd&link=asd
        // async.contentType();
        // async.response(".response");//create=${init.create}&read=${init.read}&
        // async.sending(`name=${init.user}&email=${init.email}&pass=${init.pass}&comment=${init.comment}`);//`create=${init.create}&read=${init.read}`


       // Json Example ********************

        async.ready();
        async.start("GET", "data.json", true);
        async.contentType("application/json");
        // async.response(".response");
        async.get_json(function(data) {
            var html = "<h2>" + data["title"] + "</h2>";
            html += "<h3>" + data["description"] + "</h3>";
            html += "<ul>";
            for (var i = 0; i < data["articles"].length; i++) {
                html += '<li><a href="' + data["articles"][i]["url"] + '">' + data["articles"][i]["title"] + "</a></li>";
            }
            html += "</ul>";
            document.querySelector(".response").innerHTML = html;
        });
        async.sending();


    });

});
