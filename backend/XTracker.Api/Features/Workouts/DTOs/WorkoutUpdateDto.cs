using System.ComponentModel.DataAnnotations;

namespace XTracker.Api.Features.Workouts.DTOs;

public class WorkoutUpdateDto
{
    [Required]
    public DateTime Date { get; set; }
    
    [Required]
    [StringLength(100)]
    public string Type { get; set; } = string.Empty;
    
    [Required]
    [Range(1, 480)]
    public int DurationMinutes { get; set; }
    
    [StringLength(1000)]
    public string? Notes { get; set; }
    
    [Range(0, 1000)]
    public int? Reps { get; set; }
    
    [Range(0, 1000)]
    public decimal? Weight { get; set; }
    
    public List<WorkoutExerciseUpdateDto>? Exercises { get; set; }
}

public class WorkoutExerciseUpdateDto
{
    [Required]
    public int ExerciseId { get; set; }
    
    [Required]
    [Range(1, 50)]
    public int Sets { get; set; }
    
    [Required]
    [Range(1, 1000)]
    public int Reps { get; set; }
    
    [Range(0, 1000)]
    public decimal? Weight { get; set; }
    
    [Range(1, 300)]
    public int? Duration { get; set; }
    
    [StringLength(500)]
    public string? Notes { get; set; }
}
