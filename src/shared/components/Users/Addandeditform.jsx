/* eslint-disable react/prop-types */
import { Dialog } from 'primereact/dialog';

export default function Addandeditform(props) {

     const { visible, setVisible, handlesave, handlechange, loading, formdata,handleupdate } = props;
     
    return (
        <Dialog header="User Form" visible={visible}  onHide={() => setVisible(false)} className="!w-full lg:!w-[40rem]">
            <form onSubmit={!formdata?._id?handlesave:handleupdate}>
                <div className='grid grid-cols-1 gap-3'>
                    <div>
                        <div className="mb-2">
                            <div className="mb-2">
                                <label>First_Name</label>
                            </div>
                            <input type="text" name="First_Name" value={formdata?.First_Name} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none" required />
                        </div>
                        <div className="mb-2">
                            <div className="mb-2">
                                <label>Last_Name</label>
                            </div>
                            <input type="text" name="Last_Name" value={formdata?.Last_Name} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none" />
                        </div>
                        <div className="mb-2">
                            <div className="mb-2">
                                <label>Email</label>
                            </div>
                            <input type="email" name="Email" value={formdata?.Email} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none" required />
                        </div>
                        <div className="mb-2">
                            <div className="mb-2">
                                <label>Password</label>
                            </div>
                            <input type="text" name="Password" value={formdata?.Password} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none" required />
                        </div>
                        <div className="mb-2">
                            <div className="mb-2">
                                <label>Mobile Number</label>
                            </div>
                            <input type="text" name="Mobilenumber" value={formdata?.Mobilenumber} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none" />
                        </div>
                        <div className="mb-2">
                            <div className="mb-2">
                                <label>Role</label>
                            </div>
                            <select name="Role" value={formdata?.Role} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none" required >
                                <option value="">---Select Role---</option>
                                <option value="TeamLeader">Team Leader</option>
                                <option value="Telecaller">Telecaller</option>
                            </select>
                        </div>
                        <div className="mb-2">
                            <div className="mb-2">
                                <label>Status</label>
                            </div>
                            <select name="User_Status" value={formdata?.User_Status} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none" required >
                                <option value="">---select a status---</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="mb-2">
                    <button type="submit" className="w-full px-4 py-2 text-white border rounded-md bg-primary" >
                        {loading && <span className="animate-spin text-xl inline-block size-4 border-[3px] border-current border-t-transparent text-white rounded-full" role="status" aria-label="loading"></span>}  Save
                    </button>
                </div>
            </form>
        </Dialog>
    )
}