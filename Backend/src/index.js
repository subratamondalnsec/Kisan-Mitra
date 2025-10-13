import express from "express";
const dbconnect =require("./config/database")
const dotenv = require("dotenv");
require("dotenv").config();
const cookieParser = require("cookie-parser");


const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
	return res.json({
		success: true,
		message: "Your server is up and running ...",
	});
});

const InitlizeConnection = async()=>{

    try{
        
        await dbconnect();
        console.log("connected to MongoDB");
        app.listen(PORT, () => {
            console.log(`Listening at port ${PORT} `);
        })
    }
    catch(err){
        console.log("Error "+err);
    }
}

InitlizeConnection();
