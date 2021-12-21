import { backendUrlUser } from '../BackendURL';
import axios from "axios";


const getwallet = async () => {
    let data = {
        userId: sessionStorage.getItem("userId")

    }  
    await axios.post(backendUrlUser + '/getwallet', data)
        .then(response => {
            console.log("get wallet :", response.data[0].wallet);
            sessionStorage.setItem("wallet", response.data[0].wallet)
        }).catch(error => {
            console.log(error);
        })
    };


export { getwallet };
