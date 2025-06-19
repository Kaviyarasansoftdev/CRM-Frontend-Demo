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
    const { handleDeleteAll, Uploadform, setglobalfilter, globalfilter, clearFilter, updateTableData, loading, setLoading, colfilter, addform,Sort } = props;
    const { userdetails } = useAuth();

    return (
        <>
            <div className="flex flex-col items-center justify-between px-6 py-4 space-y-4 lg:flex-row lg:space-y-0">
                <div className='block md:flex justify-center items-center'>
                    <h2 className="text-xl text-center md:text-start font-semibold text-gray-800">Doc-Center</h2>
                </div>

                <div className="md:flex items-center px-2 py-2 lg:flex-row gap-x-2">
                    <div className="flex mb-3 md:mb-0 justify-between">
                        {userdetails()?.Role === 'SuperAdmin' && (
                            <button onClick={addform} className="md:me-2 inline-flex items-center px-3 py-2 text-sm font-semibold text-white border-transparent rounded-md bg-gradient-to-b from-gray-400 to-gray-600 gap-x-2 hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none">
                                <i className="fi fi-rr-add"></i> <span className="hidden 2xl:block">Add New</span>
                            </button>
                        )}
                    </div>
                    <div className="flex">
                        <input type="input" value={globalfilter} placeholder="Search..." className="py-2 px-4 rounded-xl border outline-none me-2" onChange={(e)=>setglobalfilter(e.target.value)} />
                        <button onClick={clearFilter} className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-md shadow-md border border-transparent bg-[#193762] text-white hover:bg-[#193762] disabled:opacity-50 disabled:pointer-events-none">
                            <i className="fi fi-rr-clear-alt pt-1"></i>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
