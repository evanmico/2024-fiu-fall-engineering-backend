import connectDB from "../config/dbConn.js";
import SQL from "sql-template-strings";

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const handleAccountLogin = async (req, res) => {
    //Store Response
    const {email, password} = req.body;
    if(!email || !password) return res.status(400).json({'message': 'email and password are required'});

    //Check if provided email is in db
    const accReqSQLObj = SQL`SELECT ID, email, password FROM account A WHERE A.email = ${email} LIMIT 1`;
    let foundAccount;

    try {
        foundAccount = await connectDB.query(accReqSQLObj).then((([data,]) => data));
        //Check if email is registered at all
        if((foundAccount === undefined || foundAccount.length == 0)) { return res.status(401).json({'message': 'No account associated with provided email'}) };
    } catch(err) {
        return () => res.status(500).json({'message': 'Internal server error during email verification'});
    }

    //Complete Authentication
    try {
        const match = await bcrypt.compare(password, foundAccount[0].password);
        if (match) {
            // Create JWTs
            const accessToken = jwt.sign(
                { "ID": foundAccount[0].ID },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' } //make about 5 to 15 minutes for prod
            );
            //Saving Refresh token with current account
            const refreshToken = jwt.sign(
                { "ID": foundAccount[0].ID },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' } //make longer/same for prod
            );
            //Save refresh token of current user in db
            const refreshTokenSQLObj = SQL`INSERT INTO account_authentication 
                                            VALUES (
                                                    ${foundAccount[0].ID}, 
                                                    ${refreshToken}) AS new
                                            ON DUPLICATE KEY UPDATE refreshToken = new.refreshToken`;
            try {
                connectDB.query(refreshTokenSQLObj);
            } catch (err) {
                return res.status(500).json({'message': 'Failed to query add refresh token with MySQL db'});
            }
            
            //Send refresh token back as http only cookie due to security
            res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None'/*, secure: true*/, maxAge: 24 * 60 * 60 * 1000 }); //times out after 1 day
            //Send access token back as JSON
            res.status(200).json({ accessToken });
            return;
        }
        else {
            return res.status(401).json({'message': 'Invalid email or password'});
        }
    } catch (err) {
        return res.status(500).json({'message': 'Internal server error during password authentication'});
    }
}

export default handleAccountLogin;