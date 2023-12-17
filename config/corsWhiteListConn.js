const whiteList = [
    "https://www.yoursite.com",
    "http://localhost:5173",
    "http://localhost:8805",
  ]; //localhost (127 and localhost) are just there during dev, once publishing you only leave your front-end able to access

  export default whiteList;