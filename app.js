import 'dotenv/config';

import cors from "cors"; //important for cors middleware
import connectDB from './config/dbConn.js';

import express from "express";
const app = express();

import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import path from 'path';
import { logger } from './middleware/logEvents.js';
import errorHandler from './middleware/errorHandler.js';
const PORT = process.env.PORT || 8805;

// custom middleware logger (custom middleware requires the next keyword unlike built-in middleware)
//this whole thing works, but it could be MUCH cleaner
/*
app.use((req, res, next) => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');
  console.log(`${req.method} ${req.path}`);
  next();
});*/
//this does the same thing as that big boy right above by giving all the logic to the logEvents.js middleware
app.use(logger);

// Cross Origin Resource Sharing (needed to not get an error regarding it when pining from another domain)
//app.use(cors()); //just having it like this makes it open to the public so a whitelist must be made for just a few trusted domains
const whitelist = ['https://www.yoursite.com', 'http://127.0.0.1:5500', 'http://localhost:8805']; //localhost (127 and localhost) are just there during dev, once publishing you only leave your front-end able to access
const corsOptions = {
  origin: (origin, callback) => {       // !origin is only DURING dev since otherwise we can't access our ownbackend
    if (whitelist.indexOf(origin) !== -1 || !origin) { //if domain accessing api is inside whitelist show null for error and permit it through
      callback(null, true)
    } else {
      callback(new Error('Not allowed by all mighty CORS'));
    }
  },
  optionsSuccessStatus: 200
} //pass options made in above options object
app.use(cors(corsOptions));

//built-in middleware to handle urlencoded data
//in other words, form data:
//'content-type: application/x-www-form-urlencoded'
//allows you to pull data out as parameters when data comes in as a form filled out by user
app.use(express.urlencoded({ extended: false }));

//built-in middleware for handling json (applied to all routes)
app.use(express.json());

//built-in middleware to serve static files by having you put them in the public dir, 
//  making them publicly available to those viewing (put css files, images, text documents, etc.)
app.use(express.static(path.join(__dirname, '/public')));

//express permits REGEX in the routing so you can specify many more options per get
app.get('^/$|/index(.html)?', (req, res)=>{
  //res.json("Hello this is the backend");
  //same thing, just two different methods (path.join is cooler)
  //res.sendFile('./views/index.html', {root: __dirname});
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});
app.get("/accounts(.html)?", (req, res)=>{
  res.sendFile(path.join(__dirname, 'views', 'accounts.html'));
});
//handling redirects with express is easy as pie
app.get("/old-accounts(.html)?", (req, res)=>{
  //specified as first arg 301 for custom return message
  res.redirect(301, '/accounts.html'); //302 by default is sent, problem cause we want a 301 to be sent for perminent redirect
});

// Route Handlers
// you can chain handlers so if one page wasn't found, it can then call the next() command and take you to the next option
app.get('/hello(.html)?', (req, res, next) => {
  console.log('attempted to load hello.html');
  next();
  //occassionally you'll see the very next one right away, but it isn't necessary
}, (req, res) => {
  res.send('Hello World!');
})

//More realistic route chaining
const one = (req, res, next) => {
  console.log('one');
  next();
}
//goes next
const two = (req, res, next) => {
  console.log('the second');
  next();
}
//until it reaches a function with no next parameter
const three = (req, res) => {
  console.log(`third time's a lucky charm!`);
  res.send('Luck be on your side m8!');
}
//here the route chains together the three functions up above
app.get('/knife(.html)?', [one, two, three]);
//this route chaining is very similar to what middleware is
//middleware is really anything that is between the route requests and the route response. The chaining that was done above was basically middleware.
//three types of middleware, built-in, custom, and third-party


//app.all is used by routing while app.use is usually used by middleware
//next.js handles these like a waterfall, so here we put our catch all at the end if none of the others were chosen
app.all('*', (req, res) => {
  //express can automatically send a 404 if a link isn't found, but here we specify a specific file for the 404
    //issue is, if we provide a file, then it'll just return a 200 code so we need to chain in a status
  res.status(404); //following if else waterfall allows us to have more specific responses to various 404 requests
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html')); //we send html file here
  } else if (req.accepts('json')) {
    res.json({ error: "404 Not Found" }); //original request was a json type so we just respond in json instead of html
  } else {
    res.type('txt').send("404 Not Found"); //return a text type that says the same thing the json response says
  }
});

app.get("/account", (req, res)=>{
  const q = 'SELECT * FROM account';
  connectDB.query(q,(err,data)=>{
    if(err) return res.json(err);
    return res.json(data);
  })
})

app.post("/account", (req,res)=>{
  const q = "INSERT INTO account (`email`, `password`, `accountTypeID`) VALUES (?)";
  const values = [ 
    req.body.email,
    req.body.password,
    req.body.accountTypeID
  ];

  connectDB.query(q,[values], (err, data)=>{
    if(err) return res.json(err);
    return res.json('Account added successfully');
  })
})


//nextjs does a lot of error handling for us, but here we do some of our own to spite it
//similar to earlier, this is the big bulky version of custom middleware, but it can be make sleeker...
/*
app.use(function (err, req, res, next){
  console.error(err.stack);
  res.status(500).send(err.message);
})
*/
app.use(errorHandler);

app.listen(PORT, ()=>{
  console.log(`You're Connected to the backend on port ${PORT}`);
});
