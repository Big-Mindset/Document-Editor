"use client"

import { createContext, useContext, useState } from "react"
export let LoadingContext = createContext()

export function LoadingProvider({ children }) {
  const [loading, setLoading] = useState(null);
    
  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}