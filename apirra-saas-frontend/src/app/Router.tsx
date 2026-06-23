import { Routes, Route } from "react-router-dom";
import PreLoginHome from "../pages/ExplorerPage/PreLoginHome";
import ExplorerPage from "../components/explorer/layout/ExplorerPage";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<PreLoginHome />} />
      <Route path="/explorer" element={<ExplorerPage />} />
    </Routes>
  );
}
