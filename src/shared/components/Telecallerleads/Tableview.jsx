/* eslint-disable react/prop-types */
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { updateAllocation } from "../../services/apiunallocation/apiunallocation";
import { InputTextarea } from "primereact/inputtextarea";
import { getDispositionColor, getSubDispositionColor } from "../Unallocation/optionColors";
import { Skeleton } from "primereact/skeleton";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";
import useAuth from "../../services/store/useAuth";
import { UpdateTelecaller, getFilterOptions } from "../../services/apitelecalleralloaction/apitelecallerallocation";
import moment from "moment-timezone";
import { TabPanel, TabView } from "primereact/tabview";
import { Calendar } from "primereact/calendar";

export const Tableview = (props) => {
  const { setGlobalFilter,globalfilter, clearFilter, tabledata, setTabledata, first, setFirst, updateData, cusfilter, isLoading, tempFilterValues, setTempFilterValues,
     Sort, setSort, addDocument, toggleModal } = props;

  const { userdetails } = useAuth();
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [editRowData, setEditRowData] = useState({});
  const [filterOptions,setFilterOptions] = useState({})
  const arr = Array(20).fill(null);

  const handleApplyFilters = (key) => {
    console.log(`Applying filter on ${key} with value:`, tempFilterValues[key]);
    cusfilter(key, tempFilterValues[key]);
   
  };

  const handleClearFilters = (key) => {
    console.log(`Clearing filter on ${key}`);
    setTempFilterValues(prev => ({ ...prev, [key]: [] })); // Ensure the value is reset to an empty array
    cusfilter(key, []);
  };

  const getOption = async (key)=>{
    var filterOptions = await getFilterOptions(key);
    setFilterOptions(filterOptions)
  }

  const renderColumnFilter = (key) => (
    <React.Fragment>
      <div onClick={()=>getOption(key)}>
        <MultiSelect value={tempFilterValues[key] || []} options={filterOptions?.[key]} onChange={(e) => { setTempFilterValues(prev => ({ ...prev, [key]: e.value })); }}
        placeholder={`Select ${key.charAt(0).toUpperCase() + key.slice(1)}`} className="p-column-filter" filter virtualScrollerOptions={{ itemSize: 43 }} maxSelectedLabels={1}panelFooterTemplate={
          <div className="flex justify-between mt-2 p-2">
            <Button label="Clear" onClick={() => handleClearFilters(key)} className="p-1 text-white bg-blue-500 w-[45%]" />
            <Button label="Apply" onClick={() => handleApplyFilters(key)} className="p-1 mx-1 text-white bg-blue-500 w-[45%]" />
          </div>
        }/>

      </div>
    </React.Fragment>
  );

  useEffect(() => {
    const defaultSelectedColumns = ['timestamp', 'Remarks', 'sno', 'Productivity_Status'];
    const savedColumns = localStorage.getItem('selectedColumns');
    if (savedColumns) {
      setSelectedColumns(JSON.parse(savedColumns));
    } else if (tabledata && tabledata.length > 0) {
      const allColumns = Object.keys(tabledata[0]);
      const validColumns = allColumns.filter(col => columnOptions.some(option => option.value === col));
      const initialSelectedColumns = [...new Set([...defaultSelectedColumns, ...validColumns])];
      setSelectedColumns(initialSelectedColumns);
    } else {
      setSelectedColumns(defaultSelectedColumns);
    }
  }, [tabledata]);

  const handleEdit = (rowData, field) => {
    setEditingKey(`${rowData._id}-${field}`);
    setEditRowData(rowData);
  };

  const handleUpdateData = async () => {
    try {
      const requestBody = {
        _id: editRowData._id,
        newData: editRowData
      };
      const res = await updateAllocation(requestBody);
      toast.success("Data updated successfully");
      setEditingKey('');
      await updateData();
    } catch (err) {
      toast.error("Error in updating data");
      console.log(err);
    }
  };

  const handleCancelEdit = () => {
    setEditingKey('');
    setEditRowData({});
  };

  const handleInputChange = (field, value) => {
    setEditRowData(prev => ({ ...prev, [field]: value }));
  };

  const formatMobileNumber = (rowData, e) => {
    const userRole = userdetails()?.Role;
    if (userRole === 'SuperAdmin') {
      return rowData[e.field];
    } else {
      return rowData[e.field]?`${rowData[e.field]?.slice(0, 4)}******`:"";
    }
  };

  const formatMobileForCall = (mobileNumber) => {
    return `tel:${mobileNumber}`;
  };

  const handleDispositionChange = (rowData, e) => {
    const updatedRowData = tabledata.map(row => {
      if (row === rowData) {
        return { ...row, Disposition: e.value, Sub_Disposition: ['Followup', 'Future Followup'].includes(e.value)?new Date(): null };
      }
      return row;
    });
    setTabledata(updatedRowData);
  };

  const handleSubDispositionChange = (rowData, e) => {
    // e.preventDefault();
    setTabledata((prevItems) =>(
      prevItems.map((item) =>
        {return item._id === rowData._id ? {...item,Sub_Disposition: e.target.name == "date"?e.target.value:e.value} : item}
      ))
    );
    //console.log(tabledata)
  };


  const handleRemarksChange = (rowData, value) => {
    //console.log(rowData, value)
    const updatedRowData = tabledata.map(row => {
      if (row === rowData) {
        return { ...row, Remarks: value };
      }
      return row;
    });
    setTabledata(updatedRowData);
  };

  const saveData = async (rowData) => {
    try {
      const requestBody = { id:rowData._id, data:{...rowData,Sub_Disposition: ['Followup', 'Future Followup'].includes(rowData.Disposition) ?moment(rowData.Sub_Disposition).format('DD-MM-YYYY'):rowData.Sub_Disposition} };
      const res = await UpdateTelecaller(requestBody);
      setTabledata(prevUsers => prevUsers.map(record => record._id === res._id ? { ...record, ...res } : record ) );
      toast.success("Disposition, Sub-Disposition, and Remarks saved successfully");
      await updateData();
    } catch (err) {
      toast.error("Error in saving data");
      console.log(err);
    }
  };

  const onPage = (event) => {
    setFirst(event.first);
  };

  const sno = (rowData, { rowIndex }) => (
    <div>{rowIndex + 1}</div>
  );

  const dispositionOptions = userdetails()?.Role == 'Telecaller'?['Submit Lead', 'Not Int', 'Call Back', 'DNE', 'NRF', 'Followup', 'Future Followup', 'Lead Submitted', 'Queue Change','Lead History']: ['Submit Lead', 'Not Int', 'Call Back', 'DNE', 'NRF', 'Followup', 'Future Followup', 'Lead Submitted','Lead Accepted', 'Queue Change','Lead History'];
  const subDispositionOptionsMap = {
    'Submit Lead': ['Docs to be collected', 'Login Pending', 'Interested'],
    'Not Int': ['No Need Loan', 'No Need as of Now', 'High ROI', 'Recently Availed', 'Reason Not Mentioned','Others'],
    'Call Back': ['RNR', 'Call Waiting', 'Call Not Reachable', 'Busy Call after Some time'],
    'DNE': ['Wrong No', 'Call Not Connected', 'Doesnt Exisit', 'Customer is irate'],
    'NRF': ['Not Eligibile', 'Not Relevant', 'Not Earning Member', 'Others'],
    'Followup': ['Date & Time'],
    'Future Followup': ['Date & Time'],
    'Lead Submitted': ['Docs to be collected','Docs Pending_Rtn Back','Login Accepted'],
    'Lead Accepted' : ['Login Pending','Add. Docs to be coltd','Credit WIP','Approved','Disbursed','Declined Re-look','Fully Declined'],
    'Queue Change':['User Name'],
    'Lead History':['20th Allocated to Caller 3 - Not In']
  };

  const columnOptions = [
    { label: 'S.No', value: 'sno' },
    { label: 'Region', value: 'Region' },
    { label: 'Location', value: 'Location' },
    { label: 'Product', value: 'Product' },
    { label: 'Name', value: 'Name' },
    { label: 'Firm Name', value: 'Firm_Name' },
    { label: 'Mobile 1', value: 'Mobile1' },
    { label: 'Mobile 2', value: 'Mobile2' },
    { label: 'Campaign Name', value: 'Campaign_Name' },
    { label: 'Team Leader', value: 'selectedTeamLeader' },
    { label: 'Tele Caller', value: 'selectedTelecaller' },
    { label: 'Productivity Status', value: 'Productivity_Status' },
    { label: 'Disposition', value: 'Disposition' },
    { label: 'Disposition Updated Date', value: 'Disp_Upd_Date' },
    { label: 'Sub Disposition', value: 'Sub_Disposition' },
    { label: 'Sub Disposition Updated Date', value: 'Sub_Disp_Upd_Date' },
    { label: 'Allocate Date', value: 'Allocate_Date' },
    { label: 'Remarks', value: 'Remarks' },
  ];

  const handleColumnChange = (e) => {
    const newSelectedColumns = e.value;
    setSelectedColumns(newSelectedColumns);
    localStorage.setItem('selectedColumns', JSON.stringify(newSelectedColumns));
  };

  const renderEditableCell = (rowData, options) => {
    const editing = `${rowData._id}-${options.field}` === editingKey;
    if (editing) {
      return (
        <div className="flex gap-2">
          <InputTextarea value={editRowData[options.field]} onChange={(e) => handleInputChange(options.field, e.target.value)} rows={2} className="w-32" autoResize />
          <button className="h-8 p-2 text-white bg-red-500 rounded-lg " onClick={handleCancelEdit} ><i className="w-5 h-5 fi fi-sr-cross-circle"></i></button>
          <button className="h-8 p-2 text-white bg-blue-500 rounded-lg" onClick={handleUpdateData} ><i className="fi fi-ss-check-circle"></i></button>
            {/* <Button label="Cancel" onClick={handleCancelEdit} className="p-1 text-white bg-red-500" />
            <Button label="Update" onClick={handleUpdateData} className="p-1 mx-1 text-white bg-blue-500" /> */}
        </div>
      );
    }
    return <span onClick={() => handleEdit(rowData, options.field)}>{rowData[options.field]}</span>;
  };


  const onSort = (event) => {
    setSort({sortField: event?.sortField, sortOrder: event?.sortOrder});
  };

  return (
    <div>
      <div className="block items-center justify-start gap-4 p-2 overflow-x-auto lg:justify-between">
        <div className="block md:flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <MultiSelect value={selectedColumns} options={columnOptions} onChange={handleColumnChange} optionLabel="label" placeholder="Select Columns" maxSelectedLabels={4} className="border-2 border-cyan-300 w-fit md:w-20rem" />
            <button onClick={updateData} className=" text-blue-500 ms-2">
              <i className="fi fi-br-rotate-right"></i>
            </button>
          </div>

          <div className="flex px-2 py-2 lg:flex-row gap-x-2">
            {(userdetails()?.Role === 'Telecaller') && (
              <button onClick={toggleModal} className="inline-flex items-center px-3 py-2 text-sm font-semibold text-white border-transparent rounded-md bg-gradient-to-b from-gray-400 to-gray-600 gap-x-2 hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none">
                <i className="fi fi-rr-add"></i> <span className="hidden md:block">Allocate</span>
              </button>
            )}
            <div className="inline-flex lg:gap-x-2 gap-x-3">
              <input type="input" value={globalfilter} placeholder="Search..." className="py-2 px-4 rounded-md border outline-none" onChange={(e)=>setGlobalFilter(e.target.value)} />
              <button onClick={clearFilter} className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-md border border-transparent bg-[#193762] text-white hover:bg-[#193762] disabled:opacity-50 disabled:pointer-events-none">
                <i className="fi fi-rr-clear-alt pt-1"></i>
              </button>
            </div>
          </div> 
        </div>
      </div>

      
      {isLoading ? (
        <div className="p-4">
          {arr.map((col, i) => ( <Skeleton key={i} height="3rem" className="mb-2"></Skeleton>))}
        </div>
      ) : (
        <DataTable resizableColumns stripedRows showGridlines tableStyle={{ minWidth: '50rem' }} value={tabledata} rows={rowsPerPage} first={first} onPage={onPage} 
          className="text-sm" scrollable scrollHeight="calc(100vh - 330px)" onSort={onSort} sortField={Sort.sortField} sortOrder={Sort.sortOrder} >
          {/* <Column header="Action" style={{ minWidth: '80px' }} body={actionButton} /> */}
          {selectedColumns.includes('sno') && ( <Column field="sno" header="S.No" body={sno} /> )}
          {selectedColumns.includes('Region') && (
            <Column field="Region" header="Region" filter filterElement={renderColumnFilter('Region')} showFilterMenuOptions={false} showFilterMatchModes={false} showApplyButton={false} showClearButton={false} sortable style={{ width: '25%' }} body={renderEditableCell}/>
          )}
          {selectedColumns.includes('Location') && (
            <Column field="Location" header="Location" filter filterElement={renderColumnFilter('Location')} showFilterMenuOptions={false} showFilterMatchModes={false} showApplyButton={false} showClearButton={false} sortable style={{ width: '25%' }} body={renderEditableCell}  />
          )}
          {selectedColumns.includes('Product') && (
            <Column field="Product" header="Product" filter filterElement={renderColumnFilter('Product')} showFilterMenuOptions={false} showFilterMatchModes={false} showApplyButton={false} showClearButton={false} sortable style={{ width: '25%' }}  body={renderEditableCell} />
          )}
          {selectedColumns.includes('Name') && ( <Column field="Name" header="Name" sortable style={{ width: '25%' }} body={renderEditableCell} /> )}
          {selectedColumns.includes('Firm_Name') && ( <Column field="Firm_Name" header="Firm Name" body={renderEditableCell} /> )}
          {selectedColumns.includes('Mobile1') && ( <Column field="Mobile1" header="Mobile 1" body={formatMobileNumber} /> )}
          {selectedColumns.includes('Mobile2') && ( <Column field="Mobile2" header="Mobile 2" body={formatMobileNumber} /> )}
          <Column field="Call" header="Call" className="w-10 h-10" body={(rowData) => (
            <div className="hs-dropdown relative inline-flex">
              <button id="hs-dropdown-default" type="button" className="hs-dropdown-toggle bg-blue-400 shadow-md text-white px-2 pt-2 pb-0.5 rounded-full text-xl " aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown">
                <i className="fi fi-rr-phone-call"></i>
              </button>
            
              <div className="hs-dropdown-menu transition-[opacity,margin] z-[3] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg mt-2 dark:bg-neutral-800 dark:border dark:border-neutral-700 dark:divide-neutral-700 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full" role="menu" aria-orientation="vertical" aria-labelledby="hs-dropdown-default">
                <div className="p-1 space-y-0.5">
                  <a href={formatMobileForCall(rowData.Mobile1, userdetails())} className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"> <i className="fi fi-rr-phone-call"></i> Mobile 1 </a> 
                  {rowData.Mobile2&&<a href={formatMobileForCall(rowData.Mobile2, userdetails())} className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"> <i className="fi fi-rr-phone-call"></i> Mobile 2 </a>} 
                </div>
              </div>
            </div>
            )} />
          <Column field="Call" header="Whatsapp" className="w-10 h-10" body={(rowData) => (
            <div className="hs-dropdown relative inline-flex">
              <button id="hs-dropdown-default" type="button" className="hs-dropdown-toggle bg-green-400 shadow-md text-white px-2 pt-2 pb-0.5 rounded-full text-xl" aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown">
                <i className="fi fi-brands-whatsapp"></i>
              </button>
            
              <div className="hs-dropdown-menu transition-[opacity,margin] z-[3] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg mt-2 dark:bg-neutral-800 dark:border dark:border-neutral-700 dark:divide-neutral-700 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full" role="menu" aria-orientation="vertical" aria-labelledby="hs-dropdown-default">
                <div className="p-1 space-y-0.5">
                  <a target="_blank" href={`https://web.whatsapp.com/send/?phone=${rowData.Mobile1}&text=hi`} className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"> <i className="fi fi-rr-phone-call"></i> Mobile 1 </a> 
                  {rowData.Mobile2&&<a target="_blank" href={`https://web.whatsapp.com/send/?phone=${rowData.Mobile2}&text=hi`} className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"> <i className="fi fi-rr-phone-call"></i> Mobile 2 </a>} 
                </div>
              </div>
            </div>
            
          )} />
          {selectedColumns.includes('Campaign_Name') && (
            <Column field="Campaign_Name" header="Campaign Name" filter filterElement={renderColumnFilter('Campaign_Name')} showFilterMenuOptions={false} showFilterMatchModes={false} showApplyButton={false} showClearButton={false} sortable style={{ width: '25%' }} body={renderEditableCell} />
          )}
          {selectedColumns.includes('selectedTeamLeader') && (
            <Column field="selectedTeamLeader" header="Team Leader" style={{ minWidth: '10rem' }} filter filterElement={renderColumnFilter('selectedTeamLeader')} showFilterMenuOptions={false} showFilterMatchModes={false} showApplyButton={false} showClearButton={false} sortable />
          )}
          {selectedColumns.includes('selectedTelecaller') && (
            <Column field="selectedTelecaller" header="Tele Caller" style={{ minWidth: '10rem' }} filter filterElement={renderColumnFilter('selectedTelecaller')} showFilterMenuOptions={false} showFilterMatchModes={false} showApplyButton={false} showClearButton={false} sortable />
          )}
          {selectedColumns.includes('Disposition') && (
            <Column field="Disposition" header="Disposition" body={(rowData) => (
              <Dropdown value={rowData.Disposition} options={dispositionOptions} onChange={(e) => handleDispositionChange(rowData, e)} placeholder="Select Disposition" optionLabel={(option) => option} optionStyle={(option) => ({ color: 'white', backgroundColor: getDispositionColor(option) })} style={{ width: '200px', backgroundColor: getDispositionColor(rowData.Disposition) }} /> )} width="200px" 
              filter filterElement={renderColumnFilter('Disposition')} showFilterMenuOptions={false} showFilterMatchModes={false} showApplyButton={false} showClearButton={false} sortable style={{ width: '25%' }} />
          )}
          {selectedColumns.includes('Disp_Upd_Date') && (
            <Column field="Disp_Upd_Date" header="Disposition Updated Date" body={(rowData) => (<div>{rowData.Disp_Upd_Date ? moment(rowData.Disp_Upd_Date).format("DD-MM-YYYY") : ''}</div>)} style={{ minWidth: '10rem' }}  />
          )}
          {selectedColumns.includes('Sub_Disposition') && (
            <Column field="Sub_Disposition" header="Sub Disposition" body={(rowData) => (
              <>
              {
                !['Followup', 'Future Followup'].includes(rowData.Disposition)?
                <Dropdown name="string" value={rowData?.Sub_Disposition} options={subDispositionOptionsMap[rowData.Disposition] || []} onChange={(e) => handleSubDispositionChange(rowData, e)} placeholder="Select Sub Disposition" optionLabel={(option) => option} optionStyle={(option) => ({ color: 'white', backgroundColor: getSubDispositionColor(option) })} style={{ width: '250px', backgroundColor: getSubDispositionColor(rowData.Sub_Disposition) }} />:
                // <Calendar id="calendar-12h" name="date" dateFormat="dd-mm-yy" value={rowData.Sub_Disposition} onChange={(e) => handleSubDispositionChange(rowData, e)} />
                <input type="date" name="date" value={rowData?.Sub_Disposition} onChange={(e) => handleSubDispositionChange(rowData, e)} className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"></input>
              }
                
              </>
            )} width="200px"
              filter filterElement={renderColumnFilter('Sub_Disposition')} showFilterMenuOptions={false} showFilterMatchModes={false} showApplyButton={false} showClearButton={false} sortable style={{ width: '25%' }}
            />
          )}
          {selectedColumns.includes('Sub_Disp_Upd_Date') && (
            <Column field="Sub_Disp_Upd_Date" header="Sub Disposition Updated Date" body={(rowData) => (<div>{rowData.Sub_Disp_Upd_Date ? moment(rowData.Sub_Disp_Upd_Date).format("DD-MM-YYYY") : ''}</div>)} style={{ minWidth: '10rem' }}  />
          )}
          {selectedColumns.includes('Allocate_Date') && (
            <Column field="Allocate_Date" header="Allocate Date" sortable body={(rowData) => (<div>{rowData.Allocate_Date ? moment(rowData.Allocate_Date).format("DD-MM-YYYY") : ''}</div>)} style={{ minWidth: '10rem' }}  />
          )}
          {selectedColumns.includes('Remarks') && (
            <Column field="Remarks" header="Remarks" width="200px" body={(rowData) => ( <InputTextarea rows={1} style={{ width: '250px'}} value={rowData.Remarks} onChange={(e) => handleRemarksChange(rowData, e.target.value)} className="w-full"  /> )} />
          )}
          <Column body={(rowData) => (
            <>
              <button onClick={() => saveData(rowData)} disabled={!rowData.Disposition || !rowData.Sub_Disposition} tyle={{ minWidth: '10rem' }} className={`p-2 px-3 text-sm text-white shadow-md rounded-md ${rowData.Disposition && rowData.Sub_Disposition ? 'bg-blue-500' : 'bg-gray-400 cursor-not-allowed'}`} > Submit </button>
              {rowData.Disposition == "Lead Accepted"&&
                <button type="button" onClick={() => addDocument(rowData)} tyle={{ minWidth: '10rem' }} className={`pt-2 pb-1 px-3 ms-3 text-white shadow-md rounded-md bg-yellow-500`} > <i className="fi fi-rr-file-edit pt-1"></i> </button>
              }
            </>
          )} />
        </DataTable>
      )}
    </div>
  );
};
