import connectDB from "../config/dbConn.js";
import SQL from "sql-template-strings";

import bcrypt from 'bcrypt';

const handleNewAccount = async (req, res) => {
    //Store response
    const {email, password, accountTypeID} = req.body;
    //Check if email or password are empty
    if (!email || !password) return res.status(400).json({'message': 'email and password are required.'});

    //Check for duplicate emails in the database
    const accReqSQLObj = SQL`SELECT (email) FROM account A WHERE A.email = ${email}`;
    try{
        const result = await connectDB.query(accReqSQLObj).then((([data,]) => data), );
        if(!(result === undefined || result.length == 0)) { return res.status(409).json({'message': 'email already has an associated account'})
        };

    } catch(err) {
        () => res.status(500).json({'message': 'internal server error occured'});
    }
   

    //handle storing new account
    try {
        const hashedPwd = await bcrypt.hash(password, 10);
        // Store new account
        const newAccSQLObj = SQL`INSERT INTO account (email, password, accountTypeID)
        VALUES (${email}, ${hashedPwd}, ${accountTypeID})`;
        await connectDB.query(newAccSQLObj);
        res.status(201).json({'message': `New account with email ${email} has been successfully created.`});
        return;
    } catch (err) {
        res.status(500).json({'message': err.message});
        return;
    }
}

export default handleNewAccount;