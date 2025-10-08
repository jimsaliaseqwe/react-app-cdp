import { useEffect, useState } from "react";

export const useDataFilter = (data, searchTerm, filterFunction) => {
    const [filteredData, setFilteredData] = useState(data);
    
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredData(data);
        } else {
            setFilteredData(filterFunction(data, searchTerm));
        }
    }, [searchTerm, data, filterFunction]);
    
    return filteredData;
};