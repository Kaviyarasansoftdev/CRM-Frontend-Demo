import { Dialog } from 'primereact/dialog';

export default function UploadForm(props) {

    const { UploadVisible, setUploadVisible, handleupload, loading, uploadfile } = props;

    return (
        <Dialog header="Upload Products" visible={UploadVisible}  onHide={() => setUploadVisible(false)} className="!w-full lg:!w-[30rem]">
            <form onSubmit={uploadfile}>
                <div className="flex justify-between max-w-full">
                    <label className="block">
                        <span className="sr-only">Choose File</span>
                        <input type="file" name="files" onChange={handleupload} className="block w-full text-sm text-gray-500 file:me-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:disabled:opacity-50 file:disabled:pointer-events-none dark:text-neutral-500 dark:file:bg-blue-500 dark:hover:file:bg-blue-400 " required />
                    </label>
                    <button type="submit" className="px-4 py-2 text-white border rounded-md w-50 bg-primary" >
                        {loading && <span className="animate-spin text-xl inline-block size-4 border-[3px] border-current border-t-transparent text-white rounded-full" role="status" aria-label="loading"></span>}  Upload
                    </button>
                </div>
            </form>
        </Dialog>
    )
}