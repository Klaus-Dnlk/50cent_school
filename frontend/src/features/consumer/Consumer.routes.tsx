import { Route, Routes } from 'react-router-dom';

import { ConsumerPage } from './Consumer.page';
import { CreateScreen } from '../consumer/CreateScreen/CreateScreen.component';

export function ConsumerRoutes() {
  return (
    <Routes>
      <Route path="" element={<ConsumerPage />}>
        <Route index element={<CreateScreen />} />
      </Route>
    </Routes>
  );
}
