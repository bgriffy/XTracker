using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using XTracker.Api.Features.Workouts.Models;
using XTracker.Api.Features.Workouts.Models.Enums;

namespace XTracker.Api.Common.Data;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(XTrackerDbContext context, ILogger? logger = null)
    {
        try
        {
            logger?.LogInformation("Starting database seeding process...");

            // Ensure database is created
            await context.Database.EnsureCreatedAsync();

            // Seed exercises first (templates depend on exercises)
            await SeedExercisesAsync(context, logger);

            // Seed workout templates (depends on exercises)
            await SeedWorkoutTemplatesAsync(context, logger);

            // Seed any additional data
            await SeedAdditionalDataAsync(context, logger);

            logger?.LogInformation("Database seeding completed successfully.");
        }
        catch (Exception ex)
        {
            logger?.LogError(ex, "Error occurred during database seeding");
            throw;
        }
    }

    private static async Task SeedExercisesAsync(XTrackerDbContext context, ILogger? logger)
    {
        var exerciseCount = await context.Exercises.CountAsync();
        
        if (exerciseCount == 0)
        {
            logger?.LogInformation("Seeding exercises...");
            
            var exercises = P90XExerciseDataComplete.GetAllP90XExercises();
            
            // Validate exercises before adding
            var validExercises = ValidateExercises(exercises, logger);
            
            await context.Exercises.AddRangeAsync(validExercises);
            await context.SaveChangesAsync();
            
            logger?.LogInformation($"Successfully seeded {validExercises.Count} exercises.");
        }
        else
        {
            logger?.LogInformation($"Exercises already exist ({exerciseCount} found). Skipping exercise seeding.");
        }
    }

    private static async Task SeedWorkoutTemplatesAsync(XTrackerDbContext context, ILogger? logger)
    {
        var templateCount = await context.WorkoutTemplates.CountAsync();
        
        if (templateCount == 0)
        {
            logger?.LogInformation("Seeding workout templates...");
            
            // Ensure exercises exist before creating templates
            var exerciseCount = await context.Exercises.CountAsync();
            if (exerciseCount == 0)
            {
                logger?.LogWarning("No exercises found. Creating templates without exercise linking.");
            }
            
            var templates = await P90XWorkoutTemplateBuilder.BuildP90XWorkoutTemplatesAsync(context);
            
            // Validate templates before adding
            var validTemplates = ValidateWorkoutTemplates(templates, logger);
            
            await context.WorkoutTemplates.AddRangeAsync(validTemplates);
            await context.SaveChangesAsync();
            
            logger?.LogInformation($"Successfully seeded {validTemplates.Count} workout templates.");
        }
        else
        {
            logger?.LogInformation($"Workout templates already exist ({templateCount} found). Skipping template seeding.");
        }
    }

    private static async Task SeedAdditionalDataAsync(XTrackerDbContext context, ILogger? logger)
    {
        // Placeholder for any additional seeding logic
        // This could include:
        // - Default user accounts
        // - System settings
        // - Sample workout sessions
        // - etc.
        
        logger?.LogInformation("Additional data seeding completed.");
        await Task.CompletedTask;
    }

    private static List<Exercise> ValidateExercises(List<Exercise> exercises, ILogger? logger)
    {
        var validExercises = new List<Exercise>();
        var errors = new List<string>();

        foreach (var exercise in exercises)
        {
            try
            {
                // Basic validation
                if (string.IsNullOrWhiteSpace(exercise.Name))
                {
                    errors.Add($"Exercise with empty name found");
                    continue;
                }

                if (exercise.DefaultRepsMin.HasValue && exercise.DefaultRepsMax.HasValue && 
                    exercise.DefaultRepsMin > exercise.DefaultRepsMax)
                {
                    errors.Add($"Exercise '{exercise.Name}' has invalid rep range: {exercise.DefaultRepsMin}-{exercise.DefaultRepsMax}");
                    continue;
                }

                // Check for duplicates
                if (validExercises.Any(e => e.Name.Equals(exercise.Name, StringComparison.OrdinalIgnoreCase)))
                {
                    errors.Add($"Duplicate exercise name found: '{exercise.Name}'");
                    continue;
                }

                validExercises.Add(exercise);
            }
            catch (Exception ex)
            {
                errors.Add($"Error validating exercise '{exercise.Name}': {ex.Message}");
            }
        }

        if (errors.Any())
        {
            logger?.LogWarning($"Exercise validation found {errors.Count} issues:");
            foreach (var error in errors)
            {
                logger?.LogWarning($"  - {error}");
            }
        }

        return validExercises;
    }

    private static List<WorkoutTemplate> ValidateWorkoutTemplates(List<WorkoutTemplate> templates, ILogger? logger)
    {
        var validTemplates = new List<WorkoutTemplate>();
        var errors = new List<string>();

        foreach (var template in templates)
        {
            try
            {
                // Basic validation
                if (string.IsNullOrWhiteSpace(template.Name))
                {
                    errors.Add($"Template with empty name found");
                    continue;
                }

                if (template.EstimatedDurationMinutes <= 0)
                {
                    errors.Add($"Template '{template.Name}' has invalid duration: {template.EstimatedDurationMinutes} minutes");
                    continue;
                }

                // Check for duplicates
                if (validTemplates.Any(t => t.Name.Equals(template.Name, StringComparison.OrdinalIgnoreCase)))
                {
                    errors.Add($"Duplicate template name found: '{template.Name}'");
                    continue;
                }

                // Validate sections
                if (template.Sections?.Any() == true)
                {
                    var sectionErrors = ValidateTemplateSections(template.Sections, template.Name);
                    errors.AddRange(sectionErrors);
                }

                validTemplates.Add(template);
            }
            catch (Exception ex)
            {
                errors.Add($"Error validating template '{template.Name}': {ex.Message}");
            }
        }

        if (errors.Any())
        {
            logger?.LogWarning($"Template validation found {errors.Count} issues:");
            foreach (var error in errors)
            {
                logger?.LogWarning($"  - {error}");
            }
        }

        return validTemplates;
    }

    private static List<string> ValidateTemplateSections(ICollection<WorkoutTemplateSection> sections, string templateName)
    {
        var errors = new List<string>();

        foreach (var section in sections)
        {
            if (string.IsNullOrWhiteSpace(section.Name))
            {
                errors.Add($"Template '{templateName}' has section with empty name");
            }

            if (section.Order <= 0)
            {
                errors.Add($"Template '{templateName}' section '{section.Name}' has invalid order: {section.Order}");
            }

            // Validate exercises in section
            if (section.Exercises?.Any() == true)
            {
                var exerciseErrors = ValidateTemplateExercises(section.Exercises, templateName, section.Name);
                errors.AddRange(exerciseErrors);
            }
        }

        return errors;
    }

    private static List<string> ValidateTemplateExercises(ICollection<WorkoutTemplateExercise> exercises, string templateName, string sectionName)
    {
        var errors = new List<string>();

        foreach (var exercise in exercises)
        {
            if (exercise.ExerciseId <= 0)
            {
                errors.Add($"Template '{templateName}' section '{sectionName}' has exercise with invalid ExerciseId: {exercise.ExerciseId}");
            }

            if (exercise.Order <= 0)
            {
                errors.Add($"Template '{templateName}' section '{sectionName}' has exercise with invalid order: {exercise.Order}");
            }

            if (exercise.Sets.HasValue && exercise.Sets <= 0)
            {
                errors.Add($"Template '{templateName}' section '{sectionName}' has exercise with invalid sets: {exercise.Sets}");
            }

            if (exercise.RepsMin.HasValue && exercise.RepsMax.HasValue && exercise.RepsMin > exercise.RepsMax)
            {
                errors.Add($"Template '{templateName}' section '{sectionName}' has exercise with invalid rep range: {exercise.RepsMin}-{exercise.RepsMax}");
            }
        }

        return errors;
    }

    /// <summary>
    /// Reseeds the database by clearing existing data and re-adding it
    /// </summary>
    public static async Task ReseedAsync(XTrackerDbContext context, ILogger? logger = null)
    {
        try
        {
            logger?.LogInformation("Starting database reseeding process...");

            // Clear existing data in reverse dependency order
            await ClearWorkoutTemplatesAsync(context, logger);
            await ClearExercisesAsync(context, logger);

            // Reseed data
            await SeedAsync(context, logger);

            logger?.LogInformation("Database reseeding completed successfully.");
        }
        catch (Exception ex)
        {
            logger?.LogError(ex, "Error occurred during database reseeding");
            throw;
        }
    }

    private static async Task ClearWorkoutTemplatesAsync(XTrackerDbContext context, ILogger? logger)
    {
        var templateCount = await context.WorkoutTemplates.CountAsync();
        if (templateCount > 0)
        {
            logger?.LogInformation($"Clearing {templateCount} workout templates...");
            context.WorkoutTemplates.RemoveRange(context.WorkoutTemplates);
            await context.SaveChangesAsync();
        }
    }

    private static async Task ClearExercisesAsync(XTrackerDbContext context, ILogger? logger)
    {
        var exerciseCount = await context.Exercises.CountAsync();
        if (exerciseCount > 0)
        {
            logger?.LogInformation($"Clearing {exerciseCount} exercises...");
            context.Exercises.RemoveRange(context.Exercises);
            await context.SaveChangesAsync();
        }
    }
}
