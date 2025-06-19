import axios from "axios";
import { gettoken } from "../token/token";
import apiurl from "../apiendpoint/apiendpoint";

export const getsettings = async()=>{
    var res = await axios.get(`${apiurl()}/settings/getsettings`,{ headers: {"Authorization" : `Bearer ${gettoken()}`}});
    return res.data;
}

export const updateBackup = async(data)=>{
    var res = await axios.post(`${apiurl()}/settings/updatebackup`,data,{ headers: {"Authorization" : `Bearer ${gettoken()}`}});
    return res.data;
}

export const Backup = async(data)=>{
    var res = await axios.post(`${apiurl()}/settings/backup`,{data:"backup"},{ headers: {"Authorization" : `Bearer ${gettoken()}`}});
    return res.data;
}

export const getmyaccount = async()=>{
    var res = await axios.get(`${apiurl()}/settings/getmyaccount`,{ headers: {"Authorization" : `Bearer ${gettoken()}`}});
    return res.data;
}

export const updateUsers = async(data)=>{
    var res = await axios.put(`${apiurl()}/settings/updateuser`,data,{params:{_id:data._id}, headers: {"Authorization" : `Bearer ${gettoken()}`}});
    return res.data;
}