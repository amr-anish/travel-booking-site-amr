const userDetails = require('./beanClasses/users');
const connection = require("../utilities/connections")

const usersRegisterDB = {}


usersRegisterDB.userReg =async (username,emailid,contactnumber,password) => {

    //autogeneratiing userId
    let model= await connection.getUserCollection();
    let ids = await model.distinct("userId");
    var uids=[]
    ids.map(id=>{  uids.push(id.replace(/[^\d.-]/g,''));})
    let uId = Math.max(...uids);
    let newuserID=("U"+(uId + 1));
    // console.log("New user Id",newuserID)



    UserInfo=[{userId: newuserID, name:username, emailId:emailid, contactNo:contactnumber, password:password, wallet:1000}]


    
    return connection.getUserCollection().then((myCollection) => {
       console.log(myCollection)
       //adding new user to the database
            return myCollection.insertMany(UserInfo).then((data) => {
                if (data) {

                    return data;
                } else {
                    throw new Error("Insertion failed")
                }
            })
        

    })
}


usersRegisterDB.checkUser = (contactNo) => {
    return connection.getUserCollection().then((collection) => {
        return collection.findOne({ "contactNo": contactNo }).then((customerContact) => {
            if (customerContact) {
                return new userDetails(customerContact);
            }
            else return null;
        })
    })
}

usersRegisterDB.checkEmail = (email) => {
    return connection.getUserCollection().then((collection) => {
        return collection.findOne({ "emailId":email}).then((customerEmail) => {
            if (customerEmail) {
                return new userDetails(customerEmail);
            }
            else return null;
        })
    })
}









module.exports = usersRegisterDB;