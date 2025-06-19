import { Dialog } from 'primereact/dialog';

export default function Bulkdelete(props) {

    const { visible, setVisible, formdata, loading1, ConfirmDeleteAll, handlechange } = props;

    return (
        <Dialog header="Delete Form" visible={visible}  onHide={() => setVisible(false)} className="!w-full lg:!w-[30rem]">
            <form onSubmit={ConfirmDeleteAll}>
                <div className='grid grid-cols-1 gap-3'>
                    <div>
                        <div className="mb-2">
                            <div className="mb-2">
                                <label>Dalete Range</label>
                            </div>
                            <input type="text" name="Range" value={formdata?.Range} onChange={handlechange} className="w-full px-4 py-2 border rounded-md outline-none" required />
                        </div>
                    </div>
                </div>
                <div className="mb-2">
                    <button type="submit" className="w-full px-4 py-2 text-white border rounded-md bg-primary" >
                        {loading1 && <span className="animate-spin text-xl inline-block size-4 border-[3px] border-current border-t-transparent text-white rounded-full" role="status" aria-label="loading"></span>}  Delete
                    </button>
                </div>
            </form>
        </Dialog>
    )
}