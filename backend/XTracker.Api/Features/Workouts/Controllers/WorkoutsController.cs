using MediatR;
using Microsoft.AspNetCore.Mvc;
using XTracker.Api.Features.Workouts.Commands;
using XTracker.Api.Features.Workouts.DTOs;
using XTracker.Api.Features.Workouts.Queries;

namespace XTracker.Api.Features.Workouts.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WorkoutsController : ControllerBase
{
    private readonly IMediator _mediator;

    public WorkoutsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<ActionResult<WorkoutResponseDto>> CreateWorkout([FromBody] WorkoutCreateDto workoutDto)
    {
        try
        {
            var command = new CreateWorkoutCommand(workoutDto);
            var result = await _mediator.Send(command);
            
            return CreatedAtAction(nameof(GetWorkoutById), new { id = result.Id }, result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
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
        var query = new GetWorkoutsQuery(pageNumber, pageSize, type, startDate, endDate);
        var result = await _mediator.Send(query);
        
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<WorkoutResponseDto>> GetWorkoutById(int id)
    {
        var query = new GetWorkoutByIdQuery(id);
        var result = await _mediator.Send(query);
        
        if (result == null)
        {
            return NotFound(new { error = "Workout not found" });
        }
        
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<WorkoutResponseDto>> UpdateWorkout(int id, [FromBody] WorkoutUpdateDto workoutDto)
    {
        try
        {
            var command = new UpdateWorkoutCommand(id, workoutDto);
            var result = await _mediator.Send(command);
            
            if (result == null)
            {
                return NotFound(new { error = "Workout not found" });
            }
            
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteWorkout(int id)
    {
        var command = new DeleteWorkoutCommand(id);
        var result = await _mediator.Send(command);
        
        if (!result)
        {
            return NotFound(new { error = "Workout not found" });
        }
        
        return NoContent();
    }
}
