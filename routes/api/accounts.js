import express from "express";
const router = express.Router();
import connectDB from '../../config/dbConn.js';

router.route('/')
  .get((req, res)=>{
    const q = 'SELECT * FROM account';
    connectDB.query(q,(err,data)=>{
      if(err) return res.json(err);
      return res.json(data);
    })
  })
  .post((req,res)=>{
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
  .put((req, res) => {
    
  })
  .delete((req,res) => {

  });
router.route('/:id')
  .get((req, res) => {
    const q = "SELECT * FROM account WHERE `id` = (?)";
    const values = [req.params.id];
    connectDB.query(q, [values], (err, data)=>{
      if(err) return res.json(err);
      return res.json(data);
    })
  })

//routes always export a router
export  { router as accountsRouter };