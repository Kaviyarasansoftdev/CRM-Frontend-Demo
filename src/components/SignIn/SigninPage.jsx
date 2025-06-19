import { useState } from "react";
import SignIn from "../../shared/components/forms/signin";
import { apilogin } from "../../shared/services/apiauthentication/apilogin";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAuth from "../../shared/services/store/useAuth";

const SigninPage = () => {
    const {login}=useAuth();
    const navigate = useNavigate();
    const [formdata,setformdata]=useState({});
    const handlechange = (e) => setformdata({...formdata,[e.target.name]:e.target.value});
   
    const handlelogin=async(e)=>{
        e.preventDefault();
        console.log(location);
        const res = await apilogin(formdata);
        console.log(res); 
        if (res.status === "Success") {
          toast.success("Login successfully")
          navigate('/dashboard')
        } else{
            toast.error(res.status);
        }
        login(res.token)
    };
   
  return (

    <div>
        <SignIn handlechange={handlechange} handlelogin={handlelogin}/>
    </div>
  );
};

export default SigninPage;
