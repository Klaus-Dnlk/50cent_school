import { Route, Routes } from 'react-router-dom';

import { CreditPage } from './Credit.page';
import { CreditScreen } from './CreditScreen';

export function CreditRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CreditPage />}>
        <Route index element={<CreditScreen />} />
      </Route>
    </Routes>
  );
}
