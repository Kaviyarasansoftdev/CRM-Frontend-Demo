import { useCallback, useEffect, useState } from "react";
import Tablepagination from "../../shared/components/others/Tablepagination";
import Tableheadpanel from "../../shared/components/Productivity/Tableheadpanel";
import { Tableview } from "../../shared/components/Productivity/Tableview";
import { getallallProductivity } from "../../shared/services/apiproductivity/apiproductivity";
import moment from "moment-timezone";

export const ProductivityPage = () => {
  const [totalRecords, setTotalRecords] = useState(0);
  const [first, setFirst] = useState(0);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(20);
  const [tabledata, setTabledata] = useState([]);
  const [colfilter, setcolFilter] = useState({});
  const [globalfilter, setglobalfilter] = useState('');
  const [tempFilterValues, setTempFilterValues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [productivityStatus, setProductivityStatus] = useState('All');
  const [Sort, setSort] = useState({});

  let isMounted = true;

  const getallteamleaderandtelecaller = useCallback(async () => {
    setIsLoading(true);
    const res = await getallallProductivity({ first, rows, globalfilter, productivityStatus, colfilter, Sort });
    setIsLoading(false);
    var formatData = res?.resdata.map(resd=> {
      return  {...resd,Sub_Disposition: ['Followup', 'Future Followup'].includes(resd.Disposition)?moment(resd.Sub_Disposition?resd.Sub_Disposition:new Date(), 'DD-MM-YYYY').format('YYYY-MM-DD'):resd.Sub_Disposition}
    })
    setTabledata(formatData);
    setTotalRecords(res?.totallength);
  }, [first, rows, globalfilter, colfilter, productivityStatus, Sort]);

  useEffect(() => {
    if (isMounted) {
      getallteamleaderandtelecaller();
    }
    return () => isMounted = false;
  }, [first, rows, globalfilter, colfilter, productivityStatus, Sort]);

  const cusfilter = (field, value) => {
    setcolFilter({ ...colfilter, ...{ [field]: value } });
  };

  const clearFilter = (event)=>{
    setcolFilter(null);
    setglobalfilter('')
    setTempFilterValues([])
    setFirst(0)
    setSort({})
}

  const updateData = async () => {
    await getallteamleaderandtelecaller();
  };

  const onPage = (page) => {
    setPage(page);
    setFirst(rows * (page - 1));
    setRows(rows);
  };

  return (
    <div className="bg-white border rounded-2xl">
      <Tableheadpanel setProductivityStatus={setProductivityStatus} setFirst={setFirst} />
      <Tableview tabledata={tabledata} totalRecords={totalRecords} first={first} cusfilter={cusfilter} updateData={updateData} isLoading={isLoading}
        setFirst={setFirst} setTabledata={setTabledata} Sort={Sort} setSort={setSort}
        tempFilterValues={tempFilterValues} setTempFilterValues={setTempFilterValues} setglobalfilter={setglobalfilter} clearFilter={clearFilter} globalfilter={globalfilter} />
      <Tablepagination page={page} first={first} rows={rows} totalRecords={totalRecords} onPage={onPage}  />
    </div>
  );
};
