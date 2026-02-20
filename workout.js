export class Workout {
  constructor(customerId, type, date, time, duration, distance = null) {
    this.customerId = customerId;
    this.type = type;
    this.date = date;     // YYYY-MM-DD
    this.time = time;     // HH:MM
    this.duration = duration; // minutes
    this.distance = distance; 
  }

  get averageSpeed() {
    if (!this.distance || !this.duration) return 0;
    return this.distance / this.duration;
  }

  static fromJSON(json) {
    return new Workout(
      json.customerId,
      json.type,
      json.date,
      json.time,
      json.duration,
      json.distance ?? null
    );
  }
}