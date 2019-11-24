//Katelyn Valles
//CPI310 - Tu-Th

const sqlite3 = require('sqlite3').verbose();
const express = require("express");
var cors = require('cors');
var http = require('http');
var fs = require("fs");
var app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//new code added
//const exphbs = require("express-handlebars");

var path = require("path");
//app.use(express.static(path.join(__dirname, '/public')));
//enable cors
app.use(cors());
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
  });

app.use(express.static('public'))
app.use(express.urlencoded());
const dbPromise = new sqlite3.Database("./mydb.sqlite3");
app.use(bodyParser.urlencoded({extended: false}))
//app.set("view engine", "handlebars");
//app.engine("handlebars", exphbs());

//creates a new empty instance of a sqlite database
var db;

async function createDb()
{
	db = await dbPromise;
	//checks if the database has been created without error
	console.log('Database created!');

	/* Put code to create tables(s) here */
	//Read seedScripts.txt file into dbSeedString variable as a string
	var dbSeedString = fs.readFileSync(path.resolve(__dirname, "./seedScripts.txt"),'utf8');
	db.exec(dbSeedString);
	console.log("The seedscript created the database and the values");
	//db.close();
	/*db.each("SELECT * from user", function(err,row){
         console.log(row.id + ": " + row.username);
			});
			*/
}

function stringToHash(string) { 
	var hash = 0; 
	if (string.length == 0) return hash; 
	for (i = 0; i < string.length; i++) { 
		char = string.charCodeAt(i); 
		hash = ((hash << 5) - hash) + char; 
		hash = hash & hash; 
	} 
	return String(hash); 
} 

function generateAuthToken(length) {
	var result           = '';
	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
	   result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
 }

//need the get request to have the forms show on the website
/*
 app.get("/signup",function(req,res){
    res.render("signup.handlebars");
});

//need the get request to have the forms show on the website
app.get("/home",function(req,res){
    res.render("home.handlebars");
});
*/


//Sign up
app.post("/signup", function(req,res) {
	var{ username, first_name , last_name, date_of_birth, password, email } = req.body;

	console.log(password)
	//turn password to hash version of itself
	password = stringToHash(password);
	console.log(password);

	var signUpSqlCommand = `INSERT INTO user (username, first_name, last_name, date_of_birth, password, email)
	VALUES
	("`+ username + `","` + first_name + `","` + last_name + `","` + date_of_birth + `","` + password + `","` + email + `");`;

	//if username or email already exist, an error is returned.
	db.run(signUpSqlCommand,  (err) => {
		if(err === null)
		{
			//res.json({ message: 'signup successful' });
			//res.redirect("/home");
			//window.location = 'localhost:3000/home'
			return res.send(JSON.stringify({message:'Signup successful.'}));
		}
		else {
			console.log({message:err.toString()});
			return res.send(JSON.stringify({ error: err.toString()}));
		}
	});

});

//if username exists but password doesn't work return incorrect password

//need the get request to have the forms show on the website

app.post('/login', function (req, res) {
//http://localhost:3000/login?username=felix12&password=felixfelix
console.log(req.body);
	var{ username, password } = req.body;
	password = stringToHash(password);
	var loginString = "SELECT * FROM user WHERE username = '" + username + "' AND password = '" + password + "'";

	//run login command
	db.get(loginString,  function(err, row){
		if(err !== null) //if there is an error, print it out
		{
			console.log(err);
		
		}
		else //if there is no error check the result
		{
			if(typeof row === 'undefined')
			{
				res.send({ message: 'login unsuccessful' });
			}
			else
			{
					authToken = generateAuthToken(10);
					var authTokenUpdateQuery = "UPDATE user SET authToken = '"+authToken+"' WHERE username = '"+username+"' AND password = '" + password;
					res.send(JSON.stringify({ message: 'login successful', authToken: authToken, username: username}));
					//console.log(successful);
			}
		}
	});
});

/*
app.get("/login",function(req,res){
    res.render("login.handlebars");
});
*/


const setup = async () => {
	//const db = await dbPromise;
	createDb();
	//db.migrate({ force: "last" });
	app.listen(3000, () => {console.log("Server running on port 3000");});
};

setup();
