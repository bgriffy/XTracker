using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using XTracker.Api.Features.Workouts.Models.Enums;

namespace XTracker.Api.Features.Workouts.Models;

public class Exercise
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [StringLength(500)]
    public string? Description { get; set; }
    
    [Required]
    public ExerciseCategory Category { get; set; }
    
    [Required]
    public DifficultyLevel Difficulty { get; set; }
    
    [Required]
    public MuscleGroup PrimaryMuscleGroups { get; set; }
    
    public MuscleGroup SecondaryMuscleGroups { get; set; } = MuscleGroup.None;
    
    [StringLength(1000)]
    public string? Equipment { get; set; }
    
    [StringLength(1000)]
    public string? FormTips { get; set; }
    
    [StringLength(500)]
    public string? VideoUrl { get; set; }
    
    [StringLength(500)]
    public string? ImageUrl { get; set; }
    
    [Range(1, 1000)]
    public int? DefaultRepsMin { get; set; }
    
    [Range(1, 1000)]
    public int? DefaultRepsMax { get; set; }
    
    [Range(1, 1000)]
    public int? DefaultSets { get; set; }
    
    [Range(1, 300)]
    public int? DefaultDurationSeconds { get; set; }
    
    public bool IsWeightTracked { get; set; } = false;
    
    public bool IsTimeBased { get; set; } = false;
    
    public bool IsDistanceTracked { get; set; } = false;
    
    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? UpdatedAt { get; set; }
    
    // Navigation properties
    public virtual ICollection<WorkoutExercise> WorkoutExercises { get; set; } = new List<WorkoutExercise>();
    
    // Computed properties
    [NotMapped]
    public string DefaultRepRange => DefaultRepsMin.HasValue && DefaultRepsMax.HasValue 
        ? $"{DefaultRepsMin}-{DefaultRepsMax}" 
        : DefaultRepsMin?.ToString() ?? "Variable";
    
    [NotMapped]
    public string PrimaryMuscleGroupsDisplay => PrimaryMuscleGroups.ToString();
    
    [NotMapped]
    public string SecondaryMuscleGroupsDisplay => SecondaryMuscleGroups == MuscleGroup.None 
        ? "None" 
        : SecondaryMuscleGroups.ToString();
}
