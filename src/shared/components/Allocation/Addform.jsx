import { Dialog } from 'primereact/dialog';

export default function AddForm(props) {

    const { visible, setVisible, formdata, loading, handlesave, handleupdate, handlechange } = props;

    return (
        <Dialog header="Update Leads" visible={visible} onHide={() => setVisible(false)} className="!w-full lg:!w-[30rem]">
            <form onSubmit={!formdata?._id?handlesave:handleupdate}>
                <div className='grid grid-cols-1 gap-3'>
                    <div>
                        <div className="mb-2">
                            <div className="mb-2">
                                <label>Region</label>
                            </div>
                            <input type="text" name="Region" value={formdata?.Region} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none" required />
                        </div>
                        <div className="mb-2">
                            <div className="mb-2">
                                <label>Location</label>
                            </div>
                            <input type="text" name="Location" value={formdata?.Location} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none" />
                        </div>
                        <div className="mb-2">
                            <div className="mb-2">
                                <label>Product</label>
                            </div>
                            <input type="text" name="Product" value={formdata?.Product} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none" required />
                        </div>
                        <div className="mb-2">
                            <div className="mb-2">
                                <label>Name</label>
                            </div>
                            <input type="text" name="Name" value={formdata?.Name} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none" required />
                        </div>
                        <div className="mb-2">
                            <div className="mb-2">
                                <label>Firm Name</label>
                            </div>
                            <input type="text" name="Firm_Name" value={formdata?.Firm_Name} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none" />
                        </div>
                        <div className="mb-2">
                            <div className="mb-2">
                                <label>Mobile1</label>
                            </div>
                            <input type="text" name="Mobile1" value={formdata?.Mobile1} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none" />
                        </div>
                        <div className="mb-2">
                            <div className="mb-2">
                                <label>Mobile2</label>
                            </div>
                            <input type="text" name="Mobile2" value={formdata?.Mobile2} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none" />
                        </div>
                        <div className="mb-2">
                            <div className="mb-2">
                                <label>Campaign Name</label>
                            </div>
                            <input type="text" name="Campaign_Name" value={formdata?.Campaign_Name} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none" />
                        </div>

                        {/* <div className="mb-2">
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
                        </div> */}
                    </div>
                </div>
                <div className="mb-2">
                    <button type="submit" className="w-full px-4 py-2 text-white border rounded-md bg-primary" >
                        {loading && <span className="animate-spin text-xl inline-block size-4 border-[3px] border-current border-t-transparent text-white rounded-full" role="status" aria-label="loading"></span>}  Update
                    </button>
                </div>
            </form>
        </Dialog>
    )
}