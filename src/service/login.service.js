import { ENDPOINT } from "../utils/endpoints"
import axios from "axios";

export const signInWithApi = async(email,password) => {

    try{
        const data = await axios.post(ENDPOINT + '/docente/login',{email:email,senha:password},{headers:{"Accept":"application/json"}})
        return data;
    }catch( error ){
        return error;
    }

} 