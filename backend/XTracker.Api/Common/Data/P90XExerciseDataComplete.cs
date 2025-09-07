using XTracker.Api.Features.Workouts.Models;
using XTracker.Api.Features.Workouts.Models.Enums;

namespace XTracker.Api.Common.Data;

public static class P90XExerciseDataComplete
{
    public static List<Exercise> GetAllP90XExercises()
    {
        var exercises = new List<Exercise>();
        
        // Add Chest & Back exercises
        exercises.AddRange(GetChestAndBackExercises());
        
        // Add Shoulders & Arms exercises
        exercises.AddRange(GetShouldersAndArmsExercises());
        
        // Add Legs & Back exercises
        exercises.AddRange(GetLegsAndBackExercises());
        
        // Add Back & Biceps exercises
        exercises.AddRange(GetBackAndBicepsExercises());
        
        // Add Chest, Shoulders & Triceps exercises
        exercises.AddRange(GetChestShouldersTricepsExercises());
        
        // Add Plyometrics exercises
        exercises.AddRange(GetPlyometricsExercises());
        
        // Add Kenpo X exercises
        exercises.AddRange(GetKenpoXExercises());
        
        // Add Core Synergistics exercises
        exercises.AddRange(GetCoreSynergisticsExercises());
        
        // Add Cardio X exercises
        exercises.AddRange(GetCardioXExercises());
        
        return exercises;
    }

    private static List<Exercise> GetChestAndBackExercises()
    {
        return new List<Exercise>
        {
            CreateResistanceExercise("Standard Push-Ups", "Classic push-up exercise", 
                MuscleGroup.Chest | MuscleGroup.Triceps, MuscleGroup.Shoulders | MuscleGroup.Abs, 
                "None", 8, 15, 3, false),
            CreateResistanceExercise("Wide Front Pull-Ups", "Pull-ups with wide grip", 
                MuscleGroup.Back | MuscleGroup.Biceps, MuscleGroup.Shoulders, 
                "Pull-up bar", 5, 12, 3, false),
            CreateResistanceExercise("Military Push-Ups", "Push-ups with hands close to body", 
                MuscleGroup.Triceps | MuscleGroup.Chest, MuscleGroup.Shoulders, 
                "None", 6, 12, 3, false),
            CreateResistanceExercise("Reverse Grip Chin-Ups", "Chin-ups with underhand grip", 
                MuscleGroup.Biceps | MuscleGroup.Back, MuscleGroup.Shoulders, 
                "Pull-up bar", 5, 10, 3, false),
            CreateResistanceExercise("Wide Fly Push-Ups", "Push-ups with wide hand position", 
                MuscleGroup.Chest | MuscleGroup.Shoulders, MuscleGroup.Triceps, 
                "None", 8, 15, 3, false),
            CreateResistanceExercise("Closed Grip Overhand Pull-Ups", "Pull-ups with narrow overhand grip", 
                MuscleGroup.Back | MuscleGroup.Biceps, MuscleGroup.Shoulders, 
                "Pull-up bar", 3, 8, 3, false),
            CreateResistanceExercise("Decline Push-Ups", "Push-ups with feet elevated", 
                MuscleGroup.Chest | MuscleGroup.Triceps, MuscleGroup.Shoulders, 
                "Bench or step", 6, 12, 3, false),
            CreateResistanceExercise("Heavy Pants", "Dumbbell rows", 
                MuscleGroup.Back | MuscleGroup.Biceps, MuscleGroup.Shoulders, 
                "Dumbbells", 8, 12, 3, true),
            CreateResistanceExercise("Diamond Push-Ups", "Push-ups with diamond hand position", 
                MuscleGroup.Triceps | MuscleGroup.Chest, MuscleGroup.Shoulders, 
                "None", 5, 12, 3, false),
            CreateResistanceExercise("Lawnmowers", "Single-arm dumbbell rows", 
                MuscleGroup.Back | MuscleGroup.Biceps, MuscleGroup.Shoulders, 
                "Dumbbells", 8, 12, 3, true),
            CreateResistanceExercise("Dive-Bomber Push-Ups", "Dynamic push-up variation with arching motion", 
                MuscleGroup.Chest | MuscleGroup.Shoulders | MuscleGroup.Triceps, MuscleGroup.Abs, 
                "None", 5, 10, 3, false),
            CreateResistanceExercise("Back Flys", "Rear deltoid flys with dumbbells", 
                MuscleGroup.Back | MuscleGroup.Shoulders, MuscleGroup.Biceps, 
                "Dumbbells", 10, 15, 3, true),
            CreateResistanceExercise("Extra Wide Front Pull-Ups", "Pull-ups with extra wide grip", 
                MuscleGroup.Back | MuscleGroup.Biceps, MuscleGroup.Shoulders, 
                "Pull-up bar", 3, 8, 3, false),
            CreateResistanceExercise("Extra Dive-Bomber Push-Ups", "Additional dive-bomber push-ups", 
                MuscleGroup.Chest | MuscleGroup.Shoulders | MuscleGroup.Triceps, MuscleGroup.Abs, 
                "None", 3, 8, 3, false)
        };
    }

