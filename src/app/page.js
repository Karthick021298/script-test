"use client";
import Chatbot from "@/section/Chatbot";
import React,{useState, useEffect} from 'react'
import useAuth from "@/Utils/Hooks/useAuth";

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [themeColor, setThemeColor] = useState(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const { domainData } = useAuth();

  useEffect(() => {
    setIsClient(true);
    const storedColor =
      typeof window !== "undefined" ? localStorage.getItem("themeColor") : null;
    if (storedColor !== null) {
      setThemeColor(storedColor);
    }
    setInitialLoadComplete(true);
  }, []);

  useEffect(() => {
    const handleReload = () => {
      setIsClient(false);
      location.reload();
    };
    if (
      isClient &&
      themeColor === null &&
      !_.isEqual(domainData?.domainName, null) &&
      initialLoadComplete
    ) {
      const reloadTimeout = setTimeout(handleReload, 200);
      return () => clearTimeout(reloadTimeout);
    }
  }, [isClient, themeColor, domainData, initialLoadComplete]);

  return (
    <>
      {!_.isEqual(domainData?.domainName, null) &&
      !_.isEqual(domainData?.themeColor, null) ? (
        isClient ? (
          <Chatbot />
        ) : null
      ) : null}
    </>
  );
}
