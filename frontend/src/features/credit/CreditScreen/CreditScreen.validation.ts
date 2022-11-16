import * as yup from 'yup';

export const CreditFormValidationSchema = yup
  .object()
  .required()
  .shape({
    creditSum: yup
      .number()
      .positive('Credit sum must be a positive value')
      .required('How can we create a credit without the amount of money?'),
    creditTitle: yup
      .string()
      .max(100, 'Credit title must be shorter')
      .required('How can we create a credit without the title?'),
    creditDesc: yup
      .string()
      .max(1000, 'Make your description shorter')
      .required('How can we create a credit without the description?'),
    creditTerm: yup
      .number()
      .integer()
      .positive()
      .max(240, "You can't create a credit for more than 20 years")
      .required('How can we create a credit without the term?'),
    creditRate: yup
      .number()
      .positive()
      .max(100, "We can't have more than 100%")
      .required('How can we create a credit without the rate?'),
  });
