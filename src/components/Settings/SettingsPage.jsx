import React, { useCallback, useEffect, useState } from 'react'
import Settings from '../../shared/components/Settings/Settings'
import { Backup, getmyaccount, getsettings, updateBackup, updateUsers } from '../../shared/services/apisettings/apisettings';
import toast from 'react-hot-toast';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export default function SettingsPage() {

  const [formdata, setFormdata] = useState({});
  const [acccountdata, setAcccount] = useState({});

  let isMounted = true;

  const getSettings = useCallback(async () => {
    const res = await getsettings();
    setFormdata(res)
  }, []);

  const getMyaccount = useCallback(async () => {
    const res = await getmyaccount();
    setAcccount(res)
  }, []);

  useEffect(() => {
    if (isMounted) {
      getSettings();
      getMyaccount();
    }
    return () => isMounted = false;
  }, []);

  const handlechange =(e)=>{
    setFormdata({...formdata, [e.target.name]: e.target.value});
  }

  const handlechange1 =(e)=>{
    setAcccount({...acccountdata, [e.target.name]: e.target.value});
  }

  const updatebackup = async(e)=>{
    e.preventDefault();
    var res = await updateBackup(formdata);
    toast.success("Data Updated Successfully!");
  }

  const updateUser = async(e)=>{
    e.preventDefault();
    var res = await updateUsers(acccountdata);
    toast.success("Data Updated Successfully!");
  }

  const backupNow = async()=>{
    var resData = await Backup();

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(resData);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const fileName = 'Allocations.xlsx';
    XLSX.writeFile(wb, fileName);
    toast.success("Data Backup Completed");
  }

  return (
    <div>
      <Settings handlechange={handlechange} updatebackup={updatebackup} backupNow={backupNow} formdata={formdata} acccountdata={acccountdata} handlechange1={handlechange1}
        updateUser={updateUser} />
    </div>
  )
}
