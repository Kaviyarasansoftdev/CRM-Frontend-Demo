import React, { useCallback, useEffect, useState } from 'react'
import { getalldocuments, RemoveDocuments, saveDocument, updateDocument } from '../../shared/services/apiDocument/apidocument';
import { useParams } from 'react-router-dom';
import Tableview from '../../shared/components/Document/Tableview';
import Tableheadpanel from '../../shared/components/Document/Tableheadpanel';
import AddForm from '../../shared/components/Document/Addform';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import toast from 'react-hot-toast';

export default function DocumentsPage() {

    const [tabledata, setTabledata] = useState([]);
    const [Clientdata, setClientdata] = useState([]);
    const [visible, setVisible] = useState(false);
    const [formdata, setFormdata] = useState({});
    const [progress, setProgress] = useState(0);

    const param = useParams();

    let isMounted = true;

    const getallDocuments = useCallback(async () => {
        const res = await getalldocuments(param.id);
        setTabledata(res?.resdata);
        setClientdata(res?.Clientdata);
        // }, [ globalfilter, colfilter]);
    }, []);

    useEffect(() => {
        if (isMounted) {
            getallDocuments();
        }
        return () => isMounted = false;
    }, [param.id]);

    const editfrom = (data) => {
        setFormdata(data);
        setVisible(true);
    };

    const addform = () => {
        setFormdata({});
        setVisible(true);
    };

    const handlechange =(e)=>{
        if(e.target.type=='file'){
            //   const fileSizeInBytes = e.target.files[0].size; // Get the file size in bytes
            //   const fileSizeInKB = (fileSizeInBytes / 1024).toFixed(2); // Convert to KB and round to 2 decimal places
            //   const fileSizeInMB = (fileSizeInKB / 1024).toFixed(2); 
            //   if(fileSizeInMB < "1.01"){
                setFormdata({...formdata, [e.target.name]: e.target.files[0]});
            //   }
            //   else{
            //     toast.error("File size must be below 1mb");
            //   }
            
        }
        else{
          setFormdata({...formdata, [e.target.name]: e.target.value});
        }
    }
      
    const handlesave = async (e) =>{
        e.preventDefault();
        await saveDocument({...formdata,Client_ID:param.id},(progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percentCompleted);
        });
        await getallDocuments();
        toast.success("File uploaded successfully");
        setVisible(false)
    }
    
    const handleupdate = async (e)=>{
        e.preventDefault();
        await updateDocument(formdata,(progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percentCompleted);
        });
        await getallDocuments();
        toast.success("File updated successfully")
        setVisible(false)
    }

    const removeDocument = async(data,field)=>{
        confirmDialog({
            message: 'Do you want to Remove this Document?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'bg-red-500 ml-2 text-white p-2',
            rejectClassName: 'p-2 outline-none border-0',
            accept: async () => {
                var resData = await RemoveDocuments(data,field);
                setFormdata(resData)
                toast.success("Successfully deleted");
                getallDocuments();
            }
        });
    }

    return (
        <div className="bg-white border rounded-md shadow-md">
            <Tableheadpanel addform={addform} Clientdata={Clientdata} />
            <Tableview tabledata={tabledata} editfrom={editfrom}/>

            <AddForm setVisible={setVisible} visible={visible} formdata={formdata} handlechange={handlechange} handlesave={handlesave} handleupdate={handleupdate} 
            removeDocument={removeDocument} progress={progress} />

            <ConfirmDialog />
        </div>
    )
}
