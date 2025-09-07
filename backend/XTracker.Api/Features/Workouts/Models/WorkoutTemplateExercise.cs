using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using XTracker.Api.Features.Workouts.Models.Enums;

namespace XTracker.Api.Features.Workouts.Models;

public class WorkoutTemplateExercise
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public int WorkoutTemplateSectionId { get; set; }
    
    [Required]
    public int ExerciseId { get; set; }
    
    [Range(1, 100)]
    public int Order { get; set; }
    
    [Range(1, 50)]
    public int? Sets { get; set; }
    
    [Range(1, 1000)]
    public int? RepsMin { get; set; }
    
    [Range(1, 1000)]
    public int? RepsMax { get; set; }
    
    [Range(1, 300)]
    public int? DurationSeconds { get; set; }
    
    [Range(0, 1000)]
    [Column(TypeName = "decimal(6,2)")]
    public decimal? Weight { get; set; }
    
    [Range(0, 300)]
    public int? RestBetweenSetsSeconds { get; set; }
    
    [StringLength(500)]
    public string? Notes { get; set; }
    
    public bool IsOptional { get; set; } = false;
    
    // Navigation properties
    public virtual WorkoutTemplateSection WorkoutTemplateSection { get; set; } = null!;
    public virtual Exercise Exercise { get; set; } = null!;
    
    // Computed properties
    [NotMapped]
    public string RepRange => RepsMin.HasValue && RepsMax.HasValue 
        ? $"{RepsMin}-{RepsMax}" 
        : RepsMin?.ToString() ?? "Variable";
    
    [NotMapped]
    public string RestBetweenSetsDisplay => RestBetweenSetsSeconds.HasValue 
        ? $"{RestBetweenSetsSeconds}s" 
        : "No rest";
}
