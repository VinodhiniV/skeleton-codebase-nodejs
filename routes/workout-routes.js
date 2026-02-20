import express from 'express';
import { recordWorkout, listWorkouts, listTimeBasedWorkouts } from '../controllers/workout.controller.js';

const router = express.Router();


router.get('/workouts/:customerId/time', listTimeBasedWorkouts);

router.post('/workouts', recordWorkout);               // Record workout
router.get('/workouts/:customerId', listWorkouts);     // List workouts

export default router;