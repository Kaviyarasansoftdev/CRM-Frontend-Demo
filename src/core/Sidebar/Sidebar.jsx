/* eslint-disable react/prop-types */
import { Sidebar } from "primereact/sidebar";
import { useMediaQuery } from 'react-responsive';
import { NavLink, useLocation } from "react-router-dom";
import useAuth from "../../shared/services/store/useAuth";
import { Tooltip } from "@nextui-org/react";
import { useEffect } from "react";

const CrmSidebar = (props) => {
  const { visible, setvisible } = props;
  const { userdetails } = useAuth();
  const isMobile = useMediaQuery({ query: '(max-width: 971px)' });
  const location = useLocation();

  const handleLinkClick = () => {
    if (isMobile) {
      setvisible(false);
    }
  };

  useEffect(() => {
    setvisible(isMobile ? false : true);
  }, [isMobile]);

  const isActiveUsersAndTeams = location.pathname.startsWith("/users") || location.pathname.startsWith("/teams");
  const isActiveAllocationAndUnallocation = location.pathname.startsWith("/unallocation") || location.pathname.startsWith("/allocation");


  return (
    <>
      <Sidebar visible={visible} onHide={() => setvisible(false)} showCloseIcon={false} dismissable={false} modal={false} className="w-full md:w-60" >
        <div className="overflow-x-hidden fixed top-0 start-0 bottom-0 z-[60] w-full md:w-60 bg-cyan-400 border-gray-202 pt-3 pb-5 overflow-y-auto" >
          <div className="flex justify-between mx-4">
            <a href="#" aria-label="Brand">
              <img src="/images/Logo.png" alt="" className="object-cover w-40" />
            </a>
            <img className='cursor-pointer' src="/images/filter.svg" onClick={() => setvisible(false)} />
          </div>

          <nav className="flex flex-col flex-wrap mt-4 w-full hs-accordion-group" data-hs-accordion-always-open>
            <ul className="space-y-1.5">
              <li>
                <NavLink to={"/dashboard"} onClick={handleLinkClick} className={({ isActive }) => `flex items-center gap-x-3.5 py-2 px-2.5 w-full ${isActive ? "bg-gradient-to-tr from-[#fffffffd] to-[#fff] text-black shadow" : "" } text-sm text-black hover:text-black hover:bg-gradient-to-tr hover:from-[#fffffffd] hover:to-[#fffffffd] hover:shadow` } >
                  <div className="p-1"> <img src="/images/dashboard1.png" alt="" className="w-6 h-6" /> </div> Dashboard
                </NavLink>
              </li>

              {(userdetails()?.Role === "SuperAdmin" || userdetails()?.Role === "TeamLeader") && (
                <>
                  <li>
                    <NavLink to={"/users"} onClick={handleLinkClick} className={({ isActive }) => `flex items-center gap-x-3.5 py-2 px-2.5 w-full ${isActiveUsersAndTeams || isActive ? "bg-gradient-to-tr from-[#fffffffd] to-[#fff] text-black shadow" : ""} text-sm text-black hover:text-black hover:bg-gradient-to-tr hover:from-[#fffffffd] hover:to-[#fffffffd] hover:shadow` } >
                      <div className="p-1"> <img src="/images/users1.png" alt="" className="w-6 h-6" /> </div> Users & Teams
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/unallocation" onClick={handleLinkClick} className={({ isActive }) =>
                        `flex items-center gap-x-3.5 py-2 px-2.5 w-full ${isActiveAllocationAndUnallocation || isActive ? "bg-gradient-to-tr from-[#fffffffd] to-[#fff] text-black shadow" : "" } text-sm text-black hover:text-black hover:bg-gradient-to-tr hover:from-[#fffffffd] hover:to-[#fffffffd] hover:shadow` } >
                      <div className="p-1"> <img src="/images/dataallocation1.png" alt="" className="w-6 h-6" /> </div> Data Allocation
                    </NavLink>
                  </li>
                </>
              )}

              <li>
                <NavLink to={"/outlook"} onClick={handleLinkClick} className={({ isActive }) => `flex items-center gap-x-3.5 py-2 px-2.5 w-full ${isActive ? "bg-gradient-to-tr from-[#fffffffd] to-[#fff] text-black shadow" : "" } text-sm text-black hover:text-black hover:bg-gradient-to-tr hover:from-[#fffffffd] hover:to-[#fffffffd] hover:shadow` } >
                  <div className="p-1">  <img src="/images/outlook.png" alt=""  className="w-6 h-6" /> </div>
                  Outlook
                </NavLink>
              </li>

              <li>
                <NavLink to={"/telecallerleads"} onClick={handleLinkClick} className={({ isActive }) => `flex items-center gap-x-3.5 py-2 px-2.5 w-full ${isActive ? "bg-gradient-to-tr from-[#fffffffd] to-[#fff] text-black shadow" : "" } text-sm text-black hover:text-black hover:bg-gradient-to-tr hover:from-[#fffffffd] hover:to-[#fffffffd] hover:shadow` } >
                  <div className="p-1"> <img src="/images/telecallerleads1.png" alt=""  className="w-6 h-6" /> </div>
                  Telecaller Leads
                </NavLink>
              </li>

              {(userdetails()?.Role === "SuperAdmin" || userdetails()?.Role === "TeamLeader") && (
                <>
                  <li>
                    <NavLink to={"/productivity"} onClick={handleLinkClick} className={({ isActive }) => `flex items-center gap-x-3.5 py-2 px-2.5 w-full ${isActive ? "bg-gradient-to-tr from-[#fffffffd] to-[#fff] text-black shadow" : "" } text-sm text-black hover:text-black hover:bg-gradient-to-tr hover:from-[#fffffffd] hover:to-[#fffffffd] hover:shadow` } >
                      <div className="p-1"> <img src="/images/productivity1.png" alt="" className="w-6 h-6" /> </div>
                      Productivity
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to={"/doc-center"} onClick={handleLinkClick} className={({ isActive }) => `flex items-center gap-x-3.5 py-2 px-2.5 w-full ${isActive ? "bg-gradient-to-tr from-[#fffffffd] to-[#fff] text-black shadow" : "" } text-sm text-black hover:text-black hover:bg-gradient-to-tr hover:from-[#fffffffd] hover:to-[#fffffffd] hover:shadow` } >
                      <div className="p-1"> <img src="/images/document.png" alt="" className="w-6 h-6" /> </div>
                      Doc-Center
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to={"/settings"} onClick={handleLinkClick} className={({ isActive }) => `flex items-center gap-x-3.5 py-2 px-2.5 w-full ${isActive ? "bg-gradient-to-tr from-[#fffffffd] to-[#fff] text-black shadow" : "" } text-sm text-black hover:text-black hover:bg-gradient-to-tr hover:from-[#fffffffd] hover:to-[#fffffffd] hover:shadow` } >
                      <div className="p-1"> <img src="/images/Settings.png" alt="" className="w-6 h-6" /> </div>
                      Settings
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </Sidebar>

      {!visible && !isMobile && (
        <div className="fixed top-[95px] start-2 bottom-4 z-[60] w-20 bg-cyan-500 rounded-lg border-gray-200 pt-7 pb-10">
        {/* 
          <div className="mb-5 bg-white rounded-md">
            <img src="/images/cashflowimage.png" alt="" className="w-20 h-20 " />
          </div>
       */}
          <nav className="flex flex-col items-center space-y-4">
            <Tooltip content="Dashboard" placement="left-end">
              <NavLink to={"/dashboard"} onClick={handleLinkClick} className={({ isActive }) => `p-2 rounded-lg ${isActive ? "bg-amber-200" : "bg-white"}`} >
                <img src="/images/dashboard1.png" alt="" className="w-8 h-8" />
              </NavLink>
            </Tooltip>

            {(userdetails()?.Role === "SuperAdmin" || userdetails()?.Role === "TeamLeader" )&& (
              <>
                <Tooltip content="Users & Teams" placement="left-end">
                  <NavLink to={"/users"} onClick={handleLinkClick} className={({ isActive }) => `p-2 rounded-lg ${isActiveUsersAndTeams || isActive ? "bg-amber-200" : "bg-white"}`} >
                    <img src="/images/users1.png" alt="" className="w-8 h-8" />
                  </NavLink>
                </Tooltip>

                <Tooltip content="Data Allocation" placement="left-end">
                  <NavLink to={"/unallocation"} onClick={handleLinkClick} className={({ isActive }) => `p-2 rounded-lg ${isActiveAllocationAndUnallocation || isActive ? "bg-amber-200" : "bg-white"}`} >
                    <img src="/images/dataallocation1.png" alt="" className="w-8 h-8" />
                  </NavLink>
                </Tooltip>
              </>
            )}

            <Tooltip content="TelecallerLeads" placement="left-end">
              <NavLink to={"/telecallerleads"} onClick={handleLinkClick} className={({ isActive }) => `p-2 rounded-lg ${isActive ? "bg-amber-200" : "bg-white"}`} >
                <img src="/images/telecallerleads1.png" alt="" className="w-8 h-8" />
              </NavLink>
            </Tooltip>
            

            {(userdetails()?.Role === "SuperAdmin" || userdetails()?.Role === "TeamLeader") && (
              <>
                <Tooltip content="Productivity" placement="left-end">
                  <NavLink to={"/productivity"} onClick={handleLinkClick} className={({ isActive }) => `p-2 rounded-lg ${isActive ? "bg-amber-200" : "bg-white"}`} >
                    <img src="/images/productivity1.png" alt="" className="w-8 h-8" />
                  </NavLink>
                </Tooltip>
                <Tooltip content="Doc-Center" placement="left-end">
                  <NavLink to={"/doc-center"} onClick={handleLinkClick} className={({ isActive }) => `p-2 rounded-lg ${isActive ? "bg-amber-200" : "bg-white"}`} >
                    <img src="/images/document.png" alt="" className="w-8 h-8" />
                  </NavLink>
                </Tooltip>
                <Tooltip content="Settings" placement="left-end">
                  <NavLink to={"/settings"} onClick={handleLinkClick} className={({ isActive }) => `p-2 rounded-lg ${isActive ? "bg-amber-200" : "bg-white"}`} >
                    <div className="rounded-lg"> <img src="/images/Settings.png" alt="" className="w-8 h-8" /> </div>
                  </NavLink>
                </Tooltip>
              </>
            )}
          </nav>
        </div>
      )}
    </>
  );
};

export default CrmSidebar;
