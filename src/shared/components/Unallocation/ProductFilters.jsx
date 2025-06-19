import { useState } from 'react';
import { MultiSelect } from 'primereact/multiselect';
import { FilterMatchMode, FilterOperator } from 'primereact/api';

const useProductFilter = (tabledata, cusfilter) => {
    const [selectedProduct, setselectedProduct] = useState([]);
    const [filters3, setFilters3] = useState({
        Product: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.IN }] },
    });

    const applyProductFilter = () => {
        const updatedFilters = { ...filters3 };
        updatedFilters.Product.constraints[0].value = selectedProduct;
        setFilters3(updatedFilters);
        cusfilter('Product', selectedProduct);
    };

    const clearProductFilter = () => {
        setselectedProduct([]);
        const updatedFilters = { ...filters3 };
        updatedFilters.Product.constraints[0].value = null;
        setFilters3(updatedFilters);
        cusfilter('Product', '');
    };

    const filterApply3 = () => (
        <button onClick={applyProductFilter} className="p-1 px-2 text-white bg-blue-500 rounded-lg">Apply</button>
    );

    const filterClear3 = () => (
        <button onClick={clearProductFilter} className="p-1 px-2 text-white bg-blue-500 rounded-lg">Clear</button>
    );

    const productFilterTemplate = () => {
        const Products = [...new Set(tabledata?.map((data) => data.Product))];
        const productOptions = Products.map((Product) => ({ label: Product, value: Product }));

        return (
            <MultiSelect
                value={selectedProduct}
                options={productOptions}
                onChange={(e) => setselectedProduct(e.value)}
                placeholder="Select Product Name"
                optionLabel="label"
                showClear
                filter
                className="w-full"
            />
        );
    };

    return {
        selectedProduct,
        setselectedProduct,
        filters3,
        setFilters3,
        productFilterTemplate,
        filterApply3,
        filterClear3
    };
};

export default useProductFilter;
