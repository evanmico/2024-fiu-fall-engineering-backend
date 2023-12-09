import express from "express";
const router = express.Router();
import connectDB from "../../config/dbConn.js";
import SQL from "sql-template-strings";

router
  .route("/")
  .get((req, res) => {
    //console.log('connection ID' + connectDB.threadId);
    //const qObj = 'SELECT A.ID as ID, email, password, accountTypeValue FROM account A INNER JOIN account$type T ON A.accountTypeID = T.ID';
    const qObj = SQL`SELECT A.ID as ID, email, password, accountTypeValue 
                  FROM account A 
                  INNER JOIN account$type T 
                  ON A.accountTypeID = T.ID`;

    connectDB.query(qObj).then(
      ([data]) => res.json(data),
      (err) => res.json(err)
    );

    /*
    connectDB.query(qObj,(err,data)=>{
      if(err) return res.json(err);
      return res.json(data);
    })
    */
  })
  .post((req, res) => {
    const { email, password, accountTypeID } = req.body;

    const qObj = SQL`INSERT INTO account (email, password, accountTypeID) 
                      VALUES (${email}, ${password}, ${accountTypeID})`;

    connectDB
      .query(qObj)
      .then(res.json("Account has been successfully added"), (err) =>
        res.json(err)
      );
  })
  .put((req, res) => {})
  .delete((req, res) => {});
router
  .route("/:id")
  .get((req, res) => {
    const qObj = SQL`SELECT * FROM account 
                  WHERE id = ${req.params.id}`;

    connectDB.query(qObj).then(
      ([data]) => res.json(data),
      (err) => res.json(err)
    );
  })
  .delete((req, res) => {
    const qObj = SQL`DELETE FROM account 
                      WHERE ID = ${req.params.id}`;

    connectDB.query(qObj).then(
      () => res.json("Account deleted successfully"),
      (err) => res.json(err)
    );
  });

//routes always export a router
export { router as accountsRouter };
