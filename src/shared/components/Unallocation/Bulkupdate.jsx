import { Dialog } from 'primereact/dialog';

export default function Bulkupdate(props) {

    const { BulkUpdatevisible, setBulkUpdatevisible, formdata, loading3, handleUpdateAll, handlechange } = props;

    return (
        <Dialog header="Update Form" visible={BulkUpdatevisible}  onHide={() => setBulkUpdatevisible(false)} className="!w-full lg:!w-[30rem]">
            <form onSubmit={handleUpdateAll}>
                <div className='grid grid-cols-1 gap-3'>
                    <div>
                        <div className="mb-2">
                            <div className="mb-2">
                                <label>Update Range</label>
                            </div>
                            <input type="text" name="Range" value={formdata?.Range} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none" required />
                        </div>
                        <div className="mb-2">
                            <div className="mb-2">
                                <label>Field</label>
                            </div>
                            <select name="field" value={formdata?.field} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none" required >
                                <option value="">---select Field---</option>
                                <option value="Region">Region</option>
                                <option value="Location">Location</option>
                                <option value="Product">Product</option>
                                <option value="Campaign_Name">Campaign Name</option>
                            </select>
                        </div>
                        <div className="mb-2">
                            <div className="mb-2">
                                <label>Update Value</label>
                            </div>
                            <input type="text" name="Value" value={formdata?.Value} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none" required />
                        </div>

                    </div>
                </div>
                <div className="mb-2">
                    <button type="submit" className="w-full px-4 py-2 text-white border rounded-md bg-primary" >
                        {loading3 && <span className="animate-spin text-xl inline-block size-4 border-[3px] border-current border-t-transparent text-white rounded-full" role="status" aria-label="loading"></span>}  Update
                    </button>
                </div>
            </form>
        </Dialog>
    )
}