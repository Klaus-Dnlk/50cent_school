import { Route, Routes } from 'react-router-dom';

import { LoginPage } from './Login.page';
import { LoginScreen } from './LoginScreen';
import { LoginConfirmType } from './LoginConfirmType';
import { LoginConfirmScreen } from './LoginConfirmScreen';
import { RegistrationScreen } from './RegistrationScreen';
import { OtpRegistrationScreen } from './OtpRegistrationScreen';
import { OtpConfirmScreen } from './OtpConfirmScreen';

export function LoginRoutes() {
  return (
    <Routes>
      <Route path="" element={<LoginPage />}>
        <Route index element={<LoginScreen />} />
        <Route path="registration">
          <Route index element={<RegistrationScreen />} />
        </Route>
        <Route path="confirmType">
          <Route index element={<LoginConfirmType />} />
        </Route>
        <Route path="confirm">
          <Route index element={<LoginConfirmScreen />} />
        </Route>
        <Route path="registration/otp">
          <Route index element={<OtpRegistrationScreen />} />
        </Route>
        <Route path="registration/otp/confirm">
          <Route index element={<OtpConfirmScreen />} />
        </Route>
      </Route>
    </Routes>
  );
}
