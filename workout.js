import { config } from './config.js';

export class Workout {
    constructor(customerId, type, date, time, duration, distance = null) {
        this.customerId = customerId;
        this.type = type;
        this.date = date; // YYYY-MM-DD
        this.time = time; // HH:MM
        this.duration = duration; // minutes
        this.distance = distance; // metres
    }

    get isDistanceBased() {
        return config.requiresDistance(this.type);
    }

    get isTimeBased() {
        return !this.isDistanceBased;
    }

    get averageSpeed() {
        if (!this.isDistanceBased || this.duration === 0 || this.distance === null) {
            return null;
        }
        return this.distance / this.duration;
    }

    get score() {
        const typeFactor = config.getTypeFactor(this.type);
        
        if (this.isTimeBased) {
            // Time-based: Type factor * time spent
            return typeFactor * this.duration;
        } else {
            // Distance-based: Type factor * (distance covered / time spent)
            if (this.duration === 0 || this.distance === null) {
                return 0;
            }
            return typeFactor * (this.distance / this.duration);
        }
    }

    static fromJSON(json) {
        return new Workout(
            json.customerId,
            json.type,
            json.date,
            json.time,
            json.duration,
            json.distance
        );
    }
}
