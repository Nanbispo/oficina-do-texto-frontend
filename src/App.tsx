import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { ArtigosCriadora } from "./pages/ArtigosCriadora";
import { NovoArtigo } from "./pages/NovoArtigo";
import { Home } from "./pages/Home";
import { RequireAuth } from "./components/RequireAuth";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Pública (A Home agora tem apenas a barra "/") */}
        <Route path="/" element={<Home />} />

        {/* O Login agora tem a rota "/login" */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rota Privada */}
        <Route element={<RequireAuth />}>
          <Route path="/ArtigosCriadora" element={<ArtigosCriadora />} />
        </Route>
        <Route path="/novo-artigo" element={<NovoArtigo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