    private static List<Exercise> GetShouldersAndArmsExercises()
    {
        return new List<Exercise>
        {
            CreateResistanceExercise("Alternating Shoulder Press", "Alternating dumbbell shoulder press", 
                MuscleGroup.Shoulders, MuscleGroup.Triceps, 
                "Dumbbells", 8, 12, 3, true),
            CreateResistanceExercise("In & Out Bicep Curls", "Alternating bicep curl variation", 
                MuscleGroup.Biceps, MuscleGroup.Forearms, 
                "Dumbbells", 10, 15, 3, true),
            CreateResistanceExercise("Two-Arm Kickbacks", "Tricep kickbacks with both arms", 
                MuscleGroup.Triceps, MuscleGroup.Shoulders, 
                "Dumbbells", 10, 15, 3, true),
            CreateResistanceExercise("Deep Swimmer's Press", "Shoulder press with deep range of motion", 
                MuscleGroup.Shoulders, MuscleGroup.Triceps, 
                "Dumbbells", 8, 12, 3, true),
            CreateResistanceExercise("Full Supination Concentration Curls", "Concentration curls with full supination", 
                MuscleGroup.Biceps, MuscleGroup.Forearms, 
                "Dumbbells", 8, 12, 3, true),
            CreateResistanceExercise("Chair Dips", "Tricep dips using a chair", 
                MuscleGroup.Triceps, MuscleGroup.Shoulders, 
                "Chair", 8, 15, 3, false),
            CreateResistanceExercise("Upright Rows", "Upright rowing motion", 
                MuscleGroup.Shoulders | MuscleGroup.Biceps, MuscleGroup.Traps, 
                "Dumbbells", 10, 15, 3, true),
            CreateResistanceExercise("Static Arm Curls", "Static hold bicep curls", 
                MuscleGroup.Biceps, MuscleGroup.Forearms, 
                "Dumbbells", 8, 12, 3, true),
            CreateResistanceExercise("Flip-Grip Twist Triceps Kickbacks", "Tricep kickbacks with grip variation", 
                MuscleGroup.Triceps, MuscleGroup.Shoulders, 
                "Dumbbells", 10, 15, 3, true),
            CreateResistanceExercise("Seated Shoulder Flys", "Seated shoulder flys", 
                MuscleGroup.Shoulders, MuscleGroup.Chest, 
                "Dumbbells", 10, 15, 3, true),
            CreateResistanceExercise("Crouching Cohen Curls", "Crouching bicep curl variation", 
                MuscleGroup.Biceps, MuscleGroup.Forearms, 
                "Dumbbells", 8, 12, 3, true),
            CreateResistanceExercise("Lying-Down Triceps Extensions", "Lying tricep extensions", 
                MuscleGroup.Triceps, MuscleGroup.Chest, 
                "Dumbbells", 8, 12, 3, true),
            CreateResistanceExercise("In & Out Straight-Arm Shoulder Flys", "Straight-arm shoulder flys", 
                MuscleGroup.Shoulders, MuscleGroup.Chest, 
                "Dumbbells", 10, 15, 3, true),
            CreateResistanceExercise("Congdon Curls", "Bicep curl variation", 
                MuscleGroup.Biceps, MuscleGroup.Forearms, 
                "Dumbbells", 8, 12, 3, true),
            CreateResistanceExercise("Side Tri-Rises", "Side-lying tricep extensions", 
                MuscleGroup.Triceps, MuscleGroup.Shoulders, 
                "None", 8, 12, 3, false)
        };
    }

    private static List<Exercise> GetLegsAndBackExercises()
    {
        return new List<Exercise>
        {
            CreateResistanceExercise("Balance Lunges", "Lunges with balance challenge", 
                MuscleGroup.Quadriceps | MuscleGroup.Glutes, MuscleGroup.Calves, 
                "None", 8, 12, 3, false),
            CreateResistanceExercise("Calf-Raise Squats", "Squats with calf raises", 
                MuscleGroup.Quadriceps | MuscleGroup.Glutes | MuscleGroup.Calves, MuscleGroup.None, 
                "None", 10, 15, 3, false),
            CreateResistanceExercise("Reverse Grip Pull-Ups", "Pull-ups with reverse grip", 
                MuscleGroup.Back | MuscleGroup.Biceps, MuscleGroup.Shoulders, 
                "Pull-up bar", 5, 10, 3, false),
            CreateResistanceExercise("Super Skaters", "Lateral skating motion", 
                MuscleGroup.Glutes | MuscleGroup.Quadriceps, MuscleGroup.Calves, 
                "None", 10, 15, 3, false),
            CreateResistanceExercise("Wall Squats", "Squats against a wall", 
                MuscleGroup.Quadriceps | MuscleGroup.Glutes, MuscleGroup.Calves, 
                "Wall", 10, 20, 3, false),
            CreateResistanceExercise("Wide Front Pull-Ups", "Pull-ups with wide grip", 
                MuscleGroup.Back | MuscleGroup.Biceps, MuscleGroup.Shoulders, 
                "Pull-up bar", 5, 12, 3, false),
            CreateResistanceExercise("Step-Back Lunges", "Lunges stepping backward", 
                MuscleGroup.Quadriceps | MuscleGroup.Glutes, MuscleGroup.Calves, 
                "None", 8, 12, 3, false),
            CreateResistanceExercise("Alternating Side Lunges", "Side-to-side lunges", 
                MuscleGroup.Quadriceps | MuscleGroup.Glutes, MuscleGroup.Calves, 
                "None", 8, 12, 3, false),
            CreateResistanceExercise("Close Grip Pull-Ups", "Pull-ups with close grip", 
                MuscleGroup.Back | MuscleGroup.Biceps, MuscleGroup.Shoulders, 
                "Pull-up bar", 5, 10, 3, false),
            CreateResistanceExercise("Single-Leg Wall Squats", "Wall squats on one leg", 
                MuscleGroup.Quadriceps | MuscleGroup.Glutes, MuscleGroup.Calves, 
                "Wall", 5, 10, 3, false),
            CreateResistanceExercise("Deadlift Squats", "Squats with deadlift motion", 
                MuscleGroup.Quadriceps | MuscleGroup.Glutes | MuscleGroup.Hamstrings, MuscleGroup.Calves, 
                "None", 8, 12, 3, false),
            CreateResistanceExercise("Switch Grip Pull-Ups", "Pull-ups alternating grip", 
                MuscleGroup.Back | MuscleGroup.Biceps, MuscleGroup.Shoulders, 
                "Pull-up bar", 5, 10, 3, false)
        };
    }

