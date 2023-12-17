import connectDB from "../config/dbConn.js";
import SQL from "sql-template-strings";

import jwt from 'jsonwebtoken';

const handleLogout = async (req, res) => {
    // On client, also delete the accessToken in the memory of the client application by 0-ing it out
    //Store Response
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.status(204).end();
    const refreshToken = cookies.jwt;
    const decodedID  =  jwt.decode(refreshToken).ID;

    //Check if provided refreshToken is in db
    const accReqSQLObj = SQL`SELECT * FROM account_authentication WHERE accountID = ${decodedID} LIMIT 1`;
    let foundAccount;

    try {
        foundAccount = await connectDB.query(accReqSQLObj).then((([data,]) => data));
        //Check if refreshToken is in db at all and clear cookie if it isn't
        if((foundAccount === undefined || foundAccount.length == 0)) return res.status(204).clearCookie('jwt',{ httpOnly: true, sameSite: 'None'/*, secure: true*/ }).end(); // Successful, but no content (204)
    } catch(err) {
        return () => res.status(500).json({'message': 'Internal server error during ID verification'}).end();
    }

    // Delete Refresh token in db (no need to verify, the fact we got here means there is a refresh token in db for this user and we need to eliminate it regardless of value)
    const deleteRefreshTokenSQLObj = SQL`DELETE FROM account_authentication WHERE accountID = ${decodedID}`;
    try{
        await connectDB.query(deleteRefreshTokenSQLObj);
        //res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 *1000 });
                        //(204) all is well, but we have no return value to provide
        return res.status(204).clearCookie('jwt', { httpOnly: true, sameSite: 'None'/*, secure: true*/ }).end(); 
    } catch(err) {
        return () => res.status(500).json({'message': 'Internal server error when deleting refresh token'}).end();
    }

    
}

export default handleLogout;