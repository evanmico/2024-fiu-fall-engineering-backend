import 'dotenv/config';

import cors from "cors";
import connectDB from './config/dbConn.js';

import express from "express";
const app = express();

import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import path from 'path';
const PORT = process.env.PORT || 8805;

app.use(express.json());
app.use(cors())

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

//next.js handles these like a waterfall, so here we put our catch all at the end if none of the others were chosen
app.get('/*', (req, res) => {
  //express can automatically send a 404 if a link isn't found, but here we specify a specific file for the 404
    //issue is, if we provide a file, then it'll just return a 200 code so we need to chain in a status
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
})

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

app.listen(PORT, ()=>{
  console.log(`You're Connected to the backend on port ${PORT}`);
});
