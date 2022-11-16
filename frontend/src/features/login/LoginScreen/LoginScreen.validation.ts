import * as yup from 'yup';

export const LoginFormValidationSchema = yup
  .object()
  .required()
  .shape({
    email: yup
      .string()
      .email("it's not an email, dude! ")
      .required('how, you suppose, we can let you in without email?!'),
    password: yup
      .string()
      .min(8, "it's not your password! Who are you?")
      .required('prove that this acoount is yours! Enter the password'),
  });
