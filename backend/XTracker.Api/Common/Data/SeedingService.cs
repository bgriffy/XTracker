using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using XTracker.Api.Features.Workouts.Models;

namespace XTracker.Api.Common.Data;

public interface ISeedingService
{
    Task SeedAsync();
    Task ReseedAsync();
    Task<bool> IsSeededAsync();
    Task<int> GetExerciseCountAsync();
    Task<int> GetTemplateCountAsync();
}

public class SeedingService : ISeedingService
{
    private readonly XTrackerDbContext _context;
    private readonly ILogger<SeedingService> _logger;

    public SeedingService(XTrackerDbContext context, ILogger<SeedingService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task SeedAsync()
    {
        await DatabaseSeeder.SeedAsync(_context, _logger);
    }

    public async Task ReseedAsync()
    {
        await DatabaseSeeder.ReseedAsync(_context, _logger);
    }

    public async Task<bool> IsSeededAsync()
    {
        var exerciseCount = await _context.Exercises.CountAsync();
        var templateCount = await _context.WorkoutTemplates.CountAsync();
        
        return exerciseCount > 0 && templateCount > 0;
    }

    public async Task<int> GetExerciseCountAsync()
    {
        return await _context.Exercises.CountAsync();
    }

    public async Task<int> GetTemplateCountAsync()
    {
        return await _context.WorkoutTemplates.CountAsync();
    }
}
