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
import { DownloadFiles, getfilteroptionsDocCenter } from '../../services/apiDocument/apidocument';
import { Link } from 'react-router-dom';


const Tableview = (props) => {
    const { tabledata, totalRecords, first, rows, onPageChange, editfrom, cusfilter, tempFilterValues, setTempFilterValues, handledelete, isLoading,
        selectedRows, setSelectedRows, getallDocuments, Sort, setSort } = props;
        
    const [rowsPerPage, setRowsPerPage] = useState(rows);
    const [rowDataState, setRowDataState] = useState([]);
    const [allSelected, setAllSelected] = useState(false);
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
        var filterOptions = await getfilteroptionsDocCenter(key);
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

    const actionButton = (rowData) => (
        <div className="flex gap-4">
            <div className="flex gap-2">
                <button className="inline-flex items-center text-xl font-medium text-green-600 gap-x-1 decoration-2" onClick={() => editfrom(rowData)}>
                    <i className="fi fi-rr-pen-circle"></i>
                </button>
            </div>
            <div className="flex gap-2">
                <Link to={`/documents/${rowData.Client_ID}`} className="inline-flex items-center text-xl font-medium text-red-600 gap-x-1 decoration-2" onClick={() => editfrom(rowData)}>
                    <i className="fi fi-rr-legal"></i>
                </Link>
            </div>
            {/* <div className="flex gap-2">
                <div className="hs-dropdown relative inline-flex">
                    <button id="hs-dropdown-default" type="button" className="hs-dropdown-toggle text-xl font-medium text-blue-600 gap-x-1 decoration-2" aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown">
                        <i className="fi fi-rr-eye"></i>
                    </button>

                    <div className="hs-dropdown-menu transition-[opacity,margin] z-[9999] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg p-1 space-y-0.5 mt-2 dark:bg-neutral-800 dark:border dark:border-neutral-700 dark:divide-neutral-700 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full" role="menu" aria-orientation="vertical" aria-labelledby="hs-dropdown-default">
                        {
                           ViewOptions(rowData) 
                        }
                    </div>
                </div>
            </div> */}
            {/* <div className="flex gap-2">
                <div className="hs-dropdown relative inline-flex">
                    <button id="hs-dropdown-default" type="button" className="hs-dropdown-toggle text-md font-medium text-red-600 gap-x-1 decoration-2" aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown">
                        <i className="fi fi-rr-download"></i>
                    </button>

                    <div className="hs-dropdown-menu transition-[opacity,margin] z-[9999] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg p-1 space-y-0.5 mt-2 dark:bg-neutral-800 dark:border dark:border-neutral-700 dark:divide-neutral-700 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full" role="menu" aria-orientation="vertical" aria-labelledby="hs-dropdown-default">
                        {
                           DownloadOptions(rowData) 
                        }
                    </div>
                </div>
            </div> */}
        </div>
    );


    const onSort = (event) => {
        setSort({sortField: event?.sortField, sortOrder: event?.sortOrder});
    };

    return (
        <div>
            <div className='md:flex justify-between mx-5'>
                <div className='flex'>
                    <div className="justify-end mb-1 md:mb-3 mr-3">
                        <span>Show:</span>
                        <select value={rowsPerPage} onChange={handleRowsPerPageChange} className="p-2 mx-2 rounded-lg border-1">
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                            <option value={1000}>1000</option>
                        </select>
                        <span>rows/page</span>
                    </div>
                    <button onClick={getallDocuments} className="text-blue-500 pb-2">
                        <i className="fi fi-br-rotate-right"></i>
                    </button>
                </div>

                <h1 className='justify-end py-4'>Total Records: {totalRecords}</h1>
            </div>
            {isLoading ? (
                <div className="p-4">
                    {arr.map((col, i) => ( <Skeleton key={i} height="3rem" className="mb-2"></Skeleton>))}
                </div>
            ) : (
                <>
                    <DataTable resizableColumns stripedRows showGridlines lazy value={tabledata} totalRecords={totalRecords} paginator rows={rowsPerPage} first={first}
                        onPage={onPageChange} scrollable scrollHeight="calc(100vh - 345px)" className="text-sm" currentPageReportTemplate="{first} to {last} of {totalRecords}"
                        onSort={onSort} sortField={Sort.sortField} sortOrder={Sort.sortOrder}>

                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} headerCheckbox />
                        {userdetails()?.Role === 'SuperAdmin' && (<Column header="Action" style={{ minWidth: '80px' }} body={actionButton} />)}
                        <Column field="sno" header="S.No" body={(rowData, { rowIndex }) => <div>{rowIndex + 1}</div>} />
                        <Column field="Client_ID" header="Client ID" filter filterElement={renderColumnFilter('Client_ID')} showFilterMenuOptions={false} showFilterMatchModes={false} showApplyButton={false} showClearButton={false} sortable style={{ width: '25%' }} />
                        <Column field="Name" header="Client Name" filter filterElement={renderColumnFilter('Name')} showFilterMenuOptions={false} showFilterMatchModes={false} showApplyButton={false} showClearButton={false} sortable style={{ width: '25%' }} />
                        <Column field="Mobile1" header="Mobile Number" filter filterElement={renderColumnFilter('Mobile1')} showFilterMenuOptions={false} showFilterMatchModes={false} showApplyButton={false} showClearButton={false} sortable style={{ width: '25%' }} />
                        <Column field="Region" header="Region" filter filterElement={renderColumnFilter('Region')} showFilterMenuOptions={false} showApplyButton={false} showClearButton={false} showFilterMatchModes={false} sortable style={{ width: '25%' }} />
                        <Column field="Product" header="Product" filter filterElement={renderColumnFilter('Product')} showFilterMenuOptions={false} showApplyButton={false} showClearButton={false} showFilterMatchModes={false} sortable style={{ width: '25%' }} />
                        <Column field="Firm_Name" header="Firm Name" filter filterElement={renderColumnFilter('Firm_Name')} showFilterMenuOptions={false} showApplyButton={false} showClearButton={false} showFilterMatchModes={false} sortable style={{ width: '25%' }} />
                        <Column field="Campaign_Name" header="Campaign Name" filter filterElement={renderColumnFilter('Campaign_Name')} showFilterMenuOptions={false} showApplyButton={false} showClearButton={false} showFilterMatchModes={false} sortable style={{ width: '25%' }} />
                        <Column field="Loan_Product" header="Loan Product" filter filterElement={renderColumnFilter('Loan_Product')} showFilterMenuOptions={false} showApplyButton={false} showClearButton={false} showFilterMatchModes={false} sortable style={{ width: '25%' }} />
                        <Column field="Alternative" header="Alternative" filter filterElement={renderColumnFilter('Alternative')} showFilterMenuOptions={false} showApplyButton={false} showClearButton={false} showFilterMatchModes={false} sortable style={{ width: '25%' }} />
                        <Column field="Company_Name" header="Company Name" filter filterElement={renderColumnFilter('Company_Name')} showFilterMenuOptions={false} showApplyButton={false} showClearButton={false} showFilterMatchModes={false} sortable style={{ width: '25%' }} />
                        <Column field="Remarks" header="Remarks" filter filterElement={renderColumnFilter('Remarks')} showFilterMenuOptions={false} showApplyButton={false} showClearButton={false} showFilterMatchModes={false} sortable style={{ width: '25%' }} />
                    </DataTable>
                </>
            )}
        </div>
    );
};

export default Tableview;