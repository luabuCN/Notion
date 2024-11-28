"use client";

import { useEffect, useState } from "react";

import SettingModal from "../modals/setting-modal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <SettingModal />
    </>
  );
};

export default ModalProvider;
