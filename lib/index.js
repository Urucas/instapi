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
    login: function(csrfmiddlewaretoken) {
      
      let url = "https://instagram.com/accounts/login/?";
          url+= "force_classic_login";
          url+= "&next=/oauth/authorize/";
          url+= "&client_id="+client_id;
          url+= "&redirect_uri="+redirect_uri;
          url+= "&response_type=code";

      let qs = {
        csrfmiddlewaretoken:csrfmiddlewaretoken,
        username:username, 
        password:password
      }
      console.log("Trying to login");
      request.post({url:url, qs:qs}, function(error, response, body){

        if(error) { 
          console.log(error);
          return;
        }
        if(response.statusCode != 200) { 
          console.log("code no 200");
          return;
        }

        console.log(body);
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
        self.login(token);
      });
      
    } 
  }
}


