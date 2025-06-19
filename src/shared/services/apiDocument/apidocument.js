import axios from "axios";
import apiurl from "../apiendpoint/apiendpoint";
import {gettoken} from "../token/token";

export const getallDocCenter = async(params)=>{
    var res = await axios.get(`${apiurl()}/document/apigetalldoc-center`,{params:params, headers: {"Authorization" : `Bearer ${gettoken()}`}});
    return res.data;
}

export const getalldocuments = async(params)=>{
    var res = await axios.get(`${apiurl()}/document/apigetalldocument`,{params:{id:params}, headers: {"Authorization" : `Bearer ${gettoken()}`}});
    return res.data;
}

export const saveDocCenter=async(datas)=>{
    var res = await axios.post(`${apiurl()}/document/apisavedoc-center`,datas,{ headers: {"Authorization" : `Bearer ${gettoken()}`}});
    return res.data;
}

export const updateDocCenter=async(datas)=>{
    var res = await axios.put(`${apiurl()}/document/apiupdatedoc-center`,datas,{params:{_id:datas._id}, headers: {"Authorization" : `Bearer ${gettoken()}`}});
    return res.data;
}

export const saveDocument=async(datas,onUploadProgress)=>{
    const formData = new FormData();
    for (const key in datas) {
        formData.append(key, datas[key]);
    }
    var res = await axios.post(`${apiurl()}/document/apisavedocument`,formData,{ headers: {"Authorization" : `Bearer ${gettoken()}`}},onUploadProgress);
    return res.data;
}

export const updateDocument=async(datas,onUploadProgress)=>{
    const formData = new FormData();
    for (const key in datas) {
        formData.append(key, datas[key]);
    }
    var res = await axios.put(`${apiurl()}/document/apiupdatedocument`,formData,{params:{_id:datas._id}, headers: {"Authorization" : `Bearer ${gettoken()}`}},onUploadProgress);
    return res.data;
}

export const RemoveDocuments = async(data,field)=>{
    var res = await axios.put(`${apiurl()}/document/removedocument`,{field:field},{params:{_id:data._id},headers: {"Authorization" : `Bearer ${gettoken()}`}});
    return res.data;
}

export const DownloadFiles = async(field)=>{
    console.log(field)
    var res = await axios.post(`${apiurl()}/document/downloadfile`,{field:field}, {headers: {"Authorization" : `Bearer ${gettoken()}`}});
    return res.data;
}

export const getfilteroptionsDocCenter = async(data)=>{
    var res = await axios.post(`${apiurl()}/document/getfilteroptionsDocCenter`,{field:data},{headers: {"Authorization" : `Bearer ${gettoken()}`}});
    return res.data;
}

export const getFilterOptions = async(data)=>{
    var res = await axios.post(`${apiurl()}/document/getfilteroptions`,{field:data},{headers: {"Authorization" : `Bearer ${gettoken()}`}});
    return res.data;
}

