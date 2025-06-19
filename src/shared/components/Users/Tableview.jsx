/* eslint-disable react/prop-types */
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { useState } from "react";
import { MultiSelect } from "primereact/multiselect";
import { Skeleton } from "primereact/skeleton";

export const Tableview = (props) => {
    const { tabledata, totalRecords, editfrom, cusfilter, first, rows, handledelete, isLoading,activeButton, setActiveButton, setFirst } = props;
    const [selectedRoles, setSelectedRoles] = useState([]);

    const [filters, setFilters] = useState({
        Role: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.IN }] },
    });

    const handleButtonClick = (role) => {
        setSelectedRoles([]);
        setActiveButton(role);
        filterByRole(role);
    };

    const onPage = (event) => {
        setFirst(event.first);
      };

    const actionbotton = (rowData) => {
        return (
            <div className="flex gap-4">
                <div className="flex gap-2">
                    <button onClick={() => editfrom(rowData)} className="inline-flex items-center text-xl font-medium text-blue-600 gap-x-1 decoration-2 ">
                        <i className="fi fi-rr-pen-circle"></i>
                    </button>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => handledelete(rowData?._id)} className="inline-flex items-center text-xl font-medium text-red-600 gap-x-1 decoration-2 " >
                        <i className="fi fi-rr-trash"></i>
                    </button>
                </div>
            </div>
        )
    }

    const statusFilterTemplate = () => {
        const roles = [...new Set(tabledata.map((data) => data.Role))];
        const roleOptions = roles.map((role) => ({ label: role, value: role }));

        return (
            <MultiSelect value={selectedRoles} options={roleOptions} onChange={(e) => setSelectedRoles(e.value)} placeholder="Select Roles" optionLabel="label"
                showClear filter className="p-column-filter" />
        );
    };

    const filterapply = (field) => {
        return (
            <button onClick={() => {
                const updatedFilters = { ...filters };
                updatedFilters.Role.constraints[0].value = selectedRoles;
                setFilters(updatedFilters);
                cusfilter(field, selectedRoles);
            }}>Apply</button>
        );
    };

    const filterclear = (field) => {
        return (
            <button onClick={() => {
                setSelectedRoles([]);
                const updatedFilters = { ...filters };
                updatedFilters[field].constraints[0].value = null;
                setFilters(updatedFilters);
                cusfilter(field, '');
            }}>Clear</button>
        );
    };

    const sno = (rowData, rowIndex) => {
        return (
            <div>
                {first + rowIndex['rowIndex'] + 1}
            </div>
        )
    }

    const statusBodyTemplate = (rowData) => {
        const status = rowData.User_Status;
        const statusClassName = status === 'Active' ? 'bg-green-500 p-1 rounded-md text-white' : 'bg-red-500 p-1 rounded-md text-white';
        return (
            <span className={statusClassName}>
                {status}
            </span>
        );
    };

    const columns = [
        { field: 'UserName', header: 'User Name', width: "140px" },
        { field: 'First_Name', header: 'First Name', width: "200px" },
        { field: 'Last_Name', header: 'Last Name', width: "200px" },
        { field: 'Email', header: 'Email', width: "200px" },
        { field: 'Password', header: 'Password', width: "140px" },
        { field: 'Role', header: 'Role', width: "200px" },
        { field: 'User_Status', header: 'Status', width: "200px", body: statusBodyTemplate },
    ];

    const filterByRole = (role) => {
        setFilters({
            Role: { operator: FilterOperator.OR, constraints: [{ value: role, matchMode: FilterMatchMode.EQUALS }] }
        });
    };

    return (
        <div>
            <div className="flex justify-start gap-4 p-3 overflow-x-auto lg:justify-center">
                <button onClick={() => handleButtonClick("All")} className={`flex-shrink-0 px-3 p-2 text-sm text-white ${activeButton === 'All' ? 'bg-blue-600' : 'bg-cyan-500 hover:bg-cyan-400'} rounded-t-lg`}>All Users</button>
                <button onClick={() => handleButtonClick('TeamLeader')} className={`flex-shrink-0 px-3 text-sm text-white ${activeButton === 'TeamLeader' ? 'bg-blue-600' : 'bg-cyan-500 hover:bg-cyan-400'} rounded-t-lg`}>Team Leaders</button>
                <button onClick={() => handleButtonClick('Telecaller')} className={`flex-shrink-0 px-3 text-sm text-white ${activeButton === 'Telecaller' ? 'bg-blue-600' : 'bg-cyan-500 hover:bg-cyan-400'} rounded-t-lg`}>Telecallers</button>
            </div>
            {isLoading ? (
                <div className="p-4">
                    <Skeleton height="3rem" className="mb-2"></Skeleton>
                    <Skeleton height="3rem" className="mb-2"></Skeleton>
                    <Skeleton height="3rem" width="100%"></Skeleton>
                </div>
            ) : (
                <DataTable value={tabledata} totalRecords={totalRecords} lazy scrollable scrollHeight="calc(100vh - 310px)" className='!text-sm overflow-hidden' filters={filters} onPage={onPage}
                    paginator rows={rows} first={first} resizableColumns stripedRows showGridlines tableStyle={{ minWidth: '50rem' }}
                     currentPageReportTemplate="{first} to {last} of {totalRecords}" >
                    <Column className="flex justify-center" header="S.No" style={{ minWidth: '30px' }} body={sno} />
                    <Column header="Action" style={{ minWidth: '80px' }} body={actionbotton} />
                    {columns.map((col, i) => ( <Column key={i} field={col.field} filterApply={() => filterapply(col.field)} showFilterMatchModes={false} showFilterMenuOptions={false}
                        filterClear={() => filterclear(col.field)} filter={col.filter} filterElement={col.filterElement} header={col.header} body={col.body} /> ))}
                </DataTable>
            )}
        </div>
    )
}
