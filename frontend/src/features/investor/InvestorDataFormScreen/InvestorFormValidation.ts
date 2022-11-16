import * as yup from 'yup';

export const investorDataFormValidationSchema = yup.object().shape({
  name: yup.string().required("Будь ласка, введіть ім'я"),
  surname: yup.string().required('Будь ласка, введіть прізвище'),
  middleName: yup.string().required('Будь ласка, введіть по батькові'),
  idFile: yup.mixed().required(),
  photo: yup.mixed().required(),
});