    private static List<Exercise> GetBackAndBicepsExercises()
    {
        return new List<Exercise>
        {
            CreateResistanceExercise("Wide Front Pull-Ups", "Pull-ups with wide grip", 
                MuscleGroup.Back | MuscleGroup.Biceps, MuscleGroup.Shoulders, 
                "Pull-up bar", 5, 12, 3, false),
            CreateResistanceExercise("Lawn Mowers", "Single-arm dumbbell rows", 
                MuscleGroup.Back | MuscleGroup.Biceps, MuscleGroup.Shoulders, 
                "Dumbbells", 8, 12, 3, true),
            CreateResistanceExercise("Twenty-Ones", "Bicep curl variation with 21 reps", 
                MuscleGroup.Biceps, MuscleGroup.Forearms, 
                "Dumbbells", 21, 21, 3, true),
            CreateResistanceExercise("One-Arm Cross-Body Curls", "Cross-body bicep curls", 
                MuscleGroup.Biceps, MuscleGroup.Forearms, 
                "Dumbbells", 8, 12, 3, true),
            CreateResistanceExercise("Switch Grip Pull-Ups", "Pull-ups alternating grip", 
                MuscleGroup.Back | MuscleGroup.Biceps, MuscleGroup.Shoulders, 
                "Pull-up bar", 5, 10, 3, false),
            CreateResistanceExercise("Elbows-Out Lawnmowers", "Lawnmowers with elbows out", 
                MuscleGroup.Back | MuscleGroup.Biceps, MuscleGroup.Shoulders, 
                "Dumbbells", 8, 12, 3, true),
            CreateResistanceExercise("Standing Bicep Curls", "Standing bicep curls", 
                MuscleGroup.Biceps, MuscleGroup.Forearms, 
                "Dumbbells", 10, 15, 3, true),
            CreateResistanceExercise("One-Arm Concentration Curls", "Single-arm concentration curls", 
                MuscleGroup.Biceps, MuscleGroup.Forearms, 
                "Dumbbells", 8, 12, 3, true),
            CreateResistanceExercise("Corn Cob Pull-Ups", "Pull-ups with corn cob motion", 
                MuscleGroup.Back | MuscleGroup.Biceps, MuscleGroup.Shoulders, 
                "Pull-up bar", 5, 10, 3, false),
            CreateResistanceExercise("Reverse Grip Bent-Over Rows", "Bent-over rows with reverse grip", 
                MuscleGroup.Back | MuscleGroup.Biceps, MuscleGroup.Shoulders, 
                "Dumbbells", 8, 12, 3, true),
            CreateResistanceExercise("Open Arm Curls", "Bicep curls with open arm position", 
                MuscleGroup.Biceps, MuscleGroup.Forearms, 
                "Dumbbells", 8, 12, 3, true),
            CreateResistanceExercise("Static Arm Curls", "Static hold bicep curls", 
                MuscleGroup.Biceps, MuscleGroup.Forearms, 
                "Dumbbells", 8, 12, 3, true),
            CreateResistanceExercise("Towel Pull-Ups", "Pull-ups using a towel", 
                MuscleGroup.Back | MuscleGroup.Biceps, MuscleGroup.Shoulders, 
                "Towel, Pull-up bar", 3, 8, 3, false),
            CreateResistanceExercise("Congdon Locomotives", "Bicep curl locomotive motion", 
                MuscleGroup.Biceps, MuscleGroup.Forearms, 
                "Dumbbells", 8, 12, 3, true),
            CreateResistanceExercise("Crouching Cohen Curls", "Crouching bicep curl variation", 
                MuscleGroup.Biceps, MuscleGroup.Forearms, 
                "Dumbbells", 8, 12, 3, true),
            CreateResistanceExercise("One-Arm Corkscrew Curls", "Corkscrew bicep curls", 
                MuscleGroup.Biceps, MuscleGroup.Forearms, 
                "Dumbbells", 8, 12, 3, true),
            CreateResistanceExercise("Chin-Ups", "Chin-ups with underhand grip", 
                MuscleGroup.Biceps | MuscleGroup.Back, MuscleGroup.Shoulders, 
                "Pull-up bar", 5, 10, 3, false),
            CreateResistanceExercise("Seated Bent-Over Back Flys", "Seated back flys", 
                MuscleGroup.Back | MuscleGroup.Shoulders, MuscleGroup.Biceps, 
                "Dumbbells", 10, 15, 3, true),
            CreateResistanceExercise("Curl-Up/Hammer-Down Twists", "Bicep curl with hammer twist", 
                MuscleGroup.Biceps, MuscleGroup.Forearms, 
                "Dumbbells", 8, 12, 3, true),
            CreateResistanceExercise("Hammer Curls", "Hammer grip bicep curls", 
                MuscleGroup.Biceps, MuscleGroup.Forearms, 
                "Dumbbells", 8, 12, 3, true),
            CreateResistanceExercise("Max Rep Pull-Ups", "Maximum repetition pull-ups", 
                MuscleGroup.Back | MuscleGroup.Biceps, MuscleGroup.Shoulders, 
                "Pull-up bar", 1, 20, 3, false),
            CreateResistanceExercise("Superman Curls", "Superman position bicep curls", 
                MuscleGroup.Biceps, MuscleGroup.Forearms, 
                "Dumbbells", 8, 12, 3, true),
            CreateResistanceExercise("In-Out Hammer Curls", "In and out hammer curls", 
                MuscleGroup.Biceps, MuscleGroup.Forearms, 
                "Dumbbells", 8, 12, 3, true),
            CreateResistanceExercise("Strip-Set Curls", "Strip set bicep curls", 
                MuscleGroup.Biceps, MuscleGroup.Forearms, 
                "Dumbbells", 8, 12, 3, true)
        };
    }

