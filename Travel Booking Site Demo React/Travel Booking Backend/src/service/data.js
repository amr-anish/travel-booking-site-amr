const dataDB = require('../model/data');
const usersBookDB = require('../model/UserBooking');



const dataService = {}


dataService.getHotDeals=()=>{
    return dataDB.getHotDeals().then((hotdeals)=>{

        if(hotdeals==null)
        {
                let err= new Error("No hot Deals Available ");
                err.status=404;
                throw err;
        }
        else
        {
            return hotdeals;


        }
    })
}



dataService.getDest=()=>{
    return dataDB.getDest().then((dest)=>{

        if(dest==null)
        {
                let err= new Error("No Destination Available ");
                err.status=404;
                throw err;
        }
        else
        {
            return dest;


        }
    })
}


dataService.getAvailability=(destId,type)=>{
    return dataDB.getAvailability(destId,type).then((dest)=>{

        if(dest==null)
        {
                let err= new Error("No Slots Available ");
                err.status=404;
                throw err;
        }
        else
        {
            return dest;


        }
    })
}



dataService.getBook=()=>{
    return dataDB.getBook().then((book)=>{

        if(book==null)
        {
                let err= new Error("No hot Deals Available ");
                err.status=404;
                throw err;
        }
        else
        {
            return book;


        }
    })
}


dataService.deleteBooking=(bId)=>{
    return usersBookDB.deleteBooking(bId).then((data)=>{
        if(data===null)
        {
                let err= new Error("Something Went Wrong ! please try again ");
                err.status=404;
                throw err;
        }
        else
        {
            return data;
        }
        
    })
    .catch(err=>{
        let error=new Error(err)
        throw error;
    })
}
module.exports = dataService;