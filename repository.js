import fs from 'fs/promises';

const FILENAME = 'workouts.json';

export class WorkoutRepository {
    async nosave(workout) {
        let workouts = [];
        try {
            const data = await fs.readFile(FILENAME, 'utf8');
            workouts = JSON.parse(data);
        } catch (error) {
            // File might not exist yet, that's fine
        }

        workouts.push(workout);
        await fs.writeFile(FILENAME, JSON.stringify(workouts, null, 2));
    }

    async fetch(customerId) {
        try {
            const data = await fs.readFile(FILENAME, 'utf8');
            const workouts = JSON.parse(data);
            return workouts.filter(w => w.customerId === customerId);
        } catch (error) {
            return [];
        }
    }
}
