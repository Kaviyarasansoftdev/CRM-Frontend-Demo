import { TabPanel, TabView } from 'primereact/tabview'
import React from 'react'

export default function Settings(props) {
    const { updatebackup, handlechange, formdata, backupNow, acccountdata, handlechange1, updateUser } = props
    return (
        <TabView>
            <TabPanel header="My Account">
                <section className='h-[calc(100vh_-_250px)] flex items-center'>
                    <div className="w-full md:max-w-[85rem] mx-auto px-4">
                        
                        <div className="grid grid-cols-6 gap-4">
                            <div className="md:col-start-2 md:col-span-4 col-span-6">
                                <div className="min-h-60 flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70">
                                    <div className='text-center mt-4 text-xl font-semibold'>My Account</div>
                                    <div className="flex flex-auto flex-col justify-center items-center p-4">
                                        <form onSubmit={updateUser}>
                                            <dl className="grid sm:grid-cols-3 gap-1 sm:gap-3">
                                                <dt className="sm:col-span-1 font-semibold dark:text-white">User Name</dt>
                                                <dd className="sm:col-span-2 mb-3 sm:mb-0 dark:text-white">
                                                    <input type="text" name="UserName" value={acccountdata.UserName} onChange={handlechange1} className="max-w-xs py-3 px-4 block w-full border border-neutral-200 rounded-lg text-sm" disabled />
                                                </dd>

                                                <dt className="sm:col-span-1 font-semibold dark:text-white">Name</dt>
                                                <dd className="sm:col-span-2 mb-3 sm:mb-0 dark:text-white">
                                                    <input type="text" name="First_Name" value={acccountdata.First_Name} onChange={handlechange1} className="max-w-xs py-3 px-4 block w-full border border-neutral-200 rounded-lg text-sm" />
                                                </dd>

                                                <dt className="sm:col-span-1 font-semibold dark:text-white">Email</dt>
                                                <dd className="sm:col-span-2 mb-3 sm:mb-0 dark:text-white">
                                                    <input type="email" name="Email" value={acccountdata.Email} onChange={handlechange1} className="max-w-xs py-3 px-4 block w-full border border-neutral-200 rounded-lg text-sm" />
                                                </dd>

                                                <dt className="sm:col-span-1 font-semibold truncate dark:text-white">Mobile Number</dt>
                                                <dd className="sm:col-span-2 mb-3 sm:mb-0 dark:text-white">
                                                    <input type="text" name="Mobilenumber" value={acccountdata.Mobilenumber} onChange={handlechange1} className="max-w-xs py-3 px-4 block w-full border border-neutral-200 rounded-lg text-sm" />
                                                </dd>

                                                <dt className="sm:col-span-1 font-semibold dark:text-white">Password</dt>
                                                <dd className="sm:col-span-2 mb-3 sm:mb-0 dark:text-white">
                                                    <input type="text" name="Password" value={acccountdata.Password} onChange={handlechange1} className="max-w-xs py-3 px-4 block w-full border border-neutral-200 rounded-lg text-sm" />
                                                </dd>
                                            </dl>
                                            <div className='text-center mt-4'>
                                                <button type="submit" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                                                    update
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </TabPanel>
            <TabPanel header="General">
                <div className='w-full lg:max-w-[85rem] mx-auto px-4'>
                    <div className="grid justify-center grid-cols-1 gap-8 lg:grid-cols-2">
                        <div className='flex justify-center items-center'>
                            <button role='button' onClick={backupNow} className='w-[50%] rounded-full shadow-lg'>
                                <img src="/images/backup.png" alt="" />
                            </button>
                        </div>
                        <div className='bg-white rounded-xl shadow-small'>
                            <div className="p-5 ">
                                <h1 className="p-1 text-xl text-center font-semibold rounded-md w-full mb-2">Data Backup</h1>
                                <form className="space-y-5" onSubmit={updatebackup}>
                                    <div>
                                        <div className="mb-2">
                                            <label>Backup Mode</label>
                                        </div>
                                        <select name="Backup_Mode" value={formdata?.Backup_Mode} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none" required >
                                            <option value="">Select Mode</option>
                                            <option value="Auto">Auto Backup</option>
                                            <option value="Manual">Manual Backup</option>
                                        </select>
                                    </div>
                                    {/* <div>
                                        <div className="mb-2">
                                            <label>Backup Location</label>
                                        </div>
                                        <input type="text" value={formdata?.Backup_Location} onChange={handlechange} name="Backup_Location" className="w-full px-3 py-2 border outline-none rounded-md placeholder-slate-500" placeholder='Ex: D or E' required/>
                                    </div> */}
                                    <div>
                                        <div className="mb-2">
                                            <label>Backup Period</label>
                                        </div>
                                        <select name="Backup_Period" value={formdata?.Backup_Period} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none" required >
                                            <option value="">Select Period</option>
                                            <option value="Daily">Daily</option>
                                            <option value="Monthly">Monthly</option>
                                        </select>
                                    </div>
                                    <div>
                                        <div className="mb-2">
                                            <label>Backup Time</label>
                                        </div>
                                        <input type="time" value={formdata?.Backup_Time} onChange={handlechange} name="Backup_Time" className="w-full px-3 py-2 border outline-none rounded-md placeholder-slate-500" placeholder="Password" required/>
                                    </div>
                                    <div>
                                        <button type="submit" className="w-full px-3 py-2 text-white bg-blue-600 border rounded-xl">
                                            Update
                                        </button>
                                    </div>
                                </form>
                            </div>
                            
                        </div>


                    </div>
                </div>
                
                
            </TabPanel>
        </TabView>
    )
}
