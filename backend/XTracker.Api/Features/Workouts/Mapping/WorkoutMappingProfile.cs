using AutoMapper;
using XTracker.Api.Features.Workouts.DTOs;
using XTracker.Api.Features.Workouts.Models;

namespace XTracker.Api.Features.Workouts.Mapping;

public class WorkoutMappingProfile : Profile
{
    public WorkoutMappingProfile()
    {
        // Entity to Response DTO mappings
        CreateMap<Workout, WorkoutResponseDto>()
            .ForMember(dest => dest.Exercises, opt => opt.MapFrom(src => src.WorkoutExercises));

        CreateMap<Workout, WorkoutSummaryDto>()
            .ForMember(dest => dest.ExerciseCount, opt => opt.MapFrom(src => src.WorkoutExercises.Count));

        CreateMap<WorkoutExercise, WorkoutExerciseResponseDto>()
            .ForMember(dest => dest.ExerciseName, opt => opt.MapFrom(src => src.Exercise.Name))
            .ForMember(dest => dest.ExerciseCategory, opt => opt.MapFrom(src => src.Exercise.Category));

        // Create DTO to Entity mappings
        CreateMap<WorkoutCreateDto, Workout>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Date, opt => opt.MapFrom(src => DateTime.SpecifyKind(src.Date, DateTimeKind.Utc)))
            .ForMember(dest => dest.WorkoutExercises, opt => opt.MapFrom(src => src.Exercises));

        CreateMap<WorkoutExerciseCreateDto, WorkoutExercise>()
            .ForMember(dest => dest.WorkoutId, opt => opt.Ignore())
            .ForMember(dest => dest.Workout, opt => opt.Ignore())
            .ForMember(dest => dest.Exercise, opt => opt.Ignore());

        // Update DTO to Entity mappings
        CreateMap<WorkoutUpdateDto, Workout>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Date, opt => opt.MapFrom(src => DateTime.SpecifyKind(src.Date, DateTimeKind.Utc)))
            .ForMember(dest => dest.WorkoutExercises, opt => opt.MapFrom(src => src.Exercises));

        CreateMap<WorkoutExerciseUpdateDto, WorkoutExercise>()
            .ForMember(dest => dest.WorkoutId, opt => opt.Ignore())
            .ForMember(dest => dest.Workout, opt => opt.Ignore())
            .ForMember(dest => dest.Exercise, opt => opt.Ignore());
    }
}
