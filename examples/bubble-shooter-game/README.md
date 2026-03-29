# Bubble Shooter Game

A complete HTML5 Canvas bubble shooter game built with vanilla JavaScript.

## Features

- **Classic Gameplay**: Shoot bubbles to match 3+ of the same color
- **Physics Engine**: Realistic bubble trajectory and collision detection
- **Score System**: Points for matches, combos, and level completion
- **Level Progression**: Increasing difficulty with each level
- **Sound Effects**: Audio feedback for actions
- **Responsive Design**: Works on different screen sizes

## Project Structure

```
bubble-shooter-game/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # Game styles
├── js/
│   ├── game.js         # Main game logic
│   ├── bubble.js       # Bubble class and physics
│   ├── grid.js         # Game grid management
│   ├── shooter.js      # Player shooter mechanics
│   ├── particles.js    # Particle effects
│   └── audio.js        # Sound management
├── assets/
│   └── sounds/         # Game sound effects
└── README.md          # This file
```

## How to Run

1. **Open in Browser**
   Simply open `index.html` in any modern web browser.
   
   ```bash
   # Or use a local server
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

2. **Play the Game**
   - Move mouse to aim
   - Click to shoot
   - Match 3+ bubbles of the same color
   - Clear all bubbles to win

## Game Controls

| Action | Control |
|--------|---------|
| Aim | Mouse movement |
| Shoot | Left click |
| Pause | P key |
| Restart | R key |

## Game Mechanics

### Scoring
- 3 bubbles: 10 points each
- 4 bubbles: 20 points each
- 5+ bubbles: 30 points each
- Combo bonus: +50 points per additional match

### Level System
- Level 1: 5 rows, 4 colors
- Level 2: 6 rows, 5 colors
- Level 3+: 7+ rows, 6 colors

## Kimi-Specific Patterns

This example demonstrates:
- **Stateful Code Generation**: Complete game with state management
- **Canvas API**: HTML5 Canvas for rendering
- **Game Loop**: RequestAnimationFrame for smooth animation
- **Collision Detection**: Physics-based bubble interactions
- **Event Handling**: Mouse and keyboard input

## Prompt That Generated This

```
Create a complete bubble shooter game with:
1. HTML5 Canvas for rendering
2. Bubble physics and collision detection
3. Match-3 gameplay mechanics
4. Score tracking and level progression
5. Particle effects for matches
6. Sound effects
7. Responsive design
```
