using Microsoft.AspNetCore.Mvc;
using XTracker.Api.Features.Workouts.Models;
using XTracker.Api.Features.Workouts.Models.Validation;
using XTracker.Api.Features.Workouts.Services;

namespace XTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TemplateValidationController : ControllerBase
{
    private readonly ITemplateValidationService _validationService;
    private readonly ILogger<TemplateValidationController> _logger;

    public TemplateValidationController(
        ITemplateValidationService validationService, 
        ILogger<TemplateValidationController> logger)
    {
        _validationService = validationService;
        _logger = logger;
    }

    /// <summary>
    /// Validates a workout template
    /// </summary>
    [HttpPost("validate-template")]
    public async Task<IActionResult> ValidateTemplate([FromBody] WorkoutTemplate template)
    {
        try
        {
            if (template == null)
            {
                return BadRequest(new { message = "Template is required" });
            }

            var result = await _validationService.ValidateTemplateAsync(template);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating template");
            return StatusCode(500, new { message = "Error validating template", error = ex.Message });
        }
    }

    /// <summary>
    /// Validates a workout template section
    /// </summary>
    [HttpPost("validate-section")]
    public async Task<IActionResult> ValidateSection(
        [FromBody] WorkoutTemplateSection section,
        [FromQuery] string templateName)
    {
        try
        {
            if (section == null)
            {
                return BadRequest(new { message = "Section is required" });
            }

            if (string.IsNullOrWhiteSpace(templateName))
            {
                return BadRequest(new { message = "Template name is required" });
            }

            var result = await _validationService.ValidateSectionAsync(section, templateName);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating section");
            return StatusCode(500, new { message = "Error validating section", error = ex.Message });
        }
    }

    /// <summary>
    /// Validates a workout template exercise
    /// </summary>
    [HttpPost("validate-exercise")]
    public async Task<IActionResult> ValidateExercise(
        [FromBody] WorkoutTemplateExercise exercise,
        [FromQuery] string templateName,
        [FromQuery] string sectionName)
    {
        try
        {
            if (exercise == null)
            {
                return BadRequest(new { message = "Exercise is required" });
            }

            if (string.IsNullOrWhiteSpace(templateName))
            {
                return BadRequest(new { message = "Template name is required" });
            }

            if (string.IsNullOrWhiteSpace(sectionName))
            {
                return BadRequest(new { message = "Section name is required" });
            }

            var result = await _validationService.ValidateExerciseAsync(exercise, templateName, sectionName);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating exercise");
            return StatusCode(500, new { message = "Error validating exercise", error = ex.Message });
        }
    }

    /// <summary>
    /// Validates workout structure and balance
    /// </summary>
    [HttpPost("validate-structure")]
    public async Task<IActionResult> ValidateStructure([FromBody] WorkoutTemplate template)
    {
        try
        {
            if (template == null)
            {
                return BadRequest(new { message = "Template is required" });
            }

            var result = await _validationService.ValidateWorkoutStructureAsync(template);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating workout structure");
            return StatusCode(500, new { message = "Error validating workout structure", error = ex.Message });
        }
    }

    /// <summary>
    /// Validates P90X specific requirements
    /// </summary>
    [HttpPost("validate-p90x")]
    public async Task<IActionResult> ValidateP90X([FromBody] WorkoutTemplate template)
    {
        try
        {
            if (template == null)
            {
                return BadRequest(new { message = "Template is required" });
            }

            var result = await _validationService.ValidateP90XRequirementsAsync(template);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating P90X requirements");
            return StatusCode(500, new { message = "Error validating P90X requirements", error = ex.Message });
        }
    }

    /// <summary>
    /// Gets validation suggestions for improving a template
    /// </summary>
    [HttpPost("suggestions")]
    public async Task<IActionResult> GetSuggestions([FromBody] WorkoutTemplate template)
    {
        try
        {
            if (template == null)
            {
                return BadRequest(new { message = "Template is required" });
            }

            var suggestions = await _validationService.GetValidationSuggestionsAsync(template);
            return Ok(new { suggestions });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting validation suggestions");
            return StatusCode(500, new { message = "Error getting validation suggestions", error = ex.Message });
        }
    }

