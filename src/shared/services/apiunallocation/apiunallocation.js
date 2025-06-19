import axios from "axios";
import apiurl from "../apiendpoint/apiendpoint";
import {gettoken} from "../token/token";

export const getallallocation = async(params)=>{
   var res = await axios.get(`${apiurl()}/allocation/apigetallallocation`,{params:params, headers: {"Authorization" : `Bearer ${gettoken()}`}});
   return res.data;
}

export const getallunallocation = async(params)=>{
   var res = await axios.get(`${apiurl()}/unallocation/apigetallallocation`,{params:params, headers: {"Authorization" : `Bearer ${gettoken()}`}});
   return res.data;
}

export const getalltelecallerTeam = async(params)=>{
   var res = await axios.get(`${apiurl()}/unallocation/getalltelecallerteam`,{params:params, headers: {"Authorization" : `Bearer ${gettoken()}`}});
   return res.data;
}

export const saveallocation=async(datas)=>{
   try {
      var res = await axios.post(`${apiurl()}/unallocation/apisaveallocation`,datas,{ headers: {"Authorization" : `Bearer ${gettoken()}`}});
      return res.data;
   }
   catch(err){
      console.log(err);
   }
}

export const savebulkallocation=async(datas,onUploadProgress)=>{
   try {
      var res = await axios.post(`${apiurl()}/unallocation/apisavebulkallocation`,datas,{ headers: {"Authorization" : `Bearer ${gettoken()}`},onUploadProgress});
      return res.data;
   }
   catch(err){
      console.log(err);
   }
}

export const updateAll = async(datas)=>{
   try {
      var res = await axios.post(`${apiurl()}/unallocation/apiupdateall`,datas,{ headers: {"Authorization" : `Bearer ${gettoken()}`}});
      return res.data;
   }
   catch(err){
      console.log(err);
   }
}

export const getallfollowup = async(params)=>{
   var res = await axios.get(`${apiurl()}/unallocation/apigetfollowupandfuturefollowupdata`,{params:params, headers: {"Authorization" : `Bearer ${gettoken()}`}});
   return res.data;
}

export const allocateteamleader = async(datas)=>{
   try {
      var res = await axios.post(`${apiurl()}/unallocation/apiallocateteamleader`,datas,{ headers: {"Authorization" : `Bearer ${gettoken()}`}});
      return res.data;
   }
   catch(err){
      console.log(err);
   }
}

 export const deleteAllAllocation = async (data) => {
   try {
      const res = await axios.delete(`${apiurl()}/unallocation/apideleteallocation`, { params:data, headers: { "Authorization": `Bearer ${gettoken()}` } });
      return res.data;
   } catch (error) {
      console.error("Error deleting all unallocation:", error);
      throw error; // Optionally, handle the error based on your requirements
   }
};

export const deleteSingleAllocation = async (id) => {
   var res = await axios.delete(`${apiurl()}/unallocation/apideletesingleallocation`, {params:{_id:id}, headers: {"Authorization" : `Bearer ${gettoken()}`}});
   return res.data;
};

export const updateAllocation = async (data) => {
   try {
      const response = await axios.put(`${apiurl()}/unallocation/apiupdatallocation`, data, { params:{_id:data._id}, headers: { "Authorization": `Bearer ${gettoken()}` } });
      return response.data;
   } catch (error) {
      console.error('Error updating data:', error);
      throw error;
   }
};

export const getFilterOptions = async(data)=>{
   var res=await axios.post(`${apiurl()}/unallocation/getfilteroptions`,{field:data},{headers: {"Authorization" : `Bearer ${gettoken()}`}});
   return res.data;
}