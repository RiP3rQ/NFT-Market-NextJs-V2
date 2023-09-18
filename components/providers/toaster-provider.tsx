"use client";

import React, { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";

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
