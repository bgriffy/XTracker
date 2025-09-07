using XTracker.Api.Features.Workouts.Models.Enums;

namespace XTracker.Api.Features.Workouts.Models.Validation;

public class TemplateValidationResult
{
    public bool IsValid { get; set; }
    public List<ValidationError> Errors { get; set; } = new();
    public List<ValidationWarning> Warnings { get; set; } = new();
    public List<ValidationInfo> Info { get; set; } = new();
    
    public int ErrorCount => Errors.Count;
    public int WarningCount => Warnings.Count;
    public int InfoCount => Info.Count;
    
    public bool HasErrors => Errors.Any();
    public bool HasWarnings => Warnings.Any();
    public bool HasInfo => Info.Any();
    
    public string Summary => $"Validation completed: {ErrorCount} errors, {WarningCount} warnings, {InfoCount} info messages";
}

public class ValidationError
{
    public ValidationErrorType Type { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? Field { get; set; }
    public string? Section { get; set; }
    public string? Exercise { get; set; }
    public object? Value { get; set; }
    public string? Suggestion { get; set; }
}

public class ValidationWarning
{
    public ValidationWarningType Type { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? Field { get; set; }
    public string? Section { get; set; }
    public string? Exercise { get; set; }
    public object? Value { get; set; }
    public string? Suggestion { get; set; }
}

public class ValidationInfo
{
    public ValidationInfoType Type { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? Field { get; set; }
    public string? Section { get; set; }
    public string? Exercise { get; set; }
    public object? Value { get; set; }
}

public enum ValidationErrorType
{
    // Template level errors
    TemplateNameEmpty,
    TemplateNameTooLong,
    TemplateDurationInvalid,
    TemplateCategoryInvalid,
    TemplateDifficultyInvalid,
    TemplateDuplicateName,
    
    // Section level errors
    SectionNameEmpty,
    SectionNameTooLong,
    SectionOrderInvalid,
    SectionOrderDuplicate,
    SectionTypeInvalid,
    SectionRestPeriodInvalid,
    SectionNoExercises,
    
    // Exercise level errors
    ExerciseNotFound,
    ExerciseOrderInvalid,
    ExerciseOrderDuplicate,
    ExerciseSetsInvalid,
    ExerciseRepsInvalid,
    ExerciseWeightInvalid,
    ExerciseDurationInvalid,
    ExerciseRestPeriodInvalid,
    
    // Workout structure errors
    WorkoutTooShort,
    WorkoutTooLong,
    WorkoutNoSections,
    WorkoutUnbalancedMuscleGroups,
    WorkoutMissingWarmup,
    WorkoutMissingCooldown,
    WorkoutExcessiveRest,
    WorkoutInsufficientRest
}

public enum ValidationWarningType
{
    // Template level warnings
    TemplateNameSimilar,
    TemplateDurationLong,
    TemplateDurationShort,
    TemplateEquipmentMissing,
    TemplateInstructionsMissing,
    
    // Section level warnings
    SectionNameSimilar,
    SectionRestPeriodLong,
    SectionRestPeriodShort,
    SectionTooManyExercises,
    SectionTooFewExercises,
    
    // Exercise level warnings
    ExerciseWeightHigh,
    ExerciseWeightLow,
    ExerciseRepsHigh,
    ExerciseRepsLow,
    ExerciseDurationLong,
    ExerciseDurationShort,
    ExerciseRestPeriodLong,
    ExerciseRestPeriodShort,
    
    // Workout structure warnings
    WorkoutIntensityHigh,
    WorkoutIntensityLow,
    WorkoutMuscleGroupImbalance,
    WorkoutEquipmentHeavy,
    WorkoutSpaceRequirements
}

public enum ValidationInfoType
{
    // Template level info
    TemplateCreated,
    TemplateUpdated,
    TemplateP90XCompliant,
    TemplateEquipmentListed,
    TemplateInstructionsProvided,
    
    // Section level info
    SectionBalanced,
    SectionProperRest,
    SectionGoodExerciseCount,
    
    // Exercise level info
    ExerciseProperlyConfigured,
    ExerciseGoodParameters,
    ExerciseEquipmentListed,
    
    // Workout structure info
    WorkoutWellStructured,
    WorkoutBalancedMuscleGroups,
    WorkoutAppropriateDuration,
    WorkoutGoodIntensity
}
