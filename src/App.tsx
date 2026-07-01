import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { ArtigosCriadora } from "./pages/ArtigosCriadora";
import { Home } from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Pública (A Home agora tem apenas a barra "/") */}
        <Route path="/" element={<Home />} />

        {/* O Login agora tem a rota "/login" */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rota Privada */}
        <Route path="/ArtigosCriadora" element={<ArtigosCriadora />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;