import { useCallback, useEffect, useRef, useState } from 'react';
import { deletetelecallerallocation } from '../../shared/services/apitelecalleralloaction/apitelecallerallocation';
import Tablepagination from '../../shared/components/others/Tablepagination';
import { Teamtable } from '../../shared/components/Teams/Teamtable';
import { Tableheadpanel } from '../../shared/components/Teams/Tableheadpanel';
import { getusers } from '../../shared/services/apiusers/apiusers';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import toast from 'react-hot-toast';
import { getallTeam } from '../../shared/services/apiteams/apiteams';


export const TeamPage = () => {
  const [telecallerData, setTelecallerData] = useState([]);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(20);
  const [visible, setVisible] = useState(false);
  const [formdata, setFormdata] = useState({});
  const [totalRecords, setTotalRecords] = useState(0);
  const [first, setFirst] = useState(0);
  const [teamLeaders, setTeamLeaders] = useState([]);
  const [teleCallers, setTeleCallers] = useState([]);
  const [globalfilter, setglobalfilter] = useState('');
  const [colfilter, setcolFilter] = useState({});
  const isMounted = useRef(false);
  const isMounted1 = useRef(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllUsers = useCallback(async () => {
    try {
      const res = await getusers();
      //console.log(res)
      setIsLoading(false);
      setTotalRecords(res?.totallength);
      const teamLeaders = res?.filter(user => user.Role === "TeamLeader");
      const teleCallers = res?.filter(user => user.Role === "Telecaller");
      
      setTeamLeaders(teamLeaders);
      setTeleCallers(teleCallers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, [ ]);

  const fetchData = useCallback(async () => {
    try {
      const response = await getallTeam({ first, rows, globalfilter, colfilter });
      //console.log('Response:', response);
      if (Array.isArray(response.resdata)) {
        setTelecallerData(response.resdata);
        setTotalRecords(response.totallength);
      } else {
        console.error('resdata is not an array:', response.resdata);
      }
    } catch (error) {
      console.error('Error fetching telecaller allocation data:', error);
    }
  }, [first, rows, globalfilter, colfilter]);

  // useEffect(() => {
  //   if (!isMounted.current) {
  //     isMounted.current = true;
  //     fetchAllUsers();
  //   }
  // }, [fetchAllUsers]);

  useEffect(() => {
    if (!isMounted1.current) {
      isMounted1.current = true;
      fetchData();
      fetchAllUsers();
    }
  }, [fetchData]);

  const onPage = (page) => {
    setPage(page);
    setFirst(rows * (page - 1));
    setRows(rows);
  };

  const cusfilter = (field, value) => {
    setcolFilter({ ...colfilter, [field]: value });
  };

  const editfrom = (data) => {
    setFormdata(data);
    setVisible(true);
  }

  const handledelete = (id) => {
    confirmDialog({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      defaultFocus: 'reject',
      acceptClassName: 'bg-red-500 ml-2 text-white p-2',
      rejectClassName: 'p-2 outline-none border-0',
      accept: async () => {
        await deletetelecallerallocation(id);
        toast.success('Successfully deleted');
        fetchData();
      },
    });
  };

  return (
    <>
    <div className='bg-white border rounded-2xl'>
      <Tableheadpanel setglobalfilter={setglobalfilter} teamLeaders={teamLeaders} teleCallers={teleCallers} setTelecallerData={setTelecallerData} telecallerData={telecallerData}
       visible={visible} setVisible={setVisible} formdata={formdata} setFormdata={setFormdata} />
      <Teamtable telecallerData={telecallerData} rows={rows} first={first} cusfilter={cusfilter} editfrom={editfrom} handledelete={handledelete} isLoading={isLoading} />
      <Tablepagination page={page} first={first} rows={rows} totalRecords={totalRecords} onPage={onPage} />
      <ConfirmDialog />
      </div>
    </>
  );
};
