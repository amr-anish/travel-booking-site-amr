const user={
    name: "Anish",
    emailId: "abc@gmail.com",
    contactNo: 9487274021,
    password: "Abc@1234"
}

const validate=(name)=>{
    //let cnoRegex = /[a-zA-Z][a-zA-Z ]+[a-zA-Z]$/
    
    //if(!name.match(cnoRegex)){
        if(name=="Anish"){
        return "valid name"
    }else{
        // return "invalid"
        throw new Error("invalid name")
    }
}






module.exports={user,validate}