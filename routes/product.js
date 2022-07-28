const Product = require('../models/Product');
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

router.post("/",verifyTokenAndAdmin,async(req, res) => {
    const newProduct =new Product(req.body)

    try{
        const savedProduct = await newProduct.save();
        res.status(200).send(savedProduct)
    }catch(err){
        res.status(500).json(err);
    }
})

//product update
router.put("/:id",verifyTokenAndAdmin,async (req,res) => {

    
    try{
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id,{
            $set: req.body,
        },{new: true});
        

        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json(err);
    }

    });




// delete

router.delete("/:id",verifyTokenAndAdmin,async(req, res) =>{
    try{
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("Product has been deleted");
    }catch (err) {
        res.status(500).json(err);
    }
})

// get product
router.get("/find/:id",verifyTokenAndAdmin,async(req, res) =>{
    try{
        const Product =  await Product.findById(req.params.id)
         const {password,...other} = user._doc;
         res.status(200).json(other);
         }catch (err) {
        res.status(500).json(err);
    }
})

// get all product

router.get("/find/",verifyTokenAndAdmin,async(req, res) =>{
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try{
        let products;

        if (qNew){
            products = await Product.find().sort({createdAt:-1}).limit(5)
        }else if (qCategory){
            products = await Product.find({categories :{
                $in:[qCategory],
            },
        });
                
            }



         res.status(200).json(products);
         }catch (err) {
        res.status(500).json(err);
    }
})


//get user stats



router.get('/stats',verifyTokenAndAdmin,async(req,res) =>{
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() -1 ));
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
    re.status(200).json(data);
    }catch (err) {
        res.status(500).json(err);
    }


})
module.exports = router 