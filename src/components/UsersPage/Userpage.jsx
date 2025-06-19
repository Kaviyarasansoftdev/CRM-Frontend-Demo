import { useCallback, useEffect, useRef, useState } from "react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import toast from "react-hot-toast";
import Tableheadpanel from "../../shared/components/Users/Tableheadpanel";
import Addandeditform from "../../shared/components/Users/Addandeditform";
import { Tableview } from "../../shared/components/Users/Tableview";
import { deleteuser, getallusers, saveusers, updateusers } from "../../shared/services/apiusers/apiusers";
import Tablepagination from "../../shared/components/others/Tablepagination";

export default function Userspage(){

    const [totalRecords, setTotalRecords] = useState(0);
    const [page, setPage] = useState(1);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(20);
    const [visible, setVisible] = useState(false);
    const [formdata, setFormdata]=useState({});
    const [loading, setLoading] = useState(false);
    const [tabledata, setTabledata]=useState([]);
    const [colfilter, setcolFilter] = useState({});
    const [globalfilter, setglobalfilter]=useState('');
    const [filtervalues,setfiltervalues]=useState([]);
    const [teamLeaders, setTeamLeaders] = useState([]);
    const [teleCallers, setTeleCallers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeButton, setActiveButton] = useState('All');


    let isMounted = true;
    const fetchAllUsers = useCallback(async () => {
        //console.log({ first, rows, ...colfilter });
        try {
            setIsLoading(true);
            const res = await getallusers({ first, rows, activeButton, globalfilter, colfilter });
            setIsLoading(false);
            setTabledata(res?.resdata);
            setTotalRecords(res?.totallength);
        } catch (error) {
            console.error(error);
        }
    }, [first, rows, activeButton, globalfilter, colfilter]);
    
    useEffect(() => {
        if (isMounted) {
            fetchAllUsers();
        }
        return (() => isMounted = false);
    }, [first, rows, activeButton, globalfilter, colfilter]);

    const onPage = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    const cusfilter = (field, value) => {
        setcolFilter({...colfilter,...{[field]:value}})
    };

    const handlechange = (e)=>{
        if(e.target.files){
            setFormdata({...formdata,...{[e.target.name]:e.target.files}});
        }
        else {
            setFormdata({...formdata,...{[e.target.name]:e.target.value}});
        }
    }

    const handlesave=async (e)=>{
        e.preventDefault();
        setLoading(true);
        await saveusers(formdata);
        toast.success("Sucessfully saved");
        fetchAllUsers();
        setVisible(false);
        setLoading(false);
    }

    const newform=()=>{
        setFormdata({});
        setVisible(true);
    }

    const editfrom=(data)=>{
        setFormdata(data);
        setVisible(true);
    }

    const handleupdate=async (e)=>{
        e.preventDefault();
        setLoading(true);
        await updateusers(formdata);
        toast.success("Sucessfully updated");
        fetchAllUsers();
        setVisible(false);
        setLoading(false);
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
                await deleteuser(id)
                toast.success("Successfully deleted")
                fetchAllUsers();
            }
        });
    };

    return(
        <div>
            <div className="bg-white border rounded-2xl">
                <Tableheadpanel newform={newform} setglobalfilter={setglobalfilter} teamLeaders={teamLeaders} teleCallers={teleCallers} />

                <Tableview tabledata={tabledata} totalRecords={totalRecords} first={first} rows={rows} editfrom={editfrom} activeButton={activeButton} setActiveButton={setActiveButton}
                cusfilter={cusfilter} filtervalues={filtervalues} onPage={onPage} handledelete={handledelete} isLoading={isLoading} setFirst={setFirst}/>

                {/* <Tablepagination page={page} first={first} rows={rows} totalRecords={totalRecords} onPage={onPage} /> */}

                <Addandeditform visible={visible} setVisible={setVisible} loading={loading} formdata={formdata} setFormdata={setFormdata} handlechange={handlechange}
                 handlesave={handlesave} handleupdate={handleupdate} />

                <ConfirmDialog />
            </div>
        </div>
    )
}
