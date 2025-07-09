# Boids Background Animation Feature

## Overview
Add a subtle boids flocking animation as a background effect to the portfolio website. This feature would showcase technical skills while maintaining professional appearance and connecting to the Unity DOTS boids projects in the portfolio.

## Technical Implementation

### Core Algorithm
- **Separation**: Avoid crowding neighbors (minimum distance enforcement)
- **Alignment**: Steer towards average heading of neighbors
- **Cohesion**: Steer towards average position of neighbors
- **Boundary handling**: Wrap around screen edges or bounce off walls

### JavaScript Implementation
```javascript
// File: /static/js/boids.js
class Boid {
  constructor(x, y) {
    this.position = { x, y };
    this.velocity = { x: random(-1, 1), y: random(-1, 1) };
    this.acceleration = { x: 0, y: 0 };
    this.maxSpeed = 2;
    this.maxForce = 0.05;
  }
  
  // Three core flocking rules
  separate(boids) { /* ... */ }
  align(boids) { /* ... */ }
  cohesion(boids) { /* ... */ }
  
  update() { /* ... */ }
  render(ctx) { /* ... */ }
}
```

### Canvas Setup
- HTML5 Canvas positioned as background layer
- Transparent background to overlay content
- Responsive sizing to match viewport
- High DPI support for crisp rendering

## Design Integration

### Theme Support
- **Dark Mode**: Light gray/white boids with low opacity
- **Light Mode**: Dark gray/black boids with low opacity
- **Accent Color**: Optional subtle accent color integration
- **Smooth Transitions**: Animate color changes when theme switches

### Visual Design
- **Boid Shape**: Simple triangular or circular shapes
- **Size**: Small (3-5px) for subtlety
- **Opacity**: Low (0.1-0.3) to avoid text interference
- **Count**: 50-100 boids for optimal performance

## Performance Considerations

### Optimization Strategies
- **Spatial Partitioning**: Grid-based neighbor detection
- **Distance Culling**: Only check nearby boids for flocking rules
- **Frame Rate Management**: Use requestAnimationFrame
- **Device Detection**: Reduce boid count on mobile devices
- **Performance Monitoring**: Auto-scale based on frame rate

### Browser Compatibility
- Modern browsers with Canvas support
- Graceful fallback for older browsers
- Optional disable toggle for users

## Implementation Plan

### Phase 1: Core Implementation
1. Create basic boids class with three flocking rules
2. Set up canvas rendering system
3. Add boundary handling and basic animation loop

### Phase 2: Visual Polish
1. Integrate with theme system
2. Add smooth color transitions
3. Optimize rendering performance

### Phase 3: User Experience
1. Add toggle to enable/disable animation
2. Implement performance scaling
3. Add mobile device optimizations

### Phase 4: Integration
1. Add to homepage hero section
2. Ensure accessibility compliance
3. Test across different devices and browsers

## File Structure
```
static/
├── js/
│   ├── theme-toggle.js
│   └── boids.js          # New file
├── css/
│   └── main.css          # Add canvas styles
└── assets/
```

## Connection to Portfolio
This feature directly connects to the Unity DOTS boids projects:
- **BoidzDots**: ECS implementation showcasing technical architecture
- **ComputeShaderBoidTest**: GPU optimization knowledge
- **SurviveTheDOiTS**: Game application of the algorithm

The web implementation demonstrates the same algorithmic thinking applied to a different platform, showing versatility in implementation approaches.

## Future Enhancements
- **Interactive Elements**: Boids avoid mouse cursor
- **Particle Effects**: Subtle trailing effects
- **Sound Integration**: Optional audio visualization
- **Performance Analytics**: Real-time performance metrics display

## Implementation Priority
**Status**: Future enhancement (low priority)
**Estimated Time**: 4-6 hours
**Dependencies**: None (pure JavaScript/Canvas)
**Risk**: Low (optional feature, easy to disable)

This feature would add a unique technical showcase element while maintaining the professional, clean aesthetic of the portfolio.