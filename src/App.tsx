import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import type { JSX } from "react/jsx-runtime";
import { Dashboard } from "./pages/Dashboard";


function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('@App:token');

  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Pública (Qualquer um acessa) */}
        <Route path="/" element={<LoginPage />} />

        {/* Rota Privada (Só passa quem tem token) */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
