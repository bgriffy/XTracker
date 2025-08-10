using Microsoft.EntityFrameworkCore;
using XTracker.Api.Common.Data;
using XTracker.Api.Features.Workouts.Models;

namespace XTracker.Api.Features.Workouts.Repositories;

public class WorkoutRepository : IWorkoutRepository
{
    private readonly XTrackerDbContext _context;

    public WorkoutRepository(XTrackerDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Workout>> GetAllAsync()
    {
        return await _context.Workouts
            .Include(w => w.WorkoutExercises)
            .ThenInclude(we => we.Exercise)
            .OrderByDescending(w => w.Date)
            .ToListAsync();
    }

    public async Task<Workout?> GetByIdAsync(int id)
    {
        return await _context.Workouts
            .Include(w => w.WorkoutExercises)
            .ThenInclude(we => we.Exercise)
            .FirstOrDefaultAsync(w => w.Id == id);
    }

    public async Task<IEnumerable<Workout>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
    {
        return await _context.Workouts
            .Include(w => w.WorkoutExercises)
            .ThenInclude(we => we.Exercise)
            .Where(w => w.Date >= startDate && w.Date <= endDate)
            .OrderByDescending(w => w.Date)
            .ToListAsync();
    }

    public async Task<IEnumerable<Workout>> GetByTypeAsync(string type)
    {
        return await _context.Workouts
            .Include(w => w.WorkoutExercises)
            .ThenInclude(we => we.Exercise)
            .Where(w => w.Type == type)
            .OrderByDescending(w => w.Date)
            .ToListAsync();
    }

    public async Task<Workout> CreateAsync(Workout workout)
    {
        workout.CreatedAt = DateTime.UtcNow;
        workout.UpdatedAt = DateTime.UtcNow;
        
        _context.Workouts.Add(workout);
        await _context.SaveChangesAsync();
        return workout;
    }

    public async Task<Workout> UpdateAsync(Workout workout)
    {
        workout.UpdatedAt = DateTime.UtcNow;
        
        _context.Workouts.Update(workout);
        await _context.SaveChangesAsync();
        return workout;
    }

    public async Task DeleteAsync(int id)
    {
        var workout = await _context.Workouts.FindAsync(id);
        if (workout != null)
        {
            _context.Workouts.Remove(workout);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _context.Workouts.AnyAsync(w => w.Id == id);
    }
}
