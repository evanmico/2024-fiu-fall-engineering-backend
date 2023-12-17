import "dotenv/config";
const app = express();

import credentials from "./middleware/credentials.js";
app.use(credentials); // Set header for cors
import cors from "cors"; //important for cors middleware
import corsOptions from "./config/corsConn.js";
app.use(cors(corsOptions));

import express from "express";

import path, { dirname } from "path";
import { fileURLToPath } from "url";
import errorHandler from "./middleware/errorHandler.js";
import { logger } from "./middleware/logEvents.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = process.env.PORT || 8805;
import { catchAll } from "./controllers/appController.js";
import verifyJWT from "./middleware/verifyJWT.js";
import cookieParser from "cookie-parser";

import { rootRouter } from "./routes/root.js";
import { accountsRouter } from "./routes/api/accounts.js";
import { clientsRouter } from "./routes/api/clients.js";
import { registerRouter } from "./routes/api/register.js";
import { authRouter } from "./routes/api/auth.js";
import { refreshRouter } from "./routes/api/refresh.js";
import { logoutRouter } from "./routes/api/logout.js";

// custom middleware logger 
app.use(logger);

//built-in middleware to handle urlencoded data
app.use(express.urlencoded({ extended: false }));

//built-in middleware for handling json (applied to all routes)
app.use(express.json());

//middleware for cookie parsing
app.use(cookieParser());


app.use("/", express.static(path.join(__dirname, "/public")));

//routes
app.use("/", rootRouter);
app.use('/register', registerRouter);
app.use('/login', authRouter);
app.use('/refresh', refreshRouter);
app.use('/logout', logoutRouter);

//routes requiring JWT verification
app.use(verifyJWT);
app.use("/accounts", accountsRouter);
app.use("/clients", clientsRouter);


//next.js handles these like a waterfall, so here we put our catch all at the end if none of the others were chosen
app.all("*", catchAll);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`You're Connected to the backend on port ${PORT}`);
});
