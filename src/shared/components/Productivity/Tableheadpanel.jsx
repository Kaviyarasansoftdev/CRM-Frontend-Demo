import { TabPanel, TabView } from "primereact/tabview";
import { useEffect, useState } from "react";

/* eslint-disable react/prop-types */
export default function Tableheadpanel(props) {
    const{ setProductivityStatus, setFirst } =props;

    const [activeButton, setActiveButton] = useState(null);

    useEffect(() => {
        setFirst(0);
      }, [activeButton]);

    const filterByProductivitystatus = (role) => {
        console.log(role)
        setActiveButton(role);
        setProductivityStatus(role);
      };

    const tab1HeaderTemplate = (options,data) => {
        return (
          <div className="text-nowrap" style={{ cursor: 'pointer' }} onClick={options.onClick}>
            <div className="p-3 font-bold white-space-nowrap" onClick={()=>filterByProductivitystatus(data.Key)}>{data.title}</div>
          </div>
        );
      };

    const scrollableTabs = [
        {title :"All Leads",Key:"All"},
        {title :"Worked Leads",Key:"Worked Leads"},
        {title :"Reached",Key:"Reached Leads"},
        {title :"Not Reached Leads",Key:"Not Reached Leads"},
        {title :"Submit Leads",Key:"Submitted Leads"},
        {title :"Lead Accepted",Key:"Accepted Leads"},
        {title :"Declined",Key:"Declined Leads"},
        {title :"Not Updated",Key:"Not Updated Leads"}
    ]
   
    return (
        <div className="items-center justify-center px-6 py-1 mt-2 space-y-3 lg:space-y-0 lg:flex">
            <TabView className="My-tab" scrollable>
                {scrollableTabs.map((tab,index) => {
                    return (
                    <TabPanel className="" key={index} headerTemplate={(e)=>tab1HeaderTemplate(e,tab)}> </TabPanel>
                    );
                })}
            </TabView>
            
            {/* <div>

            </div> */}
            
        </div>
    );
}