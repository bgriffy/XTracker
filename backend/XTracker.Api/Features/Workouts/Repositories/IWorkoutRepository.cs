using XTracker.Api.Features.Workouts.Models;

namespace XTracker.Api.Features.Workouts.Repositories;

public interface IWorkoutRepository
{
    Task<IEnumerable<Workout>> GetAllAsync();
    Task<Workout?> GetByIdAsync(int id);
    Task<IEnumerable<Workout>> GetByDateRangeAsync(DateTime startDate, DateTime endDate);
    Task<IEnumerable<Workout>> GetByTypeAsync(string type);
    Task<Workout> CreateAsync(Workout workout);
    Task<Workout> UpdateAsync(Workout workout);
    Task DeleteAsync(int id);
    Task<bool> ExistsAsync(int id);
}
