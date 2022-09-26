import axios from "axios"
import { ENDPOINT } from "../utils/endpoints"

export const signPresenceWithApi = async(user_id) => {

    try{
        const sign = await axios.post(ENDPOINT + '/docente/sign',{id:user_id});
        return sign;
    }catch( error ){
        return error;
    }
}

export const getPresences = async(id) => {

    try{
        const presence = await axios.get(ENDPOINT + '/docente/presences/' + id);
        return presence;
    }catch( error){
        return error;
    }
}

export const nextPageData = async(next_page_url) => {
    try{
        const presence = await axios.get(next_page_url);
        return presence;
    }catch( error){
        return error;
    }
}

export const searchData = async(date_,id_) => {
    try{
        const data = await axios.post(ENDPOINT + '/docente/presences/search',{date:date_,id:id_});
        return data;
    }catch( error ) {
        return error;
    }

}


export const postWorkDuraion = async(id) => {
        
    try{
        const job = await axios.post(ENDPOINT+"/work/"+id);
        return job;
    }catch( error ){
        return error;
    }

}


export const updateFingerPrint = async(id,printId,reset = false) => {

    try{
        const data = await axios.put(ENDPOINT + "/fingerprint/"+id,{fingerprint:printId,reset:reset});
        return data;
    }catch( error ){
        return error;
    }
}


export const resetFinger = async(id,num) => {
    try{
        const data = await axios.put(ENDPOINT+"/fingerprint/reset/"+id,{num});
        return data;
    }catch( error ){
        return error;
    }
}