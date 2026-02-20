import { DISTANCE_BASED_TYPES, WORKOUT_CATEGORY, TYPE_FACTORS } from './constants.js';

// Base class — fields shared by every workout type
export class Workout {
    constructor(customerId, type, date, time, duration) {
        this.customerId = customerId;
        this.type = type;
        this.date = date;         // YYYY-MM-DD
        this.time = time;         // HH:MM
        this.duration = duration; // minutes
    }

    // Factory — maps a raw JSON object back to the correct subclass
    static fromJSON({ customerId, type, date, time, duration, distance }) {
        if (DISTANCE_BASED_TYPES.includes(type)) {
            return new DistanceWorkout(customerId, type, date, time, duration, distance);
        }
        return new TimeBasedWorkout(customerId, type, date, time, duration);
    }
}

// Distance-based workout (walking, cycling, running) — tracks distance and average speed
export class DistanceWorkout extends Workout {
    constructor(customerId, type, date, time, duration, distance) {
        super(customerId, type, date, time, duration);
        this.distance = distance; // metres
    }

    get category() { return WORKOUT_CATEGORY.DISTANCE; }

    get averageSpeed() {
        if (this.duration === 0) return 0;
        return this.distance / this.duration;
    }

    // score = type factor × average speed (distance ÷ duration)
    get score() {
        return TYPE_FACTORS[this.type] * this.averageSpeed;
    }
}

// Time-based workout (yoga, strength-training) — duration is the only metric
export class TimeBasedWorkout extends Workout {
    get category() { return WORKOUT_CATEGORY.TIME; }

    // score = type factor × duration
    get score() {
        return TYPE_FACTORS[this.type] * this.duration;
    }
}
