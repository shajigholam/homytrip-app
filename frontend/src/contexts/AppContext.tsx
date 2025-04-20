// define a type for our context that holds all the properties that we are going to expost to our components

import React, {useContext, useState} from "react";
import Toast from "../components/Toast";
import {useQuery} from "@tanstack/react-query";
import * as apiClient from "../api-client";

type ToastMessage = {
  message: string;
  type: "SUCCESS" | "ERROR";
};

// different contexts that we are exposing to the app
type AppContext = {
  showToast: (toastMessage: ToastMessage) => void;
  isLoggedIn: boolean;
};

// Create the context
const AppContext = React.createContext<AppContext | undefined>(undefined);

// Create the provider component to Provide the context value
export const AppContextProvider = ({children}: {children: React.ReactNode}) => {
  const [toast, setToast] = useState<ToastMessage | undefined>(undefined);
  const {isError} = useQuery({
    queryKey: ["validateToken"],
    queryFn: apiClient.validateToken,
    retry: false,
  });

  return (
    <AppContext.Provider
      value={{
        showToast: toastMsg => {
          setToast(toastMsg);
        },
        isLoggedIn: !isError,
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
