import "dotenv/config";
const app = express();

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

import { rootRouter } from "./routes/root.js";
import { accountsRouter } from "./routes/api/accounts.js";
import { clientsRouter } from "./routes/api/clients.js";
import { registerRouter } from "./routes/api/register.js";

// custom middleware logger 
app.use(logger);

//built-in middleware to handle urlencoded data
app.use(express.urlencoded({ extended: false }));

//built-in middleware for handling json (applied to all routes)
app.use(express.json());


app.use("/", express.static(path.join(__dirname, "/public")));

//routes
app.use("/", rootRouter);
app.use("/accounts", accountsRouter);
app.use("/clients", clientsRouter);
app.use('/register', registerRouter);

//next.js handles these like a waterfall, so here we put our catch all at the end if none of the others were chosen
app.all("*", catchAll);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`You're Connected to the backend on port ${PORT}`);
});
