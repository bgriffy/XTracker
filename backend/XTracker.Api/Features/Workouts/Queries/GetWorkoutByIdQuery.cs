using AutoMapper;
using MediatR;
using XTracker.Api.Features.Workouts.DTOs;
using XTracker.Api.Features.Workouts.Repositories;

namespace XTracker.Api.Features.Workouts.Queries;

public record GetWorkoutByIdQuery(int Id) : IRequest<WorkoutResponseDto?>;

public class GetWorkoutByIdQueryHandler : IRequestHandler<GetWorkoutByIdQuery, WorkoutResponseDto?>
{
    private readonly IWorkoutRepository _workoutRepository;
    private readonly IMapper _mapper;

    public GetWorkoutByIdQueryHandler(IWorkoutRepository workoutRepository, IMapper mapper)
    {
        _workoutRepository = workoutRepository;
        _mapper = mapper;
    }

    public async Task<WorkoutResponseDto?> Handle(GetWorkoutByIdQuery request, CancellationToken cancellationToken)
    {
        var workout = await _workoutRepository.GetByIdAsync(request.Id);
        
        if (workout == null)
        {
            return null;
        }

        return _mapper.Map<WorkoutResponseDto>(workout);
    }
}
