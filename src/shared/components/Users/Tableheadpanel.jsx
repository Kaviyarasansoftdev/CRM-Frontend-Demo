/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import { savetelecallerallocation } from '../../services/apitelecalleralloaction/apitelecallerallocation';
import { NavLink } from 'react-router-dom';

export default function Tableheadpanel(props) {
    const { newform, setglobalfilter, teamLeaders, teleCallers } = props;
    const [showModal, setShowModal] = useState(false);
    const [selectedTeamLeader, setSelectedTeamLeader] = useState('');
    const [selectedTelecallers, setSelectedTelecallers] = useState([]);
    const [telecallerFilter, setTelecallerFilter] = useState('');

    const handleAllocate = () => {
        setShowModal(true);
    };
    const handleAllocateConfirm = async () => {
        try {
            const selectedTeamLeaderData = teamLeaders.find(
                (leader) => leader.User_Id === selectedTeamLeader
            );

            const formattedData = {
                teamleader: [
                    {
                        User_Id: selectedTeamLeader,
                        First_Name: selectedTeamLeaderData
                            ? selectedTeamLeaderData.First_Name
                            : '',
                    },
                ],
                telecaller: selectedTelecallers.map((userId) => {
                    const user = teleCallers.find((user) => user.User_Id === userId);
                    return {
                        User_Id: userId,
                        First_Name: user ? user.First_Name : '',
                    };
                }),
            };

            const response = await savetelecallerallocation(formattedData);
            console.log('Response:', response);
            setShowModal(false);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleAllocateCancel = () => {
        setSelectedTeamLeader('');
        setSelectedTelecallers([]);
        setShowModal(false);
    };

    return (
        <div className="items-center justify-between px-6 pt-4 space-y-3 lg:space-y-0 lg:flex">
            <div className='flex items-center gap-2 py-2'>
                <h2 className="mx-1 text-xl font-semibold text-gray-800 lg:text-2xl">
                    Users
                </h2>
                <NavLink to={"/users"} isActive={(match, location) => {
                        if (location.pathname === '/users' || location.pathname === '/') {
                            return true;
                        }
                        return false;
                    }}
                    className={({ isActive }) =>
                        `flex items-center font-semibold gap-x-3.5 py-2 px-4 ${isActive ? "bg-gradient-to-b from-cyan-400 to-cyan-600" : "bg-gradient-to-b from-gray-400 to-gray-600"
                        } text-sm text-white  rounded-lg ` 
                    }
                >
                    Users
                </NavLink>
                <NavLink to={"/teams"} isActive={(match, location) => { if (location.pathname === '/teams') { return true; } return false; }}
                    className={({ isActive }) => `flex items-center font-semibold gap-x-3.5 py-2 px-4 ${isActive ? "bg-gradient-to-b from-cyan-400 to-cyan-600" : "bg-gradient-to-b from-gray-400 to-gray-600"} text-sm text-white  rounded-lg ` } >
                    Teams
                </NavLink>
            </div>
            <div className="flex items-center px-2 lg:flex lg:gap-x-2 gap-x-3">
                <button onClick={newform} className="inline-flex items-center px-3 py-2 text-sm font-semibold text-white border-transparent rounded-lg bg-gradient-to-b from-gray-400 to-gray-600 gap-x-2 hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none">
                    <i className="fi fi-rr-add"></i> <span className="hidden md:block">Add New</span>
                </button>
                <div className='py-2'>
                    <input type="text" placeholder="Search..." className="px-4 py-2 border outline-none rounded-xl w-[200px] lg:w-[250px]" onChange={(e) => setglobalfilter(e.target.value)} />
                </div>
            </div>

            {/* Modal for allocation */}
            <Dialog header="Allocate Users" visible={showModal} onHide={() => setShowModal(false)} modal style={{ width: '30vw' }} className="p-4 bg-white rounded-lg">
                <div className="p-fluid">
                    <div className="mb-4 p-field">
                        <label htmlFor="teamLeader" className="block mb-1">Select Team Leader</label>
                        <select id="teamLeader" value={selectedTeamLeader} onChange={(e) => setSelectedTeamLeader(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md p-inputtext p-component">
                            <option value="">Select a Team Leader</option>
                            {teamLeaders.map(user => (
                                <option key={user.User_Id} value={user.User_Id}>{user.First_Name} ({user.User_Id})</option>
                            ))}
                        </select>

                    </div>
                    <div className="mb-4 p-field">
                        <label htmlFor="telecallers" className="block mb-1">Select Telecallers</label>
                        <MultiSelect
                            id="telecallers"
                            value={selectedTelecallers}
                            onChange={(e) => setSelectedTelecallers(e.value)}
                            className="w-full border border-gray-300 rounded-md p-multiselect"
                            options={teleCallers.map(user => ({ label: `${user.First_Name} (${user.User_Id})`, value: user.User_Id }))}
                            filter={true}
                            filterValue={telecallerFilter}
                            onFilter={(e) => setTelecallerFilter(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex justify-end mt-4">
                    <Button label="Cancel" className="px-2 mr-2 text-white bg-red-500 p-button-text hover:bg-red-600" onClick={handleAllocateCancel} />
                    <Button label="Allocate" className="px-2 text-white bg-green-500 p-button-text hover:bg-green-600" onClick={handleAllocateConfirm} autoFocus />
                </div>
            </Dialog>
        </div>
    );
}