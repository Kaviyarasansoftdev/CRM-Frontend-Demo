import { Dialog } from 'primereact/dialog';
import { ProgressBar } from 'primereact/progressbar';

export default function AddForm(props) {

    const { visible, setVisible, formdata, loading, handlesave, handleupdate, handlechange } = props;

    return (
        <Dialog header={!formdata?._id?"Add Documents":"Update Document"} visible={visible}  onHide={() => setVisible(false)} className="!w-full lg:!w-[30rem]">
            <form onSubmit={!formdata?._id?handlesave:handleupdate}>
                <div className='grid grid-cols-1 gap-3'>
                    <div>
                        <div className="mb-2">
                            <div className="mb-2">
                                <label>Client Name</label>
                            </div>
                            <input type="text" name="Name" value={formdata?.Name} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none" required />
                        </div>
                        <div className="mb-2">
                            <div className="mb-2">
                                <label>Mobile Number</label>
                            </div>
                            <input type="text" name="Mobile1" value={formdata?.Mobile1} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none" required />
                        </div>
                        <div className="mb-2">
                            <div className="mb-2">
                                <label>Region</label>
                            </div>
                            <input type="text" name="Region" value={formdata?.Region} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none" required />
                        </div>
                        <div className="mb-2">
                            <div className="mb-2">
                                <label>Product</label>
                            </div>
                            <input type="text" name="Product" value={formdata?.Product} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none" required />
                        </div>
                        <div className="mb-2">
                            <div className="mb-2">
                                <label>Firm Name</label>
                            </div>
                            <input type="text" name="Firm_Name" value={formdata?.Firm_Name} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none" required />
                        </div>
                        <div className="mb-2">
                            <div className="mb-2">
                                <label>Campaign_Name</label>
                            </div>
                            <input type="text" name="Campaign_Name" value={formdata?.Campaign_Name} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none" required />
                        </div>
                        <div className="mb-2">
                            <div className="mb-2">
                                <label>Loan Product</label>
                            </div>
                            <input type="text" name="Loan_Product" value={formdata?.Loan_Product} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none" required />
                        </div>

                        <div className="mb-2">
                            <div className="mb-2">
                                <label>Alternative</label>
                            </div>
                            <input type="text" name="Alternative" value={formdata?.Alternative} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none" required />
                        </div>
                        <div className="mb-2">
                            <div className="mb-2">
                                <label>Company Name</label>
                            </div>
                            <input type="text" name="Company_Name" value={formdata?.Company_Name} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none" required />
                        </div>

                        <div className="mb-2">
                            <div className="mb-2">
                                <label htmlFor="Path">Remarks</label>
                            </div>
                            <textarea name="Remarks" value={formdata?.Remarks} onChange={handlechange} className="py-3 px-4 border-[1px] block w-full border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" rows="3"></textarea>
                        </div>
                    </div>
                </div>
                <div className="mb-2">
                    <button type="submit" className="w-full px-4 py-2 text-white border rounded-md bg-primary" >
                        {loading && <span className="animate-spin text-xl inline-block size-4 border-[3px] border-current border-t-transparent text-white rounded-full" role="status" aria-label="loading"></span>} {!formdata?._id? "Save":"Update"}
                    </button>
                </div>
            </form>
        </Dialog>
    )
}