import { parse, isValid } from 'date-fns';

// INFO :: there is more scope to add other validations
export const validateCustomerId = input => {
  if (!input || input.trim() === '') return 'Customer ID is required';
  return true;
};

export const validateWorkoutType = (input, validTypes) => {
  if (!input || input.trim() === '') return 'Workout type is required';
  if (!validTypes.includes(input.toLowerCase().trim())) {
    return `Invalid workout type. Must be one of: ${validTypes.join(', ')}`;
  }
  return true;
};

export const validateDate = input => {
  const parsedDate = parse(input, 'yyyy-MM-dd', new Date());
  return isValid(parsedDate) ? true : 'Invalid date format! Use YYYY-MM-DD';
};

export const validateTime = input => {
  const parsedTime = parse(input, 'HH:mm', new Date());
  return isValid(parsedTime) ? true : 'Invalid time format! Use HH:MM';
};

export const validatePositiveNumber = input => {
  return !isNaN(input) && parseInt(input) > 0 ? true : 'Must be a positive number!';
};

export const capitalize = str =>
  str.charAt(0).toUpperCase() + str.slice(1);