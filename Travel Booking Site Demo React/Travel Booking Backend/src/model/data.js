const userDetails = require('./beanClasses/users');
const connection = require("../utilities/connections")

const dataDB = {}

dataDB.getHotDeals=()=>{
    return connection.getHotCollection().then((model)=>
    {
        return model.find({},{_id:0}).then(   (hotdeals)=> {
            
            if(hotdeals.length>0)
            {
                return hotdeals;
            }
            else
            {
                return null;
            }
            }  )
    })
}


dataDB.getDest=()=>{
    return connection.getDestCollection().then((model)=>
    {
        return model.find({},{_id:0}).then(   (dest)=> {
            
            if(dest.length>0)
            {
                return dest;
            }
            else
            {
                return null;
            }
            }  )
    })
}

dataDB.getAvailability=(destId,type)=>{

    if(type=="D")
    {
    return connection.getDestCollection().then((model)=>
    {
        return model.find({"destinationId":destId},{_id:0}).then(   (dest)=> {
           // console.log(dest)
            if(dest.length>0)
            {
                return dest;
            }
            else
            {
                return null;
            }
            }  )
    })}
    else if(type=="H"){ return connection.getHotCollection().then((model)=>
        {
            return model.find({"destinationId":destId},{_id:0}).then(   (dest)=> {
               // console.log(dest)
                if(dest.length>0)
                {
                    return dest;
                }
                else
                {
                    return null;
                }
                }  )
        })

    }
}





dataDB.getBook=()=>{
    return connection.getBookCollection().then((model)=>
    {
        return model.find({},{_id:0}).then(   (book)=> {
            
            if(book.length>0)
            {
                return book;
            }
            else
            {
                return null;
            }
            }  )
    })
}


module.exports = dataDB;
