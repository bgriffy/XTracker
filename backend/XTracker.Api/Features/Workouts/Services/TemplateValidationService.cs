using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using XTracker.Api.Common.Data;
using XTracker.Api.Features.Workouts.Models;
using XTracker.Api.Features.Workouts.Models.Enums;
using XTracker.Api.Features.Workouts.Models.Validation;

namespace XTracker.Api.Features.Workouts.Services;

public class TemplateValidationService : ITemplateValidationService
{
    private readonly XTrackerDbContext _context;
    private readonly ILogger<TemplateValidationService> _logger;

    public TemplateValidationService(XTrackerDbContext context, ILogger<TemplateValidationService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<TemplateValidationResult> ValidateTemplateAsync(WorkoutTemplate template)
    {
        var result = new TemplateValidationResult();
        
        try
        {
            _logger.LogInformation($"Validating template: {template.Name}");
            
            // Validate template properties
            await ValidateTemplatePropertiesAsync(template, result);
            
            // Validate sections
            await ValidateTemplateSectionsAsync(template, result);
            
            // Validate workout structure
            var structureResult = await ValidateWorkoutStructureAsync(template);
            result.Errors.AddRange(structureResult.Errors);
            result.Warnings.AddRange(structureResult.Warnings);
            result.Info.AddRange(structureResult.Info);
            
            // Validate P90X requirements if applicable
            if (template.IsP90XWorkout)
            {
                var p90xResult = await ValidateP90XRequirementsAsync(template);
                result.Errors.AddRange(p90xResult.Errors);
                result.Warnings.AddRange(p90xResult.Warnings);
                result.Info.AddRange(p90xResult.Info);
            }
            
            result.IsValid = !result.HasErrors;
            
            _logger.LogInformation($"Template validation completed: {result.Summary}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error validating template: {template.Name}");
            result.Errors.Add(new ValidationError
            {
                Type = ValidationErrorType.TemplateNameEmpty,
                Message = $"Validation error: {ex.Message}",
                Field = "Template"
            });
            result.IsValid = false;
        }
        
        return result;
    }

    public async Task<TemplateValidationResult> ValidateSectionAsync(WorkoutTemplateSection section, string templateName)
    {
        var result = new TemplateValidationResult();
        
        try
        {
            // Validate section properties
            ValidateSectionProperties(section, templateName, result);
            
            // Validate exercises in section
            await ValidateSectionExercisesAsync(section, templateName, result);
            
            result.IsValid = !result.HasErrors;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error validating section: {section.Name} in template: {templateName}");
            result.Errors.Add(new ValidationError
            {
                Type = ValidationErrorType.SectionNameEmpty,
                Message = $"Section validation error: {ex.Message}",
                Section = section.Name
            });
            result.IsValid = false;
        }
        
        return result;
    }

    public async Task<TemplateValidationResult> ValidateExerciseAsync(WorkoutTemplateExercise exercise, string templateName, string sectionName)
    {
        var result = new TemplateValidationResult();
        
        try
        {
            // Validate exercise exists
            var exerciseExists = await _context.Exercises.AnyAsync(e => e.Id == exercise.ExerciseId);
            if (!exerciseExists)
            {
                result.Errors.Add(new ValidationError
                {
                    Type = ValidationErrorType.ExerciseNotFound,
                    Message = $"Exercise with ID {exercise.ExerciseId} not found",
                    Exercise = exercise.ExerciseId.ToString(),
                    Suggestion = "Check if exercise exists in the database"
                });
            }
            
            // Validate exercise properties
            ValidateExerciseProperties(exercise, templateName, sectionName, result);
            
            result.IsValid = !result.HasErrors;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error validating exercise in template: {templateName}, section: {sectionName}");
            result.Errors.Add(new ValidationError
            {
                Type = ValidationErrorType.ExerciseNotFound,
                Message = $"Exercise validation error: {ex.Message}",
                Exercise = exercise.ExerciseId.ToString()
            });
            result.IsValid = false;
        }
        
        return result;
    }

    public async Task<TemplateValidationResult> ValidateWorkoutStructureAsync(WorkoutTemplate template)
    {
        var result = new TemplateValidationResult();
        
        try
        {
            // Validate duration
            if (template.EstimatedDurationMinutes < 10)
            {
                result.Warnings.Add(new ValidationWarning
                {
                    Type = ValidationWarningType.WorkoutIntensityLow,
                    Message = "Workout duration is very short",
                    Field = "EstimatedDurationMinutes",
                    Value = template.EstimatedDurationMinutes,
                    Suggestion = "Consider adding more exercises or increasing duration"
                });
            }
            else if (template.EstimatedDurationMinutes > 120)
            {
                result.Warnings.Add(new ValidationWarning
                {
                    Type = ValidationWarningType.WorkoutIntensityHigh,
                    Message = "Workout duration is very long",
                    Field = "EstimatedDurationMinutes",
                    Value = template.EstimatedDurationMinutes,
                    Suggestion = "Consider breaking into multiple shorter workouts"
                });
            }
            
            // Validate section count
            if (template.Sections?.Count == 0)
            {
                result.Errors.Add(new ValidationError
                {
                    Type = ValidationErrorType.WorkoutNoSections,
                    Message = "Workout template has no sections",
                    Suggestion = "Add at least one section with exercises"
                });
            }
            
            // Validate muscle group balance
            await ValidateMuscleGroupBalanceAsync(template, result);
            
            // Validate equipment requirements
            ValidateEquipmentRequirements(template, result);
            
            result.IsValid = !result.HasErrors;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error validating workout structure for template: {template.Name}");
            result.Errors.Add(new ValidationError
            {
                Type = ValidationErrorType.WorkoutNoSections,
                Message = $"Workout structure validation error: {ex.Message}"
            });
            result.IsValid = false;
        }
        
        return result;
    }

    public async Task<TemplateValidationResult> ValidateP90XRequirementsAsync(WorkoutTemplate template)
    {
        var result = new TemplateValidationResult();
        
        try
        {
            // Validate P90X specific requirements
            if (template.IsP90XWorkout)
            {
                // Check for proper P90X naming
                if (!IsValidP90XName(template.Name))
                {
                    result.Warnings.Add(new ValidationWarning
                    {
                        Type = ValidationWarningType.TemplateNameSimilar,
                        Message = "Template name doesn't follow P90X naming convention",
                        Field = "Name",
                        Value = template.Name,
                        Suggestion = "Consider using standard P90X workout names"
                    });
                }
                
                // Check for proper duration (P90X workouts are typically 45-90 minutes)
                if (template.EstimatedDurationMinutes < 30 || template.EstimatedDurationMinutes > 120)
                {
                    result.Warnings.Add(new ValidationWarning
                    {
                        Type = ValidationWarningType.TemplateDurationLong,
                        Message = "P90X workout duration is outside typical range (30-120 minutes)",
                        Field = "EstimatedDurationMinutes",
                        Value = template.EstimatedDurationMinutes,
                        Suggestion = "P90X workouts typically last 45-90 minutes"
                    });
                }
                
                // Check for proper equipment
                if (string.IsNullOrWhiteSpace(template.Equipment))
                {
                    result.Warnings.Add(new ValidationWarning
                    {
                        Type = ValidationWarningType.TemplateEquipmentMissing,
                        Message = "P90X workout should specify required equipment",
                        Field = "Equipment",
                        Suggestion = "Add equipment requirements (e.g., 'Pull-up bar, Dumbbells')"
                    });
                }
            }
            
            result.IsValid = !result.HasErrors;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error validating P90X requirements for template: {template.Name}");
            result.Errors.Add(new ValidationError
            {
                Type = ValidationErrorType.TemplateCategoryInvalid,
                Message = $"P90X validation error: {ex.Message}"
            });
            result.IsValid = false;
        }
        
        return result;
    }

    public async Task<List<string>> GetValidationSuggestionsAsync(WorkoutTemplate template)
    {
        var suggestions = new List<string>();
        
        try
        {
            // Get validation result
            var validationResult = await ValidateTemplateAsync(template);
            
            // Extract suggestions from errors and warnings
            suggestions.AddRange(validationResult.Errors
                .Where(e => !string.IsNullOrEmpty(e.Suggestion))
                .Select(e => e.Suggestion!));
            
            suggestions.AddRange(validationResult.Warnings
                .Where(w => !string.IsNullOrEmpty(w.Suggestion))
                .Select(w => w.Suggestion!));
            
            // Add general suggestions
            if (template.Sections?.Count == 0)
            {
                suggestions.Add("Add at least one section with exercises");
            }
            
            if (string.IsNullOrWhiteSpace(template.Instructions))
            {
                suggestions.Add("Add workout instructions for better user experience");
            }
            
            if (string.IsNullOrWhiteSpace(template.Equipment))
            {
                suggestions.Add("Specify required equipment");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error getting validation suggestions for template: {template.Name}");
            suggestions.Add($"Error generating suggestions: {ex.Message}");
        }
        
        return suggestions;
    }

    public async Task<TemplateValidationResult> ValidateTemplateConsistencyAsync(List<WorkoutTemplate> templates)
    {
        var result = new TemplateValidationResult();
        
        try
        {
            // Check for duplicate names
            var duplicateNames = templates
                .GroupBy(t => t.Name, StringComparer.OrdinalIgnoreCase)
                .Where(g => g.Count() > 1)
                .Select(g => g.Key);
            
            foreach (var duplicateName in duplicateNames)
            {
                result.Errors.Add(new ValidationError
                {
                    Type = ValidationErrorType.TemplateDuplicateName,
                    Message = $"Duplicate template name found: {duplicateName}",
                    Value = duplicateName,
                    Suggestion = "Ensure all template names are unique"
                });
            }
            
            // Check for similar names
            var similarNames = FindSimilarNames(templates.Select(t => t.Name).ToList());
            foreach (var similarName in similarNames)
            {
                result.Warnings.Add(new ValidationWarning
                {
                    Type = ValidationWarningType.TemplateNameSimilar,
                    Message = $"Similar template names found: {string.Join(", ", similarName)}",
                    Value = similarName,
                    Suggestion = "Consider using more distinct names"
                });
            }
            
            result.IsValid = !result.HasErrors;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating template consistency");
            result.Errors.Add(new ValidationError
            {
                Type = ValidationErrorType.TemplateDuplicateName,
                Message = $"Consistency validation error: {ex.Message}"
            });
            result.IsValid = false;
        }
        
        return result;
    }

    #region Private Methods

    private async Task ValidateTemplatePropertiesAsync(WorkoutTemplate template, TemplateValidationResult result)
    {
        // Validate name
        if (string.IsNullOrWhiteSpace(template.Name))
        {
            result.Errors.Add(new ValidationError
            {
                Type = ValidationErrorType.TemplateNameEmpty,
                Message = "Template name is required",
                Field = "Name",
                Suggestion = "Provide a descriptive name for the workout template"
            });
        }
        else if (template.Name.Length > 100)
        {
            result.Errors.Add(new ValidationError
            {
                Type = ValidationErrorType.TemplateNameTooLong,
                Message = "Template name is too long",
                Field = "Name",
                Value = template.Name.Length,
                Suggestion = "Keep template name under 100 characters"
            });
        }
        
        // Validate duration
        if (template.EstimatedDurationMinutes <= 0)
        {
            result.Errors.Add(new ValidationError
            {
                Type = ValidationErrorType.TemplateDurationInvalid,
                Message = "Template duration must be greater than 0",
                Field = "EstimatedDurationMinutes",
                Value = template.EstimatedDurationMinutes,
                Suggestion = "Set a realistic workout duration in minutes"
            });
        }
        
        // Validate category
        if (!Enum.IsDefined(typeof(WorkoutCategory), template.Category))
        {
            result.Errors.Add(new ValidationError
            {
                Type = ValidationErrorType.TemplateCategoryInvalid,
                Message = "Invalid workout category",
                Field = "Category",
                Value = template.Category,
                Suggestion = "Use a valid workout category"
            });
        }
        
        // Validate difficulty
        if (!Enum.IsDefined(typeof(DifficultyLevel), template.Difficulty))
        {
            result.Errors.Add(new ValidationError
            {
                Type = ValidationErrorType.TemplateDifficultyInvalid,
                Message = "Invalid difficulty level",
                Field = "Difficulty",
                Value = template.Difficulty,
                Suggestion = "Use a valid difficulty level"
            });
        }
    }

    private async Task ValidateTemplateSectionsAsync(WorkoutTemplate template, TemplateValidationResult result)
    {
        if (template.Sections == null || !template.Sections.Any())
        {
            result.Errors.Add(new ValidationError
            {
                Type = ValidationErrorType.WorkoutNoSections,
                Message = "Template has no sections",
                Suggestion = "Add at least one section with exercises"
            });
            return;
        }
        
        var sectionOrders = new List<int>();
        
        foreach (var section in template.Sections)
        {
            // Validate section properties
            ValidateSectionProperties(section, template.Name, result);
            
            // Check for duplicate section orders
            if (sectionOrders.Contains(section.Order))
            {
                result.Errors.Add(new ValidationError
                {
                    Type = ValidationErrorType.SectionOrderDuplicate,
                    Message = $"Duplicate section order: {section.Order}",
                    Section = section.Name,
                    Value = section.Order,
                    Suggestion = "Ensure each section has a unique order"
                });
            }
            else
            {
                sectionOrders.Add(section.Order);
            }
            
            // Validate exercises in section
            await ValidateSectionExercisesAsync(section, template.Name, result);
        }
    }

    private void ValidateSectionProperties(WorkoutTemplateSection section, string templateName, TemplateValidationResult result)
    {
        // Validate name
        if (string.IsNullOrWhiteSpace(section.Name))
        {
            result.Errors.Add(new ValidationError
            {
                Type = ValidationErrorType.SectionNameEmpty,
                Message = "Section name is required",
                Section = section.Name,
                Suggestion = "Provide a descriptive name for the section"
            });
        }
        
        // Validate order
        if (section.Order <= 0)
        {
            result.Errors.Add(new ValidationError
            {
                Type = ValidationErrorType.SectionOrderInvalid,
                Message = "Section order must be greater than 0",
                Section = section.Name,
                Value = section.Order,
                Suggestion = "Set a positive order number for the section"
            });
        }
        
        // Validate type
        if (!Enum.IsDefined(typeof(SectionType), section.Type))
        {
            result.Errors.Add(new ValidationError
            {
                Type = ValidationErrorType.SectionTypeInvalid,
                Message = "Invalid section type",
                Section = section.Name,
                Value = section.Type,
                Suggestion = "Use a valid section type"
            });
        }
        
        // Validate rest period
        if (section.RestPeriodSeconds.HasValue && section.RestPeriodSeconds < 0)
        {
            result.Errors.Add(new ValidationError
            {
                Type = ValidationErrorType.SectionRestPeriodInvalid,
                Message = "Rest period cannot be negative",
                Section = section.Name,
                Value = section.RestPeriodSeconds,
                Suggestion = "Set rest period to 0 or a positive value"
            });
        }
    }

    private async Task ValidateSectionExercisesAsync(WorkoutTemplateSection section, string templateName, TemplateValidationResult result)
    {
        if (section.Exercises == null || !section.Exercises.Any())
        {
            result.Errors.Add(new ValidationError
            {
                Type = ValidationErrorType.SectionNoExercises,
                Message = "Section has no exercises",
                Section = section.Name,
                Suggestion = "Add at least one exercise to the section"
            });
            return;
        }
        
        var exerciseOrders = new List<int>();
        
        foreach (var exercise in section.Exercises)
        {
            // Validate exercise exists
            var exerciseExists = await _context.Exercises.AnyAsync(e => e.Id == exercise.ExerciseId);
            if (!exerciseExists)
            {
                result.Errors.Add(new ValidationError
                {
                    Type = ValidationErrorType.ExerciseNotFound,
                    Message = $"Exercise with ID {exercise.ExerciseId} not found",
                    Section = section.Name,
                    Exercise = exercise.ExerciseId.ToString(),
                    Suggestion = "Check if exercise exists in the database"
                });
            }
            
            // Validate exercise properties
            ValidateExerciseProperties(exercise, templateName, section.Name, result);
            
            // Check for duplicate exercise orders
            if (exerciseOrders.Contains(exercise.Order))
            {
                result.Errors.Add(new ValidationError
                {
                    Type = ValidationErrorType.ExerciseOrderDuplicate,
                    Message = $"Duplicate exercise order: {exercise.Order}",
                    Section = section.Name,
                    Exercise = exercise.ExerciseId.ToString(),
                    Value = exercise.Order,
                    Suggestion = "Ensure each exercise has a unique order within the section"
                });
            }
            else
            {
                exerciseOrders.Add(exercise.Order);
            }
        }
    }

    private void ValidateExerciseProperties(WorkoutTemplateExercise exercise, string templateName, string sectionName, TemplateValidationResult result)
    {
        // Validate order
        if (exercise.Order <= 0)
        {
            result.Errors.Add(new ValidationError
            {
                Type = ValidationErrorType.ExerciseOrderInvalid,
                Message = "Exercise order must be greater than 0",
                Section = sectionName,
                Exercise = exercise.ExerciseId.ToString(),
                Value = exercise.Order,
                Suggestion = "Set a positive order number for the exercise"
            });
        }
        
        // Validate sets
        if (exercise.Sets.HasValue && exercise.Sets <= 0)
        {
            result.Errors.Add(new ValidationError
            {
                Type = ValidationErrorType.ExerciseSetsInvalid,
                Message = "Exercise sets must be greater than 0",
                Section = sectionName,
                Exercise = exercise.ExerciseId.ToString(),
                Value = exercise.Sets,
                Suggestion = "Set a positive number of sets"
            });
        }
        
        // Validate reps
        if (exercise.RepsMin.HasValue && exercise.RepsMax.HasValue && exercise.RepsMin > exercise.RepsMax)
        {
            result.Errors.Add(new ValidationError
            {
                Type = ValidationErrorType.ExerciseRepsInvalid,
                Message = "Minimum reps cannot be greater than maximum reps",
                Section = sectionName,
                Exercise = exercise.ExerciseId.ToString(),
                Value = $"{exercise.RepsMin}-{exercise.RepsMax}",
                Suggestion = "Ensure minimum reps is less than or equal to maximum reps"
            });
        }
        
        // Validate weight
        if (exercise.Weight.HasValue && exercise.Weight < 0)
        {
            result.Errors.Add(new ValidationError
            {
                Type = ValidationErrorType.ExerciseWeightInvalid,
                Message = "Exercise weight cannot be negative",
                Section = sectionName,
                Exercise = exercise.ExerciseId.ToString(),
                Value = exercise.Weight,
                Suggestion = "Set weight to 0 or a positive value"
            });
        }
        
        // Validate duration
        if (exercise.DurationSeconds.HasValue && exercise.DurationSeconds <= 0)
        {
            result.Errors.Add(new ValidationError
            {
                Type = ValidationErrorType.ExerciseDurationInvalid,
                Message = "Exercise duration must be greater than 0",
                Section = sectionName,
                Exercise = exercise.ExerciseId.ToString(),
                Value = exercise.DurationSeconds,
                Suggestion = "Set a positive duration in seconds"
            });
        }
    }

    private async Task ValidateMuscleGroupBalanceAsync(WorkoutTemplate template, TemplateValidationResult result)
    {
        // This is a simplified muscle group balance check
        // In a real implementation, you'd analyze the exercises and their muscle groups
        
        var totalExercises = template.Sections?.Sum(s => s.Exercises?.Count ?? 0) ?? 0;
        
        if (totalExercises > 0)
        {
            result.Info.Add(new ValidationInfo
            {
                Type = ValidationInfoType.WorkoutBalancedMuscleGroups,
                Message = $"Workout contains {totalExercises} exercises across {template.Sections?.Count ?? 0} sections"
            });
        }
    }

    private void ValidateEquipmentRequirements(WorkoutTemplate template, TemplateValidationResult result)
    {
        if (string.IsNullOrWhiteSpace(template.Equipment))
        {
            result.Warnings.Add(new ValidationWarning
            {
                Type = ValidationWarningType.TemplateEquipmentMissing,
                Message = "No equipment specified",
                Field = "Equipment",
                Suggestion = "Specify required equipment for the workout"
            });
        }
        else
        {
            result.Info.Add(new ValidationInfo
            {
                Type = ValidationInfoType.TemplateEquipmentListed,
                Message = $"Equipment specified: {template.Equipment}"
            });
        }
    }

    private bool IsValidP90XName(string name)
    {
        var validP90XNames = new[]
        {
            "Chest & Back", "Shoulders & Arms", "Legs & Back", "Back & Biceps",
            "Chest, Shoulders & Triceps", "Plyometrics", "Kenpo X", "Core Synergistics",
            "Cardio X", "Yoga X", "X Stretch", "Ab Ripper X"
        };
        
        return validP90XNames.Any(validName => 
            string.Equals(name, validName, StringComparison.OrdinalIgnoreCase));
    }

    private List<List<string>> FindSimilarNames(List<string> names)
    {
        var similarGroups = new List<List<string>>();
        var processed = new HashSet<string>();
        
        for (int i = 0; i < names.Count; i++)
        {
            if (processed.Contains(names[i])) continue;
            
            var similar = new List<string> { names[i] };
            processed.Add(names[i]);
            
            for (int j = i + 1; j < names.Count; j++)
            {
                if (processed.Contains(names[j])) continue;
                
                if (AreNamesSimilar(names[i], names[j]))
                {
                    similar.Add(names[j]);
                    processed.Add(names[j]);
                }
            }
            
            if (similar.Count > 1)
            {
                similarGroups.Add(similar);
            }
        }
        
        return similarGroups;
    }

    private bool AreNamesSimilar(string name1, string name2)
    {
        // Simple similarity check - in a real implementation, you'd use more sophisticated algorithms
        var distance = LevenshteinDistance(name1.ToLower(), name2.ToLower());
        var maxLength = Math.Max(name1.Length, name2.Length);
        
        return maxLength > 0 && (double)distance / maxLength < 0.3; // 30% similarity threshold
    }

    private int LevenshteinDistance(string s1, string s2)
    {
        var matrix = new int[s1.Length + 1, s2.Length + 1];
        
        for (int i = 0; i <= s1.Length; i++) matrix[i, 0] = i;
        for (int j = 0; j <= s2.Length; j++) matrix[0, j] = j;
        
        for (int i = 1; i <= s1.Length; i++)
        {
            for (int j = 1; j <= s2.Length; j++)
            {
                var cost = s1[i - 1] == s2[j - 1] ? 0 : 1;
                matrix[i, j] = Math.Min(
                    Math.Min(matrix[i - 1, j] + 1, matrix[i, j - 1] + 1),
                    matrix[i - 1, j - 1] + cost);
            }
        }
        
        return matrix[s1.Length, s2.Length];
    }

    #endregion
}
