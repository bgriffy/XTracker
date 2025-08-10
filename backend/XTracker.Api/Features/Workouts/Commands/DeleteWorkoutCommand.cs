using MediatR;
using XTracker.Api.Features.Workouts.Repositories;

namespace XTracker.Api.Features.Workouts.Commands;

public record DeleteWorkoutCommand(int Id) : IRequest<bool>;

public class DeleteWorkoutCommandHandler : IRequestHandler<DeleteWorkoutCommand, bool>
{
    private readonly IWorkoutRepository _workoutRepository;

    public DeleteWorkoutCommandHandler(IWorkoutRepository workoutRepository)
    {
        _workoutRepository = workoutRepository;
    }

    public async Task<bool> Handle(DeleteWorkoutCommand request, CancellationToken cancellationToken)
    {
        // Check if workout exists
        var exists = await _workoutRepository.ExistsAsync(request.Id);
        if (!exists)
        {
            return false;
        }

        // Delete the workout
        await _workoutRepository.DeleteAsync(request.Id);
        return true;
    }
}
