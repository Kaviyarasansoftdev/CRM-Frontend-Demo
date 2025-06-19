/* eslint-disable react/prop-types */
import { useState, useMemo, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import { savetelecallerallocation, updatetelecallerallocation } from '../../services/apitelecalleralloaction/apitelecallerallocation'; 
import toast from 'react-hot-toast';
import useAuth from '../../services/store/useAuth';
import { NavLink } from 'react-router-dom';

export const Tableheadpanel = ({ setglobalfilter, teamLeaders, teleCallers, setTelecallerData, telecallerData, visible, setVisible, formdata, setFormdata }) => {
    const [selectedTeamLeader, setSelectedTeamLeader] = useState('');
    const [selectedTelecallers, setSelectedTelecallers] = useState([]);
    const [telecallerFilter, setTelecallerFilter] = useState('');
    const { userdetails } = useAuth();
    const user = userdetails();

    useEffect(() => {
        if (visible && formdata) {
            setSelectedTeamLeader('');
            setSelectedTelecallers([]);
            if (formdata.teamleader && formdata.teamleader.length > 0) {
                setSelectedTeamLeader(formdata.teamleader[0]?.UserName || '');
            }
            if (formdata.telecaller && formdata.telecaller.length > 0) {
                setSelectedTelecallers(formdata.telecaller.map(caller => caller.UserName) || []);
            }
        }
    }, [visible, formdata]);
    
    const handleAllocate = () => {
        setFormdata({});
        setSelectedTeamLeader('');
        setSelectedTelecallers([]);
        setVisible(true);
    };

    const handleAllocateConfirm = async () => {
        try {
            const selectedTeamLeaderData = teamLeaders.find(
                (leader) => leader.UserName === selectedTeamLeader
            );
            const formattedData = {
                teamleader: [
                    {
                        UserName: selectedTeamLeader,
                        First_Name: selectedTeamLeaderData ? selectedTeamLeaderData.First_Name : '',
                    },
                ],
                telecaller: selectedTelecallers.map((UserName) => {
                    const user = teleCallers.find((user) => user.UserName === UserName);
                    return {
                        UserName: UserName,
                        First_Name: user ? user.First_Name : '',
                    };
                }),
            };
            let response;
            if (formdata._id) {
                response = await updatetelecallerallocation(formdata._id, formattedData);
                const updatedData = telecallerData.map(data => 
                  data._id === formdata._id ? response : data
                );
                setTelecallerData(updatedData);
                toast.success("Team Members allocated successfully!");
                setVisible(false);
                setFormdata({});
            } else {
                response = await savetelecallerallocation(formattedData);
                console.log(response);
                if(response["status"] == "success"){
                    toast.success("Team Members allocated successfully!");
                    setVisible(false);
                    setFormdata({});
                }
                else{
                    toast.error(response["status"]);
                }
                //setTelecallerData([...telecallerData, response]);
            }
            

        } catch (error) {
            console.error('Error:', error);
            toast.error("Error in allocating team members");
        }
    };
    
    const handleAllocateCancel = () => {
        setSelectedTeamLeader('');
        setSelectedTelecallers([]);
        setVisible(false);
    };

    const handleFilterChange = (event) => {
        setglobalfilter(event.target.value);
    };

    // const filteredTeamLeaders = useMemo(() => {
    //     console.log(telecallerData.map(resp=>resp.teamleader[0]))
    //     const leaderList = user.Role === 'TeamLeader' ? teamLeaders.filter(leader => leader.UserName === user.UserName) : teamLeaders.filter(leader => {
    //         console.log(telecallerData)
    //             if (telecallerData && telecallerData.length > 0) {
    //                 return !telecallerData.some(data => data.teamleader && data.teamleader.length > 0 && data.teamleader[0].UserName === leader.UserName );
    //             }
    //             return true;
    //         });

    //     // Ensure the selected team leader from formdata is included
    //     if (formdata && formdata.teamleader && formdata.teamleader.length > 0) {
    //         const currentLeader = formdata.teamleader[0];
    //         if (!leaderList.some(leader => leader.UserName === currentLeader.UserName)) {
    //             leaderList.push(currentLeader);
    //         }
    //     }
    //     console.log(leaderList)
    //     return telecallerData.map(resp=>resp.teamleader[0]);
    // }, [teamLeaders, telecallerData, user, formdata]);

    const filteredTeleCallers = useMemo(() => {
        if(formdata?._id){
            var notinData = teleCallers.filter((telecaller) => { return !telecallerData.some((data) => data.telecaller?.some((caller) => caller.UserName === telecaller.UserName)) });
            var InData = telecallerData.filter((data) => data._id == formdata?._id)[0].telecaller;
            return [...InData,...notinData]
        }
        else{
            return teleCallers.filter((telecaller) => {
                return !telecallerData.some((data) => data.telecaller?.some((caller) => caller.UserName === telecaller.UserName));
            });
        }

    }, [teleCallers, telecallerData, user]);

    //console.log(filteredTeleCallers,telecallerData,formdata?._id)

    return (
        <div className="items-center justify-between px-6 py-4 space-y-3 lg:space-y-0 lg:flex">
            <div className="flex items-center gap-2 py-2">
                <h2 className="mx-1 text-xl font-semibold text-gray-800">
                    Team Allocation
                </h2>
                
                <NavLink to={"/users"} isActive={(match, location) => {
                        if (location.pathname === '/users' || location.pathname === '/') {
                            return true;
                        }
                        return false;
                    }}
                    className={({ isActive }) => `flex items-center font-semibold gap-x-3.5 py-2 px-4 ${isActive ? "bg-gradient-to-b from-cyan-400 to-cyan-600" : "bg-gradient-to-b from-gray-400 to-gray-600" } text-sm text-white  rounded-lg ` }
                >  Users </NavLink>
                <NavLink to={"/teams"} isActive={(match, location) => {
                        if (location.pathname === '/teams') {
                            return true;
                        }
                        return false;
                    }}
                    className={({ isActive }) => `flex items-center font-semibold gap-x-3.5 py-2 px-4 ${isActive ? "bg-gradient-to-b from-cyan-400 to-cyan-600" : "bg-gradient-to-b from-gray-400 to-gray-600" } text-sm text-white  rounded-lg ` }
                > Teams </NavLink>
                
            </div>
            <div className='flex-none items-center px-2 lg:flex lg:gap-x-2 gap-x-3'>
                <div>
                        
                    {(user.Role === 'SuperAdmin' || user.Role === '') && (
                        <button onClick={handleAllocate} className="inline-flex items-center px-3 py-2 text-sm font-semibold text-white border-transparent rounded-lg bg-gradient-to-b from-gray-400 to-gray-600 gap-x-2 hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none" >
                            <span className="">Allocate</span>
                        </button>
                    )}
                </div>

                <div className='py-2'>
                    <input type="text" placeholder="Search..." className="px-4 py-2 border outline-none rounded-xl w-[200px] lg:w-[250px]" onChange={handleFilterChange} />
                </div>
                
            </div>
            <Dialog header="Allocate Team Members" visible={visible} onHide={() => setVisible(false)} modal style={{ width: '30vw' }} className="p-4 bg-white rounded-lg" >
                <div className="p-fluid">
                    <div className="mb-4 p-field">
                        <label htmlFor="teamLeader" className="block mb-1"> Select Team Leader </label>
                        <select id="teamLeader" value={selectedTeamLeader} onChange={(e) => setSelectedTeamLeader(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md p-inputtext p-component" >
                            <option value="">Select a Team Leader</option>
                            {teamLeaders.map((user) => (
                                <option key={user.UserName} value={user.UserName}>
                                    {user.First_Name} ({user.UserName})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4 p-field">
                        <label htmlFor="telecallers" className="block mb-1"> Select Telecallers </label>
                        <MultiSelect id="telecallers" value={selectedTelecallers} onChange={(e) => setSelectedTelecallers(e.value)} className="w-full border border-gray-300 rounded-md p-multiselect"
                            options={filteredTeleCallers.map((user) => ({ label: `${user.First_Name} (${user.UserName})`, value: user.UserName }))}
                            filter filterValue={telecallerFilter} onFilter={(e) => setTelecallerFilter(e.target.value)} />
                    </div>
                </div>
                <div className="flex justify-end mt-4">
                    <Button label="Cancel" className="px-2 mr-2 text-white bg-red-500 p-button-text hover:bg-red-600" onClick={handleAllocateCancel} />
                    <Button label="Allocate" className="px-2 text-white bg-green-500 p-button-text hover:bg-green-600" onClick={handleAllocateConfirm} autoFocus />
                </div>
            </Dialog>
        </div>
    );
};