    private static List<Exercise> GetChestShouldersTricepsExercises()
    {
        return new List<Exercise>
        {
            CreateResistanceExercise("Slow-Motion 3-in-1 Push-Ups", "Slow motion push-up variation", 
                MuscleGroup.Chest | MuscleGroup.Triceps, MuscleGroup.Shoulders, 
                "None", 5, 10, 3, false),
            CreateResistanceExercise("In & Out Shoulder Flys", "In and out shoulder flys", 
                MuscleGroup.Shoulders, MuscleGroup.Chest, 
                "Dumbbells", 10, 15, 3, true),
            CreateResistanceExercise("Chair Dips", "Tricep dips using a chair", 
                MuscleGroup.Triceps, MuscleGroup.Shoulders, 
                "Chair", 8, 15, 3, false),
            CreateResistanceExercise("Plange Push-Ups", "Plange push-up variation", 
                MuscleGroup.Chest | MuscleGroup.Triceps, MuscleGroup.Shoulders, 
                "None", 5, 10, 3, false),
            CreateResistanceExercise("Pike Presses", "Pike position shoulder presses", 
                MuscleGroup.Shoulders, MuscleGroup.Triceps, 
                "None", 8, 12, 3, false),
            CreateResistanceExercise("Side Tri-Rises", "Side-lying tricep extensions", 
                MuscleGroup.Triceps, MuscleGroup.Shoulders, 
                "None", 8, 12, 3, false),
            CreateResistanceExercise("Floor Fly Push-Ups", "Push-ups with fly motion", 
                MuscleGroup.Chest | MuscleGroup.Shoulders, MuscleGroup.Triceps, 
                "None", 5, 10, 3, false),
            CreateResistanceExercise("Scarecrows", "Scarecrow shoulder exercise", 
                MuscleGroup.Shoulders, MuscleGroup.Back, 
                "Dumbbells", 10, 15, 3, true),
            CreateResistanceExercise("Overhead Triceps Extensions", "Overhead tricep extensions", 
                MuscleGroup.Triceps, MuscleGroup.Shoulders, 
                "Dumbbells", 8, 12, 3, true),
            CreateResistanceExercise("Two-Twitch Speed Push-Ups", "Fast twitch push-ups", 
                MuscleGroup.Chest | MuscleGroup.Triceps, MuscleGroup.Shoulders, 
                "None", 8, 15, 3, false),
            CreateResistanceExercise("Y-Presses", "Y-pattern shoulder presses", 
                MuscleGroup.Shoulders, MuscleGroup.Triceps, 
                "Dumbbells", 8, 12, 3, true),
            CreateResistanceExercise("Lying Triceps Extensions", "Lying tricep extensions", 
                MuscleGroup.Triceps, MuscleGroup.Chest, 
                "Dumbbells", 8, 12, 3, true),
            CreateResistanceExercise("Side-to-Side Push-Ups", "Side-to-side push-ups", 
                MuscleGroup.Chest | MuscleGroup.Triceps, MuscleGroup.Shoulders, 
                "None", 5, 10, 3, false),
            CreateResistanceExercise("Pour Flys", "Pour fly shoulder exercise", 
                MuscleGroup.Shoulders, MuscleGroup.Chest, 
                "Dumbbells", 10, 15, 3, true),
            CreateResistanceExercise("Side-Leaning Triceps Extensions", "Side-leaning tricep extensions", 
                MuscleGroup.Triceps, MuscleGroup.Shoulders, 
                "Dumbbells", 8, 12, 3, true),
            CreateResistanceExercise("One-Arm Push-Ups", "Single-arm push-ups", 
                MuscleGroup.Chest | MuscleGroup.Triceps, MuscleGroup.Shoulders | MuscleGroup.Abs, 
                "None", 3, 8, 3, false),
            CreateResistanceExercise("Weighted Circles", "Weighted arm circles", 
                MuscleGroup.Shoulders, MuscleGroup.Chest, 
                "Dumbbells", 10, 15, 3, true),
            CreateResistanceExercise("Throw the Bomb", "Overhead throwing motion", 
                MuscleGroup.Shoulders | MuscleGroup.Triceps, MuscleGroup.Chest, 
                "Dumbbells", 8, 12, 3, true),
            CreateResistanceExercise("Clap/Plio Push-Ups", "Plyometric clap push-ups", 
                MuscleGroup.Chest | MuscleGroup.Triceps, MuscleGroup.Shoulders, 
                "None", 3, 8, 3, false),
            CreateResistanceExercise("Slo-Mo Throws", "Slow motion throwing", 
                MuscleGroup.Shoulders | MuscleGroup.Triceps, MuscleGroup.Chest, 
                "Dumbbells", 8, 12, 3, true),
            CreateResistanceExercise("Front-to-Back Triceps Extensions", "Front-to-back tricep extensions", 
                MuscleGroup.Triceps, MuscleGroup.Shoulders, 
                "Dumbbells", 8, 12, 3, true),
            CreateResistanceExercise("One-Arm Balance Push-Ups", "One-arm balance push-ups", 
                MuscleGroup.Chest | MuscleGroup.Triceps, MuscleGroup.Shoulders | MuscleGroup.Abs, 
                "None", 3, 8, 3, false),
            CreateResistanceExercise("Fly-Row Presses", "Fly-row-press combination", 
                MuscleGroup.Chest | MuscleGroup.Back | MuscleGroup.Shoulders, MuscleGroup.Triceps, 
                "Dumbbells", 8, 12, 3, true),
            CreateResistanceExercise("Dumbbell Cross-Body Blows", "Cross-body punching motion", 
                MuscleGroup.Shoulders | MuscleGroup.Triceps, MuscleGroup.Chest, 
                "Dumbbells", 8, 12, 3, true)
        };
    }

