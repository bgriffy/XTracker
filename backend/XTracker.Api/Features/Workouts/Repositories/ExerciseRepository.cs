using Microsoft.EntityFrameworkCore;
using XTracker.Api.Common.Data;
using XTracker.Api.Features.Workouts.Models;
using XTracker.Api.Features.Workouts.Models.Enums;

namespace XTracker.Api.Features.Workouts.Repositories;

public class ExerciseRepository : IExerciseRepository
{
    private readonly XTrackerDbContext _context;

    public ExerciseRepository(XTrackerDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Exercise>> GetAllAsync()
    {
        return await _context.Exercises
            .OrderBy(e => e.Name)
            .ToListAsync();
    }

    public async Task<Exercise?> GetByIdAsync(int id)
    {
        return await _context.Exercises.FindAsync(id);
    }

    public async Task<IEnumerable<Exercise>> GetByCategoryAsync(ExerciseCategory category)
    {
        return await _context.Exercises
            .Where(e => e.Category == category)
            .OrderBy(e => e.Name)
            .ToListAsync();
    }

    public async Task<Exercise> CreateAsync(Exercise exercise)
    {
        exercise.CreatedAt = DateTime.UtcNow;
        
        _context.Exercises.Add(exercise);
        await _context.SaveChangesAsync();
        return exercise;
    }

    public async Task<Exercise> UpdateAsync(Exercise exercise)
    {
        _context.Exercises.Update(exercise);
        await _context.SaveChangesAsync();
        return exercise;
    }

    public async Task DeleteAsync(int id)
    {
        var exercise = await _context.Exercises.FindAsync(id);
        if (exercise != null)
        {
            _context.Exercises.Remove(exercise);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _context.Exercises.AnyAsync(e => e.Id == id);
    }
}
