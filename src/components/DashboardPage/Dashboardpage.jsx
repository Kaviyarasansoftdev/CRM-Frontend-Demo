import Dashboard from '../../shared/components/Dashboard/dashboard'
import { useState, useEffect, useRef, useCallback } from 'react';
import { DataDashboard, getDailyMISDashboard, getDailyReview, getDataDashboard, getUserDashboard } from '../../shared/services/apidashboard/apidashboard';
import { getusers } from '../../shared/services/apiusers/apiusers';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables, ChartDataLabels);

export const Dashboardpage = () => {

  const [chartData, setChartData] = useState({});
  const [barchartData, setBarChartData] = useState({});
  const [allocationchartData, setAllocationChartData] = useState({});
  const [allocationchartOptions, setAllocationChartOptions] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [barchartOptions, setBarChartOptions] = useState({});
  const [productivitybarchartData, setProductivityBarChartData] = useState({});
  const [productivitybarchartOptions, setProductivityBarChartOptions] = useState({});
  const [procuctsbarchartData, setProductsBarChartData] = useState({});
  const [productsbarchartOptions, setProductsBarChartOptions] = useState({});
  const [TotalLeadWorkeds,setTotalLeadWorkeds] = useState({})
  const [TotalLeadWorkedsOptions,setTotalLeadWorkedsOptions] = useState({})
  const [TotalLeadbyTeamlead,setTotalLeadbyTeamlead] = useState({})
  const [TotalLeadbyTeamleadOptions,setTotalLeadbyTeamleadOptions] = useState({})
  const [TotalLeadbyTeam,setTotalLeadbyTeam] = useState({})
  const [TotalLeadbyTeamOptions,setTotalLeadbyTeamOptions] = useState({});
  const [StockReport,setStockReport] = useState([])
  const [UnallocationTable,setUnallocationTable] = useState([]);
  const [TouchedProductTable,setTouchedProductTable] = useState([]);
  const [TouchedDispositionTable,setTouchedDispositionTable] = useState([]);
  const [TouchedTeamTable,setTouchedTeamTable] = useState([]);
  const [UnallocateTLData,setUnallocateTLData] = useState([]);
  const [FilterType,setFilterType] = useState('All');
  const [dates, setDates] = useState(null);
  const [UserDates, setUserDates] = useState([]);
  const [DailyMIS, setDailyMIS] = useState([]);
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      DailyMISDashboard();
      getuserData();
      fetchData();
      getDashboardData();
      getDailyReviews();
    }

  }, []);

  const getuserData = useCallback(async ()=>{
    const users = await getusers();
    setUserDates(users);
  },[])

  const fetchData = useCallback(async ()=>{
    try {
      var backendResponse = await getUserDashboard();
      const users = await getusers();
      const dataMap = new Map(users.map(item => [item.UserName, item.First_Name]));

      backendResponse = backendResponse.map(item => ({ ...item, First_Name: dataMap.get(item.Caller) }));
      backendResponse = backendResponse.map(item => ({ ...item, Lead_Name: dataMap.get(item.TeamLead) }));
      setStockReport(backendResponse)

      const data = {
        labels: ['TeamLeader', 'Telecaller'],
        datasets: [
          {
            data: [backendResponse[0]?.TeamLeader, backendResponse[0]?.Telecaller],
            backgroundColor: [ '#9D51F2', '#3196ED' ],
            hoverBackgroundColor: [ '#9D51F2', '#3196ED' ]
          }
        ]
      };
        
      const options = { cutout: '60%' };

      setChartData(data);
      setChartOptions(options);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  },[])

  const DailyMISDashboard = useCallback(async ()=>{
    try {
      var backendResponse = await getDailyMISDashboard();
      const users = await getusers();
      const dataMap = new Map(users.map(item => [item.UserName, item.First_Name]));

      backendResponse = backendResponse.map(item => ({ ...item, First_Name: dataMap.get(item.Caller) }));
      backendResponse = backendResponse.map(item => ({ ...item, Lead_Name: dataMap.get(item.TeamLead) }));
      setDailyMIS(backendResponse)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  },[])

  const getDailyReviews = useCallback(async ()=>{
    var res = await getDailyReview();
    const users = await getusers();
    const dataMap = new Map(users.map(item => [item.UserName, item.First_Name]));
    res[0]['LeadsByTeam'] = res[0]['LeadsByTeam'].map(item => ({ ...item, First_Name: dataMap.get(item.Caller) }));
    res[0]['LeadsByTeamLead'] = res[0]['LeadsByTeamLead'].map(item => ({ ...item, First_Name: dataMap.get(item.TeamLead) }));

    await fetchTotalLeadWorkeds(res&&res[0]&&res[0].Leads[0]?res[0].Leads[0]:0)
    // await fetchLeadsbyTeamlead(res[0]['LeadsByTeamLead'])
    // await fetchLeadsbyTeam(res[0]['LeadsByTeam']) 
  },[])

  const getDashboardData = useCallback(async ()=>{
    const backendResponse = await getDataDashboard();
    await fetchLeadsData(backendResponse)
  },[])

  const FilterDashbord = async (e)=>{
  
    var data;
    if(!e){
      data = {FilterType,dates}
    }
    else{
      setFilterType(e.target.value)
      data = {FilterType}
    }
    const backendResponse = await DataDashboard(data);
    await fetchLeadsData(backendResponse)
  }

  // Bar chart
  const fetchLeadsData = async (backendResponse) => {
    const documentStyle = getComputedStyle(document.documentElement);
    try {
      const data = {
        labels: ['Allocated Leads', 'Workable Leads', 'Non-Workable Leads', 'Followup', 'Lead Submitted'],
        datasets: [
          {
            label: 'Leads',
            backgroundColor: documentStyle.getPropertyValue('--blue-500'),
            borderColor: documentStyle.getPropertyValue('--yellow-400'),
            data: [
              backendResponse[0]['Telecaller_Leads'][0]?.AllocatedLeads,
              backendResponse[0]['Telecaller_Leads'][0]?.WorkableLeads,
              backendResponse[0]['Telecaller_Leads'][0]?.NonWorkableLeads,
              backendResponse[0]['Telecaller_Leads'][0]?.Followups,
              backendResponse[0]['Telecaller_Leads'][0]?.LeadSubmitted
            ]
          }
        ]
      };

      const options = {
        responsive : true,
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: { legend: { display: true }
        },
        scales: {
          x: {
            display: true,
            title: { display: true, text: 'Lead Status' }},
          y: {
            display: true,
            title: { display: true, text: 'Count' }}
        }
      };

      setBarChartData(data);
      setBarChartOptions(options);

      setUnallocationTable(backendResponse[0].unAllocateTable);
      setTouchedProductTable(backendResponse[0].TouchedProductTable);
      await fetchTotalLeadWorkeds(backendResponse[0].TouchedProduct)
      await fetchProducts(backendResponse[0]['WorkedLeads']);
      await fetchLeadsbyTeamlead(backendResponse[0]['unAllocatebyTL']);

      const mergedData = Object.values(backendResponse[0]?.TouchedDispositionTable?.reduce((acc, { count, Product, Disposition }) => {
        if (!acc[Disposition]) {
          acc[Disposition] = { Disposition };
        }
        acc[Disposition][Product] = (acc[Disposition][Product] || 0) + count;
        return acc;
      }, {}));

      setTouchedDispositionTable(mergedData)

      const TeammergedData = backendResponse[0]?.TouchedTeamTable.reduce((acc, item) => {
        const key = `${item.TeamLead}-${item.Caller}`;
        if (!acc[key]) {
          acc[key] = { TeamLead: item.TeamLead, Caller: item.Caller,  "Not Int": 0, "Call Back": 0, "DNE": 0, "Followup": 0, "Future Followup": 0, "Submit Lead": 0, "Lead Submitted": 0, "Lead Declined": 0, "Lead Accepted": 0 };
        }
        acc[key][item.Disposition] += item.count;
        return acc;
      }, {});

      let result = Object.values(TeammergedData);

      const users = await getusers();
      const dataMap = new Map(users.map(item => [item.UserName, item.First_Name]));

      result = result.map(item => ({ ...item, First_Name: dataMap.get(item.Caller) }));
      result = result.map(item => ({ ...item, Lead_Name: dataMap.get(item.TeamLead) }));

      const mergedData2 = result.reduce((acc, curr) => {
        let existingLead = acc.find(item => item.Lead_Name === curr.Lead_Name);
        const dynamicFields = Object.keys(curr).reduce((fields, key) => {
          if (key !== "Lead_Name" && key !== "TeamLead" && key !== "Caller") {
            fields[key] = curr[key];
          }
          return fields;
        }, {});
    
        if (existingLead) {
            existingLead.callers.push(dynamicFields);
        } else {
          acc.push({
            "Lead_Name": curr["Lead_Name"],
            "callers": [dynamicFields]
          });
        }
        return acc;
      }, []);

      setTouchedTeamTable(mergedData2)

      fetchProductivityData(backendResponse)
      fetchallocationData(backendResponse)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Productivity Data Chart
    
    const fetchProductivityData = async (backendResponse) => {
      const documentStyle = getComputedStyle(document.documentElement);
      try {
        const data = {
          labels: ['Reached', 'Worked Leads', 'Not Reached', 'Lead Accepted', 'Not Updated'],
          datasets: [
            {
              label: 'Productivity',
              backgroundColor: [
                documentStyle.getPropertyValue('--yellow-500'),
                documentStyle.getPropertyValue('--blue-500'),
                documentStyle.getPropertyValue('--red-500'),
                documentStyle.getPropertyValue('--orange-500'),
                documentStyle.getPropertyValue('--green-500'),
              ],
              data: [
                backendResponse[0]['Productivity'][0]?.Reached,
                backendResponse[0]['Productivity'][0]?.WorkedLeads,
                backendResponse[0]['Productivity'][0]?.NonReached,
                backendResponse[0]['Productivity'][0]?.LeadAccepted,
                backendResponse[0]['Productivity'][0]?.NotUpdated
              ]
            }
          ]
        };

        const options = {    
          responsive : true,
          maintainAspectRatio: false,
          aspectRatio: 0.8,    
          plugins: {
            datalabels: {
              display: (context) => {
                // Hide label when value is 0
                return context.dataset.data[context.dataIndex] !== 0?'auto':false;
              },
              backgroundColor: (context) => {
                // Only set background color if value is not 0
                return context.dataset.data[context.dataIndex] !== 0 ? 'rgba(0, 0, 0, 0.7)' : 'transparent';
              },
              clip : true,
              borderRadius: 4, // Optional: adds rounded corners to the background
              padding: 6,
              color: 'white', // Customize the color
              align: 'center',
              anchor: 'end',
              clamp:true,
              labels: {
                
                title: {
                  font: {
                    weight: 'bold'
                  }
                },
              },
              formatter: function(value, context) {
                return `${context.chart.data.labels[context.dataIndex]} - ${value}`;
              }
          }
        },
        cutout: '65%' 
      };

        setProductivityBarChartData(data);
        setProductivityBarChartOptions(options);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
  };

  const CustomeSort = (data)=>{
    data.sort((a, b) => b.Count - a.Count);

    // Step 2: Split the sorted array into two halves
    let half = Math.ceil(data.length / 2);
    let largeValues = data.slice(0, half); // Larger values
    let smallValues = data.slice(half); // Smaller values

    // Step 3: Merge the two halves in an alternating pattern
    let result = [];
    for (let i = 0; i < largeValues.length; i++) {
        result.push(largeValues[i]); // Add from largeValues
        if (smallValues[i]) {
            result.push(smallValues[i]); // Add from smallValues if exists
        }
    }

    return result;
  }

 // Products Data Chart
 

  const fetchProducts = async (backendResponse) => {
    try {

      const documentStyle = getComputedStyle(document.documentElement);
      const data = {
        labels:  backendResponse.map(resp=>resp.Disposition),
        datasets: [
          {
            data: backendResponse.map(resp=>resp.Count),
            backgroundColor: [ '#2bb0fd', '#4C3BCF', '#7bcf1f', '#15e472', '#fd6a34', '#9D51F2', '#6a8abb', '#d668fb' ],
            hoverBackgroundColor: [ '#2bb0fd', '#4C3BCF', '#7bcf1f', '#15e472', '#fd6a34', '#9D51F2', '#6a8abb', '#d668fb' ]
          }
        ]
      };

      const options = {
        responsive : true,
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
          datalabels: {
              display: (context) => {
                // Hide label when value is 0
                return context.dataset.data[context.dataIndex] !== 0;
              },
              backgroundColor: (context) => {
                // Only set background color if value is not 0
                return context.dataset.data[context.dataIndex] !== 0 ? 'rgba(0, 0, 0, 0.7)' : 'transparent';
              },
              borderRadius: 4, // Optional: adds rounded corners to the background
              padding: 6,
              color: 'white', // Customize the color
              align: 'center',
              anchor: 'end',
              clamp:true,
              labels: {
                
                title: {
                  font: {
                    weight: 'bold'
                  }
                },
              },
              formatter: function(value, context) {
                return `${context.chart.data.labels[context.dataIndex]} - ${value}`; // Show the value
              }
          }
        },
        responsive : true,
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        cutout: '60%'
      }

      setProductsBarChartData(data);
      setProductsBarChartOptions(options);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


// Allocation and Unallocation

  const fetchallocationData = async (backendResponse) => {
    try {
      const data = {
        labels: ['BL', 'STPL','DL','PL','UCL','HL','LP'],
        datasets: [
          {
            data: [
              backendResponse[0]['Data'][0].BL,
              backendResponse[0]['Data'][0]['STPL'],
              backendResponse[0]['Data'][0]['DL'],
              backendResponse[0]['Data'][0]['PL'],
              backendResponse[0]['Data'][0]['UCL'],
              backendResponse[0]['Data'][0]['HL'],
              backendResponse[0]['Data'][0]['LP']
            ],

            backgroundColor: [ '#402E7A', '#4C3BCF', '#4B70F5', '#3DC2EC', '#E0A75E', '#9D51F2', '#3196ED' ],
            hoverBackgroundColor: [ '#402E7A', '#4C3BCF', '#4B70F5', '#3DC2EC', '#E0A75E', '#9D51F2', '#3196ED' ]
          }
        ]
      };

      const options = {
        responsive : true,
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
          datalabels: {
              display: (context) => {
                // Hide label when value is 0
                return context.dataset.data[context.dataIndex] !== 0;
              },
              backgroundColor: (context) => {
                // Only set background color if value is not 0
                return context.dataset.data[context.dataIndex] !== 0 ? 'rgba(0, 0, 0, 0.7)' : 'transparent';
              },
              borderRadius: 4, // Optional: adds rounded corners to the background
              padding: 6,
              color: 'white', // Customize the color
              align: 'center',
              anchor: 'end',
              clamp:true,
              labels: {
                
                title: {
                  font: {
                    weight: 'bold'
                  }
                },
              },
              formatter: function(value, context) {
                return `${context.chart.data.labels[context.dataIndex]} - ${value}`;
              }
          }
        },
        responsive : true,
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        cutout: '60%'
      };

      setAllocationChartData(data);
      setAllocationChartOptions(options);
     } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchTotalLeadWorkeds = async (backendResponse) => {
    try {
      const data = {
        labels: backendResponse.map(resData=>resData.Product),
        datasets: [
          {
            data: backendResponse.map(resData=>resData.count),

            backgroundColor: [ '#402E7A', '#4C3BCF', '#4B70F5', '#3DC2EC', '#E0A75E', '#9D51F2', '#3196ED', ],
            hoverBackgroundColor: [ '#402E7A', '#4C3BCF', '#4B70F5', '#3DC2EC', '#E0A75E', '#9D51F2', '#3196ED' ]
          }
        ]
      };

      const options = {
        responsive : true,
        maintainAspectRatio: false,
        aspectRatio: 0.8, 
        plugins: {
          datalabels: {
              display: (context) => {
                // Hide label when value is 0
                return context.dataset.data[context.dataIndex] !== 0?'auto':false;
              },
              backgroundColor: (context) => {
                // Only set background color if value is not 0
                return context.dataset.data[context.dataIndex] !== 0 ? 'rgba(0, 0, 0, 0.7)' : 'transparent';
              },
              clip : true,
              borderRadius: 4, // Optional: adds rounded corners to the background
              padding: 6,
              color: 'white', // Customize the color
              align: 'center',
              anchor: 'end',
              clamp:true,
              labels: {
                
                title: {
                  font: {
                    weight: 'bold'
                  }
                },
              },
              formatter: function(value, context) {
                return `${context.chart.data.labels[context.dataIndex]} - ${value}`;
              }
          }
        },
        cutout: '60%'
        
      };

      setTotalLeadWorkeds(data);
      setTotalLeadWorkedsOptions(options);
     } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchLeadsbyTeamlead = async (backendResponse) => {
    try {

      const users = await getusers();
      const dataMap = new Map(users.map(item => [item.UserName, item.First_Name]));
      backendResponse = backendResponse.map(item => ({ ...item, First_Name: dataMap.get(item.selectedTeamLeader) }));
      setUnallocateTLData(backendResponse)
      const data = {
        labels: backendResponse.map(res=>res.First_Name +'('+res.selectedTeamLeader+')'),
        datasets: [
          {
            data: backendResponse.map(res=>res.count),
            backgroundColor: [ '#402E7A', '#4C3BCF', '#4B70F5', '#3DC2EC', '#E0A75E', '#9D51F2', '#3196ED' ],
            hoverBackgroundColor: [ '#402E7A', '#4C3BCF', '#4B70F5', '#3DC2EC', '#E0A75E', '#9D51F2', '#3196ED' ]
          }
        ]
      };

      const options = {
        responsive : true,
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
          datalabels: {
            display: (context) => {
              return context.dataset.data[context.dataIndex] !== 0;
            },
            backgroundColor: (context) => {
              return context.dataset.data[context.dataIndex] !== 0 ? 'rgba(0, 0, 0, 0.7)' : 'transparent';
            },
            borderRadius: 4, padding: 6, color: 'white', align: 'center', anchor: 'end', clamp:true,
            labels: { title: { font: { weight: 'bold' } } },
            formatter: function(value, context) {
              return `${context.chart.data.labels[context.dataIndex]} - ${value}`;
            }
          }
        },
        responsive : true,
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        cutout: '60%'
      };
      setTotalLeadbyTeamlead(data);
      setTotalLeadbyTeamleadOptions(options);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchLeadsbyTeam = async (backendResponse) => {
    try {
      const data = {
        labels:backendResponse.map((res)=> `${res['First_Name']} (${res['Caller']})`),
        datasets: [
          { label: 'Allocated Leads',
            backgroundColor: '#402E7A',
            data: backendResponse.map(res=>res['AllocatedLeads'])
          },
          { label: 'Pending Leads',
            backgroundColor: '#EF5A6F',
            data: backendResponse.map(res=>res['PendingLeads'])
          },
          { label: 'Workable Leads',
            backgroundColor: '#3DC2EC',
            data: backendResponse.map(res=>res['WorkableLeads'])
          },
          { label: 'NonWorkable Leads',
            backgroundColor: '#E0A75E',
            data: backendResponse.map(res=>res['NonWorkableLeads'])
          },
          { label: 'Lead Submitted',
            backgroundColor: '#9D51F2',
            data: backendResponse.map(res=>res['LeadSubmitted'])
          },
          { label: 'Followups',
            backgroundColor: '#3196ED',
            data: backendResponse.map(res=>res['Followups'])
          }
        ]
      };

      const options = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
          datalabels: {
              display: false}
        },
        scales: {
          x: {
            display: true,
            title: { display: true, text: 'Callers' }
          },
          y: {
            display: true,
            title: { display: true, text: 'Count' }
          }
        }
      };
      setTotalLeadbyTeam(data);
      setTotalLeadbyTeamOptions(options);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <Dashboard chartData={chartData} chartOptions={chartOptions} barchartData={barchartData} barchartOptions={barchartOptions} procuctsbarchartData={procuctsbarchartData}
        productsbarchartOptions={productsbarchartOptions} productivitybarchartData={productivitybarchartData} productivitybarchartOptions={productivitybarchartOptions}
        allocationchartData={allocationchartData} allocationchartOptions={allocationchartOptions} TotalLeadWorkeds={TotalLeadWorkeds} UnallocationTable={UnallocationTable}
        TotalLeadWorkedsOptions={TotalLeadWorkedsOptions} TotalLeadbyTeamlead={TotalLeadbyTeamlead} TotalLeadbyTeamleadOptions={TotalLeadbyTeamleadOptions}
        TotalLeadbyTeam={TotalLeadbyTeam} TotalLeadbyTeamOptions={TotalLeadbyTeamOptions} dates={dates} setDates={setDates} StockReport={StockReport}
        TouchedProductTable={TouchedProductTable} TouchedDispositionTable={TouchedDispositionTable} TouchedTeamTable={TouchedTeamTable} FilterDashbord={FilterDashbord}
        setFilterType={setFilterType} UnallocateTLData={UnallocateTLData} FilterType={FilterType} DailyMIS={DailyMIS}
      />
    </div> 
  )
}
