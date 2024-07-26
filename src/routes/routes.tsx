import { BrowserRouter as Routers, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home.tsx";

export default function Rotas() {
  return (
    <>
      <Routers>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Produtos" element={<h1>Produtos</h1>} />
          <Route path="/Produtos/:id" element={<h1>Produto</h1>} />
        </Routes>
      </Routers>
    </>
  );
}
