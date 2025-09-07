using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using XTracker.Api.Common.Data;
using Serilog;

namespace XTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    private readonly XTrackerDbContext _context;
    private readonly ILogger<HealthController> _logger;

    public HealthController(XTrackerDbContext context, ILogger<HealthController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        _logger.LogInformation("Health check requested");
        
        try
        {
            // Test database connection
            _logger.LogDebug("Testing database connection");
            await _context.Database.CanConnectAsync();
            
            // Check if required tables exist
            _logger.LogDebug("Checking if required tables exist");
            var tablesExist = await CheckRequiredTablesExist();
            
            var healthStatus = new
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
            };
            
            _logger.LogInformation("Health check completed successfully - Status: {Status}, Schema: {Schema}", 
                healthStatus.status, healthStatus.schema);
            
            return Ok(healthStatus);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Health check failed - Database connection error: {ErrorMessage}", ex.Message);
            
            var unhealthyStatus = new
            {
                status = "unhealthy",
                timestamp = DateTime.UtcNow,
                database = "disconnected",
                error = ex.Message
            };
            
            return StatusCode(503, unhealthyStatus);
        }
    }

    private async Task<bool> CheckRequiredTablesExist()
    {
        try
        {
            _logger.LogDebug("Verifying required tables exist");
            
            // Try to query each table to verify they exist
            await _context.Workouts.FirstOrDefaultAsync();
            await _context.Exercises.FirstOrDefaultAsync();
            await _context.WorkoutExercises.FirstOrDefaultAsync();
            
            _logger.LogDebug("All required tables exist");
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "One or more required tables do not exist or are not accessible");
            return false;
        }
    }
}
