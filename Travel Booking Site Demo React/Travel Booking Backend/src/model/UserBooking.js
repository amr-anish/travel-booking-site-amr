const userDetails = require('./beanClasses/users');
const connection = require("../utilities/connections")

const usersBookDB = {}


usersBookDB.booking =async (userId,destId,destinationName,checkInDate,checkOutDate,noOfPersons,totalCharges) => {

    let model= await connection.getBookCollection();
    let ids = await model.distinct("bookingId");
    var Bids=[]
    ids.map(id=>{  Bids.push(id.replace(/[^\d.-]/g,''));})
    let uId = Math.max(...Bids);
    let newBookID=("B"+(uId + 1));


    UserInfo=[{bookingId:newBookID,userId:userId,destId:destId,destinationName:destinationName,checkInDate:checkInDate,checkOutDate:checkOutDate,noOfPersons:noOfPersons,totalCharges:totalCharges,timeStamp:new Date().getTime().toString()}]

    return connection.getBookCollection().then((myCollection) => {
    //    console.log(myCollection)
            return myCollection.insertMany(UserInfo).then((data) => {
                if (data) {

                    return "Insertion Successfull"
                } else {
                    throw new Error("Insertion failed")
                }
            })
            .catch(err=>{
                return err;
            })
        

    })
}

//updateSlots(destId,slots,type)
usersBookDB.updateSlots =async (destId,slots,type) => {
    

 if(type=="D"){   return connection.getDestCollection().then((myCollection) => {console.log(slots,type)
    
            return myCollection.updateMany({destinationId:destId},{$set:{"availability":parseInt(slots)}}).then((data) => {
                if (data) {
                        console.log(data)
                    return "Insertion Successfull"
                } else {
                    throw new Error("Insertion failed")
                }
            })
        

    })}
    
    else if(type=="H"){

        return connection.getHotCollection().then((myCollection) => {console.log(slots,type)
    
            return myCollection.updateMany({destinationId:destId},{$set:{"availability":parseInt(slots)}}).then((data) => {
                if (data) {
                        console.log(data)
                    return "Insertion Successfull"
                } else {
                    throw new Error("Insertion failed")
                }
            })
        

    })


    }




}

usersBookDB.deleteBooking=(bId)=>{
    return connection.getBookCollection().then((myCollection)=>{
        //console.log("booking",myCollection)
        return myCollection.findOne({"bookingId":bId},{}).then(bookingData=>
            {
                let type=bookingData["destId"][0];
                let noOfPerson=bookingData["noOfPersons"];
                let destId=bookingData["destId"];
                return myCollection.deleteOne(bookingData).then(()=>
                {
                if(type=="D")
                {   
                    return connection.getDestCollection().then((myCollection) => 
                    {
                    //    console.log(destId,type);
                        return myCollection.findOne({destinationId:destId},{availability:1,_id:0}).then(data=>
                            {
                                // console.log((data["availability"])+noOfPerson);
                                return myCollection.updateMany({destinationId:destId},
                                    {$set:{"availability":parseInt(noOfPerson+data["availability"])}}).then((data) => 
                                    {
                                    if(data){
                                        return "Deleted Successfully";
                                    }
                                    else{
                                        throw new Error("Deletion  failed")
                                    }
                                        
                                })

                  })   
            })

                       
                }else if(type== "H")
                {   
                    return connection.getHotCollection().then((myCollection) => 
                    {
                    //    console.log(destId,type);
                        return myCollection.findOne({destinationId:destId},{availability:1,_id:0}).then(data=>
                            {
                                // console.log((data["availability"])+noOfPerson);
                                return myCollection.updateMany({destinationId:destId},
                                    {$set:{"availability":parseInt(noOfPerson+data["availability"])}}).then((data) => 
                                    {
                                    if(data){
                                        return "Deleted Successfully";
                                    }
                                    else{
                                        throw new Error("Deletion  failed")
                                    }
                                        
                                })

                  })   
            })

                       
                }
            
            }

                       
        )
    })
})
}




module.exports = usersBookDB;