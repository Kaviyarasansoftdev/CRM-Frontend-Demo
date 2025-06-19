/* eslint-disable react/prop-types */
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { allocateteamleader } from "../../services/apiunallocation/apiunallocation";
import { InputTextarea } from "primereact/inputtextarea";
import { getDispositionColor, getSubDispositionColor } from "./ProductivityoptionColors";
import useRegionFilter from "../Unallocation/RegionFilters";
import useLocationFilter from "../Unallocation/LocationFilters";
import useCampanignFilter from "../Unallocation/CampaingnFilters";
import useProductFilter from "../Unallocation/ProductFilters";
import { MultiSelect } from 'primereact/multiselect';
import { Skeleton } from "primereact/skeleton";
import moment from "moment-timezone";
import useAuth from "../../services/store/useAuth";
import { UpdateTelecaller } from "../../services/apitelecalleralloaction/apitelecallerallocation";
import { getFilterOptions } from "../../services/apiproductivity/apiproductivity";
import { Button } from "primereact/button";
import { TabPanel, TabView } from "primereact/tabview";


export const Tableview = (props) => {
  const { tabledata, first, setFirst, cusfilter, updateData, isLoading, setTabledata, tempFilterValues, setTempFilterValues, Sort, setSort, setglobalfilter, globalfilter, clearFilter } = props;
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [filterOptions,setFilterOptions] = useState({})
  const { userdetails } = useAuth();
  const arr = Array(20).fill(null);

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


  useEffect(() => {
    const defaultSelectedColumns = ['timestamp', 'Remarks', 'sno', 'Productivity_Status','Disposition','Sub_Disposition'];
    const savedColumns1 = localStorage.getItem('selectedColumns1');
    if (savedColumns1) {
      setSelectedColumns(JSON.parse(savedColumns1));
    } else if (tabledata && tabledata.length > 0) {
      const allColumns = Object.keys(tabledata[0]);
      const validColumns = allColumns.filter(col => columnOptions.some(option => option.value === col));
      const initialSelectedColumns = [...new Set([...defaultSelectedColumns, ...validColumns])];
      setSelectedColumns(initialSelectedColumns);
    } else {
      setSelectedColumns(defaultSelectedColumns);
    }
  }, [tabledata]);

  const handleRemarksChange = (rowData, value) => {
    const updatedRowData = tabledata.map(row => {
      if (row === rowData) {
        return { ...row, Remarks: value };
      }
      return row;
    });
    setTabledata(updatedRowData);
  };

  const onPage = (event) => {
    setFirst(event.first);
  };

  const sno = (rowData, { rowIndex }) => (
    <div>{rowIndex + 1}</div>
  );



  const productivityStatusOptions = [ 'Lead Accepted', 'Logged', 'Approved', 'Disbursed' ];
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

  const handleProductivityStatusChange = (rowData, e) => {
    const updatedRowData = tabledata.map(row => {
      if (row === rowData) {
        return { ...row, Productivity_Status: e.value };
      }
      return row;
    });
    setTabledata(updatedRowData);
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
    setTabledata((prevItems) =>(
      prevItems.map((item) =>
        {return item._id === rowData._id ? {...item,Sub_Disposition: e.target.name == "date"?e.target.value:e.value} : item}
      ))
    );
  };

//   const actionbotton = () => {
//     return (
//         <div className="flex gap-4">
//             <div className="flex gap-2">
//                 <button className="inline-flex items-center text-xl font-medium text-blue-600 gap-x-1 decoration-2 ">
//                     <i className="fi fi-rr-pen-circle"></i>
//                 </button>
//             </div>
//             <div className="flex gap-2">
//                 <button className="inline-flex items-center text-xl font-medium text-red-600 gap-x-1 decoration-2 " >
//                     <i className="fi fi-rr-trash"></i>
//                 </button>
//             </div>
//         </div>
//     )
// }

  const saveData = async (rowData) => {
    try {
      const requestBody = { id:rowData._id, data:{...rowData,Sub_Disposition: ['Followup', 'Future Followup'].includes(rowData.Disposition) ?moment(rowData.Sub_Disposition).format('DD-MM-YYYY'):rowData.Sub_Disposition}  };
      const res = await UpdateTelecaller(requestBody);
      setTabledata(prevUsers => prevUsers.map(record => record._id === res._id ? { ...record, ...res } : record ) );
      toast.success("Data Updated successfully");
      await updateData();
    } catch (err) {
      toast.error("Error in updating data");
      console.log(err);
    }
  };


  const handleColumnChange = (e) => {
    const newSelectedColumns = e.value;
    setSelectedColumns(newSelectedColumns);
    localStorage.setItem('selectedColumns1', JSON.stringify(newSelectedColumns));
  };

  const handleApplyFilters = (key) => {
    cusfilter(key, tempFilterValues[key]);
   
  };

  const handleClearFilters = (key) => {
    setTempFilterValues(prev => ({ ...prev, [key]: [] }));
    cusfilter(key, []);
  };

  const getOption = async (key)=>{
    var filterOptions = await getFilterOptions(key);
    setFilterOptions(filterOptions)
  }

  const renderColumnFilter = (key) => (
    <div onClick={()=>getOption(key)}>
      <MultiSelect filter value={tempFilterValues[key] || []} options={filterOptions?.[key]} onChange={(e) => { setTempFilterValues(prev => ({ ...prev, [key]: e.value })); }}
      placeholder={`Select ${key.charAt(0).toUpperCase() + key.slice(1)}`} className="p-column-filter" virtualScrollerOptions={{ itemSize: 43 }} maxSelectedLabels={1} panelFooterTemplate={
        <div className="flex justify-between mt-2 p-2">
          <Button label="Clear" onClick={() => handleClearFilters(key)} className="p-1 text-white bg-blue-500 w-[45%]" />
          <Button label="Apply" onClick={() => handleApplyFilters(key)} className="p-1 mx-1 text-white bg-blue-500 w-[45%]" />
        </div>
      }/>

    </div>
  );


  const onSort = (event) => {
    setSort({sortField: event?.sortField, sortOrder: event?.sortOrder});
  };

  return (
    <div>
      <div className="block lg:flex justify-between items-center mx-3 mb-3">

        <div className="flex items-center gap-2 ">
          <MultiSelect value={selectedColumns} options={columnOptions} onChange={handleColumnChange} optionLabel="label" placeholder="Select Columns" maxSelectedLabels={4} className="border-2 border-cyan-300 w-fit md:w-20rem" />
          <button onClick={updateData} className="text-blue-500 ms-2">
            <i className="fi fi-br-rotate-right"></i>
          </button>
        </div>

        <div className="inline-flex lg:gap-x-2 gap-x-3">
            <input type="input" value={globalfilter} placeholder="Search..." className="py-2 px-4 rounded-md border outline-none" onChange={(e)=>setglobalfilter(e.target.value)} />
            <button onClick={clearFilter} className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-md border border-transparent bg-[#193762] text-white hover:bg-[#193762] disabled:opacity-50 disabled:pointer-events-none">
                <i className="fi fi-rr-clear-alt pt-1"></i>
            </button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-4">
          {arr.map((col, i) => ( <Skeleton key={i} height="3rem" className="mb-2"></Skeleton>))}
        </div>
      ) : (
      <DataTable resizableColumns stripedRows showGridlines tableStyle={{ minWidth: 'calc(100vh - 158px)' }} selection={selectedProducts} columnResizeMode="expand"
        onSelectionChange={e => setSelectedProducts(e.value)} value={tabledata} rows={rowsPerPage} first={first} onPage={onPage} className="text-sm" scrollable
        scrollHeight="calc(100vh - 310px)" onSort={onSort} sortField={Sort.sortField} sortOrder={Sort.sortOrder}>
        {selectedColumns.includes('sno') && (
          <Column field="sno" header="S.No" body={sno} />
        )}
        {selectedColumns.includes('Region') && (
          <Column field="Region" header="Region"  filter filterElement={renderColumnFilter('Region')} showFilterMenuOptions={false} showFilterMatchModes={false} showApplyButton={false} showClearButton={false} sortable style={{ width: '25%' }}/>
        )}
        {selectedColumns.includes('Location') && (
          <Column field="Location" header="Location" filter filterElement={renderColumnFilter('Location')} showFilterMenuOptions={false} showFilterMatchModes={false} showApplyButton={false} showClearButton={false} sortable style={{ width: '25%' }} />
        )}
        {selectedColumns.includes('Product') && (
          <Column field="Product" header="Product" filter filterElement={renderColumnFilter('Product')} showFilterMenuOptions={false} showFilterMatchModes={false} showApplyButton={false} showClearButton={false} sortable style={{ width: '25%' }}/>
        )}
        {selectedColumns.includes('Name') && (
          <Column field="Name" header="Name" sortable style={{ width: '25%' }} />
        )}
        {selectedColumns.includes('Firm_Name') && (
          <Column field="Firm_Name" header="Firm Name" />
        )}
        {selectedColumns.includes('Mobile1') && (
          <Column field="Mobile1" header="Mobile 1" />
        )}
        {selectedColumns.includes('Mobile2') && (
          <Column field="Mobile2" header="Mobile 2" />
        )}
        {selectedColumns.includes('Campaign_Name') && (
          <Column field="Campaign_Name" header="Campaign Name" filter filterElement={renderColumnFilter('Campaign_Name')} showFilterMenuOptions={false} showFilterMatchModes={false} showApplyButton={false} showClearButton={false} sortable style={{ width: '25%' }} />
        )}
        {selectedColumns.includes('selectedTeamLeader') && (
          <Column field="selectedTeamLeader" header="Team Leader" style={{ minWidth: '10rem' }} filter filterElement={renderColumnFilter('selectedTeamLeader')} showFilterMenuOptions={false} showFilterMatchModes={false} showApplyButton={false} showClearButton={false} sortable />
        )}
        {selectedColumns.includes('selectedTelecaller') && (
          <Column field="selectedTelecaller" header="Tele Caller" style={{ minWidth: '10rem' }} filter filterElement={renderColumnFilter('selectedTelecaller')} showFilterMenuOptions={false} showFilterMatchModes={false} showApplyButton={false} showClearButton={false} sortable />
        )}
        {selectedColumns.includes('Productivity_Status') && (
        <Column field="Productivity_Status" header="Productivity Status" style={{ minWidth: '10rem' }} body={(rowData) => ( (['Lead Accepted','Logged','Approved','Disbursed'].includes(rowData.Productivity_Status) && userdetails.Role != "Telecaller")? (
          <Dropdown value={rowData.Productivity_Status} options={productivityStatusOptions} onChange={(e) => handleProductivityStatusChange(rowData, e)} placeholder="Select Productivity Status" optionLabel={(option) => option} /> ) : 
          ( <div>{rowData.Productivity_Status}</div> )
        )} filter filterElement={renderColumnFilter('Productivity_Status')} showFilterMenuOptions={false} showFilterMatchModes={false} showApplyButton={false} showClearButton={false} sortable />
      )}

      {selectedColumns.includes('Disposition') && (
        <Column field="Disposition" header="Disposition" width="150px" body={(rowData) => (
            <Dropdown value={rowData.Disposition} options={dispositionOptions} onChange={(e) => handleDispositionChange(rowData, e)} optionLabel={(option) => option}
              optionStyle={(option) => ({ color: 'white', backgroundColor: getDispositionColor(option) })} style={{ width: '150px', backgroundColor: getDispositionColor(rowData.Disposition) }}
            />
          )} filter filterElement={renderColumnFilter('Disposition')} showFilterMenuOptions={false} showFilterMatchModes={false} showApplyButton={false} showClearButton={false} sortable style={{ width: '25%' }}
        />
      )}
      {selectedColumns.includes('Disp_Upd_Date') && (
        <Column field="Disp_Upd_Date" header="Disposition Updated Date" body={(rowData) => (<div>{rowData.Disp_Upd_Date ? moment(rowData.Disp_Upd_Date).format("DD-MM-YYYY") : ''}</div>)} style={{ minWidth: '10rem' }}  />
      )}
      {selectedColumns.includes('Sub_Disposition') && (
        <Column field="Sub_Disposition" header="Sub Disposition" width="150px" body={(rowData) => (
          <> {
            !['Followup', 'Future Followup'].includes(rowData.Disposition)?
            <Dropdown name="select" value={rowData.Sub_Disposition} options={subDispositionOptionsMap[rowData.Disposition] || []} onChange={(e) => handleSubDispositionChange(rowData, e)} placeholder="Select Sub Disposition" optionLabel={(option) => option} optionStyle={(option) => ({ color: 'white', backgroundColor: getSubDispositionColor(option) })} style={{ width: '150px', backgroundColor: getSubDispositionColor(rowData.Sub_Disposition) }} />:
            <input type="date" name="date" value={rowData?.Sub_Disposition} onChange={(e) => handleSubDispositionChange(rowData, e)} className="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"></input>
          }</>
        )}
          filter filterElement={renderColumnFilter('Sub_Disposition')} showFilterMenuOptions={false} showFilterMatchModes={false} showApplyButton={false} showClearButton={false} sortable style={{ width: '25%' }} />
      )}
      {selectedColumns.includes('Sub_Disp_Upd_Date') && (
        <Column field="Sub_Disp_Upd_Date" header="Sub Disposition Updated Date" body={(rowData) => (<div>{rowData.Sub_Disp_Upd_Date ? moment(rowData.Sub_Disp_Upd_Date).format("DD-MM-YYYY") : ''}</div>)} style={{ minWidth: '10rem' }}  />
      )}
      {selectedColumns.includes('Allocate_Date') && (
        <Column field="Allocate_Date" header="Allocate Date" body={(rowData) => (<div>{rowData.Allocate_Date ? moment(rowData.Allocate_Date).format("DD-MM-YYYY") : ''}</div>)} style={{ minWidth: '10rem' }}  />
      )}
      {selectedColumns.includes('Remarks') && (
        <Column field="Remarks" header="Remarks" width="200px" body={(rowData) => (
          <InputTextarea value={rowData.Remarks} onChange={(e) => handleRemarksChange(rowData, e.target.value)} rows={1} style={{ width: '250px'}} className="w-full" />
        )} />
      )}
      <Column body={(rowData) => ( <button onClick={() => saveData(rowData)} disabled={!rowData.Disposition || !rowData.Sub_Disposition} 
        className={`p-2 px-4 text-white rounded-md shadow-md ${ rowData.Disposition && rowData.Sub_Disposition ? 'bg-blue-500' : 'bg-gray-400 cursor-not-allowed'
        }`} > Submit </button>
      )} style={{ minWidth: '10rem' }} />
    </DataTable>
    )}
  </div>

)};
