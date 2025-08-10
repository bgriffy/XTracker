using AutoMapper;
using MediatR;
using XTracker.Api.Features.Workouts.DTOs;
using XTracker.Api.Features.Workouts.Models;
using XTracker.Api.Features.Workouts.Repositories;

namespace XTracker.Api.Features.Workouts.Commands;

public record CreateWorkoutCommand(WorkoutCreateDto WorkoutDto) : IRequest<WorkoutResponseDto>;

public class CreateWorkoutCommandHandler : IRequestHandler<CreateWorkoutCommand, WorkoutResponseDto>
{
    private readonly IWorkoutRepository _workoutRepository;
    private readonly IExerciseRepository _exerciseRepository;
    private readonly IMapper _mapper;

    public CreateWorkoutCommandHandler(
        IWorkoutRepository workoutRepository,
        IExerciseRepository exerciseRepository,
        IMapper mapper)
    {
        _workoutRepository = workoutRepository;
        _exerciseRepository = exerciseRepository;
        _mapper = mapper;
    }

    public async Task<WorkoutResponseDto> Handle(CreateWorkoutCommand request, CancellationToken cancellationToken)
    {
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

        // Map DTO to entity
        var workout = _mapper.Map<Workout>(request.WorkoutDto);

        // Create the workout
        var createdWorkout = await _workoutRepository.CreateAsync(workout);

        // Map back to response DTO
        return _mapper.Map<WorkoutResponseDto>(createdWorkout);
    }
}
