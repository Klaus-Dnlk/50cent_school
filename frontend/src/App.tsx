import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import styled, { createGlobalStyle } from 'styled-components';
import { AppRoutes } from './routing';
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
  return (
    <GoogleOAuthProvider clientId={Config.GOOGLE_CLIENT_ID}>
      <RecoilRoot>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <AppStyled>
              <GlobalStyle />
              <AppRoutes />
            </AppStyled>
          </QueryClientProvider>
        </BrowserRouter>
      </RecoilRoot>
    </GoogleOAuthProvider>
  );
}

export default App;
