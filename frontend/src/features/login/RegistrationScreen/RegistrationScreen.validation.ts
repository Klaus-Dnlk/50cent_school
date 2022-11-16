import * as yup from 'yup';
import 'yup-phone';

export const RegistrationFormValidationSchema = yup
  .object()
  .required()
  .shape({
    email: yup
      .string()
      .email("it's not even an email, dude! ")
      .required('how, you suppose, we can register you without email?!'),
    password: yup
      .string()
      .min(
        8,
        'even my cat could create more protected password... Use, at least, 8 characters',
      )
      .required('you need a password in this cruel world'),
    phone: yup.string().phone().required(),
  });
