import { Navigate, Route, Routes } from 'react-router-dom';
import { InvestorPage } from './Investor.page';
import { InvestorDataFormScreen } from './InvestorDataFormScreen/InvestorDataFormScreen.component';
import { InvestorScreen } from './InvestorScreen';

export function InvestorRoutes() {
  return (
    <Routes>
      <Route path="" element={<InvestorPage />}>
        <Route index element={<InvestorScreen />} />
        <Route path="registration" element={<InvestorDataFormScreen />} />
        <Route path="*" element={<Navigate to="obtain" replace />} />
      </Route>
    </Routes>
  );
}
