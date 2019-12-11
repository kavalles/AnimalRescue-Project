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
function logout()
{
	document.cookie = ""
	document.cookie = "username=" + "";
	document.cookie = "authToken=" + "";
	location.replace('/home.html');


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
		  document.getElementById("volunteerNav").style.display = "none";
		  document.getElementById("logoutNav").style.display = "none";
    }
}

function volunteer()
{
  alert("Application has been submitted. You will hear from us soon!");
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
  alert("This user is now logged in");
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

function sendMail(subject, body){
  var address = "FreedomTailsRescue@gmail.com"
  var mailto_link = 'mailto:' + address + '?subject=' + subject + '&body=' + body;

  win = window.open(mailto_link, 'emailWindow');

}

(function() {
	
	function Slideshow( element ) {
		this.el = document.querySelector( element );
		this.init();
	}
	
	Slideshow.prototype = {
		init: function() {
			this.wrapper = this.el.querySelector( ".slider-wrapper" );
			this.slides = this.el.querySelectorAll( ".slide" );
			this.previous = this.el.querySelector( ".slider-previous" );
			this.next = this.el.querySelector( ".slider-next" );
			this.index = 0;
			this.total = this.slides.length;
			this.timer = null;
			
			this.action();
			this.stopStart();	
		},
		_slideTo: function( slide ) {
			var currentSlide = this.slides[slide];
			currentSlide.style.opacity = 1;
			
			for( var i = 0; i < this.slides.length; i++ ) {
				var slide = this.slides[i];
				if( slide !== currentSlide ) {
					slide.style.opacity = 0;
				}
			}
		},
		action: function() {
			var self = this;
			self.timer = setInterval(function() {
				self.index++;
				if( self.index == self.slides.length ) {
					self.index = 0;
				}
				self._slideTo( self.index );
				
			}, 3000);
		},
		stopStart: function() {
			var self = this;
			self.el.addEventListener( "mouseover", function() {
				clearInterval( self.timer );
				self.timer = null;
				
			}, false);
			self.el.addEventListener( "mouseout", function() {
				self.action();
				
			}, false);
		}
		
		
	};
	
	document.addEventListener( "DOMContentLoaded", function() {
		
		var slider = new Slideshow( "#main-slider" );
		
	});
	
	
})();
