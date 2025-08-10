using Microsoft.EntityFrameworkCore;
using XTracker.Api.Features.Workouts.Models;

namespace XTracker.Api.Common.Data;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(XTrackerDbContext context)
    {
        // Seed exercises if they don't exist
        if (!await context.Exercises.AnyAsync())
        {
            var exercises = new List<Exercise>
            {
                // P90X Exercises
                new Exercise { Name = "Push-ups", Description = "Standard push-ups", Category = "Strength" },
                new Exercise { Name = "Pull-ups", Description = "Pull-ups using a bar", Category = "Strength" },
                new Exercise { Name = "Squats", Description = "Body weight squats", Category = "Strength" },
                new Exercise { Name = "Lunges", Description = "Forward lunges", Category = "Strength" },
                new Exercise { Name = "Plank", Description = "Standard plank hold", Category = "Core" },
                new Exercise { Name = "Burpees", Description = "Full burpee with push-up and jump", Category = "Cardio" },
                new Exercise { Name = "Mountain Climbers", Description = "Running in plank position", Category = "Cardio" },
                new Exercise { Name = "Jumping Jacks", Description = "Standard jumping jacks", Category = "Cardio" },
                new Exercise { Name = "Crunches", Description = "Standard abdominal crunches", Category = "Core" },
                new Exercise { Name = "Diamond Push-ups", Description = "Push-ups with diamond hand position", Category = "Strength" },
                new Exercise { Name = "Wide Push-ups", Description = "Push-ups with wide hand position", Category = "Strength" },
                new Exercise { Name = "Military Push-ups", Description = "Push-ups with hands close to body", Category = "Strength" },
                new Exercise { Name = "Wall Squats", Description = "Squats against a wall", Category = "Strength" },
                new Exercise { Name = "Jump Squats", Description = "Squats with jump at the top", Category = "Cardio" },
                new Exercise { Name = "Side Plank", Description = "Plank on one side", Category = "Core" },
                new Exercise { Name = "Bicycle Crunches", Description = "Alternating elbow to knee crunches", Category = "Core" },
                new Exercise { Name = "High Knees", Description = "Running in place with high knees", Category = "Cardio" },
                new Exercise { Name = "Butterfly Kicks", Description = "Lying leg kicks", Category = "Core" },
                new Exercise { Name = "Pike Push-ups", Description = "Push-ups with elevated feet", Category = "Strength" },
                new Exercise { Name = "Decline Push-ups", Description = "Push-ups with feet elevated", Category = "Strength" }
            };

            await context.Exercises.AddRangeAsync(exercises);
            await context.SaveChangesAsync();
        }

        // Note: Removed sample workout creation to avoid startup issues
        // Sample workouts can be created through the API once it's running
    }
}
