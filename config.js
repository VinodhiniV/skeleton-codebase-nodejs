export const config = {
    dataFile: process.env.WORKOUT_DATA_FILE || 'workouts.json',
    backupEnabled: process.env.BACKUP_ENABLED !== 'false',
    
    maxCustomerIdLength: 50,
    maxDuration: 1440, // 24 hours in minutes
    maxDistance: 1000000, // 1000 km in metres
    minDuration: 1,
    minDistance: 1,
    
    distanceBasedWorkouts: ['walking', 'cycling', 'running'],
    
    menuOptions: {
        RECORD_WORKOUT: '1',
        LIST_WORKOUTS: '2',
        EXIT: '3'
    },
    
    workoutChoices: [
        { name: 'Walking (distance-based)', value: 'walking' },
        { name: 'Cycling (distance-based)', value: 'cycling' },
        { name: 'Running (distance-based)', value: 'running' },
        { name: 'Yoga (time-based)', value: 'yoga' },
        { name: 'Exercise (time-based)', value: 'exercise' },
        { name: 'Strength Training (time-based)', value: 'strength training' },
        { name: 'Meditation (time-based)', value: 'meditation' },
        { name: 'Stretching (time-based)', value: 'stretching' }
    ],
    
    timeBasedWorkouts: ['yoga', 'strength training'],
    
    // Scoring factors for workouts
    typeFactors: {
        // Time-based workouts
        'yoga': 2,
        'strength training': 3,
        // Distance-based workouts
        'walking': 2,
        'cycling': 4,
        'running': 6
    },
    
    get validWorkoutTypes() {
        return [...this.distanceBasedWorkouts, ...this.timeBasedWorkouts];
    },
    
    requiresDistance(type) {
        return this.distanceBasedWorkouts.includes(type.toLowerCase());
    },
    
    getTypeFactor(type) {
        return this.typeFactors[type.toLowerCase()] || 1;
    },
    
    // Date/Time formats
    dateFormat: 'yyyy-MM-dd',
    timeFormat: 'HH:mm',
};
