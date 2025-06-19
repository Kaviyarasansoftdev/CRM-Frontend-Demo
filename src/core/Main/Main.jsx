import { Outlet } from 'react-router-dom';
import Topbar from '../Topbar/Topbar';
import { useMediaQuery } from 'react-responsive';
import { useEffect, useState } from 'react';
import CrmSidebar from '../Sidebar/Sidebar';

export const Main = () => {
  const isMobile = useMediaQuery({
    query: '(max-width:1280px)'
  });
  const [visible, setvisible] = useState(false);

  useEffect(() => {
    setvisible(isMobile ? false : true);
  }, [isMobile]);

  return (
    <>
      <Topbar visible={visible} setvisible={setvisible} />
      <CrmSidebar visible={visible} setvisible={setvisible} />
      <main className={`w-full duration-200 px-4 md:px-6 lg:pe-6 lg:ps-[120px] py-4 ${visible ? "xl:ps-[260px]" : "xl:ps-[7rem]"}`} >
        <Outlet />
      </main>
    </>
  );
};
