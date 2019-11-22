//Katelyn Valles
//CPI310 - Tu-Th

const sqlite3 = require('sqlite3').verbose();
const express = require("express");
var fs = require("fs");
var app = express();
var path = require("path");
const dbPromise = new sqlite3.Database("./mydb.sqlite3");

//app.use(express.urlencoded());

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

//Sign up
app.get("/signup", async (req, res, next) => {

	var signUpSqlCommand = `INSERT INTO user (username, first_name, last_name, date_of_birth, password, email, session_active, is_admin)
	VALUES
	("`+ req.query.username + `","` + req.query.firstname + `","` + req.query.lastname + `","` + req.query.dateofbirth + `","` + req.query.password + `","` + req.query.email + `",` + req.query.sessionactive + `,` + req.query.isadmin + `);`;

	//if username or email already exist, an error is returned.
	db.run(signUpSqlCommand,  (err) => {
		if(err === null)
		{
			res.json({ message: 'signup successful' });
		}
		else {

			console.log({message:err.toString()});
			res.json({message:err.toString()});
			return;
		}
	});

//http://localhost:3000/signup?username=annekate13&firstname=Katelyn&lastname=Valles&dateofbirth=1993-05-31%2010:00:00&password=pwpwpwpw&email=kate@kate.com&sessionactive=0&isadmin=1

});

//Login => user logs in with a username and password

//if username exists but password doesn't work return incorrect password



app.get("/login", async (req, res, next) => {

	var loginString = "SELECT * FROM user WHERE username = '" + req.query.username + "' AND password = '" + req.query.password + "'";

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
				res.json({ message: 'login unsuccessful' });
			}
			else
			{
					res.json({ message: 'login successful' });
			}
		}
	});
});

const setup = async () => {
	//const db = await dbPromise;
	createDb();
	//db.migrate({ force: "last" });
	app.listen(3000, () => {console.log("Server running on port 3000");});
};

setup();
