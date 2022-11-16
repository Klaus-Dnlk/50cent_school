import * as yup from 'yup';

export const CreateFormValidationSchema = yup.object().shape({
  name: yup.string().required('required'),
  surname: yup.string().required('required'),
  middleName: yup.string().required('required'),
  photo: yup.mixed().required('required'),
  work_file: yup.mixed().required('required'),
  id_file: yup.mixed().required('required'),
  property_file: yup.mixed().required('required'),
});
