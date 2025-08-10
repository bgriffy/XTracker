using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using XTracker.Api.Common.Data;

namespace XTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    private readonly XTrackerDbContext _context;

    public HealthController(XTrackerDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        try
        {
            // Test database connection
            await _context.Database.CanConnectAsync();
            
            // Check if required tables exist
            var tablesExist = await CheckRequiredTablesExist();
            
            return Ok(new
            {
                status = "healthy",
                timestamp = DateTime.UtcNow,
                database = "connected",
                schema = tablesExist ? "valid" : "incomplete",
                tables = new
                {
                    workouts = await _context.Workouts.AnyAsync(),
                    exercises = await _context.Exercises.AnyAsync(),
                    workoutExercises = await _context.WorkoutExercises.AnyAsync()
                }
            });
        }
        catch (Exception ex)
        {
            return StatusCode(503, new
            {
                status = "unhealthy",
                timestamp = DateTime.UtcNow,
                database = "disconnected",
                error = ex.Message
            });
        }
    }

    private async Task<bool> CheckRequiredTablesExist()
    {
        try
        {
            // Try to query each table to verify they exist
            await _context.Workouts.FirstOrDefaultAsync();
            await _context.Exercises.FirstOrDefaultAsync();
            await _context.WorkoutExercises.FirstOrDefaultAsync();
            return true;
        }
        catch
        {
            return false;
        }
    }
}
