import { useCallback, useEffect, useState } from "react";
import { getallfollowup } from "../../shared/services/apiunallocation/apiunallocation";
import Tablepagination from "../../shared/components/others/Tablepagination";
import { Tableview } from "../../shared/components/Followup/Tableview";
import Tableheadpanel from "../../shared/components/Followup/Tableheadpanel";
export const FollowupPage = () => {
    const [totalRecords, setTotalRecords] = useState(0);
    const [first, setFirst] = useState(0);
    const [page, setPage] = useState(1);
    const [rows, setRows] = useState(20);
    const [tabledata, setTabledata] = useState([]);
    const [colfilter, setcolFilter] = useState({});
    const [globalfilter, setglobalfilter] = useState('');
    const [filtervalues, setfiltervalues] = useState([]);

    let isMounted = true;
    const getallfollowups = useCallback(async () => {
        const res = await getallfollowup({ first, rows, globalfilter, ...colfilter });
        setTabledata(res?.resdata);
        setTotalRecords(res?.totallength);

    }, [first, rows, globalfilter, colfilter]);

    useEffect(() => {
        if (isMounted) {
            getallfollowups();
        }
        return (() => isMounted = false);
    }, [first, rows, globalfilter, colfilter])
    const cusfilter = (field, value) => {
        setcolFilter({ ...colfilter, ...{ [field]: value } })
    };

    const onPage = (page) => {
        setPage(page)
        setFirst(rows * (page - 1));
        setRows(rows);
    };
    return (
        <div>
            <div>
                <Tableheadpanel/>
                <Tableview tabledata={tabledata} totalRecords={totalRecords} first={first}
                    cusfilter={cusfilter} filtervalues={filtervalues} onPage={onPage} />
                <Tablepagination page={page} first={first} rows={rows} totalRecords={totalRecords} onPage={onPage} />
            </div>
        </div>
    )
}

