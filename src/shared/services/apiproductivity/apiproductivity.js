import axios from "axios";
import { gettoken } from "../token/token";
import apiurl from "../apiendpoint/apiendpoint";

export const getallallProductivity = async(params)=>{
    var res = await axios.get(`${apiurl()}/productivity/apigetallproductivitydata`,{params:params, headers: {"Authorization" : `Bearer ${gettoken()}`}});
    return res.data;
}

export const getFilterOptions = async(data)=>{
    var res = await axios.post(`${apiurl()}/productivity/getfilteroptions`,{field:data},{headers: {"Authorization" : `Bearer ${gettoken()}`}});
    return res.data;
}