    private static List<Exercise> GetPlyometricsExercises()
    {
        return new List<Exercise>
        {
            CreateCardioExercise("Jump Squats", "Squats with explosive jump", 
                MuscleGroup.Quadriceps | MuscleGroup.Glutes | MuscleGroup.Cardiovascular, MuscleGroup.Calves, 
                "None", 10, 20, 3, false),
            CreateCardioExercise("Run-Stance Squat Switch Pick-Ups", "Squat switch pick-ups", 
                MuscleGroup.Quadriceps | MuscleGroup.Glutes | MuscleGroup.Cardiovascular, MuscleGroup.Calves, 
                "None", 8, 15, 3, false),
            CreateCardioExercise("Airborne Heismans", "Heisman jump variation", 
                MuscleGroup.Cardiovascular | MuscleGroup.Calves, MuscleGroup.Quadriceps, 
                "None", 10, 20, 3, false),
            CreateCardioExercise("Swing Kicks", "Dynamic swing kicks", 
                MuscleGroup.Cardiovascular | MuscleGroup.Hamstrings, MuscleGroup.Glutes, 
                "None", 10, 20, 3, false),
            CreateCardioExercise("Squat Reach Jumps", "Squats with reach jumps", 
                MuscleGroup.Quadriceps | MuscleGroup.Glutes | MuscleGroup.Cardiovascular, MuscleGroup.Calves, 
                "None", 8, 15, 3, false),
            CreateCardioExercise("Jump Knee Tucks", "Jumps with knee tucks", 
                MuscleGroup.Cardiovascular | MuscleGroup.Abs, MuscleGroup.Quadriceps, 
                "None", 10, 20, 3, false),
            CreateCardioExercise("Mary Katherine Lunges", "Mary Katherine lunge variation", 
                MuscleGroup.Quadriceps | MuscleGroup.Glutes | MuscleGroup.Cardiovascular, MuscleGroup.Calves, 
                "None", 8, 15, 3, false),
            CreateCardioExercise("Leapfrog Squats", "Leapfrog squat jumps", 
                MuscleGroup.Quadriceps | MuscleGroup.Glutes | MuscleGroup.Cardiovascular, MuscleGroup.Calves, 
                "None", 8, 15, 3, false),
            CreateCardioExercise("Twist Combo", "Twisting combination moves", 
                MuscleGroup.Cardiovascular | MuscleGroup.Abs, MuscleGroup.Obliques, 
                "None", 10, 20, 3, false),
            CreateCardioExercise("Rock Star Hops", "Rock star hop jumps", 
                MuscleGroup.Cardiovascular | MuscleGroup.Calves, MuscleGroup.Quadriceps, 
                "None", 10, 20, 3, false),
            CreateCardioExercise("Gap Jumps", "Jumping over gaps", 
                MuscleGroup.Cardiovascular | MuscleGroup.Quadriceps | MuscleGroup.Glutes, MuscleGroup.Calves, 
                "None", 8, 15, 3, false),
            CreateCardioExercise("Military March", "Military-style marching", 
                MuscleGroup.Cardiovascular | MuscleGroup.Quadriceps, MuscleGroup.Calves, 
                "None", 20, 30, 3, false),
            CreateCardioExercise("Run-Stance Squat 180 Jump Switch", "180-degree squat jumps", 
                MuscleGroup.Quadriceps | MuscleGroup.Glutes | MuscleGroup.Cardiovascular, MuscleGroup.Calves, 
                "None", 8, 15, 3, false),
            CreateCardioExercise("Circle Run", "Running in circles", 
                MuscleGroup.Cardiovascular | MuscleGroup.Quadriceps, MuscleGroup.Calves, 
                "None", 30, 60, 3, true),
            CreateCardioExercise("Jump Shots", "Jump shot motions", 
                MuscleGroup.Cardiovascular | MuscleGroup.Quadriceps, MuscleGroup.Calves, 
                "None", 10, 20, 3, false),
            CreateCardioExercise("Pitch & Catch", "Pitching and catching motions", 
                MuscleGroup.Cardiovascular | MuscleGroup.Shoulders, MuscleGroup.Triceps, 
                "None", 10, 20, 3, false),
            CreateCardioExercise("Football Hero", "Football hero movements", 
                MuscleGroup.Cardiovascular | MuscleGroup.Quadriceps | MuscleGroup.Glutes, MuscleGroup.Calves, 
                "None", 10, 20, 3, false)
        };
    }

