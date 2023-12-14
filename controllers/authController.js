import connectDB from "../config/dbConn.js";
import SQL from "sql-template-strings";

import bcrypt from 'bcrypt';

const handleAccountLogin = async (req, res) => {
    //Store Response
    const {email, password} = req.body;
    if(!email || !password) return res.status(400).json({'message': 'email and password are required'});
    console.log(req.body);

    //Check if provided email is in db
    const accReqSQLObj = SQL`SELECT email, password, accountTypeID FROM account A WHERE A.email = ${email} LIMIT 1`;
    let result;

    try {
        result = await connectDB.query(accReqSQLObj).then((([data,]) => data));
        //Check if email is registered at all
        if((result === undefined || result.length == 0)) { return res.status(401).json({'message': 'No account associated with provided email'}) };
    } catch(err) {
        return () => res.status(500).json({'message': 'Internal server error during email verification'});
    }

    //Complete Authentication
    try {
        console.log('starting compare')
        console.log(result);
        const match = await bcrypt.compare(password, result[0].password);
        console.log('finished compare');
        return (match)? 
        /*Create JWTs*/ res.status(200).json({'success': `Account ${email} successfully logged in!`}): res.status.json({'message': 'Invalid email or password'});
    } catch (err) {
        return res.status(500).json({'message': 'Internal server error during password authentication'});
    }
}

export default handleAccountLogin;