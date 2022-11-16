import { GetApiFunc, makeEndpoint } from '../base';
import { getMe } from './getMe';
import { login } from './login';
import { loginPhone } from './loginPhone';
import { loginEmail } from './loginEmail';
import { loginConfirmPhone } from './loginConfirmPhone';
import { loginConfirmEmail } from './loginConfirmEmail';
import { loginConfirmOtp } from './loginConfirmOtp';
import { registerOtp } from './registerOtp';
import { confirmOtp } from './confirmOtp';
import { signup } from './signup';
import { googleSignup } from './googleSignup';
import { facebookSignup } from './facebookSignup';
import { githubSignup } from './githubSignup';
import { confirmRegistration } from './confirm';

export function createAuthApi(getApi: GetApiFunc) {
  return {
    getMe: makeEndpoint(getMe, getApi),
    login: makeEndpoint(login, getApi),
    loginPhone: makeEndpoint(loginPhone, getApi),
    loginEmail: makeEndpoint(loginEmail, getApi),
    loginConfirmPhone: makeEndpoint(loginConfirmPhone, getApi),
    loginConfirmEmail: makeEndpoint(loginConfirmEmail, getApi),
    loginConfirmOtp: makeEndpoint(loginConfirmOtp, getApi),
    registerOtp: makeEndpoint(registerOtp, getApi),
    confirmOtp: makeEndpoint(confirmOtp, getApi),
    signup: makeEndpoint(signup, getApi),
    googleSignup: makeEndpoint(googleSignup, getApi),
    facebookSignup: makeEndpoint(facebookSignup, getApi),
    githubSignup: makeEndpoint(githubSignup, getApi),
    confirmRegistration: makeEndpoint(confirmRegistration, getApi),
  };
}
