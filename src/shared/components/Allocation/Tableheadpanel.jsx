/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import useAuth from '../../services/store/useAuth';
import { getalltelecallerallocation } from '../../services/apitelecalleralloaction/apitelecallerallocation';
import { allocateteamleader } from '../../services/apiallocation/apiallocation';
import toast from 'react-hot-toast';
import { NavLink } from 'react-router-dom';
import { getalltelecallerTeam } from '../../services/apiunallocation/apiunallocation';


export default function Tableheadpanel(props) {
    const { handleDeleteAll, Uploadform, setglobalfilter, tabledata, updateTableData, loading, setLoading, colfilter,globalfilter, clearFilter, Sort, setSort, exportData } = props;
    const [showModal, setShowModal] = useState(false);
    const [formdata, setFormdata] = useState({allocationType:'teamLeader'});
    const [selectedTeamLeader, setSelectedTeamLeader] = useState('');
    const [teamLeaders, setTeamLeaders] = useState([]);
    const [telecallers, setTelecallers] = useState([]);
    const [allocationRange, setAllocationRange] = useState();
    const { userdetails } = useAuth();
    const isMounted = useRef(false);

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const handleAllocateCancel = () => {
        setShowModal(false);
        setFormdata({allocationType:'teamLeader'})
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
        console.log({formdata, colfilter})
        setLoading(true);
        await allocateteamleader({formdata, colfilter, Sort });
        //console.log('Bulk allocation saved successfully.');
        updateTableData();
        toast.success("Allocation completed successfully!", { duration: 4000 });
        setLoading(false);
        setShowModal(false);


    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const telecallerAllocationData = await getalltelecallerTeam({});
                const allTeamLeaders = telecallerAllocationData.resdata.map(item => item.teamleader[0]);
                const allTelecallers = telecallerAllocationData.resdata.reduce((acc, curr) => acc.concat(curr.telecaller), []);
                if (isMounted.current) {
                    setTeamLeaders(allTeamLeaders);
                    setTelecallers(allTelecallers);

                    // Set the selectedTeamLeader value based on the user's role
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

    return (
        <div className="flex flex-col items-center justify-between px-6 py-4 space-y-4 lg:flex-row lg:space-y-0">
            <div className='block md:flex justify-center items-center gap-2'>
                <h2 className="mx-1 text-xl text-center md:text-start font-semibold text-gray-800 mb-2">Allocation Data</h2>
                <div className='flex gap-2 mx-5'>
                    <NavLink to={"/unallocation"} isActive={(match, location) => { if (location.pathname === '/unallocation' || location.pathname === '/') { return true;  }  return false; }}
                        className={({ isActive }) => `flex items-center font-semibold py-2 px-2.5 ${isActive ? "bg-gradient-to-b from-cyan-400 to-cyan-600" : "bg-gradient-to-b from-gray-400 to-gray-600" } text-sm text-white  rounded-md ` } >
                        UnAllocated
                    </NavLink>
                    <NavLink to={"/allocation"} isActive={(match, location) => { if (location.pathname === '/allocation') { return true; } return false; }}
                        className={({ isActive }) => `flex items-center font-semibold gap-x-3.5 py-2 px-2.5 ${isActive ? "bg-gradient-to-b from-cyan-400 to-cyan-600" : "bg-gradient-to-b from-gray-400 to-gray-600" } text-sm text-white  rounded-md  ` } >
                        Allocated
                    </NavLink>
                </div>
            </div>
            <div className="flex-none px-2 lg:flex items-center lg:gap-x-2 gap-x-3">
                <div className="flex mb-3 md:mb-0 justify-between">
                    {(userdetails()?.Role === 'SuperAdmin' || userdetails()?.Role === 'TeamLeader') && (
                        <button onClick={toggleModal} className="inline-flex me-2 items-center px-3 py-2 text-sm font-semibold text-white border-transparent rounded-md bg-gradient-to-b from-gray-400 to-gray-600 gap-x-2 hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none">
                            <i className="fi fi-rr-add"></i> <span className="hidden md:block">Reallocate Data</span>
                        </button>
                    )}
                    {/* {userdetails()?.Role === 'SuperAdmin' && (
                        <button onClick={handleDeleteAll} className="inline-flex me-2 items-center px-3 py-2 text-sm font-semibold text-white border-transparent rounded-md bg-gradient-to-b from-red-400 to-red-600 gap-x-2 hover:bg-red-800">
                            <i className="fi fi-rr-trash"></i><span className="hidden md:block"> Bulk Delete</span>
                        </button>
                    )} */}
                    {userdetails()?.Role === 'SuperAdmin' && (
                        <button onClick={exportData} className="inline-flex items-center px-3 pt-2 pb-1 text-md font-semibold text-white border-transparent rounded-md bg-gradient-to-b bg-green-600 ">
                            <i className="fi fi-rs-file-excel"></i>
                        </button>
                    )}
                </div>
                <div className='py-2 flex items-center'>
                    <input type="input" value={globalfilter} placeholder="Search..." className="py-2 px-4 rounded-md border outline-none me-2" onChange={(e)=>setglobalfilter(e.target.value)} />
                    <button onClick={clearFilter} className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-md border border-transparent bg-[#193762] text-white hover:bg-[#193762] disabled:opacity-50 disabled:pointer-events-none">
                        <i className="fi fi-rr-clear-alt pt-1"></i>
                    </button>
                </div>
            </div>


            <Dialog header="Reallocate Leads" visible={showModal} onHide={() => handleAllocateCancel()} modal className="p-4 bg-white rounded-lg w-[600px]">
                <form onSubmit={handleAllocateConfirm}>
                    <div className="p-fluid">
                            
                        <div className="mb-4 p-field">
                            <label className="block mb-1">Allocate To</label>
                            <select name="allocationType" value={formdata.allocationType} onChange={(e) => handlechange(e)} className="w-full px-4 py-2 border border-gray-300 rounded-md p-inputtext p-component" required>
                                <option value="Admin">Admin</option>
                                <option value="teamLeader">Team Leader</option>
                                <option value="telecaller">Telecaller</option>
                            </select>
                        </div>
                        { ['teamLeader','telecaller'].includes(formdata.allocationType) && (
                            <>
                                <div className="mb-4 p-field">
                                    <label className="block mb-1">Select Team Leader</label>
                                    <select name="selectedTeamLeader" value={formdata.selectedTeamLeader} onChange={(e) => handlechange(e)} className="w-full px-4 py-2 border border-gray-300 rounded-md p-inputtext p-component" required>
                                        <option value="">Select a Team Leader</option>
                                        {teamLeaders.map((user) => (
                                            <option key={user.UserName} value={user.UserName}>
                                                {user.First_Name} ({user.UserName})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {formdata.allocationType === 'telecaller' && (
                                    <div className="mb-4 p-field">
                                        <label className="block mb-1">Select Telecaller</label>
                                        <select name="selectedTelecaller" value={formdata.selectedTelecaller} onChange={(e) => handlechange(e)} className="w-full px-4 py-2 border border-gray-300 rounded-md p-inputtext p-component" required>
                                            <option value="">Select a Telecaller</option>
                                            {telecallers.map((user) => (
                                                <option key={user.UserName} value={user.UserName}>
                                                    {user.First_Name} ({user.UserName})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </>
                        )}

                        <div className="mb-4 p-field">
                            <label className="block mb-1">Clear Disposition</label>
                            <select name="Clear_Disposition" value={formdata.Clear_Disposition} onChange={(e) => handlechange(e)} className="w-full px-4 py-2 border border-gray-300 rounded-md p-inputtext p-component" required>
                                <option value="">Select </option>
                                <option value="Disposition Only">Disposition Only</option>
                                <option value="Subdisposition Only">Subdisposition Only</option>
                                <option value="Clear Both">Clear Both</option>
                                <option value="Dont Clear">Dont Clear</option>
                            </select>
                        </div>
                         
   

                        <div className="mb-4 p-field">
                            <label className="block mb-1">No of Datas</label>
                            <input type="number" name="allocationRange" value={allocationRange} onChange={(e) => handlechange(e)} className="w-full px-4 py-2 border border-gray-300 rounded-md p-inputtext p-component" min="1" required/>
                        </div>
                    </div>
                    <div className="flex justify-end mt-4">
                        <Button label="Cancel" className="px-2 mr-2 text-white bg-red-500 p-button-text hover:bg-red-600" onClick={handleAllocateCancel} />
                        {loading && <span className="inline-block w-4 h-4 mr-2 text-blue-500 border-2 border-current rounded-full animate-spin border-t-transparent" aria-label="loading"></span>}
                        <Button type='submit' label="Allocate" className="px-2 text-white bg-green-500 p-button-text hover:bg-green-600" autoFocus disabled={loading} />
                    </div>
                </form>
            </Dialog>
        </div>
    );
}
