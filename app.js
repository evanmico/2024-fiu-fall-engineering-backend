import 'dotenv/config';
import express from "express";
import cors from "cors";
import connectDB from './config/dbConn.js';

import http from 'http';
import path from 'path';
import fs from 'fs';
import fsPromises from "fs/promises";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import logEvents from './logEvents.js';
import EventEmitter from 'events';
import { log } from 'console';
class MyEmitter extends EventEmitter {};
//initialize object
const myEmitter = new MyEmitter();
//myEmitter.on('log', (msg) => logEvents(msg));
//Emit event
//myEmitter.emit('log', 'Log event emitted!');

const PORT = process.env.PORT || 3500;

const server = http.createServer((req, res) => {
  console.log(req.url, req.method);

  const extension = path.extname(req.url);
  let contentType;
  switch (extension) {
    case '.css':
      contentType = 'text/css';
      break;
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.jpg':
      contentType = 'image/jpeg';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.txt':
      contentType = 'text/plain';
      break;
    default:
      contentType = 'text/html';
      break;
  }

  let filePath = 
    contentType === 'text/html' && req.url === '/'
      ? path.join(__dirname, 'views', 'index.html')
      : contentType === 'text/html' && req.url.slice(-1) === '/'
        ? path.join(__dirname, 'views', req.url, 'index.html')
        : contentType === 'text/html'
          ? path.join(__dirname, 'views', req.url)
          : path.join(__dirname, req.url);
  //makes .html extension not required in browser
  if (!extension && req.url.slice(-1) !== '/') {
    fliePath += '.html';
  }

  const fileExists = fs.existsSync(filePath);

  if(fileExists) {
    //serve the file
  } else {
    //404
    //301 redirect
    switch(console.log(path.parse(filePath).base)){
      case 'index.html':
        res.writeHead(301, {'Location': '/'})
    }
  }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const app = express();

app.use(express.json());
app.use(cors())

app.get("/", (req, res)=>{
  res.json("Hello this is the backend");
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

app.listen(8800, ()=>{
  console.log("Connected to backend!");
});
