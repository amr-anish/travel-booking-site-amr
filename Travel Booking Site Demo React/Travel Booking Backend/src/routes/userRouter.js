const express = require('express');
const router = express.Router();
const setupUser = require("../model/setupUser");
const userservice = require('../service/userslogin');
const setupDest =require('../model/setupDest');
const setupBook =require('../model/setupBook');
const setupHot =require('../model/setupHot');
const dataService=require('../service/data');
const { use } = require('chai');

router.get("/setup", (req, res, next) => 
{
    setupUser.userSetup().then((data) => {
        res.send(data)
    }).catch(err => next(err));

    setupDest.destSetup().then((data) => {
        res.send(data)
    }).catch(err => next(err));

    setupHot.hotSetup().then((data) => {
        res.send(data)
    }).catch(err => next(err));

    setupBook.bookSetup().then((data) => {
        res.send(data)
    }).catch(err => next(err));




})

//router to login
router.post('/login', function (req, res, next) {
    let contactNo = req.body.contactNo;
    let password = req.body.password;

    //console.log(contactNo)
    userservice.login(parseInt(contactNo), password).then(function (userDetails) {
        res.json(userDetails);
    }).catch(err => next(err));
})

router.post('/getwallet', function (req, res, next) {
    let userId = req.body.userId;
   

    // console.log("wallet user ID",userId)
    userservice.getWallet(userId).then(function (userDetails) {
        // console.log("wallet get res:",userDetails);
        res.json(userDetails);
    }).catch(err => next(err));
//    validate.validateUserId(userId);
  
//     userservice.getWallet(userId).then(function (userDetails) {
//         //  console.log("wallet get res:",userDetails);
//           res.json(userDetails);
//       }).catch(err => next(err));
 
   

  //  console.log("wallet user ID",userId)
   
})

router.post('/updatewallet', function (req, res, next) {
    // let userId = "U1001"
    // let amount =850000

    let userId =req.body.userId;
   let amount=req.body.amount;
   

    // console.log("wallet updation",userId,amount)
    userservice.updateWallet(userId,amount).then(function (userDetails) {
        res.json(userDetails);
    }).catch(err => next(err));
})











router.post('/register', function (req, res, next) {
    let contactNo = req.body.contactNo;
    let password = req.body.password;
    let name = req.body.name;
    let email = req.body.email;
    // console.log("Register",contactNo);
    userservice.register(parseInt(contactNo), password, name, email).then(function (userDetails) {
        res.json(userDetails);

    }).catch(err => next(err));
})


router.post('/booking', function (req, res, next) {
    
    let userId=req.body.userId;
    let destId=req.body.destId;
    let destinationName=req.body.destinationName;
    let checkInDate=req.body.checkInDate;
    let checkOutDate=req.body.checkOutDate;
    let noOfPersons=req.body.noOfPersons;
    let totalCharges=req.body.totalCharges;
   
    userservice.bookingService (userId,destId,destinationName,checkInDate,checkOutDate,noOfPersons,totalCharges).then(function (userDetails) {
        res.json(userDetails);

        
    }).catch(err => next(err));
})
router.put('/updateSlots', function (req, res, next) {
    
    
    let destId=req.body.destId;
    let slots=req.body.slots;
    let type=req.body.type;
   
    userservice.updateSlotsService(destId,slots,type).then(function (Details) {
        res.json(Details);

        
    }).catch(err => next(err));
})

router.get('/gethotdeals',function(req,res,next){
    
        dataService.getHotDeals().then(hotdeals=>{
            res.json(hotdeals);
        }).catch(err=>next(err));
})

router.get('/getbooking',function(req,res,next){
    
    dataService.getBook().then(book=>{
        res.json(book);
    }).catch(err=>next(err));
})

router.get('/getdest',function(req,res,next){
    
    dataService.getDest().then(Dest=>{
        res.json(Dest);
    }).catch(err=>next(err));
})

router.delete('/deletebooking/:bId',function(req,res,next){
   // console.log("came here")
    let bookingId=req.params.bId
    dataService.deleteBooking(bookingId).then(data=>{
        res.json(data);
    }).catch(err=>next(err))
})


router.post('/getavailability',function(req,res,next){
    let destId=req.body.destId;
    let type=req.body.type;
   // console.log(req.body)

    
    dataService.getAvailability(destId,type).then(Dest=>{
        res.json(Dest);
    }).catch(err=>next(err));
})



module.exports = router;

