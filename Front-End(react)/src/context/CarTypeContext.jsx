import { createContext, useContext, useState } from "react";

// Create the context
const CarTypeContext = createContext();

// Create a provider component
export const CarTypeProvider = ({ children }) => {
    const [carType, setCarType] = useState("microbus");

    return (
        <CarTypeContext.Provider value={{ carType, setCarType }}>
            {children}
        </CarTypeContext.Provider>
    );
};

// Custom hook to use the CarTypeContext
export const useCarType = () => {
    return useContext(CarTypeContext);
};
