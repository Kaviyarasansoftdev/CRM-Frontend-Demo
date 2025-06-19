/* eslint-disable react/prop-types */
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import useAuth from '../../services/store/useAuth';
import { Skeleton } from 'primereact/skeleton';

export const Teamtable = (props) => {
  const { telecallerData, globalfilter, first, editfrom, handledelete, isLoading } = props;
  const { userdetails } = useAuth();
  const sno = (rowData, rowIndex) => {
    return (
      <div>
        {first + rowIndex['rowIndex'] + 1}
      </div>
    )
  }

  const actionbotton = (rowData) => {
    return (
      <div className="flex gap-2">
        {(userdetails()?.Role === 'SuperAdmin') && (
          <>
            <button onClick={() => editfrom(rowData)} className="inline-flex items-center text-xl font-medium text-blue-600 gap-x-1 decoration-2">
              <i className="fi fi-rr-pen-circle"></i>
            </button>
            <button onClick={() => handledelete(rowData?._id)} className="inline-flex items-center text-xl font-medium text-red-600 gap-x-1 decoration-2">
              <i className="fi fi-rr-trash"></i>
            </button>
          </>
        )}
      </div>
    );
  };


  return (
    <>
      <div className="container mx-auto">
      {isLoading ? (
        <div className="p-4">
          <Skeleton height="3rem" className="mb-2"></Skeleton>
          <Skeleton height="3rem" className="mb-2"></Skeleton>
          <Skeleton height="3rem" width="100%"></Skeleton>
        </div>
      ) : (
        <DataTable
          value={telecallerData}
          resizableColumns
          stripedRows
          showGridlines tableStyle={{ minWidth: 'calc(100vh - 430px)' }}
          globalFilter={globalfilter}
          className="!text-sm overflow-hidden"
        >
          <Column className="flex justify-center" header="S.No" style={{ minWidth: '40px' }} body={sno} />
          {(userdetails()?.Role === 'SuperAdmin') && (
            <Column header="Action" style={{ minWidth: '60px' }} body={actionbotton} />
          )}
          <Column header="Team Leader ID" body={(rowData) => rowData.teamleader?.map((leader, index) => <div key={index}>{leader.UserName}</div>)} />
          <Column header="Team Leader Name" body={(rowData) => rowData.teamleader?.map((leader, index) => <div key={index}>{leader.First_Name}</div>)} />
          <Column header="Telecaller ID" body={(rowData) => rowData.telecaller?.map((caller, index) => <div key={index}>{caller.UserName}</div>)} />
          <Column header="Telecaller Name" body={(rowData) => rowData.telecaller?.map((caller, index) => <div key={index}>{caller.First_Name}</div>)} />
        </DataTable>
      )}
      </div>
    </>
  )
}
