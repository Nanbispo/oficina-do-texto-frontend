import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import type { JSX } from "react/jsx-runtime";
import { ArtigosCriadora } from "./pages/ArtigosCriadora";





function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Pública (Qualquer um acessa) */}
        <Route path="/" element={<LoginPage />} />

        {/* Rota Privada (Só passa quem tem token) */}
        <Route path="/dashboard" element={<ArtigosCriadora />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
