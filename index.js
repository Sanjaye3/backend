const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("C:\\Users\\sanja\\OneDrive\\Desktop\\b1\\routes\\user.js");
const authRoute = require("C:\\Users\\sanja\\OneDrive\\Desktop\\b1\\routes\\auth.js");
const productRoute = require("C:\\Users\\sanja\\OneDrive\\Desktop\\b1\\routes\\product.js");
dotenv.config();


mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("DBconnection Successful!")).catch((err) => {
    console.log(err);
});
app.use(express.json());

app.use("/users", userRoute);
app.use("/auth",authRoute);
app.use("/products",productRoute);

 
app.listen(process.env.PORT || 5000,() => {
    console.log("backend is running");
})