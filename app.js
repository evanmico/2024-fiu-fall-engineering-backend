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
