/**
 * Tạo generic filter function cho các entity
 * @param {Array<string>} searchableFields - Các field có thể search
 * @returns {Function} Filter function
 */
export const createGenericFilter = (searchableFields) => {
    return (items, searchTerm) => {
        if (!searchTerm.trim()) return items;
        
        const lowerSearch = searchTerm.toLowerCase();
        return items.filter(item =>
            searchableFields.some(field => {
                const value = item[field];
                if (value === null || value === undefined) return false;
                
                // Handle arrays (like features)
                if (Array.isArray(value)) {
                    return value.join(", ").toLowerCase().includes(lowerSearch);
                }
                
                // Handle normal values
                return value.toString().toLowerCase().includes(lowerSearch);
            })
        );
    };
};