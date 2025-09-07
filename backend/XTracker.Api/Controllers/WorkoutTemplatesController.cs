using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using XTracker.Api.Common.Data;
using XTracker.Api.Features.Workouts.Models;
using XTracker.Api.Features.Workouts.Models.Enums;

namespace XTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WorkoutTemplatesController : ControllerBase
{
    private readonly XTrackerDbContext _context;
    private readonly ILogger<WorkoutTemplatesController> _logger;

    public WorkoutTemplatesController(XTrackerDbContext context, ILogger<WorkoutTemplatesController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Gets all workout templates
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetWorkoutTemplates()
    {
        try
        {
            var templates = await _context.WorkoutTemplates
                .Include(t => t.Sections)
                    .ThenInclude(s => s.Exercises)
                        .ThenInclude(e => e.Exercise)
                .Where(t => t.IsActive)
                .OrderBy(t => t.Name)
                .ToListAsync();

            var response = templates.Select(t => new
            {
                t.Id,
                t.Name,
                t.Description,
                Category = t.Category.ToString(),
                Difficulty = t.Difficulty.ToString(),
                t.EstimatedDurationMinutes,
                t.Equipment,
                t.Instructions,
                t.IsP90XWorkout,
                ExerciseCount = t.Sections.Sum(s => s.Exercises.Count),
                SectionCount = t.Sections.Count
            });

            return Ok(new { templates = response });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching workout templates");
            return StatusCode(500, new { message = "Error fetching workout templates", error = ex.Message });
        }
    }

    /// <summary>
    /// Gets a specific workout template by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetWorkoutTemplate(int id)
    {
        try
        {
            var template = await _context.WorkoutTemplates
                .Include(t => t.Sections)
                    .ThenInclude(s => s.Exercises)
                        .ThenInclude(e => e.Exercise)
                .FirstOrDefaultAsync(t => t.Id == id && t.IsActive);

            if (template == null)
            {
                return NotFound(new { message = "Workout template not found" });
            }

            var response = new
            {
                template.Id,
                template.Name,
                template.Description,
                Category = template.Category.ToString(),
                Difficulty = template.Difficulty.ToString(),
                template.EstimatedDurationMinutes,
                template.Equipment,
                template.Instructions,
                template.IsP90XWorkout,
                Sections = template.Sections.OrderBy(s => s.Order).Select(s => new
                {
                    s.Id,
                    s.Name,
                    s.Description,
                    Type = s.Type.ToString(),
                    s.Order,
                    s.Instructions,
                    s.RestPeriodSeconds,
                    Exercises = s.Exercises.OrderBy(e => e.Order).Select(e => new
                    {
                        e.Id,
                        e.Order,
                        e.Sets,
                        Reps = e.RepsMin.HasValue && e.RepsMax.HasValue ? $"{e.RepsMin}-{e.RepsMax}" : e.RepsMin?.ToString() ?? "Variable",
                        e.Weight,
                        Duration = e.DurationSeconds.HasValue ? $"{e.DurationSeconds}s" : null,
                        RestPeriodSeconds = e.RestBetweenSetsSeconds,
                        e.Notes,
                        Exercise = new
                        {
                            e.Exercise.Id,
                            e.Exercise.Name,
                            e.Exercise.Description,
                            Category = e.Exercise.Category.ToString(),
                            Difficulty = e.Exercise.Difficulty.ToString(),
                            PrimaryMuscleGroups = e.Exercise.PrimaryMuscleGroups.ToString(),
                            SecondaryMuscleGroups = e.Exercise.SecondaryMuscleGroups.ToString(),
                            e.Exercise.Equipment,
                            e.Exercise.FormTips,
                            e.Exercise.VideoUrl,
                            e.Exercise.ImageUrl
                        }
                    })
                })
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching workout template {TemplateId}", id);
            return StatusCode(500, new { message = "Error fetching workout template", error = ex.Message });
        }
    }

    /// <summary>
    /// Gets all P90X workout templates
    /// </summary>
    [HttpGet("p90x")]
    public async Task<IActionResult> GetP90XWorkoutTemplates()
    {
        try
        {
            var templates = await _context.WorkoutTemplates
                .Include(t => t.Sections)
                    .ThenInclude(s => s.Exercises)
                        .ThenInclude(e => e.Exercise)
                .Where(t => t.IsActive && t.IsP90XWorkout)
                .OrderBy(t => t.Name)
                .ToListAsync();

            var response = templates.Select(t => new
            {
                t.Id,
                t.Name,
                t.Description,
                Category = t.Category.ToString(),
                Difficulty = t.Difficulty.ToString(),
                t.EstimatedDurationMinutes,
                t.Equipment,
                t.Instructions,
                t.IsP90XWorkout,
                ExerciseCount = t.Sections.Sum(s => s.Exercises.Count),
                SectionCount = t.Sections.Count
            });

            return Ok(new { templates = response });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching P90X workout templates");
            return StatusCode(500, new { message = "Error fetching P90X workout templates", error = ex.Message });
        }
    }

    /// <summary>
    /// Gets workout templates by category
    /// </summary>
    [HttpGet("category/{category}")]
    public async Task<IActionResult> GetWorkoutTemplatesByCategory(string category)
    {
        try
        {
            if (!Enum.TryParse<WorkoutCategory>(category, true, out var workoutCategory))
            {
                return BadRequest(new { message = "Invalid category" });
            }

            var templates = await _context.WorkoutTemplates
                .Include(t => t.Sections)
                    .ThenInclude(s => s.Exercises)
                        .ThenInclude(e => e.Exercise)
                .Where(t => t.IsActive && t.Category == workoutCategory)
                .OrderBy(t => t.Name)
                .ToListAsync();

            var response = templates.Select(t => new
            {
                t.Id,
                t.Name,
                t.Description,
                Category = t.Category.ToString(),
                Difficulty = t.Difficulty.ToString(),
                t.EstimatedDurationMinutes,
                t.Equipment,
                t.Instructions,
                t.IsP90XWorkout,
                ExerciseCount = t.Sections.Sum(s => s.Exercises.Count),
                SectionCount = t.Sections.Count
            });

            return Ok(new { templates = response });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching workout templates by category {Category}", category);
            return StatusCode(500, new { message = "Error fetching workout templates by category", error = ex.Message });
        }
    }
}