    private static List<Exercise> GetKenpoXExercises()
    {
        return new List<Exercise>
        {
            CreateMartialArtsExercise("Jab, Cross, Hook, Uppercut Combo", "Boxing combination", 
                MuscleGroup.Cardiovascular | MuscleGroup.Shoulders, MuscleGroup.Triceps, 
                "None", 10, 20, 3, false),
            CreateMartialArtsExercise("Step-Drag Punches", "Step-drag punching combinations", 
                MuscleGroup.Cardiovascular | MuscleGroup.Shoulders, MuscleGroup.Triceps, 
                "None", 10, 20, 3, false),
            CreateMartialArtsExercise("High Blocks / Low Blocks", "Martial arts blocking", 
                MuscleGroup.Shoulders | MuscleGroup.Cardiovascular, MuscleGroup.Triceps, 
                "None", 10, 20, 3, false),
            CreateMartialArtsExercise("Knee Kicks", "Knee kick variations", 
                MuscleGroup.Cardiovascular | MuscleGroup.Quadriceps, MuscleGroup.Glutes, 
                "None", 10, 20, 3, false),
            CreateMartialArtsExercise("Ball Kicks", "Ball kick variations", 
                MuscleGroup.Cardiovascular | MuscleGroup.Quadriceps, MuscleGroup.Glutes, 
                "None", 10, 20, 3, false),
            CreateMartialArtsExercise("Side Kicks", "Side kick variations", 
                MuscleGroup.Cardiovascular | MuscleGroup.Quadriceps, MuscleGroup.Glutes, 
                "None", 10, 20, 3, false),
            CreateMartialArtsExercise("Back Kicks", "Back kick variations", 
                MuscleGroup.Cardiovascular | MuscleGroup.Quadriceps, MuscleGroup.Glutes, 
                "None", 10, 20, 3, false),
            CreateMartialArtsExercise("Three-Direction Kicks", "Three-direction kick combinations", 
                MuscleGroup.Cardiovascular | MuscleGroup.Quadriceps, MuscleGroup.Glutes, 
                "None", 10, 20, 3, false),
            CreateMartialArtsExercise("Punch/Kick Combos", "Punch and kick combinations", 
                MuscleGroup.Cardiovascular | MuscleGroup.Shoulders | MuscleGroup.Quadriceps, MuscleGroup.Triceps, 
                "None", 10, 20, 3, false),
            CreateMartialArtsExercise("Blocks with Punch Combos", "Blocking with punch combinations", 
                MuscleGroup.Cardiovascular | MuscleGroup.Shoulders, MuscleGroup.Triceps, 
                "None", 10, 20, 3, false)
        };
    }

