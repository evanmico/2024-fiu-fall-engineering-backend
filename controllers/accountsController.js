import connectDB from "../config/dbConn.js";
import SQL from "sql-template-strings";

const getAllAccounts = (req, res) => {
    const qObj = SQL`SELECT A.ID as ID, email, password, accountTypeValue 
                  FROM account A 
                  INNER JOIN account$type T 
                  ON A.accountTypeID = T.ID`;

    connectDB.query(qObj).then(
      ([data]) => res.json(data),
      (err) => res.json(err)
    );
  }

  const createNewAccount = (req, res) => {
    const { email, password, accountTypeID } = req.body;

    const qObj = SQL`INSERT INTO account (email, password, accountTypeID) 
                      VALUES (${email}, ${password}, ${accountTypeID})`;

    connectDB
      .query(qObj)
      .then(res.status(201).json("Account has been successfully added"), (err) =>
        res.json(err)
      );
  }

  const updateAccount = (req, res) => {};

  const deleteAccounts = (req, res) => {};

  const getAccount = (req, res) => {
    const qObj = SQL`SELECT * FROM account 
                  WHERE id = ${req.params.id}`;

    connectDB.query(qObj).then(
      ([data]) => res.json(data),
      (err) => res.json(err)
    );
  }

  const deleteAccount = (req, res) => {
    const qObj = SQL`DELETE FROM account 
                      WHERE ID = ${req.params.id}`;

    connectDB.query(qObj).then(
      () => res.json("Account deleted successfully"),
      (err) => res.json(err)
    );
  }

  export {
    getAllAccounts, 
    createNewAccount, 
    updateAccount,
    deleteAccounts,
    getAccount,
    deleteAccount
}