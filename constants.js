export const DISTANCE_BASED_TYPES = Object.freeze(['walking', 'cycling', 'running']);
export const TIME_BASED_TYPES     = Object.freeze(['yoga', 'strength-training']);

export const WORKOUT_CATEGORY = Object.freeze({
    DISTANCE: 'distance',
    TIME:     'time',
});

export const DATE_FORMAT = 'yyyy-MM-dd';
export const TIME_FORMAT = 'HH:mm';

// Multipliers used in score calculations — one place to update if factors change
export const TYPE_FACTORS = Object.freeze({
    walking:             2,
    cycling:             4,
    running:             6,
    yoga:                2,
    'strength-training': 3,
});
