# AGI

A mobile-first React app with interactive 3D neural network visualizations. Built for vibe coding on the go.

## Features

- Full-screen neural network visualization with touch interaction
- Fluid particle trails that follow your finger
- Glowing particles with additive blending
- Responsive design for mobile and desktop
- Works as a PWA when added to home screen

## Tech Stack

- [React](https://react.dev/) - UI framework
- [Vite](https://vitejs.dev/) - Build tool
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Three.js](https://threejs.org/) - 3D graphics and WebGL rendering
- [React Router](https://reactrouter.com/) - Client-side routing

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Mobile Development Workflow

This project supports a mobile-first development workflow:

1. Code changes are pushed to a feature branch
2. Merge via GitHub (web or mobile app)
3. Vercel auto-deploys from main branch
4. View changes instantly on your phone

This enables updating and deploying code entirely from a mobile device.

## Deployment

Deployed on [Vercel](https://vercel.com/). Push to main triggers automatic deployment.

## License

MIT
