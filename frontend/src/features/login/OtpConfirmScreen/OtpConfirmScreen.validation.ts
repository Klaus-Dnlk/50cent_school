import * as yup from 'yup';

export const OtpConfirmValidationSchema = yup
  .object()
  .required()
  .shape({
    code: yup.number().required('Just show us, that this email is yours ;)'),
  });
