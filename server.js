//importing packages
require("dotenv").config();
const http = require("http");

//importing constants
const PORT=process.env.PORT
//importing files
const app = require("./app");
const uncaughtRejection=require('./api/middlewares/errors/uncaughtRejection');
const uncaughtException=require('./api/middlewares/errors/uncaughtException')

uncaughtException();

//creating server
const server = http.createServer(app);
server.listen(PORT, () =>
  {console.log(`Server running at http://localhost:${PORT}`)}
);
uncaughtRejection(server)