    private static List<Exercise> GetCoreSynergisticsExercises()
    {
        return new List<Exercise>
        {
            CreateCoreExercise("Staggered Push-Ups", "Push-ups with staggered hand position", 
                MuscleGroup.Chest | MuscleGroup.Triceps | MuscleGroup.Core, MuscleGroup.Shoulders, 
                "None", 5, 10, 3, false),
            CreateCoreExercise("Banana Rolls", "Banana roll core exercise", 
                MuscleGroup.Core | MuscleGroup.Abs, MuscleGroup.Obliques, 
                "None", 8, 15, 3, false),
            CreateCoreExercise("Leaning Crescent Lunges", "Lunges with crescent motion", 
                MuscleGroup.Quadriceps | MuscleGroup.Glutes | MuscleGroup.Core, MuscleGroup.Calves, 
                "None", 8, 12, 3, false),
            CreateCoreExercise("Squat Run", "Squat running motion", 
                MuscleGroup.Quadriceps | MuscleGroup.Glutes | MuscleGroup.Cardiovascular, MuscleGroup.Calves, 
                "None", 10, 20, 3, false),
            CreateCoreExercise("Sphinx Push-Ups", "Sphinx position push-ups", 
                MuscleGroup.Chest | MuscleGroup.Triceps | MuscleGroup.Core, MuscleGroup.Shoulders, 
                "None", 5, 10, 3, false),
            CreateCoreExercise("Bow to Boat", "Bow to boat core exercise", 
                MuscleGroup.Core | MuscleGroup.Abs, MuscleGroup.LowerBack, 
                "None", 8, 15, 3, false),
            CreateCoreExercise("Low Lateral Skaters", "Low lateral skating motion", 
                MuscleGroup.Glutes | MuscleGroup.Quadriceps | MuscleGroup.Core, MuscleGroup.Calves, 
                "None", 10, 15, 3, false),
            CreateCoreExercise("Lunge & Reach", "Lunges with reaching motion", 
                MuscleGroup.Quadriceps | MuscleGroup.Glutes | MuscleGroup.Core, MuscleGroup.Calves, 
                "None", 8, 12, 3, false),
            CreateCoreExercise("Prison Cell Push-Ups", "Prison cell push-up variation", 
                MuscleGroup.Chest | MuscleGroup.Triceps | MuscleGroup.Core, MuscleGroup.Shoulders, 
                "None", 5, 10, 3, false),
            CreateCoreExercise("Side Hip Raises", "Side-lying hip raises", 
                MuscleGroup.Glutes | MuscleGroup.Core, MuscleGroup.Obliques, 
                "None", 8, 15, 3, false),
            CreateCoreExercise("Squat X-Press", "Squats with X-press motion", 
                MuscleGroup.Quadriceps | MuscleGroup.Glutes | MuscleGroup.Core, MuscleGroup.Calves, 
                "None", 8, 12, 3, false),
            CreateCoreExercise("Plank to Chaturanga Run", "Plank to chaturanga running", 
                MuscleGroup.Core | MuscleGroup.Chest | MuscleGroup.Triceps, MuscleGroup.Shoulders, 
                "None", 5, 10, 3, false),
            CreateCoreExercise("Walking Push-Ups", "Walking push-up variation", 
                MuscleGroup.Chest | MuscleGroup.Triceps | MuscleGroup.Core, MuscleGroup.Shoulders, 
                "None", 5, 10, 3, false),
            CreateCoreExercise("Superman/Banana", "Superman to banana exercise", 
                MuscleGroup.Core | MuscleGroup.LowerBack, MuscleGroup.Glutes, 
                "None", 8, 15, 3, false),
            CreateCoreExercise("Lunge-Kickback-Curl-Press", "Lunge-kickback-curl-press combination", 
                MuscleGroup.Quadriceps | MuscleGroup.Glutes | MuscleGroup.Biceps | MuscleGroup.Shoulders, MuscleGroup.Core, 
                "Dumbbells", 8, 12, 3, true),
            CreateCoreExercise("Towel Hoppers", "Towel hopping exercise", 
                MuscleGroup.Cardiovascular | MuscleGroup.Calves, MuscleGroup.Quadriceps, 
                "Towel", 10, 20, 3, false),
            CreateCoreExercise("Reach High & Under Push-Ups", "Reach high and under push-ups", 
                MuscleGroup.Chest | MuscleGroup.Triceps | MuscleGroup.Core, MuscleGroup.Shoulders, 
                "None", 5, 10, 3, false),
            CreateCoreExercise("Steam Engines", "Steam engine core exercise", 
                MuscleGroup.Core | MuscleGroup.Abs, MuscleGroup.Obliques, 
                "None", 10, 20, 3, false),
            CreateCoreExercise("Dreya Roll", "Dreya roll exercise", 
                MuscleGroup.Core | MuscleGroup.Abs, MuscleGroup.Obliques, 
                "None", 5, 10, 3, false),
            CreateCoreExercise("Plank to Chaturanga Iso", "Plank to chaturanga isometric hold", 
                MuscleGroup.Core | MuscleGroup.Chest | MuscleGroup.Triceps, MuscleGroup.Shoulders, 
                "None", 5, 10, 3, false),
            CreateCoreExercise("Halfback Drills", "Halfback drill exercises", 
                MuscleGroup.Cardiovascular | MuscleGroup.Quadriceps, MuscleGroup.Calves, 
                "None", 10, 20, 3, false),
            CreateCoreExercise("Table Dip Leg Raises", "Table dip with leg raises", 
                MuscleGroup.Triceps | MuscleGroup.Core, MuscleGroup.Shoulders, 
                "Table", 8, 15, 3, false)
        };
    }

