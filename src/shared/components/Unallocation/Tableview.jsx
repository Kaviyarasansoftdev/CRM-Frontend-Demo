/* eslint-disable react/prop-types */
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Skeleton } from 'primereact/skeleton';
import { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import { getFilterOptions } from '../../services/apiunallocation/apiunallocation';
import useAuth from '../../services/store/useAuth';

const Tableview = (props) => {
    const { tabledata, totalRecords, first, rows, onPageChange, editfrom, cusfilter, tempFilterValues, setTempFilterValues, handledelete, isLoading,
        selectedRows, setSelectedRows, updateTableData, Sort, setSort } = props;
        
    const [rowsPerPage, setRowsPerPage] = useState(rows);
    const [rowDataState, setRowDataState] = useState([]);
    const [allSelected, setAllSelected] = useState(false);
    const [filterOptions,setFilterOptions] = useState({});
    
    const {userdetails} = useAuth()
    const arr = Array(20).fill(null);

    useEffect(() => {
        setRowDataState(tabledata.map(row => ({
            ...row,
            selectedDisposition: row.Disposition || null,
            selectedSubDisposition: row.Sub_Disposition || null
        })));
    }, [tabledata]);

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(event.target.value);
        onPageChange({ first: 0, rows: event.target.value });
    };

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
        setFilterOptions(filterOptions)
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

    const actionButton = (rowData) => (
        <div className="flex gap-4">
            <div className="flex gap-2">
                <button className="inline-flex items-center text-xl font-medium text-blue-600 gap-x-1 decoration-2" onClick={() => editfrom(rowData)}>
                    <i className="fi fi-rr-pen-circle"></i>
                </button>
            </div>
            <div className="flex gap-2">
                <button className="inline-flex items-center text-xl font-medium text-red-600 gap-x-1 decoration-2" onClick={() => handledelete(rowData._id)}>
                    <i className="fi fi-rr-trash"></i>
                </button>
            </div>
        </div>
    );

    const handleRefresh = () => {
        updateTableData();
    };

    const handleSelectionChange = (e) => {
        setSelectedRows(e.value);
    };

    const handleSelectAllChange = (e) => {
        if (e.checked) {
            const currentPageRows = rowDataState.slice(first, first + rowsPerPage); 
            setSelectedRows(currentPageRows);
        } else {
            setSelectedRows([]);
        }
        setAllSelected(e.checked);
    };

    const onSort = (event) => {
        setSort({sortField: event?.sortField, sortOrder: event?.sortOrder});
    };

    const formatMobileNumber = (rowData, e) => {
        const userRole = userdetails()?.Role;
        if (userRole === 'SuperAdmin') {
            return rowData[e.field];
        } else {
            return rowData[e.field]?`${rowData[e.field]?.slice(0, 4)}******`:"";
        }
    };

    return (
        <div>
            <div className='md:flex justify-between mx-5'>
                <div className='flex'>
                    <div className="justify-end mb-1 md:mb-3 mr-3">
                        <span>Show:</span>
                        <select value={rowsPerPage} onChange={handleRowsPerPageChange} className="p-2 mx-2 rounded-md border-1">
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                            <option value={1000}>1000</option>
                        </select>
                        <span>rows/page</span>
                    </div>
                    <button onClick={handleRefresh} className="text-blue-500 rounded-md pb-2">
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
                    <DataTable resizableColumns stripedRows showGridlines lazy value={rowDataState} totalRecords={totalRecords} paginator rows={rowsPerPage} first={first}
                        onPage={onPageChange} scrollable scrollHeight="calc(100vh - 320px)" className="text-sm" currentPageReportTemplate="{first} to {last} of {totalRecords}"
                        selection={selectedRows} onSelectionChange={handleSelectionChange} selectAll={allSelected} onSelectAllChange={handleSelectAllChange}
                        onSort={onSort} sortField={Sort.sortField} sortOrder={Sort.sortOrder}>

                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} headerCheckbox />
                        {userdetails()?.Role === 'SuperAdmin' && (<Column header="Action" style={{ minWidth: '80px' }} body={actionButton} />)}
                        <Column field="sno" header="S.No" body={(rowData, { rowIndex }) => <div>{rowIndex + 1}</div>} />
                        <Column field="Region" header="Region" filter filterElement={renderColumnFilter('Region')} showFilterMenuOptions={false} showFilterMatchModes={false} showApplyButton={false} showClearButton={false} sortable style={{ width: '25%' }} />
                        <Column field="Location" header="Location" filter filterElement={renderColumnFilter('Location')} showFilterMenuOptions={false} showFilterMatchModes={false} showApplyButton={false} showClearButton={false} sortable style={{ width: '25%' }} />
                        <Column field="Product" header="Product" filter filterElement={renderColumnFilter('Product')} showFilterMenuOptions={false} showFilterMatchModes={false} showApplyButton={false} showClearButton={false} sortable style={{ width: '25%' }} />
                        <Column field="Campaign_Name" header="Campaign Name" filter filterElement={renderColumnFilter('Campaign_Name')} showFilterMenuOptions={false} showApplyButton={false} showClearButton={false} showFilterMatchModes={false} sortable style={{ width: '25%' }} />
                        <Column field="Name" header="Name" sortable style={{ width: '25%' }} />
                        <Column field="Firm_Name" header="Firm Name" />
                        <Column field="Mobile1" header="Mobile 1" body={formatMobileNumber} />
                        <Column field="Mobile2" header="Mobile 2" body={formatMobileNumber} />

                    </DataTable>
                </>
            )}
        </div>
    );
};

export default Tableview;