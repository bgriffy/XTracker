# XTracker Frontend

A Next.js application for tracking P90X workouts with a modern, responsive interface.

## Features

- **Workout Logging**: Track your P90X workouts with detailed exercise information
- **Schedule Management**: Follow the 90-day P90X program schedule
- **Progress Analytics**: View statistics and progress over time
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **HTTP Client**: Axios
- **UI Components**: Custom components built with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local with your configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=XTracker
NEXT_PUBLIC_APP_VERSION=1.0.0
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── layout/           # Layout components
│   │   ├── Header.tsx    # Navigation header
│   │   ├── Footer.tsx    # Footer component
│   │   ├── Sidebar.tsx   # Sidebar navigation
│   │   └── MainLayout.tsx # Main layout wrapper
│   └── ui/               # UI components
│       ├── Button.tsx    # Button component
│       ├── Card.tsx      # Card component
│       └── LoadingSpinner.tsx # Loading spinner
└── lib/                  # Utility libraries
    └── api/              # API client and services
        ├── client.ts     # Axios configuration
        └── workoutService.ts # Workout API service
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:5000/api` |
| `NEXT_PUBLIC_APP_NAME` | Application name | `XTracker` |
| `NEXT_PUBLIC_APP_VERSION` | Application version | `1.0.0` |

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## API Integration

The frontend communicates with the backend API through the `workoutService` and `exerciseService` modules. The API client is configured with:

- Base URL configuration
- Request/response interceptors
- Error handling
- Authentication token management

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Docker

```bash
# Build the Docker image
docker build -t xtracker-frontend .

# Run the container
docker run -p 3000:3000 xtracker-frontend
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