    /// <summary>
    /// Validates multiple templates for consistency
    /// </summary>
    [HttpPost("validate-consistency")]
    public async Task<IActionResult> ValidateConsistency([FromBody] List<WorkoutTemplate> templates)
    {
        try
        {
            if (templates == null || !templates.Any())
            {
                return BadRequest(new { message = "Templates are required" });
            }

            var result = await _validationService.ValidateTemplateConsistencyAsync(templates);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating template consistency");
            return StatusCode(500, new { message = "Error validating template consistency", error = ex.Message });
        }
    }

    /// <summary>
    /// Gets validation error types and their descriptions
    /// </summary>
    [HttpGet("error-types")]
    public IActionResult GetErrorTypes()
    {
        var errorTypes = Enum.GetValues<ValidationErrorType>()
            .Select(e => new
            {
                Type = e.ToString(),
                Description = GetErrorTypeDescription(e)
            })
            .ToList();

        return Ok(new { errorTypes });
    }

    /// <summary>
    /// Gets validation warning types and their descriptions
    /// </summary>
    [HttpGet("warning-types")]
    public IActionResult GetWarningTypes()
    {
        var warningTypes = Enum.GetValues<ValidationWarningType>()
            .Select(w => new
            {
                Type = w.ToString(),
                Description = GetWarningTypeDescription(w)
            })
            .ToList();

        return Ok(new { warningTypes });
    }

    /// <summary>
    /// Gets validation info types and their descriptions
    /// </summary>
    [HttpGet("info-types")]
    public IActionResult GetInfoTypes()
    {
        var infoTypes = Enum.GetValues<ValidationInfoType>()
            .Select(i => new
            {
                Type = i.ToString(),
                Description = GetInfoTypeDescription(i)
            })
            .ToList();

        return Ok(new { infoTypes });
    }

    private string GetErrorTypeDescription(ValidationErrorType type)
    {
        return type switch
        {
            ValidationErrorType.TemplateNameEmpty => "Template name is required",
            ValidationErrorType.TemplateNameTooLong => "Template name exceeds maximum length",
            ValidationErrorType.TemplateDurationInvalid => "Template duration is invalid",
            ValidationErrorType.TemplateCategoryInvalid => "Template category is invalid",
            ValidationErrorType.TemplateDifficultyInvalid => "Template difficulty level is invalid",
            ValidationErrorType.TemplateDuplicateName => "Template name already exists",
            ValidationErrorType.SectionNameEmpty => "Section name is required",
            ValidationErrorType.SectionNameTooLong => "Section name exceeds maximum length",
            ValidationErrorType.SectionOrderInvalid => "Section order is invalid",
            ValidationErrorType.SectionOrderDuplicate => "Section order is duplicated",
            ValidationErrorType.SectionTypeInvalid => "Section type is invalid",
            ValidationErrorType.SectionRestPeriodInvalid => "Section rest period is invalid",
            ValidationErrorType.SectionNoExercises => "Section has no exercises",
            ValidationErrorType.ExerciseNotFound => "Exercise not found in database",
            ValidationErrorType.ExerciseOrderInvalid => "Exercise order is invalid",
            ValidationErrorType.ExerciseOrderDuplicate => "Exercise order is duplicated",
            ValidationErrorType.ExerciseSetsInvalid => "Exercise sets count is invalid",
            ValidationErrorType.ExerciseRepsInvalid => "Exercise reps range is invalid",
            ValidationErrorType.ExerciseWeightInvalid => "Exercise weight is invalid",
            ValidationErrorType.ExerciseDurationInvalid => "Exercise duration is invalid",
            ValidationErrorType.ExerciseRestPeriodInvalid => "Exercise rest period is invalid",
            ValidationErrorType.WorkoutTooShort => "Workout duration is too short",
            ValidationErrorType.WorkoutTooLong => "Workout duration is too long",
            ValidationErrorType.WorkoutNoSections => "Workout has no sections",
            ValidationErrorType.WorkoutUnbalancedMuscleGroups => "Workout has unbalanced muscle groups",
            ValidationErrorType.WorkoutMissingWarmup => "Workout is missing warm-up section",
            ValidationErrorType.WorkoutMissingCooldown => "Workout is missing cool-down section",
            ValidationErrorType.WorkoutExcessiveRest => "Workout has excessive rest periods",
            ValidationErrorType.WorkoutInsufficientRest => "Workout has insufficient rest periods",
            _ => "Unknown error type"
        };
    }

