//Uncaught Exceptions
module.exports=()=>{

    process.on("uncaughtException", (err) => {
        console.log(`Error : ${err.message}`);
        console.log("Shutting down server due to uncaught exception");
        process.exit(1);
      });
}
