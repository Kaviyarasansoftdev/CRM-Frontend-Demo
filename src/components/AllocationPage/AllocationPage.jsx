import { useCallback, useEffect, useState } from "react";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import * as XLSX from 'xlsx';
import Tableview from "../../shared/components/Allocation/Tableview";
import Tableheadpanel from "../../shared/components/Allocation/Tableheadpanel";
import UploadForm from "../../shared/components/Allocation/Upload";
import { deleteAllAllocation, getallallocation, getexportData, savebulkallocation, sendOTP, updateAllocation } from "../../shared/services/apiallocation/apiallocation";
import toast from "react-hot-toast";
import { deleteSingleAllocation } from "../../shared/services/apiallocation/apiallocation";
import Bulkdelete from "../../shared/components/Allocation/Bulkdelete";
import AddForm from "../../shared/components/Allocation/Addform";
import { Dialog } from "primereact/dialog";
import { saveAs } from 'file-saver';
import moment from "moment-timezone";

export default function AllocationPage() {
    const [totalRecords, setTotalRecords] = useState(0);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(20);
    const [visible, setVisible] = useState(false);
    const [formdata, setFormdata] = useState({});
    const [loading, setLoading] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const [tabledata, setTabledata] = useState([]);
    const [colfilter, setcolFilter] = useState({});
    const [globalfilter, setglobalfilter] = useState('');
    const [UploadVisible, setUploadVisible] = useState(false);
    const [File, setFile] = useState([]);
    const [productCounts, setProductCounts] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [tempFilterValues, setTempFilterValues] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [Sort, setSort] = useState({});
    const [ExportVisible, setExportVisible] = useState(false);

    let isMounted = true;

    const getallallocations = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await getallallocation({ first, rows, globalfilter, colfilter,Sort });
            setTabledata(res?.resdata);
            setTotalRecords(res?.totallength);
        } finally {
            setIsLoading(false);
        }
    }, [first, rows, globalfilter, colfilter,Sort]);

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
        setSort({})
    }

    const updateTableData = async () => {
        await getallallocations();
    };

    const newform = () => {
        setFormdata({});
        setVisible(true);
    };

    const Uploadform = () => {
        setUploadVisible(true);
    };

    const editfrom = (data) => {
        setFormdata(data);
        setVisible(true);
    };

    const onPageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    const handlechange =(e)=>{
        setFormdata({...formdata, [e.target.name]: e.target.value});
    }

    const handleDeleteAll = () => {
        // setFormdata({})
        // setVisible(true)
        confirmDialog({
            message: 'Do you want to delete all this record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'bg-red-500 ml-2 text-white p-2',
            rejectClassName: 'p-2 outline-none border-0',
            accept: async () => {
                await deleteAllAllocation();
                getallallocations();
                console.log("All data deleted successfully");
            }
        });
    };

    const ConfirmDeleteAll = async (e) => {
        e.preventDefault();
        setLoading1(true)
        const {Range} = formdata
        console.log(Range)
        await deleteAllAllocation({globalfilter, colfilter,Range,Sort});
        setLoading1(false)
        setVisible(false)
        getallallocations();
    }

    const handleupload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet);
            setFile(jsonData);
        };
        reader.readAsArrayBuffer(file);
    };

    const uploadfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await savebulkallocation(File);
            getallallocations();
            toast.success("File uploaded successfully!");
        } catch (error) {
            toast.error("Failed to upload file. Please try again.");
        } finally {
            setLoading(false);
            setUploadVisible(false);
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

    const handleupdate = async (e)=>{
        e.preventDefault();
        await updateAllocation(formdata)
        await getallallocations();
        setLoading(false);
        setVisible(false)
    }

    const exportData = async ()=>{
        var res = await sendOTP();
        if(res.status == 'Success'){
            setExportVisible(true);
        }
        else{
            toast.error(res.status)
        }
    }

    const download = async (e)=>{
        e.preventDefault();
        const res = await getexportData({globalfilter, colfilter, Sort },formdata);
        if(res.status == 'Success'){
            setExportVisible(false);
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(res.resdata);
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
            const fileName = moment().add('DD-MM-YYYY HH:mm:ss')+'_Allocations.xlsx';
            XLSX.writeFile(wb, fileName);
            toast.success("Data Backup Completed");
            
        }
        else{
            toast.error(res.status)
        }
    }
    

    return (
        <div>
            <div className="bg-white border rounded-2xl">
                <Tableheadpanel newform={newform} setglobalfilter={setglobalfilter} Uploadform={Uploadform} handleDeleteAll={handleDeleteAll} tabledata={tabledata} colfilter={colfilter}
                    productCounts={productCounts} updateTableData={updateTableData} loading={loading} setLoading={setLoading} selectedRows={selectedRows}
                    clearFilter={clearFilter} globalfilter={globalfilter} Sort={Sort} exportData={exportData} />

                <Tableview tabledata={tabledata} totalRecords={totalRecords} first={first} rows={rows} updateTableData={updateTableData} onPageChange={onPageChange}
                    editfrom={editfrom} cusfilter={cusfilter} handledelete={handledelete} isLoading={isLoading} selectedRows={selectedRows} Sort={Sort} setSort={setSort}
                    setSelectedRows={setSelectedRows} clearFilter={clearFilter} tempFilterValues={tempFilterValues} setTempFilterValues={setTempFilterValues} />

                <UploadForm uploadfile={uploadfile} handleupload={handleupload} UploadVisible={UploadVisible} setUploadVisible={setUploadVisible} loading={loading} />

                <Bulkdelete visible={visible} setVisible={setVisible} ConfirmDeleteAll={ConfirmDeleteAll} handlechange={handlechange} formdata={formdata} loading={loading1} />

                <AddForm visible={visible} setVisible={setVisible} formdata={formdata} loading={loading}handleupdate={handleupdate} handlechange={handlechange} />

                <ConfirmDialog />

                <Dialog
                    visible={ExportVisible}
                    modal
                    onHide={() => {if (!ExportVisible) return; setExportVisible(false); }}
                    content={({ hide }) => (
                    <div className="px-8 py-5 gap-4" style={{ borderRadius: '12px', backgroundImage: 'radial-gradient(circle at left top, var(--primary-400), var(--primary-700))' }}>
                        <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg" className="block mx-auto">
                            <g mask="url(#mask0_2642_713)">
                                <path fillRule="evenodd" clipRule="evenodd" fill="white"
                                    d="M31.5357 13.0197L29.2036 17.0218L31.531 21.0161C32.3802 22.4733 32.3802 24.2131 31.5311 25.6702C30.682 27.1274 29.1612 27.9973 27.463 27.9973H22.8081L20.6555 31.6915C19.7975 33.164 18.2608 34.0431 16.5447 34.0431C14.8286 34.0431 13.2918 33.164 12.4337 31.6915L10.2811 27.9973H5.617C3.93113 27.9973 2.42136 27.1337 1.57841 25.6871C0.735451 24.2405 0.735451 22.5131 1.57841 21.0666L3.91045 17.0644L1.58298 13.0702C0.733895 11.613 0.733895 9.87311 1.58298 8.41596C2.43207 6.95878 3.95286 6.08884 5.65104 6.08884H10.306L12.4585 2.39474C13.3165 0.922318 14.8535 0.0430908 16.5695 0.0430908C18.2856 0.0430908 19.8223 0.922227 20.6803 2.39474L22.8329 6.08884H27.4971C29.183 6.08884 30.6927 6.95252 31.5357 8.3991C32.3787 9.84573 32.3787 11.573 31.5357 13.0197ZM16.5695 1.06124C15.225 1.0612 14.0208 1.74999 13.3486 2.90374L11.4927 6.08873H21.6463L19.7904 2.90374C19.1182 1.74999 17.914 1.06124 16.5695 1.06124ZM22.7105 26.1286L22.6607 26.2141L22.6534 26.2266L22.5337 26.432L21.8976 27.5237L21.7881 27.7117L20.4662 29.9803L20.0676 30.6643L19.7869 31.146L19.7763 31.1484L19.77 31.1592C19.0978 32.313 17.8714 32.6453 16.5269 32.6453C15.1843 32.6453 14.004 32.3149 13.3312 31.1641L13.31 31.1588L12.6277 29.9878L12.4567 29.6945L5.09715 17.0644L6.43206 14.7736L6.43225 14.7744L8.78685 10.7356L8.7852 10.7353L9.05248 10.2767L9.05421 10.277L10.9022 7.10709L22.2401 7.10314L28.017 17.0219L22.7105 26.1286ZM30.6411 25.1613C29.9777 26.2996 28.7896 26.9792 27.4629 26.9792H23.4014L28.6101 18.0401L30.641 21.5253C31.3043 22.6636 31.3043 24.0229 30.6411 25.1613ZM2.46839 25.178C3.1256 26.3058 4.30263 26.9791 5.617 26.9791H9.6878L4.50379 18.0826L2.46839 21.5756C1.81123 22.7035 1.81123 24.0502 2.46839 25.178ZM2.47303 12.5611C1.80969 11.4227 1.80969 10.0634 2.47303 8.92507C3.13632 7.78669 4.32437 7.10706 5.65105 7.10706H9.71266L4.50381 16.0462L2.47303 12.5611ZM27.497 7.10706C28.8114 7.10706 29.9885 7.78039 30.6456 8.90826C31.3028 10.036 31.3028 11.3827 30.6456 12.5106L28.6102 16.0036L23.4262 7.10706H27.497Z"
                                />
                            </g>
                            <path d="M22.0969 18.6465L20.3461 18.2616L21.7078 20.1862V26.1522L26.0214 22.3031L26.3764 15.7598L24.2367 16.5296L22.0969 18.6465Z" fill="white" />
                            <path d="M11.2035 18.6465L12.9543 18.2616L11.5926 20.1862V26.1522L7.27906 22.3031L6.92397 15.7598L9.06376 16.5296L11.2035 18.6465Z" fill="white" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M12.1761 20.5713L13.7323 18.2618L14.7049 18.8392H18.5955L19.5681 18.2618L21.1243 20.5713V29.2316L19.3056 32.6659H13.6397L12.1761 29.2316V20.5713Z" fill="white" />
                            <path d="M21.7079 29.8089L24.2367 27.3071V24.8052L21.7079 26.9221V29.8089Z" fill="white" />
                            <path d="M11.5927 29.8089L9.06387 27.3071V24.8052L11.5927 26.9221V29.8089Z" fill="white" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M16.2613 7.09967H14.1215L12.5652 10.7563L15.0941 18.0694H18.401L20.7353 10.7563L19.1791 7.09967H17.0394V18.0694H16.2613V7.09967Z" fill="white" />
                            <path d="M15.0942 18.0694L6.7296 14.9901L5.56244 10.1788L12.7599 10.7562L15.2887 18.0694H15.0942Z" fill="white" />
                            <path d="M18.4011 18.0694L26.7658 14.9901L27.9329 10.1788L20.5409 10.7562L18.2066 18.0694H18.4011Z" fill="white" />
                            <path d="M21.1245 10.1789L24.8545 9.794L22.4862 7.09967H19.7628L21.1245 10.1789Z" fill="white" />
                            <path d="M12.1762 10.1789L8.4462 9.794L10.8145 7.09967H13.5378L12.1762 10.1789Z" fill="white" />
                        </svg>
                        <form className="mt-3" onSubmit={download}>
                            <div className="inline-flex flex-column items-center gap-2">
                                <label htmlFor="username" className="text-primary-50 font-semibold"> OTP </label>
                                <input type="number" id="username" name="OTP" value={formdata.OTP} onChange={handlechange} className="bg-white-alpha-20 border p-2"></input>
                            </div>
    
                            <div className="flex align-items-center gap-2 mt-3">
                                <button onClick={(e) => hide(e)} className="px-3 py-1 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10">Cancel</button>
                                <button type="submit" className="px-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10">Export</button>
                            </div>
                        </form>

                    </div>
                    )}
                ></Dialog>
            </div>
        </div>
    );
}
