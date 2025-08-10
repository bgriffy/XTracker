using AutoMapper;
using MediatR;
using XTracker.Api.Features.Workouts.DTOs;
using XTracker.Api.Features.Workouts.Repositories;

namespace XTracker.Api.Features.Workouts.Queries;

public record GetWorkoutsQuery(
    int PageNumber = 1,
    int PageSize = 10,
    string? Type = null,
    DateTime? StartDate = null,
    DateTime? EndDate = null) : IRequest<WorkoutListResponseDto>;

public class GetWorkoutsQueryHandler : IRequestHandler<GetWorkoutsQuery, WorkoutListResponseDto>
{
    private readonly IWorkoutRepository _workoutRepository;
    private readonly IMapper _mapper;

    public GetWorkoutsQueryHandler(IWorkoutRepository workoutRepository, IMapper mapper)
    {
        _workoutRepository = workoutRepository;
        _mapper = mapper;
    }

    public async Task<WorkoutListResponseDto> Handle(GetWorkoutsQuery request, CancellationToken cancellationToken)
    {
        // Get all workouts (we'll filter and paginate in memory for now)
        var allWorkouts = await _workoutRepository.GetAllAsync();

        // Apply filters
        var filteredWorkouts = allWorkouts.AsEnumerable();

        if (!string.IsNullOrEmpty(request.Type))
        {
            filteredWorkouts = filteredWorkouts.Where(w => w.Type == request.Type);
        }

        if (request.StartDate.HasValue)
        {
            filteredWorkouts = filteredWorkouts.Where(w => w.Date >= request.StartDate.Value);
        }

        if (request.EndDate.HasValue)
        {
            filteredWorkouts = filteredWorkouts.Where(w => w.Date <= request.EndDate.Value);
        }

        var totalCount = filteredWorkouts.Count();
        var totalPages = (int)Math.Ceiling((double)totalCount / request.PageSize);

        // Apply pagination
        var pagedWorkouts = filteredWorkouts
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToList();

        // Map to DTOs
        var workoutDtos = _mapper.Map<List<WorkoutSummaryDto>>(pagedWorkouts);

        return new WorkoutListResponseDto
        {
            Workouts = workoutDtos,
            TotalCount = totalCount,
            PageNumber = request.PageNumber,
            PageSize = request.PageSize,
            TotalPages = totalPages
        };
    }
}
