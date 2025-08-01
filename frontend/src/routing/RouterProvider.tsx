import { BrowserRouter, HashRouter } from 'react-router-dom';
import { ReactNode } from 'react';

interface RouterProviderProps {
  children: ReactNode;
  useHashRouter?: boolean;
}

export const RouterProvider = ({ children, useHashRouter = false }: RouterProviderProps) => {
  if (useHashRouter) {
    return <HashRouter>{children}</HashRouter>;
  }
  
  return <BrowserRouter>{children}</BrowserRouter>;
}; 