    private string GetWarningTypeDescription(ValidationWarningType type)
    {
        return type switch
        {
            ValidationWarningType.TemplateNameSimilar => "Template name is similar to existing templates",
            ValidationWarningType.TemplateDurationLong => "Template duration is longer than typical",
            ValidationWarningType.TemplateDurationShort => "Template duration is shorter than typical",
            ValidationWarningType.TemplateEquipmentMissing => "Template equipment requirements not specified",
            ValidationWarningType.TemplateInstructionsMissing => "Template instructions not provided",
            ValidationWarningType.SectionNameSimilar => "Section name is similar to other sections",
            ValidationWarningType.SectionRestPeriodLong => "Section rest period is longer than typical",
            ValidationWarningType.SectionRestPeriodShort => "Section rest period is shorter than typical",
            ValidationWarningType.SectionTooManyExercises => "Section has more exercises than typical",
            ValidationWarningType.SectionTooFewExercises => "Section has fewer exercises than typical",
            ValidationWarningType.ExerciseWeightHigh => "Exercise weight is higher than typical",
            ValidationWarningType.ExerciseWeightLow => "Exercise weight is lower than typical",
            ValidationWarningType.ExerciseRepsHigh => "Exercise reps are higher than typical",
            ValidationWarningType.ExerciseRepsLow => "Exercise reps are lower than typical",
            ValidationWarningType.ExerciseDurationLong => "Exercise duration is longer than typical",
            ValidationWarningType.ExerciseDurationShort => "Exercise duration is shorter than typical",
            ValidationWarningType.ExerciseRestPeriodLong => "Exercise rest period is longer than typical",
            ValidationWarningType.ExerciseRestPeriodShort => "Exercise rest period is shorter than typical",
            ValidationWarningType.WorkoutIntensityHigh => "Workout intensity is higher than typical",
            ValidationWarningType.WorkoutIntensityLow => "Workout intensity is lower than typical",
            ValidationWarningType.WorkoutMuscleGroupImbalance => "Workout has muscle group imbalance",
            ValidationWarningType.WorkoutEquipmentHeavy => "Workout requires heavy equipment",
            ValidationWarningType.WorkoutSpaceRequirements => "Workout requires significant space",
            _ => "Unknown warning type"
        };
    }

    private string GetInfoTypeDescription(ValidationInfoType type)
    {
        return type switch
        {
            ValidationInfoType.TemplateCreated => "Template was successfully created",
            ValidationInfoType.TemplateUpdated => "Template was successfully updated",
            ValidationInfoType.TemplateP90XCompliant => "Template follows P90X standards",
            ValidationInfoType.TemplateEquipmentListed => "Template equipment requirements are specified",
            ValidationInfoType.TemplateInstructionsProvided => "Template instructions are provided",
            ValidationInfoType.SectionBalanced => "Section is well balanced",
            ValidationInfoType.SectionProperRest => "Section has appropriate rest periods",
            ValidationInfoType.SectionGoodExerciseCount => "Section has appropriate number of exercises",
            ValidationInfoType.ExerciseProperlyConfigured => "Exercise is properly configured",
            ValidationInfoType.ExerciseGoodParameters => "Exercise has good parameters",
            ValidationInfoType.ExerciseEquipmentListed => "Exercise equipment is specified",
            ValidationInfoType.WorkoutWellStructured => "Workout is well structured",
            ValidationInfoType.WorkoutBalancedMuscleGroups => "Workout has balanced muscle groups",
            ValidationInfoType.WorkoutAppropriateDuration => "Workout has appropriate duration",
            ValidationInfoType.WorkoutGoodIntensity => "Workout has good intensity level",
            _ => "Unknown info type"
        };
    }
}
