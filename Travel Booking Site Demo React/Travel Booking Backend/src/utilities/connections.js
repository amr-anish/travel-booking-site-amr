const { Schema } = require("mongoose");
const Mongoose = require("mongoose")
Mongoose.Promise = global.Promise;
const url = "mongodb://localhost:27017/AMR_travel_Booking_DB";

let userSchema = Schema({
    name: String,
    userId: String,
    emailId: String,
    contactNo: Number,
    password: String,
    bookings: [String],
    wallet:Number,
}, { collection: "User" })


let destSchema= Schema({
    destinationId : String,
    continent:String,
    imageUrl:String,
    name : String,
    details : {
                about : String,
                itinerary :  {
                                dayWiseDetails:{
                                                firstDay:String,
                                                restDaysSightSeeing:[String],
                                                lastDay:String
                                                },
                                 packageInclusions : [String],
                                 tourHighlights: [String],
                                 tourPace : [String]
                               }

            },
            noOfNights : Number,
            flightCharges:Number,
            chargesPerPerson: Number,
            discount: Number,
            availability: Number
}, { collection: "Dest" })




let hotSchema=Schema({
    destinationId : String,
    continent:String,
    imageUrl:String,
    name : String,
    details : {
                about : String,
                itinerary :  {
                                dayWiseDetails:{
                                                firstDay:String,
                                                restDaysSightSeeing:[String],
                                                lastDay:String
                                                },
                                 packageInclusions : [String],
                                 tourHighlights: [String],
                                 tourPace : [String]
                               }
            },
            noOfNights : Number,
            flightCharges:Number,
            chargesPerPerson: Number,
            discount: Number,
            availability: Number
}, { collection: "Hot" })


let bookSchema=Schema({
    bookingId:String,
    userId:String,
    destId:String,
    destinationName:String,
    checkInDate:String,
    checkOutDate:String,
    noOfPersons: Number,
    totalCharges:Number,
    timeStamp:String}, { collection: "Book" })


let collection = {};

collection.getUserCollection = () => {
    return Mongoose.connect(url, { useNewUrlParser: true }).then((database) => {
        return database.model('User', userSchema)
    }).catch((error) => {
        let err = new Error("Could not connect to Database");
        err.status = 500;
        throw err;
    })
}


collection.getDestCollection=()=>{
    return Mongoose.connect(url, { useNewUrlParser: true }).then((database) => {
        return database.model('Dest', destSchema)
    }).catch((error) => {
        let err = new Error("Could not connect to Database");
        err.status = 500;
        throw err;
    })
}


collection.getHotCollection=()=>{
    return Mongoose.connect(url, { useNewUrlParser: true }).then((database) => {
        return database.model('Hot', hotSchema)
    }).catch((error) => {
        let err = new Error("Could not connect to Database");
        err.status = 500;
        throw err;
    })
}




collection.getBookCollection=()=>{
    return Mongoose.connect(url, { useNewUrlParser: true }).then((database) => {
        return database.model('Book', bookSchema)
    }).catch((error) => {
        let err = new Error("Could not connect to Database");
        err.status = 500;
        throw err;
    })
}


module.exports = collection;
