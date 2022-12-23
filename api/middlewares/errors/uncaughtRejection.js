
//Unhandled Promise Rejection
module.exports=(server)=>{

  process.on("unhandledRejection", (err) => {
      console.log(`Error : ${err.message}`);
      console.log("Shutting down server due to unhadled promise rejection");
      server.close(() => {
        process.exit(1);
      });
    });
}