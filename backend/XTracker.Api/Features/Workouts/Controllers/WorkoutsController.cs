using MediatR;
using Microsoft.AspNetCore.Mvc;
using XTracker.Api.Features.Workouts.Commands;
using XTracker.Api.Features.Workouts.DTOs;
using XTracker.Api.Features.Workouts.Queries;
using Serilog;

namespace XTracker.Api.Features.Workouts.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WorkoutsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<WorkoutsController> _logger;

    public WorkoutsController(IMediator mediator, ILogger<WorkoutsController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    [HttpPost]
    public async Task<ActionResult<WorkoutResponseDto>> CreateWorkout([FromBody] WorkoutCreateDto workoutDto)
    {
        _logger.LogInformation("Creating new workout with type: {WorkoutType}", workoutDto.Type);
        
        try
        {
            var command = new CreateWorkoutCommand(workoutDto);
            var result = await _mediator.Send(command);
            
            _logger.LogInformation("Successfully created workout with ID: {WorkoutId}", result.Id);
            return CreatedAtAction(nameof(GetWorkoutById), new { id = result.Id }, result);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Failed to create workout due to validation error: {ErrorMessage}", ex.Message);
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error occurred while creating workout");
            throw;
        }
    }

    [HttpGet]
    public async Task<ActionResult<WorkoutListResponseDto>> GetWorkouts(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? type = null,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        _logger.LogInformation("Getting workouts - Page: {PageNumber}, Size: {PageSize}, Type: {Type}, StartDate: {StartDate}, EndDate: {EndDate}", 
            pageNumber, pageSize, type, startDate, endDate);
        
        try
        {
            var query = new GetWorkoutsQuery(pageNumber, pageSize, type, startDate, endDate);
            var result = await _mediator.Send(query);
            
            _logger.LogInformation("Successfully retrieved {Count} workouts", result.Workouts.Count);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving workouts");
            throw;
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<WorkoutResponseDto>> GetWorkoutById(int id)
    {
        _logger.LogInformation("Getting workout by ID: {WorkoutId}", id);
        
        try
        {
            var query = new GetWorkoutByIdQuery(id);
            var result = await _mediator.Send(query);
            
            if (result == null)
            {
                _logger.LogWarning("Workout with ID {WorkoutId} not found", id);
                return NotFound(new { error = "Workout not found" });
            }
            
            _logger.LogInformation("Successfully retrieved workout with ID: {WorkoutId}", id);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving workout with ID: {WorkoutId}", id);
            throw;
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<WorkoutResponseDto>> UpdateWorkout(int id, [FromBody] WorkoutUpdateDto workoutDto)
    {
        _logger.LogInformation("Updating workout with ID: {WorkoutId}", id);
        
        try
        {
            var command = new UpdateWorkoutCommand(id, workoutDto);
            var result = await _mediator.Send(command);
            
            if (result == null)
            {
                _logger.LogWarning("Workout with ID {WorkoutId} not found for update", id);
                return NotFound(new { error = "Workout not found" });
            }
            
            _logger.LogInformation("Successfully updated workout with ID: {WorkoutId}", id);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Failed to update workout with ID {WorkoutId} due to validation error: {ErrorMessage}", id, ex.Message);
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error occurred while updating workout with ID: {WorkoutId}", id);
            throw;
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteWorkout(int id)
    {
        _logger.LogInformation("Deleting workout with ID: {WorkoutId}", id);
        
        try
        {
            var command = new DeleteWorkoutCommand(id);
            var result = await _mediator.Send(command);
            
            if (!result)
            {
                _logger.LogWarning("Workout with ID {WorkoutId} not found for deletion", id);
                return NotFound(new { error = "Workout not found" });
            }
            
            _logger.LogInformation("Successfully deleted workout with ID: {WorkoutId}", id);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while deleting workout with ID: {WorkoutId}", id);
            throw;
        }
    }
}
