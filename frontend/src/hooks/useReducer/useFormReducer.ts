import { useReducer, useCallback } from 'react';

// Form state interface
interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

// Form actions
type FormAction<T> =
  | { type: 'SET_FIELD'; field: keyof T; value: any }
  | { type: 'SET_ERROR'; field: keyof T; error: string }
  | { type: 'SET_TOUCHED'; field: keyof T; touched: boolean }
  | { type: 'SET_SUBMITTING'; isSubmitting: boolean }
  | { type: 'SET_VALID'; isValid: boolean }
  | { type: 'RESET'; initialValues: T }
  | { type: 'SET_VALUES'; values: Partial<T> };

// Form reducer
function formReducer<T>(state: FormState<T>, action: FormAction<T>): FormState<T> {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        values: {
          ...state.values,
          [action.field]: action.value,
        },
        isDirty: true,
      };

    case 'SET_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.field]: action.error,
        },
      };

    case 'SET_TOUCHED':
      return {
        ...state,
        touched: {
          ...state.touched,
          [action.field]: action.touched,
        },
      };

    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.isSubmitting,
      };

    case 'SET_VALID':
      return {
        ...state,
        isValid: action.isValid,
      };

    case 'RESET':
      return {
        values: action.initialValues,
        errors: {},
        touched: {},
        isSubmitting: false,
        isValid: false,
        isDirty: false,
      };

    case 'SET_VALUES':
      return {
        ...state,
        values: {
          ...state.values,
          ...action.values,
        },
        isDirty: true,
      };

    default:
      return state;
  }
}

// Custom hook for form state management
export function useFormReducer<T extends Record<string, any>>(
  initialValues: T,
  validationSchema?: (values: T) => Partial<Record<keyof T, string>>
) {
  const initialState: FormState<T> = {
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
    isValid: false,
    isDirty: false,
  };

  const [state, dispatch] = useReducer(formReducer<T>, initialState);

  // Set field value
  const setFieldValue = useCallback((field: keyof T, value: any) => {
    dispatch({ type: 'SET_FIELD', field, value });
  }, []);

  // Set field error
  const setFieldError = useCallback((field: keyof T, error: string) => {
    dispatch({ type: 'SET_ERROR', field, error });
  }, []);

  // Set field touched
  const setFieldTouched = useCallback((field: keyof T, touched: boolean = true) => {
    dispatch({ type: 'SET_TOUCHED', field, touched });
  }, []);

  // Set submitting state
  const setSubmitting = useCallback((isSubmitting: boolean) => {
    dispatch({ type: 'SET_SUBMITTING', isSubmitting });
  }, []);

  // Validate form
  const validateForm = useCallback(() => {
    if (!validationSchema) return true;
    
    const errors = validationSchema(state.values);
    const hasErrors = Object.keys(errors).length > 0;
    
    // Update errors
    Object.entries(errors).forEach(([field, error]) => {
      dispatch({ type: 'SET_ERROR', field: field as keyof T, error });
    });
    
    dispatch({ type: 'SET_VALID', isValid: !hasErrors });
    return !hasErrors;
  }, [state.values, validationSchema]);

  // Reset form
  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET', initialValues });
  }, [initialValues]);

  // Set multiple values
  const setValues = useCallback((values: Partial<T>) => {
    dispatch({ type: 'SET_VALUES', values });
  }, []);

  // Handle field change
  const handleChange = useCallback((field: keyof T) => (value: any) => {
    setFieldValue(field, value);
    setFieldTouched(field, true);
  }, [setFieldValue, setFieldTouched]);

  // Handle field blur
  const handleBlur = useCallback((field: keyof T) => () => {
    setFieldTouched(field, true);
    if (validationSchema) {
      const errors = validationSchema(state.values);
      if (errors[field]) {
        setFieldError(field, errors[field]!);
      }
    }
  }, [setFieldTouched, validationSchema, state.values, setFieldError]);

  return {
    // State
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    isSubmitting: state.isSubmitting,
    isValid: state.isValid,
    isDirty: state.isDirty,
    
    // Actions
    setFieldValue,
    setFieldError,
    setFieldTouched,
    setSubmitting,
    validateForm,
    resetForm,
    setValues,
    handleChange,
    handleBlur,
  };
} 