import fs from 'fs/promises';

const FILE_PATH = 'workouts.json';

export class WorkoutRepository {
    constructor(filePath = FILE_PATH) {
        this.filePath = filePath;
    }

    // --- Private helpers ---

    async #readAll() {
        try {
            const data = await fs.readFile(this.filePath, 'utf8');
            return JSON.parse(data);
        } catch {
            return [];  // file doesn't exist yet — treat as empty
        }
    }

    async #writeAll(workouts) {
        await fs.writeFile(this.filePath, JSON.stringify(workouts, null, 2));
    }

    // --- Public API ---

    async save(workout) {
        const workouts = await this.#readAll();
        workouts.push(workout);
        await this.#writeAll(workouts);
    }

    async fetch(customerId) {
        const workouts = await this.#readAll();
        return workouts.filter(w => w.customerId === customerId);
    }
}
