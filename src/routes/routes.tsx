import { BrowserRouter as Routers, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home.tsx";
import InventoryPage from "@/pages/Inventory.tsx";

export default function Rotas() {
  return (
    <>
      <Routers>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/Produtos/:id" element={<h1>Produto</h1>} />
        </Routes>
      </Routers>
    </>
  );
}