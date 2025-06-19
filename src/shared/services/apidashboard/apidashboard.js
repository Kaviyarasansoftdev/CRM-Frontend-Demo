import axios from "axios";
import apiurl from "../apiendpoint/apiendpoint";
import {gettoken} from "../token/token";

export const getUserDashboard = async(params)=>{
   var res=await axios.get(`${apiurl()}/dashboard/apigetuserdashboard`,{params:params, headers: {"Authorization" : `Bearer ${gettoken()}`}});
   return res.data;
}

export const getDailyMISDashboard = async(params)=>{
   var res=await axios.get(`${apiurl()}/dashboard/apigetdailymisdashboard`,{params:params, headers: {"Authorization" : `Bearer ${gettoken()}`}});
   return res.data;
}

export const getDataDashboard = async(params)=>{
   var res=await axios.get(`${apiurl()}/dashboard/apigetdatadashboard`,{params:params, headers: {"Authorization" : `Bearer ${gettoken()}`}});
   return res.data;
}

export const getDailyReview = async(params)=>{
   var res=await axios.get(`${apiurl()}/dashboard/apigetdailyreview`,{params:params, headers: {"Authorization" : `Bearer ${gettoken()}`}});
   return res.data;
}

export const DataDashboard = async(data)=>{
   var res=await axios.post(`${apiurl()}/dashboard/apidatadashboard`,data,{ headers: {"Authorization" : `Bearer ${gettoken()}`}});
   return res.data;
}

export const FollowupReminder = async(data)=>{
   var res=await axios.get(`${apiurl()}/dashboard/apifollowupreminder`,{ headers: {"Authorization" : `Bearer ${gettoken()}`}});
   return res.data;
}