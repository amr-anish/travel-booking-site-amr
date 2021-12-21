const userDB = require('../model/userslogin');
const userRegisterDB = require('../model/usersRegister')
const userBookDB = require('../model/UserBooking')
const userService = {}

//login a user
userService.login = (contactNo, userPassword) => {
    return userDB.checkUser(contactNo).then((user) => {
        if (user == null) {
            let err = new Error("Enter registered contact number! If not registered, please register")
            err.status = 404
            throw err
        }
        else {
            return userDB.getPassword(contactNo).then((password) => {
                if (password != userPassword) {
                    let err = new Error("Incorrect password")
                    err.status = 406
                    throw err
                }
                else {
                    return user;
                }
            })
        }
    })
}

userService.getWallet = (userId) => {
    return userDB.getWallet(userId).then((amount) => {
        if (amount == null) {
            let err = new Error("No Amount in Wallet")
            err.status = 404
            throw err
        }
        
                else {
                    return amount;
                }
            })
        }
    
userService.updateWallet = (userId,amount) => {
    return userDB.updateWallet(userId,amount).then((Data) => {
        if (Data == null) {
            let err = new Error("No Amount in Wallet")
            err.status = 404
            throw err
        }
        
                else {
                    return amount;
                }
            })
        }
    











//register a user
userService.register = (contactNo, userPassword, userName, email) => {
    return userRegisterDB.checkUser(contactNo).then((user) => {
        if (user !== null) {
            let err = new Error("This contact number is already registered")
            err.status = 409
            throw err
        }
        else{    
            return userRegisterDB.checkEmail(email).then((userr) => {
            if (userr !== null) {
                let err = new Error("This Email is already registered")
                err.status = 409
                throw err
            }
            else{
                return userRegisterDB.userReg(userName,email,contactNo,userPassword).then((data)=>{
                    if(data !==null)
                    {
                        return data;
                    }else{
                        let err = new Error("Registration Failed! Please try again")
                        err.status = 408
                        throw err
                    }
                })
            }
          })

    }})
}
//booking a user

userService.bookingService = (userId,destId,destinationName,checkInDate,checkOutDate,noOfPersons,totalCharges) => {
    return userBookDB.booking(userId,destId,destinationName,checkInDate,checkOutDate,noOfPersons,totalCharges).then((BookingId) => {
        if (BookingId === null) {
            let err = new Error("Please Book again Some Techinical Failure Occured")
            err.status = 403
            throw err
        }
        else {
            
            return BookingId;
                }
        })
            .catch(err=>{
                return new Error(err)
            })
        
}
 
userService.updateSlotsService=(destId,slots,type) => {
    return userBookDB.updateSlots(destId,slots,type).then((BookingId) => {
        if (BookingId === null) {
            let err = new Error("Please Book again Some Techinical Failure Occured")
            err.status = 403
            throw err
        }
        else {
            
            return BookingId;
                }
            })
        .catch(err=>{
            return new Error(err)
        })
        
    }







module.exports = userService
