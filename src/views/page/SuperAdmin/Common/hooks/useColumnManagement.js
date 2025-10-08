import { useCallback, useMemo, useState } from "react";

export const useColumnManagement = (allColumns, defaultColumns) => {
    const [showColumns, setShowColumns] = useState(defaultColumns);
    
    const handleToggleColumn = useCallback((field) => {
        setShowColumns(prev =>
            prev.includes(field) 
                ? prev.filter(f => f !== field) 
                : [...prev, field]
        );
    }, []);
    
    const handleToggleAllColumns = useCallback(() => {
        setShowColumns(prev =>
            prev.length === allColumns.length 
                ? defaultColumns 
                : allColumns.map(c => c.field)
        );
    }, [allColumns, defaultColumns]);
    
    const visibleColumns = useMemo(
        () => allColumns.filter(col => showColumns.includes(col.field)),
        [showColumns, allColumns]
    );
    
    return { 
        showColumns, 
        visibleColumns, 
        handleToggleColumn, 
        handleToggleAllColumns 
    };
};