"use client";

import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

const ToasterProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return <Toaster />;
};

export default ToasterProvider;
