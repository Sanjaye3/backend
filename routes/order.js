const Order = require('../models/Order');
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
    const newOrder =new Order(req.body)

    try{
        const savedOrder = await newOrder.save();
        res.status(200).send(savedOrder)
    }catch(err){
        res.status(500).json(err);
    }
})

// //product update
router.put("/:id",verifyTokenAndAdmin,async (req,res) => {

    
    try{
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id,{
            $set: req.body,
        },{new: true});
        

        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(500).json(err);
    }

    });




// delete

router.delete("/:id",verifyTokenAndAdmin,async(req, res) =>{
    try{
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json("Order has been deleted");
    }catch (err) {
        res.status(500).json(err);
    }
})

// get user orders
router.get("/find/:id",verifyTokenAndAuthorization),async(req, res) =>{
    try{
        const orders =  await Order.findOne({userId:req.params.id});
         
         res.status(200).json(orders);
         }catch (err) {
        res.status(500).json(err);
    }
}

// get all product

 router.get ("/",verifyTokenAndAdmin,async (req, res) =>{
     try{
         const orders = await Order.find();
         res.status(200).json(orders);
     } catch (err) {
         res.status(500).json(err);
     }
 })


//  get monthly income 
router.get("/income",verifyTokenAndAdmin,async (req, res) =>{
    const date = new Date();
    const lastmonth = new Date(date.setMonth(date.getMonth() -1));
    const previousMonth = new Date (date.setMonth(lastmonth .getMonth() -1));

    try{
        const income = await Order.aggregate([
            { $match :{ createdAt: {$gte:previousMonth}}},
            { $project:{
                month:{month:"$createdAt"},
                sales:"$amount",
            
            },
        },
            {
                $group: {
                    _id:"$month",
                    total:{$sum:"$sales"}
                }
            },

            
           
        
        ]);
        res.status(200).json(income);
    }catch(err){
        res.status(500).json(err);
    }
})
module.exports = router 