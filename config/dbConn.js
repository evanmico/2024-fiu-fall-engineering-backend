import mysql2 from "mysql2/promise";
import fs from "fs";

const connectDB = mysql2.createPool({
                    host: process.env.DB_HOST,
                    user: process.env.DB_USER,
                    password: process.env.DB_PASS,
                    database: process.env.DB_DATABASE,
                    port: process.env.DB_PORT,
                    ssl: { ca: fs.readFileSync(process.env.SSL_PATH) }
                    });

export default connectDB;