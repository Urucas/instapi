// es6 runtime requirements
require('babel/polyfill');
import request from 'request';
import htmlparser from 'htmlparser';

export default function instapi({
  client_id,
  redirect_uri = "app://authorize",
  username,
  password
}){
  return {
    login: function(url, csrfmiddlewaretoken, cookies) {
      
      console.log("\r\n\r\nTrying to login\r\n");
      let qs = {
        csrfmiddlewaretoken:csrfmiddlewaretoken,
        username:username, 
        password:password
      }
     
      let jar = request.jar();
      for(let i=0; i<cookies.length;i++) {
        let cookie = request.cookie(cookies[i]);
        jar.setCookie(cookie, "instagram.com");
      }

      request.post({url:url, form:qs, jar:jar }, function(error, response, body){

        if(error) { 
          console.log(error);
          return;
        }
        console.log(body);
        
        if(response.statusCode != 200) { 
          console.log("code no 200");
          return;
        }

      }); 
    },

    authorize: function() {
      
      /*
      $.ajax({
        url:"/oauth/authorize/?client_id=694958f6f3a74a419abd9dd7dfce9f8f&redirect_uri=app://authorize&response_type=code", 
        type:"POST",
        data:{
          "csrfmiddlewaretoken":"76ec497043d70ffa0f78458f15b8b7c0",
          "allow":"Authorize"
        }, 
        success: function(response){ console.log(response); } 
      });
      */
    },

    auth: function() {
      let url = "https://api.instagram.com/oauth/authorize/";
      let qs  = {
        client_id: client_id,
        redirect_uri: redirect_uri,
        response_type: "code"
      }
      let self = this;
      console.log("Getting authorize");

      var j = request.jar();
      console.log(url);
      // request.debug = true;
      request.get({url:url, qs:qs}, function(error, response, body){
        if(error) { 
          console.log(error);
          return;
        }
        if(response.statusCode != 200) { 
          console.log("code no 200");
          return;
        }
        
        //console.log(body);
        var re = /<input type\=\"hidden\" name\=\"csrfmiddlewaretoken\" value\=\"[\d\w]+\"\/>/ig;
        var token = re.exec(body)[0].split("value")[1].replace(/[\=\"\/>]/ig, "");

        var re = /<form method\=\"POST\" id\=\"login-form\" class\=\"adjacent\" action\=\"[\d\w\/\?\=\&\;\%]+\">/;
        var url = re.exec(body)[0].split("action")[1];
            url = url.replace(/^\=\"/, "");
            url = url.replace(/\">$/,"");
            url = "http://instagram.com"+url;

        var res = response.toJSON();
        var cookies = res.headers["set-cookie"];
        self.login(url, token, cookies);
      });
      
    } 
  }
}


