const Cart = require('../models/Cart');
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
// create 

router.post("/",verifyToken,async(req, res) => {
    const newCart =new Cart(req.body)

    try{
        const savedCart = await newCart.save();
        res.status(200).send(savedCart)
    }catch(err){
        res.status(500).json(err);
    }
})

// //product update
router.put("/:id",verifyTokenAndAuthorization,async (req,res) => {

    
    try{
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id,{
            $set: req.body,
        },{new: true});
        

        res.status(200).json(updatedCart);
    } catch (err) {
        res.status(500).json(err);
    }

    });




// delete

router.delete("/:id",verifyTokenAndAuthorization,async(req, res) =>{
    try{
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json("Cart has been deleted");
    }catch (err) {
        res.status(500).json(err);
    }
})

// get user cart
router.get("/find/:id",verifyTokenAndAuthorization),async(req, res) =>{
    try{
        const cart =  await Cart.findOne({userId:req.params.id});
         
         res.status(200).json(cart);
         }catch (err) {
        res.status(500).json(err);
    }
}

// get all product

 router.get ("/",verifyTokenAndAdmin,async (req, res) =>{
     try{
         const carts = await Cart.find();
         res.status(200).json(carts);
     } catch (err) {
         res.status(500).json(err);
     }
 })
module.exports = router 