using FluentValidation;
using XTracker.Api.Features.Workouts.DTOs;

namespace XTracker.Api.Features.Workouts.Validators;

public class WorkoutUpdateDtoValidator : AbstractValidator<WorkoutUpdateDto>
{
    public WorkoutUpdateDtoValidator()
    {
        RuleFor(x => x.Date)
            .NotEmpty()
            .WithMessage("Date is required")
            .LessThanOrEqualTo(DateTime.Today.AddDays(1))
            .WithMessage("Date cannot be in the future");

        RuleFor(x => x.Type)
            .NotEmpty()
            .WithMessage("Workout type is required")
            .MaximumLength(100)
            .WithMessage("Workout type cannot exceed 100 characters");

        RuleFor(x => x.DurationMinutes)
            .InclusiveBetween(1, 480)
            .WithMessage("Duration must be between 1 and 480 minutes");

        RuleFor(x => x.Notes)
            .MaximumLength(1000)
            .When(x => !string.IsNullOrEmpty(x.Notes))
            .WithMessage("Notes cannot exceed 1000 characters");

        RuleFor(x => x.Reps)
            .InclusiveBetween(0, 1000)
            .When(x => x.Reps.HasValue)
            .WithMessage("Reps must be between 0 and 1000");

        RuleFor(x => x.Weight)
            .InclusiveBetween(0, 1000)
            .When(x => x.Weight.HasValue)
            .WithMessage("Weight must be between 0 and 1000");

        RuleForEach(x => x.Exercises)
            .SetValidator(new WorkoutExerciseUpdateDtoValidator())
            .When(x => x.Exercises != null);
    }
}

public class WorkoutExerciseUpdateDtoValidator : AbstractValidator<WorkoutExerciseUpdateDto>
{
    public WorkoutExerciseUpdateDtoValidator()
    {
        RuleFor(x => x.ExerciseId)
            .GreaterThan(0)
            .WithMessage("Exercise ID must be greater than 0");

        RuleFor(x => x.Sets)
            .InclusiveBetween(1, 50)
            .WithMessage("Sets must be between 1 and 50");

        RuleFor(x => x.Reps)
            .InclusiveBetween(1, 1000)
            .WithMessage("Reps must be between 1 and 1000");

        RuleFor(x => x.Weight)
            .InclusiveBetween(0, 1000)
            .When(x => x.Weight.HasValue)
            .WithMessage("Weight must be between 0 and 1000");

        RuleFor(x => x.Duration)
            .InclusiveBetween(1, 300)
            .When(x => x.Duration.HasValue)
            .WithMessage("Duration must be between 1 and 300 seconds");

        RuleFor(x => x.Notes)
            .MaximumLength(500)
            .When(x => !string.IsNullOrEmpty(x.Notes))
            .WithMessage("Notes cannot exceed 500 characters");
    }
}
