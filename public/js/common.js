function sendPostRequest(payLoad,url)
{
  var body = JSON.stringify(payLoad);

  const http = new XMLHttpRequest();
  http.open("POST", url,false);

  http.withCredentials = true;
  http.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  http.send(body);

  if (http.status === 200) {
    console.log(http.responseText); 
    return JSON.parse(http.responseText);
  }
}

function login()
{
  var pw = document.getElementById("passwordTxt").value;
  var usr = document.getElementById("usernameTxt").value;

  var payLoad = {username:usr,password:pw};

  responseText = sendPostRequest(payLoad,'http://localhost:3000/login');

  if(responseText.message != null && responseText.message === "login unsuccessful")
  {
    alert(responseText.message)
  }
  else
  {
    document.cookie = "username="+responseText.username;
    document.cookie = "authToken="+responseText.authToken;
    printUserInfo();
    window.location.href= '/home.html'


  }

}

//log out erases the cookie
function logOut()
{

}

      //signup part
      function signup()
      {
        var usr = document.getElementById("usernameTxt").value;
        var firstname = document.getElementById("firstnameTxt").value;
        var lastname = document.getElementById("lastnameTxt").value; 
        var dob = document.getElementById("birthdayTxt").value;
        var pw = document.getElementById("passwordTxt").value;
        var email = document.getElementById("emailTxt").value;

        var payLoad = {username:usr,firstname:firstname,lastname:lastname,birthday:dob,password:pw,email:email};   
        
        responseText = sendPostRequest(payLoad,'http://localhost:3000/signup');   
        

        //if you sign up with same username or email then send an error
        
        alert(responseText.message.toString());

        window.location.href= '/login.html'

        
      }

  function application()
  {
    //var user = document.getElementById("usernameTxt").value;
    var isEmployed = document.getElementById("employed").selectedIndex;
    var job = document.getElementById("occupationTxt").value; 
    var addr = document.getElementById("addressTxt").value;

    //get username
    var username = getCookie("username");

    //get authToken from cookie
    var authToken = getCookie("authToken");

    var payLoad = {username:username, isEmployed: isEmployed, occupation:job, address: addr, authToken: authToken};

    responseText = sendPostRequest(payLoad,'http://localhost:3000/application');
    
    alert(responseText.message.toString());
  
  }
    
function start()
{

    displayPayPal();

    var username = getCookie("username");
    
     //if they are signed in display their name and hide the signup button
    if(username !== "")
    {
       document.getElementById("loginChange").innerHTML="Hello " + username;
       document.getElementById("signupNav").style.display = "none";

    }

    //if someone is logged out, they can't see the application form

    if(username == "")
    {
          document.getElementById("applicationNav").style.display = "none";
    }
    

}

function displayPayPal() 
{
    var payPalForm = 
    `<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
   <input type="hidden" name="cmd" value="_s-xclick" />
   <input type="hidden" name="hosted_button_id" value="E9KXJZZ98C8R6" />
   <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
   <img alt="" border="0" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1" />
   </form>`;

    document.getElementById("paypalElement").innerHTML = payPalForm;
}

function printUserInfo()
{
  alert("This user is currently logged in (and the info is available in the cookie):\n" + document.cookie);
}














function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}