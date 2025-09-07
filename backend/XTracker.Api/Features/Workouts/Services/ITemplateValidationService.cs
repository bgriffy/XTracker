using XTracker.Api.Features.Workouts.Models;
using XTracker.Api.Features.Workouts.Models.Validation;

namespace XTracker.Api.Features.Workouts.Services;

public interface ITemplateValidationService
{
    /// <summary>
    /// Validates a workout template for completeness and correctness
    /// </summary>
    Task<TemplateValidationResult> ValidateTemplateAsync(WorkoutTemplate template);
    
    /// <summary>
    /// Validates a workout template section
    /// </summary>
    Task<TemplateValidationResult> ValidateSectionAsync(WorkoutTemplateSection section, string templateName);
    
    /// <summary>
    /// Validates a workout template exercise
    /// </summary>
    Task<TemplateValidationResult> ValidateExerciseAsync(WorkoutTemplateExercise exercise, string templateName, string sectionName);
    
    /// <summary>
    /// Validates workout structure and balance
    /// </summary>
    Task<TemplateValidationResult> ValidateWorkoutStructureAsync(WorkoutTemplate template);
    
    /// <summary>
    /// Validates P90X specific requirements
    /// </summary>
    Task<TemplateValidationResult> ValidateP90XRequirementsAsync(WorkoutTemplate template);
    
    /// <summary>
    /// Gets validation suggestions for improving a template
    /// </summary>
    Task<List<string>> GetValidationSuggestionsAsync(WorkoutTemplate template);
    
    /// <summary>
    /// Validates multiple templates for consistency
    /// </summary>
    Task<TemplateValidationResult> ValidateTemplateConsistencyAsync(List<WorkoutTemplate> templates);
}
