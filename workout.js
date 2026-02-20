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

  get score() {
    const typeFactors = {
      yoga: 2,
      'strength-training': 3,
      walking: 2,
      cycling: 4,
      running: 6
    };

    const factor = typeFactors[this.type];
    if (!factor) return 0;

    // Timebased
    if (this.distance == null) {
      return factor * this.duration;
    }

    // Distancebased
    const speed = this.averageSpeed; 
    return factor * speed;
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