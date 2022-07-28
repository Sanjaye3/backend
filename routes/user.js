const User = require('../models/User');
const { verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin } = require('C:\\Users\\sanja\\OneDrive\\Desktop\\b1\\routes\\verifyToken.js');



const router = require('express').Router(); 

router.get("/home",(req,res) => {

    res.send("user test is successful");
})

router.post("/userposttest",(req,res) => {
    const username = req.body.username;
    console.log(username);
    res.send("your username is " + username )
})


//user update
router.put("/:id",verifyTokenAndAuthorization,async (req,res) => {

    if(req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString();
        
    } 
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id,{
            $set: req.body,
        },{new: true});
        

        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json(err);
    }

    });




// delete

router.delete("/:id",verifyTokenAndAuthorization,async(req, res) =>{
    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("user has been deleted");
    }catch (err) {
        res.status(500).json(err);
    }
})

// get user
router.get("/find/:id",verifyTokenAndAdmin,async(req, res) =>{
    try{
        const user =  await User.findById(req.params.id)
         const {password,...other} = user._doc;
         res.status(200).json(other);
         }catch (err) {
        res.status(500).json(err);
    }
})

// get all user

router.get("/find/",verifyTokenAndAdmin,async(req, res) =>{
    try{
        const users =  await User.find()
         res.status(200).json(users);
         }catch (err) {
        res.status(500).json(err);
    }
})


//get user stats



router.get('/stats',verifyTokenAndAdmin,async(req,res) =>{
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() ));
    try {
        const data = await User.aggregate([
        {$match : {createdAt :{$gte : lastYear }}},
        {
            $project:{
                month:{ $month : "$createdAt"}
            },
        },
        {
            $group:{
                _id:"$month",
                total:{$sum : 1},
            }
        }
    ])
    res.status(200).json(data);
    }catch (err) {
        res.status(500).json(err);
    }


})
module.exports = router 