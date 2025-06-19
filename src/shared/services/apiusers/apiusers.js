import axios from "axios";
import apiurl from "../apiendpoint/apiendpoint";
import { gettoken } from "../token/token";

export const getallusers = async(params)=>{
   var res=await axios.get(`${apiurl()}/users/apigetalluser`,{params:params, headers: {"Authorization" : `Bearer ${gettoken()}`}});
   return res.data;
}

export const getusers = async(params)=>{
   var res=await axios.get(`${apiurl()}/users/apigetuser`,{ headers: {"Authorization" : `Bearer ${gettoken()}`}});
   return res.data;
}

export const deleteuser = async(id)=>{
   var res=await axios.delete(`${apiurl()}/users/apideleteuser`,{params:{_id:id}, headers: {"Authorization" : `Bearer ${gettoken()}`}});
   return res.data;
}

export const saveusers = async(datas)=>{
   try {
      var data = datas.Category?{...datas, Category:datas.Category.split(',')}:datas
      var res=await axios.post(`${apiurl()}/users/apisaveuser`,data,{ headers: {"Authorization" : `Bearer ${gettoken()}`}});
      return res.data;
   }
   catch(err){
      console.log(err);
   }
}
export const updateusers = async(datas)=>{
   var data = {...datas, Category:checkValueType( datas.Category) =="Array"? datas.Category:datas.Category?.split(',')}
   console.log(data)
   var res = await axios.put(`${apiurl()}/users/apiupdateuser`,data,{params:{_id:datas?._id}, headers: {"Authorization" : `Bearer ${gettoken()}`}});
   return res.data;
}

const checkValueType = (value) => {
   if (Array.isArray(value)) {
       return "Array";
   } else if (typeof value === "string") {
       return "String";
   } else {
       return "Neither Array nor String";
   }
}

