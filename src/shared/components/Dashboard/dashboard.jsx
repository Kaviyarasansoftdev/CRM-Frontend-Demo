/* eslint-disable react/prop-types */
// import { useRef } from 'react';
import { Chart } from 'primereact/chart';
import useAuth from '../../services/store/useAuth';
import ApexCharts from 'apexcharts';
import { useEffect } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function Dashboard(props) {  

  const { userdetails } = useAuth();
  const { chartData, chartOptions, barchartData, barchartOptions, procuctsbarchartData, productsbarchartOptions,TotalLeadWorkeds, TotalLeadWorkedsOptions,
    productivitybarchartData, productivitybarchartOptions, allocationchartData, allocationchartOptions,TotalLeadbyTeamlead,TotalLeadbyTeamleadOptions, TotalLeadbyTeam,
    TotalLeadbyTeamOptions, dates, setDates,StockReport, UnallocationTable, TouchedProductTable, TouchedDispositionTable, TouchedTeamTable, UnallocateTLData, DailyMIS } = props;

  const getGreeting = () => {
    const now = new Date();
    const hour = now.getHours();
    if (hour < 12) {
      return 'Good Morning';
    } else if (hour < 18) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  };

  const colors = ['bg-blue-200','bg-green-200','bg-red-200','bg-yellow-200','bg-pink-200']

  useEffect(() => {

    const getChartOptions = () => {
      return {
        series: [35.1, 23.5, 2.4, 5.4],
        colors: ["#1C64F2", "#16BDCA", "#FDBA8C", "#E74694"],
        chart: {
          height: 320,
          width: "100%",
          type: "donut",
        },
        stroke: {
          colors: ["transparent"],
          lineCap: "",
        },
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                name: {
                  show: true,
                  fontFamily: "Inter, sans-serif",
                  offsetY: 20,
                },
                total: {
                  showAlways: true,
                  show: true,
                  label: "Unique visitors",
                  fontFamily: "Inter, sans-serif",
                  formatter: function (w) {
                    const sum = w.globals.seriesTotals.reduce((a, b) => {
                      return a + b
                    }, 0)
                    return '$' + sum + 'k'
                  },
                },
                value: {
                  show: true,
                  fontFamily: "Inter, sans-serif",
                  offsetY: -20,
                  formatter: function (value) {
                    return value + "k"
                  },
                },
              },
              size: "80%",
            },
          },
        },
        grid: {
          padding: {
            top: -2,
          },
        },
        labels: ["Direct", "Sponsor", "Affiliate", "Email marketing"],
        dataLabels: {
          enabled: false,
        },
        legend: {
          position: "bottom",
          fontFamily: "Inter, sans-serif",
        },
        yaxis: {
          labels: {
            formatter: (value)=> { return value + "k" },
          },
        },
        xaxis: {
          labels: {
            formatter: (value)=> { return value  + "k" },
          },
          axisTicks: { show: false },
          axisBorder: { show: false },
        },
      }
    }
    
    if (document.getElementById("donut-chart") && typeof ApexCharts !== 'undefined') {
      const chart = new ApexCharts(document.getElementById("donut-chart"), getChartOptions());
      chart.render(); 
    }
  }, []);

  return (
    <>
      {(userdetails()?.Role === "Telecaller") && (
        <div className='grid justify-center grid-cols-1 mb-5 shadow-xl'>
          <div className='bg-white rounded-xl'>
            <div className='grid grid-cols-1 lg:grid-cols-2'>
              <div className='flex items-center justify-center p-2'>
                <p className='text-2xl font-medium lg:text-4xl text-slate-600'>{getGreeting()} {userdetails()?.First_Name}</p>
              </div>
              <div className='flex items-center justify-center p-2'>
                <img src="/images/call-center.png" alt="" className='object-cover w-full max-w-[200px] h-auto max-h-[340px] -my-9' />
              </div>
            </div>
          </div>
        </div>
      )}

      {(userdetails()?.Role === "Telecaller") && (
        <div className='bg-white rounded-xl lg:h-[530px]'>
          <div className="p-5">
            <h1 className="p-1 text-xl font-semibold rounded-lg text--black w-fit">Telecaller Leads</h1>
            <Chart type="bar" data={barchartData} options={barchartOptions} className="" />
          </div>
        </div>
      )}

      {["SuperAdmin","TeamLeader"].includes(userdetails()?.Role)&& (

        <TabView>
          <TabPanel header="Daily MIS Tracker">
            <div className="grid justify-center grid-cols-1">
              {["SuperAdmin","TeamLeader"].includes(userdetails()?.Role) && (
                <div className='bg-white rounded-xl shadow-small'>
                  <div className="p-5">
                    <h1 className="p-1 text-md font-semibold rounded-lg text--black w-fit">Daily MIS</h1>
                    <div className="flex flex-col">
                      <div className="-m-1.5 overflow-x-auto">
                        <div className="p-1.5 min-w-full inline-block align-middle">
                          <div className="border overflow-hidden dark:border-neutral-700">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                              <thead className='bg-slate-100'>
                                <tr>
                                  <th rowSpan="2" scope="col" className="px-6 py-3 border-r-small text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">S.No</th>
                                  <th rowSpan="2" scope="col" className="px-6 py-3 border-r-small text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">TL Name</th>
                                  <th rowSpan="2" scope="col" className="px-6 py-3 border-r-small text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Caller Name</th>
                                  <th rowSpan="2" scope="col" className="px-6 py-3 border-r-small text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Caller ID</th>
                                  <th rowSpan="2" scope="col" className="px-6 py-3 border-r-small text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">NOS</th>
                                  <th colspan="2" scope="col" className="px-6 py-3 border-r-small  border-b-small text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Product Wise</th>
                                  <th colspan="2" scope="col" className="px-6 py-3 border-r-small border-b-small text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Dispo Wise</th>
                                </tr>
                                <tr>
                                  <th scope="col" className="px-6 py-3 border-r-small text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Product Name</th>
                                  <th scope="col" className="px-6 py-3 border-r-small text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Nos</th>
                                  <th scope="col" className="px-6 py-3 border-r-small text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Dispo Name</th>
                                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Nos</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 dark:divide-neutral-700 custome-h">
                                {DailyMIS.map((entry, index) => (
                                  <tr key={index}>
                                    <td className="px-6 py-4 border-r-small whitespace-nowrap text-center text-sm font-medium text-gray-800">{index+1}</td>
                                    <td className="px-6 py-4 border-r-small whitespace-nowrap text-sm font-medium text-gray-800">{entry.Lead_Name}</td>
                                    <td className="px-6 py-4 border-r-small whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">{entry.First_Name}</td>
                                    <td className="px-6 py-4 border-r-small whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">{entry.Caller}</td>
                                    <td className={`px-6 py-4 border-r-small text-center whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200  `}>{entry.PendingLeads}</td>
                                    <td className="py-0 w-full whitespace-nowrap border-r-small text-sm font-medium text-gray-800 dark:text-neutral-200">
                                      {entry.Products.sort((a, b) => a.Name.localeCompare(b.Name)).map((productEntry, productIndex) => (
                                        <div className={`px-6 text-center ${entry.Products.length != (productIndex+1)?'border-b-small':''} `} style={{ paddingTop: `${(entry.Campaign.filter(resp=>resp.Product == productEntry.Name).length)}rem`, paddingBottom:  `${(entry.Campaign.filter(resp=>resp.Product == productEntry.Name).length)}rem` }} key={productIndex}>
                                          {productEntry.Name != " "?productEntry.Name: <p className='py-[10px]'></p>}
                                        </div>
                                      ))}
                                    </td>
                                    <td className="py-0 whitespace-nowrap border-r-small text-sm font-medium text-gray-800 dark:text-neutral-200">
                                      {entry.Products.sort((a, b) => a.Name.localeCompare(b.Name)).map((productEntry, productIndex) => (
                                        <div className={`px-6 text-center ${entry.Products.length != (productIndex+1)?'border-b-small':''} `} style={{ paddingTop: `${(entry.Campaign.filter(resp=>resp.Product == productEntry.Name).length)}rem`, paddingBottom:  `${(entry.Campaign.filter(resp=>resp.Product == productEntry.Name).length)}rem` }} key={productIndex}>
                                          {productEntry.Count}
                                        </div>
                                      ))}
                                    </td>
                                    <td className="whitespace-nowrap border-r-small text-start text-sm font-medium">
                                      {entry.Campaign.sort((a, b) => a.Product.localeCompare(b.Product)).map((campaignEntry, campaignIndex) => (
                                        <div className={`px-6 ${entry.Campaign.length != (campaignIndex+1)?'border-b-small':''}`} key={campaignIndex} style={{ paddingTop: `${entry.Campaign.length >1? '0.78rem':'1rem'}`, paddingBottom: `${entry.Campaign.length >1? '0.78rem':'1rem'}`}}>
                                          {campaignEntry.Name}
                                        </div>
                                      ))}
                                    </td>

                                    <td className="whitespace-nowrap text-center text-sm font-medium">
                                      {entry.Campaign.sort((a, b) => a.Product.localeCompare(b.Product)).map((campaignEntry, campaignIndex) => (
                                        <div className={`px-6 ${entry.Campaign.length != (campaignIndex+1)?'border-b-small':''}`} style={{ paddingTop: `${entry.Campaign.length >1? '0.78rem':'1rem'}`, paddingBottom:  `${entry.Campaign.length >1? '0.78rem':'1rem'}` }} key={campaignIndex}>
                                           {campaignEntry.Count}
                                        </div>
                                      ))}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabPanel>

          <TabPanel header="Unallocated Leads">
            <div className="grid justify-center items-center grid-cols-1 gap-8 lg:grid-cols-2">
              {["SuperAdmin","TeamLeader"].includes(userdetails()?.Role) && (
                <div className='bg-white rounded-xl shadow-small'>
                  <div className="flex justify-center">
                    <div className="p-5 h-full w-full">
                      <h1 className="p-1 text-xl font-semibold rounded-lg text--black w-fit">Total Unallocated Leads</h1>
                      <Chart type="doughnut" data={allocationchartData} options={allocationchartOptions} className="" />
                    </div>
                  </div>
                </div>
              )}

              <div className=" ">
                <div className='bg-white rounded-xl shadow-small'>
                  <div className="flex flex-col">
                    <div className="-m-1.5 overflow-x-auto">
                      <div className="p-1.5 min-w-full inline-block align-middle">
                        <div className="overflow-hidden">
                          <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                            <thead>
                              <tr>
                                <th scope="col" colSpan="2" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Product & Campaign</th>
                                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Total Leads</th>
                              </tr>
                            </thead>
                            <tbody>
                              { UnallocationTable?.map((product,index)=>(
                                <>
                                  <tr key={index} className="bg-gray-100 hover:bg-gray-100">
                                    <td colSpan="2" className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-800">{product.Product}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">{product.count}</td>
                                  </tr>

                                  {product.campaignwise.map((camp,index)=>(
                                    <tr className=" hover:bg-gray-100">
                                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-800"></td>
                                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-800">{camp.campaign}</td>
                                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{camp.count}</td>
                                    </tr>
                                  ))}
                                </>
                              ))}

                              <tr className="bg-gray-100 hover:bg-gray-100 ">
                                <td colSpan="2" className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">Total</td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{UnallocationTable?.reduce((acc, curr) => acc + curr.count, 0)}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* {["SuperAdmin","TeamLeader"].includes(userdetails()?.Role) && (
                <div className='bg-white rounded-xl shadow-small'>
                  <div className="flex justify-center ">
                    <div className="p-5 lg:h-[90px] lg:w-[350px]">
                      <h1 className="p-1 text-xl font-semibold rounded-lg text--black w-fit">Total Users</h1>
                      <Chart type="doughnut" data={chartData} options={chartOptions} className="" />
                    </div>
                  </div>
                </div>
              )} */}
            
              <div className="mt-5">
                {["SuperAdmin","TeamLeader"].includes(userdetails()?.Role) && (
                  <div className='bg-white rounded-xl shadow-small'>
                    <div className="flex justify-center">
                      <div className="p-5 h-full w-full">
                        <h1 className="p-1 text-md font-semibold rounded-lg text--black w-fit">Teamlead Unallocated leads</h1>
                          <Chart type="doughnut" data={TotalLeadbyTeamlead} options={TotalLeadbyTeamleadOptions} className="" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className=" ">
                <div className='bg-white rounded-xl shadow-small'>
                  <div className="flex flex-col">
                    <div className="-m-1.5 overflow-x-auto">
                      <div className="p-1.5 min-w-full inline-block align-middle">
                        <div className="overflow-hidden">
                          <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                            <thead>
                              <tr>
                                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Teamlead</th>
                                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Total Leads</th>
                              </tr>
                            </thead>
                            <tbody>
                              { UnallocateTLData?.map((product,index)=>(

                                <tr key={index} className=" hover:bg-gray-100">
                                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-800">{product.First_Name}</td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{product.count}</td>
                                </tr>
                              
                              ))}

                              <tr className="bg-gray-100 hover:bg-gray-100 ">
                                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">Total</td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{UnallocateTLData?.reduce((acc, curr) => acc + curr.count, 0)}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
          <TabPanel header="Worked Leads">
            {/* <div className='flex justify-between items-center mb-2'>
              <div>
              <select name='filter' value={FilterType} onChange={(e)=>{FilterDashbord(e)}} className="py-2 px-3 block w-full border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
                <option value="">Select</option>
                <option value="All">All</option>
                <option value="Current Year">Current Year</option>
                <option value="Custom Date">Custom Date</option>
              </select>
              </div>
              {FilterType == "Custom Date"&&
                <Calendar name='Range' className='border rounded-md' value={dates} onChange={(e) => setDates(e.value)} selectionMode="range" readOnlyInput hideOnRangeSelection showIcon />
              }
            </div> */}
            <div className="grid justify-center items-center grid-cols-1 gap-4 lg:grid-cols-2 mb-4">
              {["SuperAdmin","TeamLeader"].includes(userdetails()?.Role) && (
                <div className='bg-white rounded-xl shadow-small'>
                  <div className="flex justify-center">
                    <div className="p-5 h-full w-full">
                      <h1 className="p-1 text-md font-semibold rounded-lg text--black w-fit">Product Wise</h1>
                      <Chart type="doughnut" data={TotalLeadWorkeds} options={TotalLeadWorkedsOptions} className="" />
                    </div>
                  </div>
                </div>
              )}

              <div className='bg-white rounded-xl shadow-small overflow-hidden'>
                <div className="flex flex-col">
                  <div className="-m-1.5 overflow-x-auto">
                    <div className="p-1.5 min-w-full inline-block align-middle">
                      <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                          <thead>
                            <tr>
                              <th scope="col" colSpan="2" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Product & Campaign</th>
                              <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Total Leads</th>
                            </tr>
                          </thead>
                          <tbody>
                            { TouchedProductTable?.map((product,index)=>(
                              <>
                                <tr key={index} className="bg-gray-100 hover:bg-gray-100">
                                  <td colSpan="2" className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-800">{product.Product}</td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">{product.count}</td>
                                </tr>

                                {product.campaignwise.map((camp,index)=>(
                                  <tr className=" hover:bg-gray-100">
                                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-800"></td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-800">{camp.campaign}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">{camp.count}</td>
                                  </tr>
                                ))}
                              </>
                            ))}

                            <tr className="bg-gray-100 hover:bg-gray-100">
                              <td colSpan="2" className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-800">Total</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">{TouchedProductTable?.reduce((acc, curr) => acc + curr.count, 0)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid justify-center items-center grid-cols-1 gap-4 lg:grid-cols-2 mb-4">
              {/* {["SuperAdmin","TeamLeader"].includes(userdetails()?.Role) && (
                <div className='bg-white rounded-xl shadow-small'>
                  <div className="flex justify-center rounded-xl">
                    <div className="p-5 h-full w-full">
                      <h1 className="p-1 text-md font-semibold rounded-lg text--black w-fit">Disposition Wise</h1>
                      <Chart type="doughnut" data={productivitybarchartData} options={productivitybarchartOptions} className="" />
                    </div>
                  </div>
                </div>
              )} */}

              {["SuperAdmin","TeamLeader"].includes(userdetails()?.Role) && (
                <div className='bg-white rounded-xl shadow-small'>
                  <div className="flex justify-center rounded-xl">
                    <div className="p-5 h-full w-full">
                      <h1 className="p-1 text-xl font-semibold rounded-lg text--black w-fit">Disposition Wise</h1>
                      <Chart className="py-5" type="doughnut" data={procuctsbarchartData} options={productsbarchartOptions} />
                    </div>
                  </div>
                </div>
              )}

              <div className=" ">
                <div className='bg-white rounded-xl shadow-small overflow-hidden'>
                  <div className="flex flex-col">
                    <div className="-m-1.5 overflow-x-auto">
                      <div className="p-1.5 min-w-full inline-block align-middle">
                        <div className="overflow-hidden">
                          <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                            <thead>
                              <tr>
                                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Disposition</th>
                                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">BL</th>
                                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">DL</th>
                                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">PL</th>
                                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">LP</th>
                                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">HL</th>
                                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">STPL</th>
                                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">UCL</th>
                              </tr>
                            </thead>
                            <tbody>
                              { TouchedDispositionTable?.map((product,index)=>(
                                <>
                                  <tr key={index} className="odd:bg-white even:bg-gray-100 hover:bg-gray-100">
                                    <td  className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-800">{product.Disposition}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">{product.BL?product.BL:0}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">{product.DL?product.DL:0}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">{product.PL?product.PL:0}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">{product.LP?product.LP:0}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">{product.HL?product.HL:0}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">{product.STPL?product.STPL:0}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">{product.UCL?product.UCL:0}</td>
                                  </tr>
                                </>
                              ))}

                              <tr className="odd:bg-white even:bg-gray-100 hover:bg-gray-100">
                                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-800">Total</td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">{TouchedDispositionTable?.reduce((total, item) => total + (item.BL || 0), 0)}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">{TouchedDispositionTable?.reduce((total, item) => total + (item.DL || 0), 0)}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">{TouchedDispositionTable?.reduce((total, item) => total + (item.PL || 0), 0)}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">{TouchedDispositionTable?.reduce((total, item) => total + (item.LP || 0), 0)}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">{TouchedDispositionTable?.reduce((total, item) => total + (item.HL || 0), 0)}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">{TouchedDispositionTable?.reduce((total, item) => total + (item.STPL || 0), 0)}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">{TouchedDispositionTable?.reduce((total, item) => total + (item.UCL || 0), 0)}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid justify-center items-center grid-cols-1 gap-4 lg:grid-cols-2 mb-4">
              <div className="col-span-2">
                <div className='bg-white rounded-xl shadow-small overflow-hidden'>
                  <div className="flex flex-col">
                    <div className="-m-1.5 overflow-x-auto">
                      <div className="p-1.5 min-w-full inline-block align-middle">
                        <div className="overflow-hidden">
                          <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                              <thead>
                                <tr>
                                  <th scope="col" className="px-3 py-3 text-start text-xs font-medium text-gray-500 uppercase">TL Name</th>
                                  <th scope="col" className="px-3 py-3 text-start text-xs font-medium text-gray-500 uppercase">Caller Name</th>
                                  <th scope="col" className="px-3 py-3 text-start text-xs font-medium text-gray-500 uppercase">Not int</th>
                                  <th scope="col" className="px-3 py-3 text-end text-xs font-medium text-gray-500 uppercase">DNE</th>
                                  <th scope="col" className="px-3 py-3 text-end text-xs font-medium text-gray-500 uppercase">NRF</th>
                                  <th scope="col" className="px-3 py-3 text-end text-xs font-medium text-gray-500 uppercase">Followup</th>
                                  <th scope="col" className="px-3 py-3 text-end text-xs font-medium text-gray-500 uppercase">Future Followup</th>
                                  <th scope="col" className="px-3 py-3 text-end text-xs font-medium text-gray-500 uppercase">Lead Submitted</th>
                                  <th scope="col" className="px-3 py-3 text-end text-xs font-medium text-gray-500 uppercase">Lead Accepted</th>
                                  <th scope="col" className="px-3 py-3 text-end text-xs font-medium text-gray-500 uppercase">Lead Declined</th>
                                  <th scope="col" className="px-3 py-3 text-end text-xs font-medium text-gray-500 uppercase">Queue Change</th>
                                </tr>
                              </thead>
                              <tbody>
                                {TouchedTeamTable.map((data,index)=>(
                                  <>
                                    <tr className={`odd:bg-white ${colors[index]} hover:bg-gray-100`}>
                                      <td rowSpan={data.callers.length} className={`px-3 py-2 ${colors[index]} whitespace-nowrap text-sm font-medium text-gray-800`}>{data.Lead_Name}</td>
                                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">{data.callers[0].First_Name?data.callers[0].First_Name:0}</td>
                                      <td className="px-3 py-2 whitespace-nowrap text-center text-sm text-gray-800">{data.callers[0]['Not Int']?data.callers[0]['Not Int']:0}</td>
                                      <td className="px-3 py-2 whitespace-nowrap text-center text-sm text-gray-800">{data.callers[0]['DNE']?data.callers[0]['DNE']:0}</td>
                                      <td className="px-3 py-2 whitespace-nowrap text-center text-sm text-gray-800">{data.callers[0]['NRF']?data.callers[0]['NRF']:0}</td>
                                      <td className="px-3 py-2 whitespace-nowrap text-center text-sm text-gray-800">{data.callers[0]['Followup']?data.callers[0]['Followup']:0}</td>
                                      <td className="px-3 py-2 whitespace-nowrap text-center text-sm text-gray-800">{data.callers[0]['Future Followup']?data.callers[0]['Future Followup']:0}</td>
                                      <td className="px-3 py-2 whitespace-nowrap text-center text-sm text-gray-800">{data.callers[0]['Lead Submitted']}</td>
                                      <td className="px-3 py-2 whitespace-nowrap text-center text-sm text-gray-800">{data.callers[0]['Lead Accepted']?data.callers[0]['Lead Accepted']:0}</td>
                                      <td className="px-3 py-2 whitespace-nowrap text-center text-sm text-gray-800">{data.callers[0]['Lead Declined']?data.callers[0]['Lead Declined']:0}</td>
                                      <td className="px-3 py-2 whitespace-nowrap text-center text-sm text-gray-800">{data.callers[0]['Queue Change']?data.callers[0]['Queue Change']:0}</td>
                                    </tr>
                                    {
                                      Array.from({ length:data.callers.length - 1 }).map((_, idx) => (
                                      <tr className={`odd:bg-white ${colors[index]} hover:bg-gray-100`}>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-800">{data.callers[idx+1].First_Name}</td>
                                        <td className="px-3 py-2 whitespace-nowrap text-center text-sm text-gray-800">{data.callers[idx+1]['Not Int']?data.callers[idx+1]['Not Int']:0}</td>
                                        <td className="px-3 py-2 whitespace-nowrap text-center text-sm text-gray-800">{data.callers[idx+1]['DNE']?data.callers[idx+1]['DNE']:0}</td>
                                        <td className="px-3 py-2 whitespace-nowrap text-center text-sm text-gray-800">{data.callers[idx+1]['NRF']?data.callers[idx+1]['NRF']:0}</td>
                                        <td className="px-3 py-2 whitespace-nowrap text-center text-sm text-gray-800">{data.callers[idx+1]['Followup']?data.callers[idx+1]['Followup']:0}</td>
                                        <td className="px-3 py-2 whitespace-nowrap text-center text-sm text-gray-800">{data.callers[idx+1]['Future Followup']?data.callers[idx+1]['Future Followup']:0}</td>
                                        <td className="px-3 py-2 whitespace-nowrap text-center text-sm text-gray-800">{data.callers[idx+1]['Lead Submitted']?data.callers[idx+1]['Lead Submitted']:0}</td>
                                        <td className="px-3 py-2 whitespace-nowrap text-center text-sm text-gray-800">{data.callers[idx+1]['Lead Accepted']?data.callers[idx+1]['Lead Accepted']:0}</td>
                                        <td className="px-3 py-2 whitespace-nowrap text-center text-sm text-gray-800">{data.callers[idx+1]['Lead Declined']?data.callers[idx+1]['Lead Declined']:0}</td>
                                        <td className="px-3 py-2 whitespace-nowrap text-center text-sm text-gray-800">{data.callers[idx+1]['Queue Change']?data.callers[idx+1]['Queue Change']:0}</td>
                                      </tr>
                                    ))}
                                    <tr className=" bg-yellow-300">
                                      <td colSpan="2" className="px-3 py-2 text-center whitespace-nowrap text-sm font-medium text-gray-800">Total</td>
                                      <td className="px-3 py-2 whitespace-nowrap text-center text-sm text-gray-800">{data.callers.reduce((total, item) => total + (item['Not Int'] || 0), 0)}</td>
                                      <td className="px-3 py-2 whitespace-nowrap text-center text-sm text-gray-800">{data.callers.reduce((total, item) => total + (item['DNE'] || 0), 0)}</td>
                                      <td className="px-3 py-2 whitespace-nowrap text-center text-sm text-gray-800">{data.callers.reduce((total, item) => total + (item['NRF'] || 0), 0)}</td>
                                      <td className="px-3 py-2 whitespace-nowrap text-center text-sm text-gray-800">{data.callers.reduce((total, item) => total + (item['Followup'] || 0), 0)}</td>
                                      <td className="px-3 py-2 whitespace-nowrap text-center text-sm text-gray-800">{data.callers.reduce((total, item) => total + (item['Future Followup'] || 0), 0)}</td>
                                      <td className="px-3 py-2 whitespace-nowrap text-center text-sm text-gray-800">{data.callers.reduce((total, item) => total + (item['Lead Submitted'] || 0), 0)}</td>
                                      <td className="px-3 py-2 whitespace-nowrap text-center text-sm text-gray-800">{data.callers.reduce((total, item) => total + (item['Lead Accepted'] || 0), 0)}</td>
                                      <td className="px-3 py-2 whitespace-nowrap text-center text-sm text-gray-800">{data.callers.reduce((total, item) => total + (item['Lead Declined'] || 0), 0)}</td>
                                      <td className="px-3 py-2 whitespace-nowrap text-center text-sm text-gray-800">{data.callers.reduce((total, item) => total + (item['Queue Change'] || 0), 0)}</td>
                                    </tr>
                                  </>
                                ))}

                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                </div>
              </div>
              
            </div>
          </TabPanel>
          <TabPanel header="Stock Report">
            <div className="grid justify-center grid-cols-1">
              

              {["SuperAdmin","TeamLeader"].includes(userdetails()?.Role) && (
                <div className='bg-white rounded-xl shadow-small'>
                  <div className="p-5">
                    <h1 className="p-1 text-md font-semibold rounded-lg text--black w-fit">Stock Report</h1>
                    {/* <DataTable value={StockReport} tableStyle={{ minWidth: '100%' }} scrollable scrollHeight="calc(100vh - 255px)">
                      <Column field="code" header="S.No" body={(rowData, { rowIndex }) => <div>{rowIndex + 1}</div>}></Column>
                      <Column field="First_Name" header="Name"></Column>
                      <Column field="Caller" header="Caller ID" style={{ minWidth: '180px' }}></Column>
                      <Column field="PendingLeads" header="Stock" sortable body={(rowData, { rowIndex }) => <span className={`inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium ${ rowData['PendingLeads'] <= 50?'bg-red-500':'bg-green-500'} text-white`}> {rowData['PendingLeads']}</span>} ></Column>
                    </DataTable> */}
                    <div className="flex flex-col">
                      <div className="-m-1.5 overflow-x-auto">
                        <div className="p-1.5 min-w-full inline-block align-middle">
                          <div className="border overflow-hidden dark:border-neutral-700">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                              <thead className='bg-slate-100'>
                                <tr>
                                  <th rowSpan="2" scope="col" className="px-6 py-3 border-r-small text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">S.No</th>
                                  <th rowSpan="2" scope="col" className="px-6 py-3 border-r-small text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">TL Name</th>
                                  <th rowSpan="2" scope="col" className="px-6 py-3 border-r-small text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Caller Name</th>
                                  <th rowSpan="2" scope="col" className="px-6 py-3 border-r-small text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Caller ID</th>
                                  <th rowSpan="2" scope="col" className="px-6 py-3 border-r-small text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Untouched Data</th>
                                  <th colspan="2" scope="col" className="px-6 py-3 border-r-small  border-b-small text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Product Wise</th>
                                  <th colspan="2" scope="col" className="px-6 py-3 border-r-small border-b-small text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Campaign Wise</th>
                                </tr>
                                <tr>
                                  <th scope="col" className="px-6 py-3 border-r-small text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Product Name</th>
                                  <th scope="col" className="px-6 py-3 border-r-small text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Nos</th>
                                  <th scope="col" className="px-6 py-3 border-r-small text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Campaign Name</th>
                                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Nos</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 dark:divide-neutral-700 custome-h">
                                {StockReport.map((entry, index) => (
                                  <tr key={index}>
                                    <td className="px-6 py-4 border-r-small whitespace-nowrap text-center text-sm font-medium text-gray-800">{index+1}</td>
                                    <td className="px-6 py-4 border-r-small whitespace-nowrap text-sm font-medium text-gray-800">{entry.Lead_Name}</td>
                                    <td className="px-6 py-4 border-r-small whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">{entry.First_Name}</td>
                                    <td className="px-6 py-4 border-r-small whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">{entry.Caller}</td>
                                    <td className={`px-6 py-4 border-r-small text-center whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200  `}>{entry.PendingLeads}</td>
                                    <td className="py-0 w-full whitespace-nowrap border-r-small text-sm font-medium text-gray-800 dark:text-neutral-200">
                                      {entry.Products.sort((a, b) => a.Name.localeCompare(b.Name)).map((productEntry, productIndex) => (
                                        <div className={`px-6 text-center ${entry.Products.length != (productIndex+1)?'border-b-small':''} `} style={{ paddingTop: `${(entry.Campaign.filter(resp=>resp.Product == productEntry.Name).length)}rem`, paddingBottom:  `${(entry.Campaign.filter(resp=>resp.Product == productEntry.Name).length)}rem` }} key={productIndex}>
                                          {productEntry.Name != " "?productEntry.Name: <p className='py-[10px]'></p>}
                                        </div>
                                      ))}
                                    </td>
                                    <td className="py-0 whitespace-nowrap border-r-small text-sm font-medium text-gray-800 dark:text-neutral-200">
                                      {entry.Products.sort((a, b) => a.Name.localeCompare(b.Name)).map((productEntry, productIndex) => (
                                        <div className={`px-6 text-center ${entry.Products.length != (productIndex+1)?'border-b-small':''} `} style={{ paddingTop: `${(entry.Campaign.filter(resp=>resp.Product == productEntry.Name).length)}rem`, paddingBottom:  `${(entry.Campaign.filter(resp=>resp.Product == productEntry.Name).length)}rem` }} key={productIndex}>
                                          {productEntry.Count}
                                        </div>
                                      ))}
                                    </td>
                                    <td className="whitespace-nowrap border-r-small text-start text-sm font-medium">
                                      {entry.Campaign.sort((a, b) => a.Product.localeCompare(b.Product)).map((campaignEntry, campaignIndex) => (
                                        <div className={`px-6 ${entry.Campaign.length != (campaignIndex+1)?'border-b-small':''}`} key={campaignIndex} style={{ paddingTop: `${entry.Campaign.length >1? '0.78rem':'1rem'}`, paddingBottom: `${entry.Campaign.length >1? '0.78rem':'1rem'}`}}>
                                          {campaignEntry.Name}
                                        </div>
                                      ))}
                                    </td>

                                    <td className="whitespace-nowrap text-center text-sm font-medium">
                                      {entry.Campaign.sort((a, b) => a.Product.localeCompare(b.Product)).map((campaignEntry, campaignIndex) => (
                                        <div className={`px-6 ${entry.Campaign.length != (campaignIndex+1)?'border-b-small':''}`} style={{ paddingTop: `${entry.Campaign.length >1? '0.78rem':'1rem'}`, paddingBottom:  `${entry.Campaign.length >1? '0.78rem':'1rem'}` }} key={campaignIndex}>
                                           {campaignEntry.Count}
                                        </div>
                                      ))}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabPanel>
        </TabView>
      )}

      
      {/* <div className="w-full max-w-sm p-4 mt-5 bg-white rounded-lg shadow dark:bg-gray-800 md:p-6">
        <div className="flex items-center justify-center">
          <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white pe-1">Website traffic</h5>
        </div>
        <div className="py-6" id="donut-chart"></div>
      </div> */}
      
    </>
  );
}
