// define a type for our context that holds all the properties that we are going to expost to our components

import React, {useContext, useState} from "react";
import Toast from "../components/Toast";

type ToastMessage = {
  message: string;
  type: "SUCCESS" | "ERROR";
};

type AppContext = {
  showToast: (toastMessage: ToastMessage) => void;
};

// Create the context
const AppContext = React.createContext<AppContext | undefined>(undefined);

// Create the provider component to Provide the context value
export const AppContextProvider = ({children}: {children: React.ReactNode}) => {
  const [toast, setToast] = useState<ToastMessage | undefined>(undefined);
  return (
    <AppContext.Provider
      value={{
        showToast: toastMsg => {
          setToast(toastMsg);
        },
      }}
    >
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(undefined)}
        />
      )}
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use context (safely)
// with this we can Use it only inside components wrapped in <AppContextProvider> — otherwise context will actually be undefined, and it may cause runtime errors.
export const useAppContext = () => {
  const context = useContext(AppContext);
  return context as AppContext; //This avoids having to check for undefined every time you use the context.(Trust me, context is not undefined)
};
