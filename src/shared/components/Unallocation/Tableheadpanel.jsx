/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import useAuth from '../../services/store/useAuth';
import { getalltelecallerallocation } from '../../services/apitelecalleralloaction/apitelecallerallocation';
import { allocateteamleader, getalltelecallerTeam } from '../../services/apiunallocation/apiunallocation';
import toast from 'react-hot-toast';
import { NavLink } from 'react-router-dom';

export default function Tableheadpanel(props) {
    const { handleDeleteAll, Uploadform, setglobalfilter, globalfilter, clearFilter, updateTableData, loading, setLoading, colfilter, addform,Sort,BulkupdatForm } = props;
    const [showModal, setShowModal] = useState(false);
    const [formdata, setFormdata] = useState({allocationType:'teamLeader'});
    const [selectedTeamLeader, setSelectedTeamLeader] = useState('');
     const [teamLeaders, setTeamLeaders] = useState([]);
    const [telecallers, setTelecallers] = useState([]);
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
        setLoading(true);
        await allocateteamleader({formdata, colfilter,Sort });
        updateTableData();
        toast.success("Allocation completed successfully!", { duration: 4000 });
        setLoading(false);
        setShowModal(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const telecallerAllocationData = await getalltelecallerTeam();
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
        <>
            <div className="flex flex-col items-center justify-between px-6 py-4 space-y-4 lg:flex-row lg:space-y-0">
                <div className='block md:flex justify-center items-center gap-2'>
                    <h2 className="text-xl text-center md:text-start font-semibold text-gray-800 mb-3">Unallocation</h2>

                    <div className="flex justify-center">
                        <NavLink to={"/unallocation"} isActive={(match, location) => { if (location.pathname === '/unallocation' || location.pathname === '/') { return true; } return false; }}
                            className={({ isActive }) => `flex items-center font-semibold py-2 px-2.5 me-2 ${isActive ? "bg-gradient-to-b from-cyan-400 to-cyan-600" : "bg-gradient-to-b from-gray-400 to-gray-600" } text-sm text-white  rounded-md ` } >
                            Un Allocated
                        </NavLink>
                        <NavLink to={"/allocation"} isActive={(match, location) => { if (location.pathname === '/allocation') { return true; }  return false; }}
                            className={({ isActive }) =>`flex items-center font-semibold gap-x-3.5 py-2 px-2.5 ${isActive ? "bg-gradient-to-b from-cyan-400 to-cyan-600" : "bg-gradient-to-b from-gray-400 to-gray-600" } text-sm text-white  rounded-md  ` } >
                            Allocated
                        </NavLink>
                    </div>
                </div>

                <div className="md:flex items-center px-2 py-2 lg:flex-row gap-x-2">
                    <div className="flex mb-3 md:mb-0 justify-between">
                        {(userdetails()?.Role === 'SuperAdmin' || userdetails()?.Role === 'TeamLeader') && (
                            <button onClick={toggleModal} className="md:me-2 inline-flex items-center px-3 py-2 text-sm  text-white border-transparent rounded-md bg-gradient-to-b from-gray-400 to-gray-600 gap-x-2 hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none">
                                <i className="fi fi-ss-chart-tree"></i> <span className="hidden 2xl:block">Allocate</span>
                            </button>
                        )}

                        {userdetails()?.Role === 'SuperAdmin' && (
                            <>
                                <button onClick={addform} className="md:me-2 inline-flex items-center px-3 py-2 text-sm  text-white border-transparent rounded-md bg-gradient-to-b from-gray-400 to-gray-600 gap-x-2 hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none">
                                    <i className="fi fi-rr-add"></i> <span className="hidden 2xl:block">Add New</span>
                                </button>
                                <button onClick={BulkupdatForm} className="md:me-2 inline-flex items-center px-3 py-2 text-sm  text-white border-transparent rounded-md bg-gradient-to-b from-gray-400 to-gray-600 gap-x-2 hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none">
                                    <i className="fi fi-br-list-check"></i> <span className="hidden 2xl:block">Bulk Update</span>
                                </button> 
                            </>
                        )}

                        {(userdetails()?.Role === 'SuperAdmin' || userdetails()?.Role === 'TeamLeader') && (
                            <>
                                {loading && <span className="inline-block w-4 h-4 mr-2 text-blue-500 border-2 border-current rounded-full animate-spin border-t-transparent" aria-label="loading"></span>}
                                {userdetails()?.Role === 'SuperAdmin' && (<button onClick={Uploadform} className="md:me-2 inline-flex items-center px-3 py-2 text-sm  text-white border-transparent rounded-md bg-gradient-to-b from-gray-400 to-gray-600 gap-x-2 hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none">
                                    <i className="fi fi-rr-file-upload"></i> <span className="hidden 2xl:block">Upload</span>
                                </button>)}


                                {userdetails()?.Role === 'SuperAdmin' && (
                                    <button onClick={handleDeleteAll} className="md:me-2 inline-flex items-center px-3 py-2 text-sm  text-white border-transparent rounded-md bg-gradient-to-b from-red-400 to-red-600 gap-x-2 hover:bg-red-800">
                                        <i className="fi fi-rr-trash"></i><span className="hidden 2xl:block"> Bulk Delete</span>
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                    <div className="flex">
                        <input type="input" value={globalfilter} placeholder="Search..." className="py-2 px-4 rounded-md border outline-none me-2" onChange={(e)=>setglobalfilter(e.target.value)} />
                        <button onClick={clearFilter} className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-md border border-transparent bg-[#193762] text-white hover:bg-[#193762] disabled:opacity-50 disabled:pointer-events-none">
                            <i className="fi fi-rr-clear-alt pt-1"></i>
                        </button>
                    </div>
                </div>
            </div>
            <Dialog header="Allocate Leads" visible={showModal} onHide={() => handleAllocateCancel()} modal className="p-4 bg-white rounded-lg w-[600px]">
                <form onSubmit={handleAllocateConfirm}>
                    <div className="p-fluid">
                        {(userdetails()?.Role === 'SuperAdmin') && (
                            <>
                                <div className="mb-4 p-field">
                                    <label className="block mb-1">Allocate To</label>
                                    <select name="allocationType" value={formdata.allocationType} onChange={(e) => handlechange(e)} className="w-full px-4 py-2 border border-gray-300 rounded-md p-inputtext p-component" required>
                                        <option value="teamLeader">Team Leader</option>
                                        <option value="telecaller">Telecaller</option>
                                    </select>
                                </div>
                                <div className="mb-4 p-field">
                                    <label htmlFor="selectedTeamLeader" className="block mb-1">Select Team Leader</label>
                                    <select name="selectedTeamLeader" value={formdata.selectedTeamLeader} onChange={(e) => handlechange(e)} className="w-full px-4 py-2 border border-gray-300 rounded-md p-inputtext p-component" required>
                                        <option value="">Select a Team Leader</option>
                                        {teamLeaders.map((user) => (
                                            <option key={user.UserName} value={user.UserName}>
                                                {user.First_Name} ({user.UserName})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {formdata.allocationType == 'telecaller' && (
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
                                )}
                                
                            </>
                        )}
                        {(userdetails()?.Role === 'TeamLeader') && (
                            <>
                                <div className="mb-4 p-field">
                                    <label htmlFor="allocationType" className="block mb-1">Allocate To</label>
                                    <select name="selectedTeamLeader" value={formdata.selectedTeamLeader} onChange={(e) => handlechange(e)} className="w-full px-4 py-2 border border-gray-300 rounded-md p-inputtext p-component" required>
                                        <option value="telecaller">Telecaller</option>
                                    </select>
                                </div>
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
                            </>
                        )}

                        <div className="mb-4 p-field">
                            <label htmlFor="From" className="block mb-1">No of Datas</label>
                            <input type="number" name="allocationRange" value={formdata.allocationRange} onChange={(e) => handlechange(e)} className="w-full px-4 py-2 border border-gray-300 rounded-md p-inputtext p-component" min="1" required/>
                        </div>

                    </div>
                    <div className="flex justify-end mt-4">
                        <Button label="Cancel" className="px-2 mr-2 text-white bg-red-500 p-button-text hover:bg-red-600" onClick={handleAllocateCancel} />
                        {loading && <span className="inline-block w-4 h-4 mr-2 text-blue-500 border-2 border-current rounded-full animate-spin border-t-transparent" aria-label="loading"></span>}
                        <Button type='submit' label="Allocate" className="px-2 text-white bg-green-500 p-button-text hover:bg-green-600" autoFocus disabled={loading} />
                    </div>
                </form>
            </Dialog>

        </>
    );
}
