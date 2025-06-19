/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useRef, useState }  from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar } from "@nextui-org/react";
import useAuth from "../../shared/services/store/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { OverlayPanel } from "primereact/overlaypanel";
import { FollowupReminder } from "../../shared/services/apidashboard/apidashboard";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { getusers } from "../../shared/services/apiusers/apiusers";

export default function Topbar(props) {
 const { visible, setvisible } = props;
  const { userdetails, logout } = useAuth();
  const [ tableData, setTableData] = useState([{}]);
  const navigate = useNavigate();
  const op = useRef(null);

  const isMobile = useMediaQuery({ query: '(max-width: 971px)' });

  const imageMap = { 'SuperAdmin': '../images/letter-s.png', 'TeamLeader': '../images/letter-t.png', 'Telecaller': '../images/letter-c.png', 'default': 'https://example.com/default.png' };

  const getAvatarImage = () => {
    const role = userdetails()?.Role;
    switch (role) {
      case 'SuperAdmin':
        return  imageMap['SuperAdmin']
      case 'TeamLeader':
        return  imageMap['TeamLeader']
      case 'Telecaller':
        return  imageMap['Telecaller']
      default:
        return  imageMap['default']
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      getallFollowups();
    }
    return () =>{ isMounted = false};
  }, []);

  const getallFollowups = useCallback (async () => {
    const users = await getusers();
    const dataMap = new Map(users.map(item => [item.UserName, item.First_Name]));
    var res = await FollowupReminder();
    res = res.map(item => ({ ...item, Caller_Name: dataMap.get(item.selectedTelecaller) }));

    setTableData(res);
  }, []);


  const handleToggleClick = () => {
    setvisible(!visible);
  };

  const handleLogout = () => {
    logout(); 
    navigate('/'); 
  };

  const formatMobileForCall = (mobileNumber) => {
    return `tel:${mobileNumber}`;
  };

  return (
    <>
      <header className="sticky top-0 inset-x-0 shadow-md flex flex-wrap sm:justify-start sm:flex-nowrap z-[48] w-full bg-gradient-to-b from-cyan-400 to-cyan-200 border-b text-sm py-2 sm:py-3 lg:ps-4 rounded-b-xl">
        <nav className="flex items-center justify-between w-full px-4 mx-auto basis-full sm:px-6 md:px-8" aria-label="Global">
          <div className="rounded-md md:order-1 order-2">
            <img src="/images/logo.svg" alt="" className="w-[120px] " />
          </div>
          <div className="lg:me-0 md:order-2 order-1">
            <a className="flex flex-row text-2xl font-bold md:ml-7 lg:flex-row-reverse dark:text-white" href="#" aria-label="">
              {isMobile ? (
                <>
                  <button type="button" className={`text-gray-500 hover:text-gray-600 lg:px-6`} data-hs-overlay="#application-sidebar"aria-controls="application-sidebar"aria-label="Toggle navigation"onClick={handleToggleClick}>
                    <span className="sr-only">Toggle Navigation</span>
                    <svg className={`flex-shrink-0 w-4 h- ${visible ? 'hidden' : ''}`} xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
                      <line x1="3" x2="21" y1="6" y2="6" />
                      <line x1="3" x2="21" y1="12" y2="12" />
                      <line x1="3" x2="21" y1="18" y2="18" />
                    </svg>
                  </button>
                  <div className="flex logo-container">
                    <img className="px-2" src="../images/logo.svg" alt="" />
                  </div>
                </>
              ) : (
                <>
                  <button type="button" className={`text-gray-500 hover:text-gray-600 lg:px-12 ${visible ? 'hidden' : ''}`}data-hs-overlay="#application-sidebar"aria-controls="application-sidebar"aria-label="Toggle navigation"onClick={handleToggleClick} >
                    <span className="sr-only">Toggle Navigation</span>
                    <svg className={`flex-shrink-0  ${visible ? 'hidden' : ''}`} xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="3" x2="21" y1="6" y2="6" /> <line x1="3" x2="21" y1="12" y2="12" /> <line x1="3" x2="21" y1="18" y2="18" />
                    </svg>
                  </button>
                  {!visible && (
                    <div className="flex -mx-4 logo-container">
                      <img className="px-2" src="../images/logo.svg" alt="" /> 
                    </div>
                  )}
                    
                </>
              )}
            </a>
            
          </div>
          <div className="md:ms-auto  p-2 order-3">

            <div className="flex items-center justify-end gap-2">
              {["SuperAdmin","TeamLeader"].includes(userdetails()?.Role)&&(<div>
                <button className="relative" onClick={(e) => op.current.toggle(e)}>
                  <img className={`${tableData&&tableData.length !=0?'vibrate':''} w-6`} src="../images/notification.png" alt="" /> 
                  <span className="absolute top-0 end-0 inline-flex items-center py-0.5 px-1.5 rounded-full text-xs font-medium transform -translate-y-1/2 translate-x-1/2 bg-red-500 text-white">{tableData&&(tableData?.length >9)?(tableData?.length+'+'):(tableData?.length)}</span>
                </button>
              </div>)}
              <div className="md:block hidden">
                <h1 className="mx-1 text-md font-semibold text-black lg:text-xl">{userdetails()?.First_Name}</h1>
              </div>
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                <Avatar isBordered as="button" size="sm" className="transition-transform" src={getAvatarImage()} />
                </DropdownTrigger>
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                  <DropdownItem key="profile" className="gap-2 h-14">
                    
                      <p className="font-semibold">{userdetails()?.First_Name}</p>
                      <p className="font-semibold text-blue-500">{userdetails()?.Role} ({userdetails()?.UserName})</p>
                    
                  </DropdownItem>
                  <DropdownItem key="logout" onPress={handleLogout}>
                    Log Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </nav>
      </header>

      <OverlayPanel ref={op} showCloseIcon closeOnEscape dismissable={false}>
        <DataTable value={tableData} size="small" scrollable scrollHeight="400px" >
          <Column field="Product" header="Product" sortable/>
          <Column field="Name" header="Name" sortable/>
          {/* <Column field="Mobile" header="Name" sortable/> */}
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
          <Column field="Disposition" header="Disposition" sortable/>
          <Column field="Sub_Disposition" header="Followup Date" sortable/>
          <Column field="selectedTelecaller" header="Telecaller"/>
          <Column field="Caller_Name" header="Caller Name"/>
        </DataTable>
      </OverlayPanel>
    </>
  )
}