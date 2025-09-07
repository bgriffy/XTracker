using Microsoft.EntityFrameworkCore;
using XTracker.Api.Features.Workouts.Models;

namespace XTracker.Api.Common.Data;

public class XTrackerDbContext : DbContext
{
    public XTrackerDbContext(DbContextOptions<XTrackerDbContext> options) : base(options)
    {
    }

    // DbSets
    public DbSet<Workout> Workouts { get; set; }
    public DbSet<Exercise> Exercises { get; set; }
    public DbSet<WorkoutExercise> WorkoutExercises { get; set; }
    public DbSet<WorkoutTemplate> WorkoutTemplates { get; set; }
    public DbSet<WorkoutTemplateSection> WorkoutTemplateSections { get; set; }
    public DbSet<WorkoutTemplateExercise> WorkoutTemplateExercises { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Configure Workout entity
        modelBuilder.Entity<Workout>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Type).IsRequired().HasMaxLength(100);
            entity.Property(e => e.DurationMinutes).IsRequired();
            entity.Property(e => e.Notes).HasMaxLength(1000);
            entity.Property(e => e.Weight).HasColumnType("decimal(6,2)");
            entity.Property(e => e.CreatedAt).IsRequired();
            entity.Property(e => e.UpdatedAt).IsRequired();
            
            // Indexes
            entity.HasIndex(e => e.Date);
            entity.HasIndex(e => e.Type);
            entity.HasIndex(e => e.CreatedAt);
        });

        // Configure Exercise entity
        modelBuilder.Entity<Exercise>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.Category).IsRequired().HasConversion<int>();
            entity.Property(e => e.Difficulty).IsRequired().HasConversion<int>();
            entity.Property(e => e.PrimaryMuscleGroups).IsRequired().HasConversion<int>();
            entity.Property(e => e.SecondaryMuscleGroups).HasConversion<int>();
            entity.Property(e => e.Equipment).HasMaxLength(1000);
            entity.Property(e => e.FormTips).HasMaxLength(1000);
            entity.Property(e => e.VideoUrl).HasMaxLength(500);
            entity.Property(e => e.ImageUrl).HasMaxLength(500);
            entity.Property(e => e.CreatedAt).IsRequired();
            
            // Indexes
            entity.HasIndex(e => e.Name);
            entity.HasIndex(e => e.Category);
            entity.HasIndex(e => e.Difficulty);
            entity.HasIndex(e => e.PrimaryMuscleGroups);
        });

        // Configure WorkoutExercise junction entity
        modelBuilder.Entity<WorkoutExercise>(entity =>
        {
            entity.HasKey(e => new { e.WorkoutId, e.ExerciseId });
            entity.Property(e => e.Sets).IsRequired();
            entity.Property(e => e.Reps).IsRequired();
            entity.Property(e => e.Weight).HasColumnType("decimal(6,2)");
            entity.Property(e => e.Notes).HasMaxLength(500);
            
            // Foreign key relationships
            entity.HasOne(we => we.Workout)
                .WithMany(w => w.WorkoutExercises)
                .HasForeignKey(we => we.WorkoutId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasOne(we => we.Exercise)
                .WithMany(e => e.WorkoutExercises)
                .HasForeignKey(we => we.ExerciseId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Configure WorkoutTemplate entity
        modelBuilder.Entity<WorkoutTemplate>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.Category).IsRequired().HasConversion<int>();
            entity.Property(e => e.Difficulty).IsRequired().HasConversion<int>();
            entity.Property(e => e.Equipment).HasMaxLength(1000);
            entity.Property(e => e.Instructions).HasMaxLength(1000);
            entity.Property(e => e.CreatedAt).IsRequired();
            
            // Indexes
            entity.HasIndex(e => e.Name);
            entity.HasIndex(e => e.Category);
            entity.HasIndex(e => e.Difficulty);
            entity.HasIndex(e => e.IsP90XWorkout);
            entity.HasIndex(e => e.IsActive);
        });

        // Configure WorkoutTemplateSection entity
        modelBuilder.Entity<WorkoutTemplateSection>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.Type).IsRequired().HasConversion<int>();
            entity.Property(e => e.Instructions).HasMaxLength(1000);
            
            // Foreign key relationships
            entity.HasOne(wts => wts.WorkoutTemplate)
                .WithMany(wt => wt.Sections)
                .HasForeignKey(wts => wts.WorkoutTemplateId)
                .OnDelete(DeleteBehavior.Cascade);
            
            // Indexes
            entity.HasIndex(e => new { e.WorkoutTemplateId, e.Order });
        });

        // Configure WorkoutTemplateExercise entity
        modelBuilder.Entity<WorkoutTemplateExercise>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Weight).HasColumnType("decimal(6,2)");
            entity.Property(e => e.Notes).HasMaxLength(500);
            
            // Foreign key relationships
            entity.HasOne(wte => wte.WorkoutTemplateSection)
                .WithMany(wts => wts.Exercises)
                .HasForeignKey(wte => wte.WorkoutTemplateSectionId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasOne(wte => wte.Exercise)
                .WithMany()
                .HasForeignKey(wte => wte.ExerciseId)
                .OnDelete(DeleteBehavior.Restrict);
            
            // Indexes
            entity.HasIndex(e => new { e.WorkoutTemplateSectionId, e.Order });
        });
    }
}
