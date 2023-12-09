import express from "express";
const router = express.Router();
import connectDB from "../../config/dbConn.js";
import SQL from "sql-template-strings";

router.route("/").get((req, res) => {
  const qObj = SQL`SELECT * FROM client_therapist_vw`;

  connectDB.query(qObj).then(
    ([data]) => res.json(data),
    (err) => res.json(err)
  );
});

router.route("/all").get((req, res) => {
  const qObj = SQL`SELECT fullName, phoneNumber, DATE_FORMAT(dob, '%Y-%m-%d') as dob, email, occupation, employer, sex 
                        FROM client C 
                        INNER JOIN clientid_fullname_vw N 
                            ON C.ID = N.clientID`;

  connectDB.query(qObj).then(
    ([data]) => res.json(data),
    (err) => res.json(err)
  );
});

export { router as clientsRouter };
