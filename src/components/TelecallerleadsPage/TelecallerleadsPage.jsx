import { useCallback, useEffect, useState } from "react";
import Tableheadpanel from '../../shared/components/Telecallerleads/Tableheadpanel';
import { Tableview } from '../../shared/components/Telecallerleads/Tableview';
import { getallselectedteamleaderandtelecaller } from "../../shared/services/apitelecalleralloaction/apitelecallerallocation";
import Tablepagination from "../../shared/components/others/Tablepagination";
import toast from "react-hot-toast";
import moment from "moment-timezone";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { saveDocCenter } from "../../shared/services/apiDocument/apidocument";

export const TelecallerleadsPage = () => {
  const [totalRecords, setTotalRecords] = useState(0);
  const [first, setFirst] = useState(0);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(20);
  const [tabledata, setTabledata] = useState([]);
  const [colfilter, setColFilter] = useState({});
  const [globalfilter, setGlobalFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeButton, setActiveButton] = useState('Allocated Leads');
  const [tempFilterValues, setTempFilterValues] = useState([]);
  const [dispositionfilter, setDispositionfilter] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [Sort, setSort] = useState({});

  let isMounted = true;

  const getallteamleaderandtelecaller = useCallback(async () => {
    try {
      setIsLoading(true);
      const dispositionFilter = getDispositionFilter(activeButton);
      const res = await getallselectedteamleaderandtelecaller({ first, rows, globalfilter, dispositionfilter: dispositionFilter, colfilter, Sort });
      var formatData = res?.resdata.map(resd=> {
        return  {...resd,Sub_Disposition: ['Followup', 'Future Followup'].includes(resd.Disposition)?moment(resd.Sub_Disposition?resd.Sub_Disposition:new Date(), 'DD-MM-YYYY').format('YYYY-MM-DD'):resd.Sub_Disposition}
      })
      setTabledata(formatData);
      setTotalRecords(res?.totallength);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  }, [first, rows, globalfilter, colfilter, Sort, activeButton]);

  useEffect(() => {
    if (isMounted) {
      getallteamleaderandtelecaller();
    }
    return () => isMounted = false;
  }, [getallteamleaderandtelecaller]);

  const cusfilter = async (field, value) => {
    setColFilter(prev => ({ ...prev, [field]: {$in:value} }));
    setFirst(0);
  };

  const clearFilter = (event)=>{
    setColFilter(null);
    setGlobalFilter('')
    setTempFilterValues([])
    setFirst(0)
    setSort({})
}

  const updateData = async () => {
    await getallteamleaderandtelecaller();
  };

  const onPage = (newPage) => {
    setPage(newPage);
    setFirst(rows * (newPage - 1));
  };

  const handleButtonClick = async (button) => {
    setActiveButton(button);
    setColFilter({}); // Reset column filters
   
  };

  const getDispositionFilter = (button) => {
    let filter = '';
    switch (button) {
      case 'Non Workable Leads':
        filter = ['DNE', 'Not Int'];
        break;
      case 'Followups':
        filter = ['Followup', 'Future Followup'];
        break;
      case 'Lead Submitted':
        filter = ['Submit Lead', 'Lead Submitted', 'Lead Accepted', 'Lead Declined'];
        break;
      default:
        filter = [button];
    }
    setDispositionfilter(filter)
    return filter;
  };

  const addDocument = (data)=>{
    confirmDialog({
      message: (
        <div>
          <p><strong>Are your sure. do you want to add this client to Doc-Center</strong></p>
          <div> Client Name: <span className="bg-red-500 text-white text-center px-3 rounded-md"> {data.Name} </span></div>
          <div><span>Mobile Number: {data.Mobile1} </span></div>
        </div>
      ),//`Do you want to update this records? <span className="bg-red-500 text-white"> ${formdata.Range} </span>`,
      header: 'Add Doc-Center Confirmation',
      icon: 'pi pi-info-circle',
      defaultFocus: 'success',
      acceptClassName: 'bg-red-500 ml-2 text-white p-2',
      rejectClassName: 'p-2 outline-none border-0',
      accept: async () => {
        delete data._id;
        var resData = await saveDocCenter(data);
        console.log(resData)
        if(resData.msg == "Data Added Successfully"){
          toast.success("Data Added Successfully");
          await getallteamleaderandtelecaller();
        }
        else{
          toast.error("Data Already Exist");
        }
      }
    });
  }

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div className="bg-white border rounded-md shadow-md">
      <Tableheadpanel updateData={updateData} 
       dispositionfilter={dispositionfilter} handleButtonClick={handleButtonClick} activeButton={activeButton} setFirst={setFirst} showModal={showModal} 
       setShowModal={setShowModal} />

      <Tableview tabledata={tabledata} handlefiltervalue={cusfilter} first={first} setFirst={setFirst} updateData={updateData} isLoading={isLoading}
       cusfilter={cusfilter} setGlobalFilter={setGlobalFilter} setTabledata={setTabledata} Sort={Sort} setSort={setSort} addDocument={addDocument}
       clearFilter={clearFilter} globalfilter={globalfilter} tempFilterValues={tempFilterValues} setTempFilterValues={setTempFilterValues} toggleModal={toggleModal} />

      <Tablepagination page={page} first={first} rows={rows} totalRecords={totalRecords} onPage={onPage} />
      <ConfirmDialog />
    </div>
  );
};
