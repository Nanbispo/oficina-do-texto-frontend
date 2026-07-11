import { type ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

type RequireAuthProps = {
  children?: ReactNode;
};

export function RequireAuth({ children }: RequireAuthProps) {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('@App:token');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children ?? <Outlet />;
}
