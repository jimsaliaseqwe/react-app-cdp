// BaseContext.js
import { createContext, useContext } from 'react';

const BaseContext = createContext(null);

export const useBase = () => useContext(BaseContext);

export const BaseProvider = ({ children, value }) => {
    return (
        <BaseContext.Provider value={value}>{children}</BaseContext.Provider>
    );
};
