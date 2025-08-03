import { Route, Routes } from 'react-router-dom';

import { CreditPage } from './Credit.page';
import { CreditScreen } from './CreditScreen';
import { CreditScreenWithOffline } from './CreditScreen/CreditScreenWithOffline.component';
import { IndexedDBDemo } from '@/components/IndexedDBDemo';

export function CreditRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CreditPage />}>
        <Route index element={<CreditScreen />} />
        <Route path="offline" element={<CreditScreenWithOffline />} />
        <Route path="demo" element={<IndexedDBDemo />} />
      </Route>
    </Routes>
  );
}
