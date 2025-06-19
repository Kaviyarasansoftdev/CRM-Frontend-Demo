import { useState } from 'react';
import { MultiSelect } from 'primereact/multiselect';
import { FilterMatchMode, FilterOperator } from 'primereact/api';

const useLocationFilter = (tabledata, cusfilter) => {
    const [selectedLocation1, setSelectedLocation1] = useState([]);
    const [filters1, setFilters1] = useState({
        Location: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.IN }] },
    });

    const applyLocationFilter1 = () => {
        const updatedFilters = { ...filters1 };
        updatedFilters.Location.constraints[0].value = selectedLocation1;
        setFilters1(updatedFilters);
        cusfilter('Location', selectedLocation1);
    };
    
    const clearLocationFilter1 = () => {
        setSelectedLocation1([]);
        const updatedFilters = { ...filters1 };
        updatedFilters.Location.constraints[0].value = null;
        setFilters1(updatedFilters);
        cusfilter('Location', '');
    };
    
    const filterApply1 = () => (
        <button onClick={applyLocationFilter1} className="p-1 px-2 text-white bg-blue-500 rounded-lg">Apply</button>
    );
    
    const filterClear1 = () => (
        <button onClick={clearLocationFilter1} className="p-1 px-2 text-white bg-blue-500 rounded-lg">Clear</button>
    );

    const LocationFilterTemplate = () => {
        const Locations = [...new Set(tabledata?.map((data) => data.Location))];
        const LocationOptions = Locations.map((Location) => ({ label: Location, value: Location }));

        return (
            <MultiSelect
                value={selectedLocation1}
                options={LocationOptions}
                onChange={(e) => setSelectedLocation1(e.value)}
                placeholder="Select Location"
                optionLabel="label"
                showClear
                filter
                className="p-column-filter"
            />
        );
    };

    return {
        selectedLocation1,
        setSelectedLocation1,
        filters1,
        setFilters1,
        LocationFilterTemplate,
        filterApply1,
        filterClear1
    };
};

export default useLocationFilter;
