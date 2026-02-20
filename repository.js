import fs from 'fs/promises';
import { config } from './config.js';

const FILENAME = 'workouts.json';

export class WorkoutRepository {
  constructor(filename = FILENAME) {
    this.filename = filename;
  }

  async _readFile() {
    try {
      const data = await fs.readFile(this.filename, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') return []; // File doesn't exist yet
      throw error; // Unexpected error, propagate
    }
  }

  async _writeFile(workouts) {
    await fs.writeFile(this.filename, JSON.stringify(workouts, null, 2));
  }

  async save(workout) {
    const workouts = await this._readFile();
    workouts.push(workout);
    await this._writeFile(workouts);
  }

  async fetch(customerId) {
    const workouts = await this._readFile();
    return workouts.filter(w => w.customerId === customerId);
  }
}