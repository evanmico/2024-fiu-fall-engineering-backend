import connectDB from "../config/dbConn.js";
import SQL from "sql-template-strings";

import jwt from 'jsonwebtoken';

const handleRefreshToken = async (req, res) => {
    //Store Response
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.status(401).end();
    const refreshToken = cookies.jwt;
    const decodedID  =  jwt.decode(refreshToken).ID;

    //Check if provided refreshToken is in db
    const accReqSQLObj = SQL`SELECT * FROM account_authentication WHERE accountID = ${decodedID} LIMIT 1`;
    let foundAccount;

    try {
        [foundAccount,] = await connectDB.query(accReqSQLObj);
        //Check if refreshToken is in db at all
        if((foundAccount === undefined || foundAccount.length == 0)) return res.status(403).end(); //Forbidden
    } catch(err) {
        return () => res.status(500).json({'message': 'Internal server error during ID verification'}).end();
    }   

    //Evaluate jwt refresh token validity
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundAccount[0].accountID !== decoded.ID) return res.status(403).end(); //Forbid if cookie refreshToken or ID have been tampered with
            const accessToken = jwt.sign(
                { "ID": decoded.ID },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' }
            );
            return res.json({ accessToken });
        }
    );

    
}

export default handleRefreshToken;