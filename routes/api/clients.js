import express from "express";
const router = express.Router();
import connectDB from '../../config/dbConn.js';

router.route('/')
    .get((req,res)=>{
        const q = "SELECT * FROM client_therapist_vw";
        connectDB.query(q,(err,data)=>{
            if(err) return res.json(err);
            return res.json(data);
        });
    });

router.route('/all')
    .get((req,res)=>{
        const q = "SELECT * FROM client"
        connectDB.query(q,(err,data)=>{
            if(err) return res.json(err);
            return res.json(data);
        });
    })

export  { router as clientsRouter };