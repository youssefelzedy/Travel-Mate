import { createContext, useContext, useState } from "react";

// Create the context
const UserDataContext = createContext();

// Create a provider component
export const UserDataProvider = ({ children }) => {
    const [carType, setCarType] = useState("microbus");
    const [location, setLocation] = useState(null);
    const [destination, setDestination] = useState(null);

    return (
        <UserDataContext.Provider
            value={{
                carType,
                setCarType,
                location,
                setLocation,
                destination,
                setDestination,
            }}>
            {children}
        </UserDataContext.Provider>
    );
};

// Custom hook to use the UserDataContext
export const useUserData = () => {
    return useContext(UserDataContext);
};
