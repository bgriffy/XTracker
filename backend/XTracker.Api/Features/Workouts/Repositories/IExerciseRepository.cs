using XTracker.Api.Features.Workouts.Models;

namespace XTracker.Api.Features.Workouts.Repositories;

public interface IExerciseRepository
{
    Task<IEnumerable<Exercise>> GetAllAsync();
    Task<Exercise?> GetByIdAsync(int id);
    Task<IEnumerable<Exercise>> GetByCategoryAsync(string category);
    Task<Exercise> CreateAsync(Exercise exercise);
    Task<Exercise> UpdateAsync(Exercise exercise);
    Task DeleteAsync(int id);
    Task<bool> ExistsAsync(int id);
}
