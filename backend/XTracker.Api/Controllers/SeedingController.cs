using Microsoft.AspNetCore.Mvc;
using XTracker.Api.Common.Data;

namespace XTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SeedingController : ControllerBase
{
    private readonly ISeedingService _seedingService;
    private readonly ILogger<SeedingController> _logger;

    public SeedingController(ISeedingService seedingService, ILogger<SeedingController> logger)
    {
        _seedingService = seedingService;
        _logger = logger;
    }

    /// <summary>
    /// Seeds the database with initial data
    /// </summary>
    [HttpPost("seed")]
    public async Task<IActionResult> Seed()
    {
        try
        {
            await _seedingService.SeedAsync();
            return Ok(new { message = "Database seeded successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding database");
            return StatusCode(500, new { message = "Error seeding database", error = ex.Message });
        }
    }

    /// <summary>
    /// Reseeds the database by clearing existing data and re-adding it
    /// </summary>
    [HttpPost("reseed")]
    public async Task<IActionResult> Reseed()
    {
        try
        {
            await _seedingService.ReseedAsync();
            return Ok(new { message = "Database reseeded successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error reseeding database");
            return StatusCode(500, new { message = "Error reseeding database", error = ex.Message });
        }
    }

    /// <summary>
    /// Checks if the database has been seeded
    /// </summary>
    [HttpGet("status")]
    public async Task<IActionResult> GetStatus()
    {
        try
        {
            var isSeeded = await _seedingService.IsSeededAsync();
            var exerciseCount = await _seedingService.GetExerciseCountAsync();
            var templateCount = await _seedingService.GetTemplateCountAsync();

            return Ok(new
            {
                isSeeded,
                exerciseCount,
                templateCount,
                message = isSeeded ? "Database is seeded" : "Database is not seeded"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking seeding status");
            return StatusCode(500, new { message = "Error checking seeding status", error = ex.Message });
        }
    }
}
