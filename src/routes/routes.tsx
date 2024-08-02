import { BrowserRouter as Routers, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home.tsx";
import InventoryPage from "@/pages/Inventory.tsx";
import DetailsPage from "@/pages/DetailsPage.tsx";
import NotFoundPage from "@/pages/Error";

export default function RouterConfig() {
  return (
    <Routers>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/items/:id" element={<DetailsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Routers>
  );
}
