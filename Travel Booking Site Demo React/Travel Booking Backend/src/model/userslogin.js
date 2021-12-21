const userDetails = require('./beanClasses/users');
const connection = require("../utilities/connections")

const usersDB = {}


usersDB.checkUser = (contactNo) => {
    return connection.getUserCollection().then((collection) => {
        return collection.findOne({ "contactNo": contactNo }).then((customerContact) => {
            if (customerContact) {
                return new userDetails(customerContact);
            }
            else return null;
        })
    })
}

usersDB.getPassword = (contactNo) => {
    return connection.getUserCollection().then((collection) => {
        return collection.find({ "contactNo": contactNo }, { _id: 0, password: 1 }).then((password) => {
            if (password.length != 0){
                // console.log(password[0].password);
                return password[0].password;
        }
            else
                return null;
        })
    })
}

usersDB.getWallet = (userId) => {
    return connection.getUserCollection().then((collection) => {
        return collection.find({ "userId": userId }, { _id: 0, wallet: 1 }).then((wallet) => {
            if (wallet != null){
                // console.log("wallet",wallet);
                return wallet;
        }
            else
                return null;
        })
    })
}

usersDB.updateWallet = (userId,amount) => {
   
    return connection.getUserCollection().then((collection) => {
        return collection.updateMany({ "userId": userId }, {$set:{"wallet":parseInt(amount)} }).then((data) => {
            {
                if(data){
                    return "wallet updated Successfully";
                }
                else{
                    throw new Error("updation   failed")
                }
        
            
            
            }


        }) 
    })
}





module.exports = usersDB;
