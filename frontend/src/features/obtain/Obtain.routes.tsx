import { Route, Routes } from 'react-router-dom';
import { ObtainPage } from './Obtain.page';
import { ObtainScreen } from './ObtainScreen';

export function ObtainRoutes() {
  return (
    <Routes>
      <Route path="" element={<ObtainPage />}>
        <Route index element={<ObtainScreen />} />
      </Route>
    </Routes>
  );
}
