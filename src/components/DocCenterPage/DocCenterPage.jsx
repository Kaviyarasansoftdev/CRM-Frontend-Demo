import React, { useCallback, useEffect, useState } from 'react'
import { getallDocCenter, RemoveDocuments, saveDocCenter, saveDocument, updateDocCenter, updateDocument } from '../../shared/services/apiDocument/apidocument';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import toast from 'react-hot-toast';
import AddForm from '../../shared/components/DocCenter/Addform';
import Tableview from '../../shared/components/DocCenter/Tableview';
import Tableheadpanel from '../../shared/components/DocCenter/Tableheadpanel';

export default function DocCenterPage() {

  const [totalRecords, setTotalRecords] = useState(0);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(20);
  const [visible, setVisible] = useState(false);
  const [formdata, setFormdata] = useState({});

  const [tabledata, setTabledata] = useState([]);
  const [colfilter, setcolFilter] = useState({});
  const [globalfilter, setglobalfilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [tempFilterValues, setTempFilterValues] = useState([]);
  const [progress, setProgress] = useState(0);
  const [Sort, setSort] = useState({});

  let isMounted = true;

  const getallDocuments = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getallDocCenter({ first, rows, globalfilter, colfilter,Sort });
      setTabledata(res?.resdata);
      setTotalRecords(res?.totallength);
    } finally {
      setIsLoading(false);
    }
    // }, [ globalfilter, colfilter]);
  }, [first, rows, globalfilter, colfilter, Sort]);


  useEffect(() => {
    
    if (isMounted) {
      getallDocuments();
    }
    return () => isMounted = false;
  }, [getallDocuments]);

  const cusfilter = (field, value) => {
    setcolFilter(prev => ({ ...prev, [field]: {$in:value} }));
    setFirst(0); // Reset to first page when applying a new filter
  };

  const clearFilter = (event)=>{
    setcolFilter(null);
    setglobalfilter('')
    setTempFilterValues([])
    setFirst(0)
    setSort({});
  }

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
      const fileSizeInBytes = e.target.files[0].size; // Get the file size in bytes
      const fileSizeInKB = (fileSizeInBytes / 1024).toFixed(2); // Convert to KB and round to 2 decimal places
      const fileSizeInMB = (fileSizeInKB / 1024).toFixed(2); 
      console.log(fileSizeInMB)
      if(fileSizeInMB < "1.01"){
        setFormdata({...formdata, [e.target.name]: e.target.files[0]});
      }
      else{
        toast.error("File size must be below 1mb");
      }
      
    }
    else{
      setFormdata({...formdata, [e.target.name]: e.target.value});
    }
  }
  
  const handlesave = async (e) =>{
    e.preventDefault();
    await saveDocCenter(formdata);
    await getallDocuments();
    toast.success("File uploaded successfully");
    setVisible(false)
  }

  const handleupdate = async (e)=>{
    e.preventDefault();
    await updateDocCenter(formdata);
    await getallDocuments();
    toast.success("File updated successfully")
    setVisible(false)
  }

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const handleDeleteAll = () => {
    setFormdata({})
    setVisible(true)
  };

  const ConfirmDeleteAll = async (e) => {
    e.preventDefault();
    setLoading1(true)
    const {Range} = formdata
    await deleteAllAllocation({globalfilter, colfilter,Range,Sort});
    setLoading1(false)
    setVisible(false)
    getallDocuments();
  }

  const handledelete = (id) => {
    confirmDialog({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      defaultFocus: 'reject',
      acceptClassName: 'bg-red-500 ml-2 text-white p-2',
      rejectClassName: 'p-2 outline-none border-0',
      accept: async () => {
        await deleteSingleAllocation(id);
        toast.success("Successfully deleted");
        getallDocuments();
      }
    });
  };

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
      <Tableheadpanel setglobalfilter={setglobalfilter} globalfilter={globalfilter} clearFilter={clearFilter} addform={addform} />
      <Tableview tabledata={tabledata} totalRecords={totalRecords} first={first} rows={rows} editfrom={editfrom} onPageChange={onPageChange} Sort={Sort} setSort={setSort} cusfilter={cusfilter}
       tempFilterValues={tempFilterValues} setTempFilterValues={setTempFilterValues} getallDocuments={getallDocuments} />


      <AddForm setVisible={setVisible} visible={visible} formdata={formdata} handlechange={handlechange} handlesave={handlesave} handleupdate={handleupdate} 
        removeDocument={removeDocument} progress={progress} />

      <ConfirmDialog />
    </div>
  )
}
