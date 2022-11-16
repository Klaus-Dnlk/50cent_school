export const routes = {
  layout: {
    absolute: () => '/',
  },
  home: {
    absolute: () => '/home',
  },
  login: {
    absolute: () => '/login',
    registration: {
      absolute: () => '/login/registration',
      relative: () => 'registration',
    },
    confirmTypes: {
      phoneAbsolute: () => '/login/confirm?type=phone',
      emailAbsolute: () => '/login/confirm?type=email',
      otpAbsolute: () => '/login/confirm?type=otp',
    },
    registrationOtp: {
      absolute: () => '/login/registration/otp',
    },
    confirmOtp: {
      absolute: () => '/login/registration/otp/confirm',
    },
  },
  investor: {
    absolute: () => '/investor',
    registration: {
      absolute: () => '/investor/registration',
      relative: () => 'registration',
    },
  },
  admin: {
    absolute: () => '/admin',
  },
  credit: {
    absolute: () => '/credit',
  },
  consumer: {
    absolute: () => '/consumer',
  },
  obtain: {
    absolute: () => '/obtain',
  },
} as const;
