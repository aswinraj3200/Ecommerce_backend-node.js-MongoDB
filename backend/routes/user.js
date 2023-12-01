const user = require("../models/user");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();

//Update
router.put("/:id",verifyTokenAndAuthorization, async (req,res)=>{
  if(req.body.password) {
    req.body.password = CryptoJS.AES.decrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString()
  }
  try{
    const updatedUser = await user.findByIdAndUpdate(req.params.id,
      {
      $set: req.body
     },{new :true}
    );
    res.status(200).json(updatedUser)
  }catch(err){
    res.status(500).json(err)
  }
});
//delete
router.delete("/:id",verifyTokenAndAuthorization, async (req,res)=>{
  try{
    await user.findByIdAndDelete(req.params.id)
    res.status(200).json("user has deleted")
  }catch(err){
    res.status(500).json(err)
  }
});

//get
router.get("/find/:id",verifyTokenAndAdmin, async (req,res)=>{
  try{
    const User = await user.findById(req.params.id)
    const { password, ...others } = User._doc;

    res.status(200).json(others);
  }catch(err){
    res.status(500).json(err)
  }
});

//get all users
router.get("/",verifyTokenAndAdmin, async (req,res)=>{
  const query = req.query.new;
  try{
    const Users = query 
    ? await user.find().sort({_id:-1}).limit(5)
    : await user.find() //if any query is given in api
    res.status(200).json(Users);
  }catch(err){
    res.status(500).json(err)
  }
});

//get user stats
router.get('/stats',verifyTokenAndAdmin, async (req,res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1 ));
  try{
    const data = await user.aggregate([
      { $match: {createdAt:{ $gte: lastYear } } },
      {
        $project: {
          month: { $month : "$createdAt"},
        },
      },
      {
        $group: {
          _id: "$month",
          total: {$sum: 1}
        }
      }
    ]);
    res.status(200).json(data)
  }catch(err){
    res.status(500).json(err)
  }
})


module.exports = router