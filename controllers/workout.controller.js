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
    res.json({ workouts });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch workouts', error: err.message });
  }
};

export const listTimeBasedWorkouts = async (req, res) => {
  try {
    let { customerId } = req.params;
    let { time } = req.query; 
    let workouts = await repo.fetch(customerId);
    let timeBased = workouts.filter(w => w.distance == null)
    if (time) {
      timeBased = timeBased.filter(w => w.time === time);
    }
    res.json({ workouts: timeBased });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch time-based workouts', error: err.message });
  }
};