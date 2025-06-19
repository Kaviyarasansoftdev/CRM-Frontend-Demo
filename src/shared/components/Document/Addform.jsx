import { Dialog } from 'primereact/dialog';
import { ProgressBar } from 'primereact/progressbar';

export default function AddForm(props) {

    const { visible, setVisible, formdata, loading, handlesave, handleupdate, handlechange, removeDocument, progress } = props;

    var types = [
        {Docs_CAT:"Ind KYC",Doc_Name:["App PAN", "App Aadhar", "App Photo","App Address Proof","App Relationship Proof", "Co-app PAN", "Co-app Aadhar", "Co-app Photo", "Co-app Address Proof","Co-app Relationship proof", "Others"]},
        {Docs_CAT:"Compa KYC",Doc_Name:["GSTR Certificate", "MSME Certificate", "SSI Certificate","TIN","Company PAN", "Partnership Deed", "COI, MOA & AOA", "Share Holding Pattern", "Others"]},
        {Docs_CAT:"ITR",Doc_Name:["ITR Document", "Others"]},
        {Docs_CAT:"Bank Stmt",Doc_Name:["SA", "CA", "OD","CC","Company PAN", "Partnership Deed", "COI, MOA & AOA", "Share Holding Pattern", "Others"]},
        {Docs_CAT:"Payslip",Doc_Name:["Payslip", "Others"]},
        {Docs_CAT:"GSTR",Doc_Name:["GSTR 3B", "Others"]},
        {Docs_CAT:"Loan Details",Doc_Name:["RPS", "SOA", "OD Sanction letter", "Others"]},
        {Docs_CAT:"Property Docs",Doc_Name:["Property Docs", "Others"]},
        {Docs_CAT:"RC Details",Doc_Name:["RC Details", "Others"]},
    ]
    //console.log(types.filter(res=>res?.Docs_CAT == formdata?.Docs_CAT))
    return (
        <Dialog header={!formdata?._id?"Add Documents":"Update Document"} visible={visible}  onHide={() => setVisible(false)} className="!w-full lg:!w-[30rem]">
            <form onSubmit={!formdata?._id?handlesave:handleupdate}>
                <div className='grid grid-cols-1 gap-3'>
                    <div>
                        <div className="mb-2">
                            <div className="mb-2">
                                <label>Docs CAT</label>
                            </div>
                            <select name="Docs_CAT" value={formdata.Docs_CAT} onChange={(e) => handlechange(e)} className="w-full px-4 py-2 border border-gray-300 rounded-md p-inputtext p-component" required>
                                <option value="">Select</option>
                                {types.map((user) => (
                                    <option key={user.Docs_CAT} value={user.Docs_CAT}>
                                        {user.Docs_CAT}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-2">
                            <div className="mb-2">
                                <label>Docs CAT</label>
                            </div>
                            <select name="Doc_Name" value={formdata.Doc_Name} onChange={(e) => handlechange(e)} className="w-full px-4 py-2 border border-gray-300 rounded-md p-inputtext p-component" required>
                                <option value="">Select</option>
                                {formdata?.Docs_CAT&&
                                    types.filter(res=>res?.Docs_CAT == formdata?.Docs_CAT)[0].Doc_Name.map((user) => (
                                    <option key={user} value={user}>
                                        {user}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-2">
                            <div className="mb-2">
                                <label htmlFor="Path">Document</label>
                            </div>
                            <input type="file" name="Path" onChange={handlechange} id="Path" className="block w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 file:bg-gray-50 file:border-0 file:me-4  file:py-3 file:px-4 dark:file:bg-neutral-700 dark:file:text-neutral-400" />
                            { formdata?._id&&formdata['Path']&&typeof formdata['Path'] === "string"&&
                                <>
                                    <div className="px-3 py-1 mt-2 rounded-md text-white bg-slate-400">
                                        <div className='flex items-center justify-between'>
                                            <div className='flex items-center'><i className="fi fi-rr-document me-2 pt-1"></i>{formdata.Doc_Name}</div>
                                            <button type='button' onClick={(e)=>removeDocument(formdata)} className='flex items-center'><i className="fi fi-rr-cross-circle pt-1"></i></button>
                                        </div>
                                    </div>
                                </>
                            }
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
            {progress > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <ProgressBar value={progress}></ProgressBar>
                </div>
            )}
        </Dialog>
    )
}