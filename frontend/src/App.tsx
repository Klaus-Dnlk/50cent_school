import { QueryClient, QueryClientProvider } from 'react-query';
import { RecoilRoot } from 'recoil';
import styled, { createGlobalStyle } from 'styled-components';
import { AppRoutes, RouterProvider } from './routing';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Config } from './config';

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: Gilroy, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

export const AppStyled = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: auto;
`;

function App() {
  // You can configure this based on your deployment environment
  // For example, use HashRouter for static hosting or when server doesn't support HTML5 History API
  const useHashRouter = process.env.REACT_APP_USE_HASH_ROUTER === 'true';

  return (
    <GoogleOAuthProvider clientId={Config.GOOGLE_CLIENT_ID}>
      <RecoilRoot>
        <RouterProvider useHashRouter={useHashRouter}>
          <QueryClientProvider client={queryClient}>
            <AppStyled>
              <GlobalStyle />
              <AppRoutes />
            </AppStyled>
          </QueryClientProvider>
        </RouterProvider>
      </RecoilRoot>
    </GoogleOAuthProvider>
  );
}

export default App;
