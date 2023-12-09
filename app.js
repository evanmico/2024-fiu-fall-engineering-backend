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

import { accountsRouter } from "./routes/api/accounts.js";
import { clientsRouter } from "./routes/api/clients.js";
import { rootRouter } from "./routes/root.js";

// custom middleware logger 
app.use(logger);


//built-in middleware to handle urlencoded data
app.use(express.urlencoded({ extended: false }));

//built-in middleware for handling json (applied to all routes)
app.use(express.json());

//built-in middleware to serve static files by having you put them in the public dir,
//  making them publicly available to those viewing (put css files, images, text documents, etc.)
app.use("/", express.static(path.join(__dirname, "/public")));
app.use("/", rootRouter);

app.use("/accounts", accountsRouter);
app.use("/clients", clientsRouter);
//app.all is used by routing while app.use is usually used by middleware
//next.js handles these like a waterfall, so here we put our catch all at the end if none of the others were chosen
app.all("*", (req, res) => {
  //express can automatically send a 404 if a link isn't found, but here we specify a specific file for the 404
  //issue is, if we provide a file, then it'll just return a 200 code so we need to chain in a status
  res.status(404); //following if else waterfall allows us to have more specific responses to various 404 requests
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html")); //we send html file here
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" }); //original request was a json type so we just respond in json instead of html
  } else {
    res.type("txt").send("404 Not Found"); //return a text type that says the same thing the json response says
  }
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`You're Connected to the backend on port ${PORT}`);
});
