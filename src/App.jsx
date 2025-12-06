import React, { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import GreenLabLanding from "./GreenLabLanding.jsx";
import GreenLabBali from "./GreenLabBali.jsx";
import GreenLabCanggu from "./GreenLabCanggu.jsx";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<GreenLabLanding />} />
        <Route path="/canggu" element={<GreenLabCanggu />} />
        <Route path="/bali" element={<GreenLabBali />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
