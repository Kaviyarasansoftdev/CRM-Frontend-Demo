import { useState } from 'react';
import { MultiSelect } from 'primereact/multiselect';
import { FilterMatchMode, FilterOperator } from 'primereact/api';

const useCampanignFilter = (tabledata, cusfilter) => {
    const [selectedCampaign, setselectedCampaign] = useState([]);
    const [filters2, setFilters2] = useState({
        Campaign_Name: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.IN }] },
    });

    const applyCampaignFilter = () => {
        const updatedFilters = { ...filters2 };
        updatedFilters.Campaign.constraints[0].value = selectedCampaign;
        setFilters2(updatedFilters);
        cusfilter('Campaign_Name', selectedCampaign);
    };

    const clearCampaignFilter = () => {
        setselectedCampaign([]);
        const updatedFilters = { ...filters2 };
        updatedFilters.Campaign.constraints[0].value = null;
        setFilters2(updatedFilters);
        cusfilter('Campaign_Name', '');
    };

    const filterApply2 = () => (
        <button onClick={applyCampaignFilter} className="p-1 px-2 text-white bg-blue-500 rounded-lg">Apply</button>
    );

    const filterClear2 = () => (
        <button onClick={clearCampaignFilter} className="p-1 px-2 text-white bg-blue-500 rounded-lg">Clear</button>
    );

    const campaignFilterTemplate = () => {
        const campaigns = [...new Set(tabledata?.map((data) => data.Campaign_Name))];
        const campaignOptions = campaigns.map((Campaign_Name) => ({ label: Campaign_Name, value: Campaign_Name }));

        return (
            <MultiSelect
                value={selectedCampaign}
                options={campaignOptions}
                onChange={(e) => setselectedCampaign(e.value)}
                placeholder="Select Campaign Name"
                optionLabel="label"
                showClear
                filter
                className="w-full"
            />
        );
    };

    return {
        selectedCampaign,
        setselectedCampaign,
        filters2,
        setFilters2,
        campaignFilterTemplate,
        filterApply2,
        filterClear2
    };
};

export default useCampanignFilter;
