//the dumb__filename and __dirname import to make them functional :|
import { fileURLToPath } from "url";
import path, { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const catchAll = (req, res) => {
  //express can automatically send a 404 if a link isn't found, but here we specify a specific file for the 404
  //issue is, if we provide a file, then it'll just return a 200 code so we need to chain in a status
  res.status(404); //following if else waterfall allows us to have more specific responses to various 404 requests
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname,"..", "views", "404.html")); //we send html file here
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" }); //original request was a json type so we just respond in json instead of html
  } else {
    res.type("txt").send("404 Not Found"); //return a text type that says the same thing the json response says
  }
};

export { catchAll };
