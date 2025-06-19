import { Dialog } from "primereact/dialog";
import { getalltelecallerTeam } from "../../services/apiunallocation/apiunallocation";
import { useEffect, useRef, useState } from "react";
import useAuth from "../../services/store/useAuth";
import { Button } from "primereact/button";
import toast from "react-hot-toast";
import { allocateteamleader } from "../../services/apiallocation/apiallocation";
import { Reallocateleads } from "../../services/apitelecalleralloaction/apitelecallerallocation";
import { TabPanel, TabView } from "primereact/tabview";

/* eslint-disable react/prop-types */
export default function Tableheadpanel (props) {
    const {updateData,colfilter, handleButtonClick, activeButton,dispositionfilter,Sort, setFirst,showModal, setShowModal } = props;

    const [loading, setLoading] = useState(false);
    const [selectedTelecaller, setSelectedTelecaller] = useState('');
    const [telecallers, setTelecallers] = useState([]);
    const [teamLeaders, setTeamLeaders] = useState([]);
    const [formdata, setFormdata] = useState({allocationType:'telecaller'});
    const [selectedTeamLeader, setSelectedTeamLeader] = useState('');

    const { userdetails } = useAuth();
    const isMounted = useRef(false);

    //console.log(userdetails())

    useEffect(() => {
        setFirst(0);
    }, [activeButton]);

    const handleAllocateCancel = async () => {
        setShowModal(false);
        const Resdata = await getalltelecallerTeam({});
        const result = Resdata.resdata.filter(group => group.telecaller.some(telecaller => telecaller.UserName === userdetails().UserName)).map(group => group.teamleader[0].UserName);  // Maps the filtered group to the team leader's UserName
        setFormdata({allocationType:'telecaller',selectedTeamLeader:result[0]}) ;

        
        setLoading(false);
    };

    const handlechange = (e) => {
        setFormdata({...formdata,[e.target.name]:e.target.value})
        if(e.target.name == 'selectedTeamLeader'){
            setSelectedTeamLeader(e.target.value)
        }
    };

    const handleAllocateConfirm = async (e) => {
        e.preventDefault();
        setLoading(true);
        await Reallocateleads({ formdata, colfilter, Sort,dispositionfilter });
        updateData();
        toast.success("Allocation completed successfully!", { duration: 4000 });
        setLoading(false);
        setShowModal(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const telecallerAllocationData = await getalltelecallerTeam();
                const result = telecallerAllocationData.resdata.filter(group => group.telecaller.some(telecaller => telecaller.UserName === userdetails().UserName)).map(group => group.teamleader[0].UserName);  // Maps the filtered group to the team leader's UserName
                setFormdata({allocationType:'telecaller',selectedTeamLeader:result[0]}) ;
                setSelectedTeamLeader(result[0])

                const allTeamLeaders = telecallerAllocationData.resdata.map(item => item.teamleader[0]);
                const allTelecallers = telecallerAllocationData.resdata.reduce((acc, curr) => acc.concat(curr.telecaller), []);
                if (isMounted.current) {
                    setTeamLeaders(allTeamLeaders);
                    setTelecallers(allTelecallers);

                    if (userdetails()?.Role === 'TeamLeader') {
                        const currentUser = allTeamLeaders.find(user => user.UserName === userdetails().UserName);
                        setSelectedTeamLeader(currentUser?.UserName || '');
                    }
                }
            } catch (error) {
                console.error("Error fetching telecaller allocation data:", error);
            }
        };

        if (!isMounted.current) {
            isMounted.current = true;
            fetchData();
        }
    }, []);

    useEffect(() => {
        const fetchTelecallers = async () => {
            try {
                if (selectedTeamLeader) {
                    const telecallerAllocationData = await getalltelecallerTeam({});
                    const teamLeader = telecallerAllocationData.resdata.find(item => item.teamleader[0].UserName === selectedTeamLeader);
                    if (teamLeader && isMounted.current) {
                        const telecallersForSelectedTeamLeader = teamLeader.telecaller;
                        setTelecallers(telecallersForSelectedTeamLeader);
                    }
                }
            } catch (error) {
                console.error("Error fetching telecallers:", error);
            }
        };

        fetchTelecallers();
    }, [selectedTeamLeader]);

    const tab1HeaderTemplate = (options,data) => {
        return (
          <div className="text-nowrap" style={{ cursor: 'pointer' }} onClick={options.onClick}>
            <div className="p-3 font-bold white-space-nowrap" onClick={()=>handleButtonClick(data.Key)}>{data.title}</div>
          </div>
        );
    };

    const scrollableTabs = [
        {title :"Allocated Leads",Key:"Allocated Leads"},
        {title :"Workable Leads",Key:"Call Back"},
        {title :"Non Workable Leads",Key:"Non Workable Leads"},
        {title :"Followups",Key:"Followups"},
        {title :"Lead Accepted",Key:"Lead Submitted"},
    ]

    return (
        <>
            <div className="items-center justify-center px-3 py-1 mt-1 space-y-3 lg:space-y-0 lg:flex">
                <TabView className="My-tab" scrollable>
                    {scrollableTabs.map((tab,index) => {
                        return (
                            <TabPanel key={index} headerTemplate={(e)=>tab1HeaderTemplate(e,tab)}> </TabPanel>
                        );
                    })}
                </TabView>
            </div>
            
            <Dialog header="Allocate Users" visible={showModal} onHide={() =>handleAllocateCancel()} modal className="p-4 bg-white rounded-lg w-[600px]">
                <form onSubmit={handleAllocateConfirm}>
                    <div className="p-fluid">
                    {(userdetails()?.Role === 'Telecaller') && (
                        <>
                            <div className="mb-4 p-field">
                                <label className="block mb-1">Allocate To</label>
                                <select name="allocationType" value={formdata.allocationType} onChange={(e) => handlechange(e)} className="w-full px-4 py-2 border border-gray-300 rounded-md p-inputtext p-component" required>
                                    <option value="Admin">Admin</option>
                                    <option value="telecaller">Telecaller</option>
                                </select>
                            </div>
                            {formdata.allocationType != 'Admin' && ( <>
                                {/* <div className="mb-4 p-field">
                                    <label htmlFor="selectedTeamLeader" className="block mb-1">Select Team Leader</label>
                                    <select name="selectedTeamLeader" value={formdata.selectedTeamLeader} onChange={(e) => handlechange(e)} className="w-full px-4 py-2 border border-gray-300 rounded-md p-inputtext p-component" required>
                                        <option value="">Select a Team Leader</option>
                                        {teamLeaders.map((user) => (
                                            <option key={user.UserName} value={user.UserName}>
                                                {user.First_Name} ({user.UserName})
                                            </option>
                                        ))}
                                    </select>
                                </div> */}

                                <div className="mb-4 p-field">
                                    <label htmlFor="selectedTelecaller" className="block mb-1">Select Telecaller</label>
                                    <select name="selectedTelecaller" value={formdata.selectedTelecaller} onChange={(e) => handlechange(e)} className="w-full px-4 py-2 border border-gray-300 rounded-md p-inputtext p-component" required>
                                        <option value="">Select a Telecaller</option>
                                        {telecallers.map((user) => (
                                            <option key={user.UserName} value={user.UserName}>
                                                {user.First_Name} ({user.UserName})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>)}

                            <div className="mb-4 p-field">
                                <label className="block mb-1">No of Datas</label>
                                <input type="number" name="allocationRange" value={formdata.allocationRange} onChange={(e) => handlechange(e)} className="w-full px-4 py-2 border border-gray-300 rounded-md p-inputtext p-component" min="1" required/>
                            </div>
                        </>
                    )}
                    </div>
                    <div className="flex justify-end mt-4">
                        <Button label="Cancel" className="px-2 mr-2 text-white bg-red-500 p-button-text hover:bg-red-600" onClick={handleAllocateCancel} />
                        {loading && <span className="inline-block w-4 h-4 mr-2 text-blue-500 border-2 border-current rounded-full animate-spin border-t-transparent" aria-label="loading"></span>}
                        <Button type="submit" label="Allocate" className="px-2 text-white bg-green-500 p-button-text hover:bg-green-600" autoFocus disabled={loading} />
                    </div>
                </form>
        </Dialog>
    </>
    );
}