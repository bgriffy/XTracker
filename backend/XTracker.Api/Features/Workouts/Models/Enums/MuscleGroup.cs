namespace XTracker.Api.Features.Workouts.Models.Enums;

[Flags]
public enum MuscleGroup
{
    None = 0,
    Chest = 1,
    Back = 2,
    Shoulders = 4,
    Traps = 8,
    Biceps = 16,
    Triceps = 32,
    Forearms = 64,
    Abs = 128,
    Core = 256,
    Obliques = 512,
    LowerBack = 1024,
    Glutes = 2048,
    Quadriceps = 4096,
    Hamstrings = 8192,
    Calves = 16384,
    FullBody = 32768,
    Cardiovascular = 65536
}
