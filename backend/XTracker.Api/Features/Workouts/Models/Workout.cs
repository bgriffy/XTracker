using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace XTracker.Api.Features.Workouts.Models;

public class Workout
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public DateTime Date { get; set; }
    
    [Required]
    [StringLength(100)]
    public string Type { get; set; } = string.Empty;
    
    [Required]
    [Range(1, 480)] // 1 minute to 8 hours
    public int DurationMinutes { get; set; }
    
    [StringLength(1000)]
    public string? Notes { get; set; }
    
    [Range(0, 1000)]
    public int? Reps { get; set; }
    
    [Range(0, 1000)]
    [Column(TypeName = "decimal(6,2)")]
    public decimal? Weight { get; set; }
    
    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    [Required]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public virtual ICollection<WorkoutExercise> WorkoutExercises { get; set; } = new List<WorkoutExercise>();
}
