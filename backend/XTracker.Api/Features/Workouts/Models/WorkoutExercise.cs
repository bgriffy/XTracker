using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace XTracker.Api.Features.Workouts.Models;

public class WorkoutExercise
{
    [Key]
    [Column(Order = 0)]
    public int WorkoutId { get; set; }
    
    [Key]
    [Column(Order = 1)]
    public int ExerciseId { get; set; }
    
    [Required]
    [Range(1, 50)]
    public int Sets { get; set; }
    
    [Required]
    [Range(1, 1000)]
    public int Reps { get; set; }
    
    [Range(0, 1000)]
    [Column(TypeName = "decimal(6,2)")]
    public decimal? Weight { get; set; }
    
    [Range(1, 300)]
    public int? Duration { get; set; } // in seconds
    
    [StringLength(500)]
    public string? Notes { get; set; }
    
    // Navigation properties
    public virtual Workout Workout { get; set; } = null!;
    public virtual Exercise Exercise { get; set; } = null!;
}
