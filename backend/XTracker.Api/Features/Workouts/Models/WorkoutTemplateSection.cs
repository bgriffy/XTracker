using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using XTracker.Api.Features.Workouts.Models.Enums;

namespace XTracker.Api.Features.Workouts.Models;

public class WorkoutTemplateSection
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public int WorkoutTemplateId { get; set; }
    
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [StringLength(500)]
    public string? Description { get; set; }
    
    [Required]
    public SectionType Type { get; set; }
    
    [Range(1, 100)]
    public int Order { get; set; }
    
    [Range(0, 300)]
    public int? RestPeriodSeconds { get; set; }
    
    [Range(1, 10)]
    public int? CircuitRounds { get; set; }
    
    [StringLength(1000)]
    public string? Instructions { get; set; }
    
    // Navigation properties
    public virtual WorkoutTemplate WorkoutTemplate { get; set; } = null!;
    public virtual ICollection<WorkoutTemplateExercise> Exercises { get; set; } = new List<WorkoutTemplateExercise>();
    
    // Computed properties
    [NotMapped]
    public string TypeDisplay => Type.ToString();
    
    [NotMapped]
    public string RestPeriodDisplay => RestPeriodSeconds.HasValue 
        ? $"{RestPeriodSeconds}s" 
        : "No rest";
}
