using AutoMapper;
using MediatR;
using XTracker.Api.Features.Workouts.DTOs;
using XTracker.Api.Features.Workouts.Models;
using XTracker.Api.Features.Workouts.Repositories;

namespace XTracker.Api.Features.Workouts.Commands;

public record UpdateWorkoutCommand(int Id, WorkoutUpdateDto WorkoutDto) : IRequest<WorkoutResponseDto?>;

public class UpdateWorkoutCommandHandler : IRequestHandler<UpdateWorkoutCommand, WorkoutResponseDto?>
{
    private readonly IWorkoutRepository _workoutRepository;
    private readonly IExerciseRepository _exerciseRepository;
    private readonly IMapper _mapper;

    public UpdateWorkoutCommandHandler(
        IWorkoutRepository workoutRepository,
        IExerciseRepository exerciseRepository,
        IMapper mapper)
    {
        _workoutRepository = workoutRepository;
        _exerciseRepository = exerciseRepository;
        _mapper = mapper;
    }

    public async Task<WorkoutResponseDto?> Handle(UpdateWorkoutCommand request, CancellationToken cancellationToken)
    {
        // Check if workout exists
        var existingWorkout = await _workoutRepository.GetByIdAsync(request.Id);
        if (existingWorkout == null)
        {
            return null;
        }

        // Validate that all exercises exist
        if (request.WorkoutDto.Exercises != null)
        {
            foreach (var exerciseDto in request.WorkoutDto.Exercises)
            {
                var exercise = await _exerciseRepository.GetByIdAsync(exerciseDto.ExerciseId);
                if (exercise == null)
                {
                    throw new ArgumentException($"Exercise with ID {exerciseDto.ExerciseId} not found");
                }
            }
        }

        // Update the existing workout entity properties
        existingWorkout.Date = request.WorkoutDto.Date;
        existingWorkout.Type = request.WorkoutDto.Type;
        existingWorkout.DurationMinutes = request.WorkoutDto.DurationMinutes;
        existingWorkout.Notes = request.WorkoutDto.Notes;
        existingWorkout.Reps = request.WorkoutDto.Reps;
        existingWorkout.Weight = request.WorkoutDto.Weight;
        existingWorkout.UpdatedAt = DateTime.UtcNow;

        // Update the workout
        var updatedWorkout = await _workoutRepository.UpdateAsync(existingWorkout);

        // Map back to response DTO
        return _mapper.Map<WorkoutResponseDto>(updatedWorkout);
    }
}
