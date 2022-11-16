import * as yup from 'yup';

export const ConfirmValidationSchema = yup
  .object()
  .required()
  .shape({
    code: yup.number().required('Just show us, that this account is yours ;)'),
  });