    private static List<Exercise> GetCardioXExercises()
    {
        return new List<Exercise>
        {
            CreateCardioExercise("Jab/Cross/Hook/Uppercut Combos", "Boxing combination", 
                MuscleGroup.Cardiovascular | MuscleGroup.Shoulders, MuscleGroup.Triceps, 
                "None", 10, 20, 3, false),
            CreateCardioExercise("Kicks (front, side, back)", "Various kick combinations", 
                MuscleGroup.Cardiovascular | MuscleGroup.Quadriceps, MuscleGroup.Glutes, 
                "None", 10, 20, 3, false),
            CreateCardioExercise("Jump Squats", "Squats with explosive jump", 
                MuscleGroup.Quadriceps | MuscleGroup.Glutes | MuscleGroup.Cardiovascular, MuscleGroup.Calves, 
                "None", 10, 20, 3, false),
            CreateCardioExercise("Run-Stance Switch Pick-Ups", "Squat switch pick-ups", 
                MuscleGroup.Quadriceps | MuscleGroup.Glutes | MuscleGroup.Cardiovascular, MuscleGroup.Calves, 
                "None", 8, 15, 3, false),
            CreateCardioExercise("Jump Knee Tucks", "Jumps with knee tucks", 
                MuscleGroup.Cardiovascular | MuscleGroup.Abs, MuscleGroup.Quadriceps, 
                "None", 10, 20, 3, false),
            CreateCardioExercise("Squat X-Press", "Squats with X-press motion", 
                MuscleGroup.Quadriceps | MuscleGroup.Glutes | MuscleGroup.Cardiovascular, MuscleGroup.Calves, 
                "None", 8, 12, 3, false),
            CreateCardioExercise("Steam Engines", "Steam engine core exercise", 
                MuscleGroup.Core | MuscleGroup.Abs | MuscleGroup.Cardiovascular, MuscleGroup.Obliques, 
                "None", 10, 20, 3, false),
            CreateCardioExercise("Dreya Roll", "Dreya roll exercise", 
                MuscleGroup.Core | MuscleGroup.Abs | MuscleGroup.Cardiovascular, MuscleGroup.Obliques, 
                "None", 5, 10, 3, false),
            CreateCardioExercise("Plank to Chaturanga Run", "Plank to chaturanga running", 
                MuscleGroup.Core | MuscleGroup.Chest | MuscleGroup.Triceps | MuscleGroup.Cardiovascular, MuscleGroup.Shoulders, 
                "None", 5, 10, 3, false)
        };
    }

    private static Exercise CreateResistanceExercise(string name, string description, 
        MuscleGroup primaryMuscles, MuscleGroup secondaryMuscles, string equipment, 
        int repsMin, int repsMax, int sets, bool isWeightTracked)
    {
        return new Exercise
        {
            Name = name,
            Description = description,
            Category = ExerciseCategory.Resistance,
            Difficulty = DifficultyLevel.Intermediate,
            PrimaryMuscleGroups = primaryMuscles,
            SecondaryMuscleGroups = secondaryMuscles,
            Equipment = equipment,
            DefaultRepsMin = repsMin,
            DefaultRepsMax = repsMax,
            DefaultSets = sets,
            IsWeightTracked = isWeightTracked,
            IsTimeBased = false,
            IsDistanceTracked = false
        };
    }

    private static Exercise CreateCardioExercise(string name, string description, 
        MuscleGroup primaryMuscles, MuscleGroup secondaryMuscles, string equipment, 
        int repsMin, int repsMax, int sets, bool isWeightTracked)
    {
        return new Exercise
        {
            Name = name,
            Description = description,
            Category = ExerciseCategory.Cardio,
            Difficulty = DifficultyLevel.Intermediate,
            PrimaryMuscleGroups = primaryMuscles,
            SecondaryMuscleGroups = secondaryMuscles,
            Equipment = equipment,
            DefaultRepsMin = repsMin,
            DefaultRepsMax = repsMax,
            DefaultSets = sets,
            IsWeightTracked = isWeightTracked,
            IsTimeBased = false,
            IsDistanceTracked = false
        };
    }

    private static Exercise CreateMartialArtsExercise(string name, string description, 
        MuscleGroup primaryMuscles, MuscleGroup secondaryMuscles, string equipment, 
        int repsMin, int repsMax, int sets, bool isWeightTracked)
    {
        return new Exercise
        {
            Name = name,
            Description = description,
            Category = ExerciseCategory.MartialArts,
            Difficulty = DifficultyLevel.Intermediate,
            PrimaryMuscleGroups = primaryMuscles,
            SecondaryMuscleGroups = secondaryMuscles,
            Equipment = equipment,
            DefaultRepsMin = repsMin,
            DefaultRepsMax = repsMax,
            DefaultSets = sets,
            IsWeightTracked = isWeightTracked,
            IsTimeBased = false,
            IsDistanceTracked = false
        };
    }

    private static Exercise CreateCoreExercise(string name, string description, 
        MuscleGroup primaryMuscles, MuscleGroup secondaryMuscles, string equipment, 
        int repsMin, int repsMax, int sets, bool isWeightTracked)
    {
        return new Exercise
        {
            Name = name,
            Description = description,
            Category = ExerciseCategory.Core,
            Difficulty = DifficultyLevel.Intermediate,
            PrimaryMuscleGroups = primaryMuscles,
            SecondaryMuscleGroups = secondaryMuscles,
            Equipment = equipment,
            DefaultRepsMin = repsMin,
            DefaultRepsMax = repsMax,
            DefaultSets = sets,
            IsWeightTracked = isWeightTracked,
            IsTimeBased = false,
            IsDistanceTracked = false
        };
    }
}
