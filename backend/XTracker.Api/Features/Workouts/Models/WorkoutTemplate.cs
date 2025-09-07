using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using XTracker.Api.Features.Workouts.Models.Enums;

namespace XTracker.Api.Features.Workouts.Models;

public class WorkoutTemplate
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [StringLength(500)]
    public string? Description { get; set; }
    
    [Required]
    public WorkoutCategory Category { get; set; }
    
    [Required]
    public DifficultyLevel Difficulty { get; set; }
    
    [Range(1, 480)] // 1 minute to 8 hours
    public int EstimatedDurationMinutes { get; set; }
    
    [StringLength(1000)]
    public string? Equipment { get; set; }
    
    [StringLength(1000)]
    public string? Instructions { get; set; }
    
    public bool IsP90XWorkout { get; set; } = false;
    
    public bool IsCustom { get; set; } = false;
    
    public bool IsActive { get; set; } = true;
    
    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? UpdatedAt { get; set; }
    
    // Navigation properties
    public virtual ICollection<WorkoutTemplateSection> Sections { get; set; } = new List<WorkoutTemplateSection>();
    
    // Computed properties
    [NotMapped]
    public int ExerciseCount => Sections?.Sum(s => s.Exercises?.Count ?? 0) ?? 0;
    
    [NotMapped]
    public string DifficultyDisplay => Difficulty.ToString();
    
    [NotMapped]
    public string CategoryDisplay => Category.ToString();
}
