import { useState } from 'react';
import { MultiSelect } from 'primereact/multiselect';
import { FilterMatchMode, FilterOperator } from 'primereact/api';

const useRegionFilter = (tabledata, cusfilter) => {
    const [selectedRegion, setSelectedRegion] = useState([]);
    const [filters, setFilters] = useState({
        Region: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.IN }] },
    });

    const applyRegionFilter = () => {
        const updatedFilters = { ...filters };
        updatedFilters.Region.constraints[0].value = selectedRegion;
        setFilters(updatedFilters);
        cusfilter('Region', selectedRegion);
    };

    const clearRegionFilter = () => {
        setSelectedRegion([]);
        const updatedFilters = { ...filters };
        updatedFilters.Region.constraints[0].value = null;
        setFilters(updatedFilters);
        cusfilter('Region', '');
    };

    const filterApply = () => (
        <button onClick={applyRegionFilter} className="p-1 px-2 text-white bg-blue-500 rounded-lg">Apply</button>
    );

    const filterClear = () => (
        <button onClick={clearRegionFilter} className="p-1 px-2 text-white bg-blue-500 rounded-lg">Clear</button>
    );

    const regionFilterTemplate = () => {
        const regions = [...new Set(tabledata?.map((data) => data.Region))];
        const regionOptions = regions.map((Region) => ({ label: Region, value: Region }));

        return (
            <MultiSelect
                value={selectedRegion}
                options={regionOptions}
                onChange={(e) => setSelectedRegion(e.value)}
                placeholder="Select Region"
                optionLabel="label"
                showClear
                filter
                className="w-full"
            />
        );
    };

    return {
        selectedRegion,
        setSelectedRegion,
        filters,
        setFilters,
        regionFilterTemplate,
        filterApply,
        filterClear
    };
};

export default useRegionFilter;
