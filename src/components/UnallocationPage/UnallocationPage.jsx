import { useCallback, useEffect, useState } from "react";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import * as XLSX from 'xlsx';
import Tableview from "../../shared/components/Unallocation/Tableview";
import Tableheadpanel from "../../shared/components/Unallocation/Tableheadpanel";
import UploadForm from "../../shared/components/Unallocation/Upload";
import { deleteAllAllocation, deleteSingleAllocation, getallunallocation, saveallocation, savebulkallocation, updateAll, updateAllocation } from "../../shared/services/apiunallocation/apiunallocation";
import toast from "react-hot-toast";
import AddForm from "../../shared/components/Unallocation/Addform";
import Bulkdelete from "../../shared/components/Unallocation/Bulkdelete";
import Bulkupdate from "../../shared/components/Unallocation/Bulkupdate";

export default function UnallocationPage() {
    const [totalRecords, setTotalRecords] = useState(0);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(20);
    const [visible, setVisible] = useState(false);
    const [BulkUpdatevisible, setBulkUpdatevisible] = useState(false);
    const [formdata, setFormdata] = useState({});
    const [loading, setLoading] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [loading3, setLoading3] = useState(false);

    const [tabledata, setTabledata] = useState([]);
    const [colfilter, setcolFilter] = useState({});
    const [globalfilter, setglobalfilter] = useState('');
    const [UploadVisible, setUploadVisible] = useState(false);
    const [File, setFile] = useState([]);
    const [productCounts, setProductCounts] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRows, setSelectedRows] = useState([]);
    const [tempFilterValues, setTempFilterValues] = useState([]);
    const [AddFormVisible, setAddFormVisible] = useState(false);
    const [progress, setProgress] = useState(0);
    const [Sort, setSort] = useState({});

    let isMounted = true;

    const getallallocations = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await getallunallocation({ first, rows, globalfilter, colfilter,Sort });
            setTabledata(res?.resdata);
            setTotalRecords(res?.totallength);
        } finally {
            setIsLoading(false);
        }
        // }, [ globalfilter, colfilter]);
    }, [first, rows, globalfilter, colfilter, Sort]);


    useEffect(() => {
        if (isMounted) {
            getallallocations();
        }
        return () => isMounted = false;
    }, [getallallocations]);

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

    const updateTableData = async () => {
        await getallallocations();
    };

    const editfrom = (data) => {
        setFormdata(data);
        setAddFormVisible(true);
    };

    const addform = () => {
        setFormdata({});
        setAddFormVisible(true);
    };

    const handlechange =(e)=>{
        setFormdata({...formdata, [e.target.name]: e.target.value});
    }
    
    const handlesave = async (e) =>{
        e.preventDefault();
        setLoading2(true);
        console.log(formdata);
        await saveallocation(formdata);
        await getallallocations();
        setLoading2(false);
        setAddFormVisible(false)
    }

    const handleupdate = async (e)=>{
        e.preventDefault();
        await updateAllocation(formdata)
        await getallallocations();
        setLoading2(false);
        setAddFormVisible(false)
    }

    const Uploadform = (data) => {
        setFormdata(data);
        setUploadVisible(true);
    };

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
        getallallocations();
    }

    const BulkupdatForm = async()=>{
        setBulkUpdatevisible(true)
        setFormdata({})
    }

    const handleUpdateAll = async(e)=>{
        e.preventDefault();
        setLoading3(true)
        confirmDialog({
            message: (
                <div>
                    <p><strong>Please Confirm the Datas</strong></p>
                    <div> Range: <span className="bg-red-500 text-white text-center px-3 rounded-md"> {formdata.Range} </span></div>
                    <div><span>Field: {formdata.field} </span></div>
                    <div><span>Replaced Value: {formdata.Value} </span></div>
                </div>
            ),//`Do you want to update this records? <span className="bg-red-500 text-white"> ${formdata.Range} </span>`,
            header: 'Update Confirmation',
            icon: 'pi pi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'bg-red-500 ml-2 text-white p-2',
            rejectClassName: 'p-2 outline-none border-0',
            accept: async () => {
                await updateAll({formdata, colfilter, Sort});
                toast.success("Successfully Updated");
                getallallocations();
                setBulkUpdatevisible(false)
                setFormdata({})
                setLoading3(false)
            }
        });
    }

    const handleupload = (e) => {
        //console.log(e.target.files)
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet);

            const seen = new Set();
            const uniqueData = jsonData.filter(item => {
                if (seen.has(item.Mobile1)) {
                    return false;
                } else {
                    seen.add(item.Mobile1);
                    return true;
                }
            });
            setFile(uniqueData);
            
        };
        reader.readAsArrayBuffer(file);
    };

    const uploadfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await savebulkallocation(File,(progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setProgress(percentCompleted);
            });

        } catch (error) {
            toast.error("Failed to upload file. Please try again.");
        } finally {
            setLoading(false);
            setUploadVisible(false);
            setProgress(0)
            getallallocations();
            toast.success("File uploaded successfully!");
        }
    };

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
                getallallocations();
            }
        });
    };

    return (
        <div>
            <div className="bg-white border rounded-2xl">
                <Tableheadpanel colfilter={colfilter} setglobalfilter={setglobalfilter} Uploadform={Uploadform} handleDeleteAll={handleDeleteAll} tabledata={tabledata}
                    productCounts={productCounts} updateTableData={updateTableData} loading={loading} setLoading={setLoading} selectedRows={selectedRows} loading1={loading1}
                    addform={addform} clearFilter={clearFilter} globalfilter={globalfilter} Sort={Sort} BulkupdatForm={BulkupdatForm} />

                <Tableview tabledata={tabledata} totalRecords={totalRecords} first={first} rows={rows} updateTableData={updateTableData} onPageChange={onPageChange}
                    editfrom={editfrom} cusfilter={cusfilter} handledelete={handledelete} isLoading={isLoading} selectedRows={selectedRows} Sort={Sort} setSort={setSort}
                    setSelectedRows={setSelectedRows} clearFilter={clearFilter} tempFilterValues={tempFilterValues} setTempFilterValues={setTempFilterValues} />

                <UploadForm uploadfile={uploadfile} handleupload={handleupload} UploadVisible={UploadVisible} setUploadVisible={setUploadVisible} loading={loading} progress={progress} />
                <AddForm AddFormVisible={AddFormVisible} setAddFormVisible={setAddFormVisible} formdata={formdata} loading={loading2} handlesave={handlesave} 
                    handleupdate={handleupdate} handlechange={handlechange} />

                <ConfirmDialog />

                <Bulkdelete visible={visible} setVisible={setVisible} ConfirmDeleteAll={ConfirmDeleteAll} handlechange={handlechange} formdata={formdata} loading={loading1} />
                <Bulkupdate BulkUpdatevisible={BulkUpdatevisible} setBulkUpdatevisible={setBulkUpdatevisible} handleUpdateAll={handleUpdateAll} handlechange={handlechange} formdata={formdata} loading={loading3} />
            </div>
        </div>
    );
}