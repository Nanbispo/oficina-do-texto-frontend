import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { ArtigosCriadora } from "./pages/ArtigosCriadora";
import { NovoArtigo } from "./pages/NovoArtigo";
import { Home } from "./pages/Home";
import { RequireAuth } from "./components/RequireAuth";
import { Artigo } from "./pages/Artigo";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Pública (A Home agora tem apenas a barra "/") */}
        <Route path="/" element={<Home />} />
        <Route path="/artigo/:id" element={<Artigo />} />

        {/* O Login agora tem a rota "/login" */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rota Privada */}
        <Route element={<RequireAuth />}>
          <Route path="/ArtigosCriadora" element={<ArtigosCriadora />} />
          <Route path="/novo-artigo" element={<NovoArtigo />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
