import React, { createContext, useEffect, useState } from 'react';

const UserContext = createContext();

export function UserProvider({children}){
    const [userData, setUserData] = useState(() => {
        const savedUserData = localStorage.getItem('userData');
        return savedUserData ? JSON.parse(savedUserData) : null
      });

    useEffect(() => {
        const userDataJSON = JSON.stringify(userData);
        localStorage.setItem('userData', userDataJSON);
      }, [userData,setUserData]);

      console.log("userData", userData);

      
    return(

        <UserContext.Provider value={{userData, setUserData}}>
            {children}
        </UserContext.Provider>

    )

}

export default UserContext