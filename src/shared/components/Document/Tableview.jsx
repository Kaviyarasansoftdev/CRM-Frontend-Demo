/* eslint-disable react/prop-types */
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Skeleton } from 'primereact/skeleton';
import { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import useAuth from '../../services/store/useAuth';
import apiurl from '../../services/apiendpoint/apiendpoint';
import { DownloadFiles, getFilterOptions } from '../../services/apiDocument/apidocument';
import { Link } from 'react-router-dom';
import DocViewer, { DocViewerRenderers } from 'react-doc-viewer';
import axios from 'axios';


const Tableview = (props) => {
    const { tabledata, totalRecords, first, rows, onPageChange, editfrom, cusfilter, tempFilterValues, setTempFilterValues, handledelete, isLoading,
        selectedRows, setSelectedRows, getallDocuments, Sort, setSort } = props;
        
    const [rowsPerPage, setRowsPerPage] = useState(rows);
    const [rowDataState, setRowDataState] = useState([]);
    const [docs, setdocs] = useState([]);
    const [filterOptions,setFilterOptions] = useState({});
    
    const {userdetails} = useAuth()
    const arr = Array(20).fill(null);
   
    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(event.target.value);
        onPageChange({ first: 0, rows: event.target.value });
    };

    // const statusItemTemplate = (option) => option;

    const handleApplyFilters = (key) => {
        cusfilter(key, tempFilterValues[key]);
        onPageChange({ first: 0, rows: rowsPerPage });
    };

    const handleClearFilters = (key) => {
        setTempFilterValues(prev => ({ ...prev, [key]: null }));
        cusfilter(key, null);
        onPageChange({ first: 0, rows: rowsPerPage });
    };

    const getOption = async (key)=>{
        var filterOptions = await getFilterOptions(key);
        console.log(filterOptions)
        setFilterOptions(filterOptions)
    }

    const DownloadFile = async (key)=>{
        // console.log(key)
        await DownloadFiles(key);
    }
    
    const renderColumnFilter = (key) => {
        return (
            <div onClick={()=>getOption(key)}>
                <MultiSelect filter value={tempFilterValues[key]} options={filterOptions?.[key]} className="p-column-filter" virtualScrollerOptions={{ itemSize: 43 }} maxSelectedLabels={1}
                 placeholder={`Select ${key.charAt(0).toUpperCase() + key.slice(1)}`} onChange={(e) => setTempFilterValues(prev => ({ ...prev, [key]: e.value }))}panelFooterTemplate={
                    <div className="flex justify-between mt-2 p-2">
                      <Button label="Clear" onClick={() => handleClearFilters(key)} className="p-1 text-white bg-blue-500 w-[45%]" />
                      <Button label="Apply" onClick={() => handleApplyFilters(key)} className="p-1 mx-1 text-white bg-blue-500 w-[45%]" />
                    </div>
                  } />
            </div>
        )
    };

    const ViewOptions = (rowData) =>{
        const resultArray = [];
        for (const key in rowData) {
            if (typeof rowData[key] === 'string' && rowData[key].startsWith("uploads/Documents")) {
                const fileName = rowData[key].split('/').pop();  // Extract the file name
                resultArray.push({ Key: key, value: rowData[key], type: fileName });
            }
        }
        return(
            <>
                { resultArray.map((resp,index)=>(
                    <a key={index} href={`${apiurl()}/${resp.value}`} target='_black' className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700">
                        {resp.Key}
                    </a>
                ))}
            </>
        )
    }

    const DownloadOptions = (rowData) =>{
        const resultArray = [];
        for (const key in rowData) {
            if (typeof rowData[key] === 'string' && rowData[key].startsWith("uploads/Documents")) {
                const fileName = rowData[key].split('/').pop();  // Extract the file name
                resultArray.push({ Key: key, value: rowData[key], type: fileName });
            }
        }
        return(
            <>
                { resultArray.map((resp,index)=>(
                    <a key={index} href={`${apiurl()}/${resp.value}`} target='_black' className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700">
                        {resp.Key}
                    </a>
                ))}
            </>
        )
    }

    const view = async (rowData)=>{
        // setdocs(`${apiurl()}/${rowData.Path}`)
        setdocs([{ uri: `${apiurl()}/${rowData.Path}` }])
        try{
            const response = await fetch(`${apiurl()}/${rowData.Path}`,{
                method: 'GET',
                credentials: 'include' // This should match your CORS setup
            });
            console.log(response)
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const blob = await response.blob();
            console.log(blob)
            const url = URL.createObjectURL(blob);
            console.log(url)
        }
        catch(err){
            console.log(err)
        }
    }

    const actionButton = (rowData) => (
        <div className="flex gap-4">
            <div className="flex gap-2">
                <button className="inline-flex items-center text-xl font-medium text-green-600 gap-x-1 decoration-2" onClick={() => editfrom(rowData)}>
                    <i className="fi fi-rr-pen-circle"></i>
                </button>
            </div>
            {/* <div className="flex gap-2">
                <button className="inline-flex items-center text-xl font-medium text-blue-400 gap-x-1 decoration-2" onClick={() => view(rowData)}>
                    <i className="fi fi-rr-eye"></i>
                </button>
            </div> */}
            <a href={`${apiurl()}/${rowData.Path}`} target='_black' className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-red-600 hover:bg-gray-100 focus:outline-none focus:bg-gray-100">
                <i className="fi fi-rr-download"></i>
            </a>
            
        </div>
    );

    return (
        <div>
            {isLoading ? (
                <div className="p-4">
                    {arr.map((col, i) => ( <Skeleton key={i} height="3rem" className="mb-2"></Skeleton>))}
                </div>
            ) : (
                <>
                    <DataTable resizableColumns stripedRows showGridlines value={tabledata} scrollable scrollHeight="calc(100vh - 345px)" className="text-sm" currentPageReportTemplate="{first} to {last} of {totalRecords}" >
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} headerCheckbox />
                        {userdetails()?.Role === 'SuperAdmin' && (<Column header="Action" style={{ minWidth: '80px' }} body={actionButton} />)}
                        <Column field="sno" header="S.No" body={(rowData, { rowIndex }) => <div>{rowIndex + 1}</div>} />
                        <Column field="Docs_CAT" header="Docs CAT" style={{ width: '25%' }} />
                        <Column field="Doc_Name" header="Doc Name" style={{ width: '25%' }} />
                        <Column field="Size" header="Size" style={{ width: '25%' }} />
                        <Column field="Remarks" header="Remarks" style={{ width: '25%' }} />
                    </DataTable>
                </>
            )}
            {/* <DocViewer documents={docs} /> */}
            {/* <iframe src={docs} width="100%" height="600px" style={{ border: 'none' }} title="File Viewer"  ></iframe> */}
        </div>
    );
};

export default Tableview;