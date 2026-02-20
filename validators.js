import { parse, isValid } from 'date-fns';
import { DATE_FORMAT, TIME_FORMAT } from './constants.js';

export const validateDate = input => {
    const parsed = parse(input, DATE_FORMAT, new Date());
    return isValid(parsed) ? true : `Invalid date format! Use ${DATE_FORMAT.toUpperCase()}`;
};

export const validateTime = input => {
    const parsed = parse(input, TIME_FORMAT, new Date());
    return isValid(parsed) ? true : `Invalid time format! Use ${TIME_FORMAT.toUpperCase()}`;
};

export const validatePositiveNumber = input =>
    !isNaN(input) && parseInt(input, 10) > 0 ? true : 'Must be a positive number';

export const validateNotEmpty = input =>
    input.trim() !== '' ? true : 'This field is required';
