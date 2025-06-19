import axios from "axios";
import { gettoken } from "../token/token";
import apiurl from "../apiendpoint/apiendpoint";

export const getallTeam = async(params)=>{
    var res = await axios.get(`${apiurl()}/users/apigetallteam`,{params:params, headers: {"Authorization" : `Bearer ${gettoken()}`}});
    return res.data;
}