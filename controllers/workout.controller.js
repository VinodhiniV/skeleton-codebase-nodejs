import { Workout } from '../workout.js';
import { WorkoutRepository } from '../repository.js';

const repo = new WorkoutRepository();

export const recordWorkout = async (req, res) => {
  try {
    const { customerId, type, date, time, duration, distance } = req.body;

    if (!customerId || !type || !date || !time || !duration) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const workout = new Workout(
      customerId,
      type,
      date,
      time,
      Number(duration),
      distance ? Number(distance) : null
    );

    await repo.save(workout);
    res.status(201).json({ message: 'Workout recorded', workout });
  } catch (err) {
    res.status(500).json({ message: 'Failed to record workout', error: err.message });
  }
};

export const listWorkouts = async (req, res) => {
  try {
    const { customerId } = req.params;

    if (!customerId) {
      return res.status(400).json({ message: 'customerId is required' });
    }

    const workouts = await repo.fetch(customerId);

    // ✅ Attach score
    const withScore = workouts.map(w => {
      const workout = Workout.fromJSON(w);
      return { ...w, score: workout.score };
    });

    res.json({ workouts: withScore });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch workouts', error: err.message });
  }
};

export const listTimeBasedWorkouts = async (req, res) => {
  try {
    const { customerId } = req.params;

    if (!customerId) {
      return res.status(400).json({ message: 'customerId is required' });
    }

    const workouts = await repo.fetch(customerId);

    const timeBased = workouts.filter(w => w.distance == null);
    const distanceBased = workouts.filter(w => w.distance != null);

    const timeBasedWithScore = timeBased.map(w => {
      const workout = Workout.fromJSON(w);
      return { ...w, score: workout.score };
    });

    const distanceBasedWithScore = distanceBased.map(w => {
      const workout = Workout.fromJSON(w);
      return { ...w, score: workout.score };
    });

    res.json({
      timebasedWorkouts: timeBasedWithScore,
      distancebasedWorkouts: distanceBasedWithScore
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch workouts', error: err.message });
  }
};