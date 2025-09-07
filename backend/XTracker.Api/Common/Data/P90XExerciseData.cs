using XTracker.Api.Features.Workouts.Models;
using XTracker.Api.Features.Workouts.Models.Enums;

namespace XTracker.Api.Common.Data;

public static class P90XExerciseData
{
    public static List<Exercise> GetP90XExercises()
    {
        return new List<Exercise>
        {
            // Chest & Back Exercises
            new Exercise
            {
                Name = "Standard Push-Ups",
                Description = "Classic push-up exercise",
                Category = ExerciseCategory.Resistance,
                Difficulty = DifficultyLevel.Beginner,
                PrimaryMuscleGroups = MuscleGroup.Chest | MuscleGroup.Triceps,
                SecondaryMuscleGroups = MuscleGroup.Shoulders | MuscleGroup.Abs,
                Equipment = "None",
                DefaultRepsMin = 8,
                DefaultRepsMax = 15,
                DefaultSets = 3,
                IsWeightTracked = false
            },
            new Exercise
            {
                Name = "Wide Front Pull-Ups",
                Description = "Pull-ups with wide grip",
                Category = ExerciseCategory.Resistance,
                Difficulty = DifficultyLevel.Intermediate,
                PrimaryMuscleGroups = MuscleGroup.Back | MuscleGroup.Biceps,
                SecondaryMuscleGroups = MuscleGroup.Shoulders,
                Equipment = "Pull-up bar",
                DefaultRepsMin = 5,
                DefaultRepsMax = 12,
                DefaultSets = 3,
                IsWeightTracked = false
            },
            new Exercise
            {
                Name = "Military Push-Ups",
                Description = "Push-ups with hands close to body",
                Category = ExerciseCategory.Resistance,
                Difficulty = DifficultyLevel.Intermediate,
                PrimaryMuscleGroups = MuscleGroup.Triceps | MuscleGroup.Chest,
                SecondaryMuscleGroups = MuscleGroup.Shoulders,
                Equipment = "None",
                DefaultRepsMin = 6,
                DefaultRepsMax = 12,
                DefaultSets = 3,
                IsWeightTracked = false
            },
            new Exercise
            {
                Name = "Reverse Grip Chin-Ups",
                Description = "Chin-ups with underhand grip",
                Category = ExerciseCategory.Resistance,
                Difficulty = DifficultyLevel.Intermediate,
                PrimaryMuscleGroups = MuscleGroup.Biceps | MuscleGroup.Back,
                SecondaryMuscleGroups = MuscleGroup.Shoulders,
                Equipment = "Pull-up bar",
                DefaultRepsMin = 5,
                DefaultRepsMax = 10,
                DefaultSets = 3,
                IsWeightTracked = false
            },
            new Exercise
            {
                Name = "Wide Fly Push-Ups",
                Description = "Push-ups with wide hand position",
                Category = ExerciseCategory.Resistance,
                Difficulty = DifficultyLevel.Beginner,
                PrimaryMuscleGroups = MuscleGroup.Chest | MuscleGroup.Shoulders,
                SecondaryMuscleGroups = MuscleGroup.Triceps,
                Equipment = "None",
                DefaultRepsMin = 8,
                DefaultRepsMax = 15,
                DefaultSets = 3,
                IsWeightTracked = false
            },
            new Exercise
            {
                Name = "Closed Grip Overhand Pull-Ups",
                Description = "Pull-ups with narrow overhand grip",
                Category = ExerciseCategory.Resistance,
                Difficulty = DifficultyLevel.Advanced,
                PrimaryMuscleGroups = MuscleGroup.Back | MuscleGroup.Biceps,
                SecondaryMuscleGroups = MuscleGroup.Shoulders,
                Equipment = "Pull-up bar",
                DefaultRepsMin = 3,
                DefaultRepsMax = 8,
                DefaultSets = 3,
                IsWeightTracked = false
            },
            new Exercise
            {
                Name = "Decline Push-Ups",
                Description = "Push-ups with feet elevated",
                Category = ExerciseCategory.Resistance,
                Difficulty = DifficultyLevel.Intermediate,
                PrimaryMuscleGroups = MuscleGroup.Chest | MuscleGroup.Triceps,
                SecondaryMuscleGroups = MuscleGroup.Shoulders,
                Equipment = "Bench or step",
                DefaultRepsMin = 6,
                DefaultRepsMax = 12,
                DefaultSets = 3,
                IsWeightTracked = false
            },
            new Exercise
            {
                Name = "Heavy Pants",
                Description = "Dumbbell rows",
                Category = ExerciseCategory.Resistance,
                Difficulty = DifficultyLevel.Beginner,
                PrimaryMuscleGroups = MuscleGroup.Back | MuscleGroup.Biceps,
                SecondaryMuscleGroups = MuscleGroup.Shoulders,
                Equipment = "Dumbbells",
                DefaultRepsMin = 8,
                DefaultRepsMax = 12,
                DefaultSets = 3,
                IsWeightTracked = true
            },
            new Exercise
            {
                Name = "Diamond Push-Ups",
                Description = "Push-ups with diamond hand position",
                Category = ExerciseCategory.Resistance,
                Difficulty = DifficultyLevel.Intermediate,
                PrimaryMuscleGroups = MuscleGroup.Triceps | MuscleGroup.Chest,
                SecondaryMuscleGroups = MuscleGroup.Shoulders,
                Equipment = "None",
                DefaultRepsMin = 5,
                DefaultRepsMax = 12,
                DefaultSets = 3,
                IsWeightTracked = false
            },
            new Exercise
            {
                Name = "Lawnmowers",
                Description = "Single-arm dumbbell rows",
                Category = ExerciseCategory.Resistance,
                Difficulty = DifficultyLevel.Beginner,
                PrimaryMuscleGroups = MuscleGroup.Back | MuscleGroup.Biceps,
                SecondaryMuscleGroups = MuscleGroup.Shoulders,
                Equipment = "Dumbbells",
                DefaultRepsMin = 8,
                DefaultRepsMax = 12,
                DefaultSets = 3,
                IsWeightTracked = true
            },
            new Exercise
            {
                Name = "Dive-Bomber Push-Ups",
                Description = "Dynamic push-up variation with arching motion",
                Category = ExerciseCategory.Resistance,
                Difficulty = DifficultyLevel.Advanced,
                PrimaryMuscleGroups = MuscleGroup.Chest | MuscleGroup.Shoulders | MuscleGroup.Triceps,
                SecondaryMuscleGroups = MuscleGroup.Abs,
                Equipment = "None",
                DefaultRepsMin = 5,
                DefaultRepsMax = 10,
                DefaultSets = 3,
                IsWeightTracked = false
            },
            new Exercise
            {
                Name = "Back Flys",
                Description = "Rear deltoid flys with dumbbells",
                Category = ExerciseCategory.Resistance,
                Difficulty = DifficultyLevel.Beginner,
                PrimaryMuscleGroups = MuscleGroup.Back | MuscleGroup.Shoulders,
                SecondaryMuscleGroups = MuscleGroup.Biceps,
                Equipment = "Dumbbells",
                DefaultRepsMin = 10,
                DefaultRepsMax = 15,
                DefaultSets = 3,
                IsWeightTracked = true
            }
        };
    }
}
