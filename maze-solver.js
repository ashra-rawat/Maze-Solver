// Maze Solver Application
let maze = [];
let start = { x: 0, y: 0 };
let end = { x: 0, y: 0 };
let size = 15;
let cellSize = 0;
let canvas, ctx;
let isSolving = false;
let pathLength = 0;
let visitedCells = 0;
let keyState = {};

// Initialize the maze application
function initMaze() {
    canvas = document.getElementById('maze-canvas');
    ctx = canvas.getContext('2d');
    
    // Set initial size
    size = parseInt(document.getElementById('maze-size').value);
    
    // Initialize event listeners
    document.getElementById('maze-size').addEventListener('change', function() {
        size = parseInt(this.value);
        generateEmptyMaze();
        drawMaze();
    });
    
    document.getElementById('generate-btn').addEventListener('click', generateRandomMaze);
    document.getElementById('clear-btn').addEventListener('click', generateEmptyMaze);
    document.getElementById('solve-btn').addEventListener('click', solveMaze);
    document.getElementById('reset-btn').addEventListener('click', resetSolution);
    
    // Keyboard event listeners
    document.addEventListener('keydown', function(e) {
        keyState[e.key.toLowerCase()] = true;
    });
    
    document.addEventListener('keyup', function(e) {
        keyState[e.key.toLowerCase()] = false;
    });
    
    // Canvas click event
    canvas.addEventListener('click', handleCanvasClick);
    
    // Generate initial maze
    generateEmptyMaze();
    drawMaze();
}

// Generate an empty maze (all paths)
function generateEmptyMaze() {
    maze = [];
    for (let i = 0; i < size; i++) {
        maze[i] = [];
        for (let j = 0; j < size; j++) {
            maze[i][j] = 0; // 0 represents path, 1 represents wall
        }
    }
    
    // Set default start and end points
    start = { x: 0, y: 0 };
    end = { x: size - 1, y: size - 1 };
    
    resetStats();
    drawMaze();
}

// Generate a random maze
function generateRandomMaze() {
    maze = [];
    for (let i = 0; i < size; i++) {
        maze[i] = [];
        for (let j = 0; j < size; j++) {
            // 30% chance of being a wall, but ensure start and end are paths
            if ((i === start.x && j === start.y) || (i === end.x && j === end.y)) {
                maze[i][j] = 0;
            } else {
                maze[i][j] = Math.random() < 0.3 ? 1 : 0;
            }
        }
    }
    
    resetStats();
    drawMaze();
}

// Reset solution and stats
function resetSolution() {
    // Remove any solution visualization but keep the maze
    resetStats();
    drawMaze();
}

// Reset statistics
function resetStats() {
    pathLength = 0;
    visitedCells = 0;
    updateStats();
    isSolving = false;
}

// Update statistics display
function updateStats() {
    document.getElementById('path-length').textContent = pathLength;
    document.getElementById('visited-cells').textContent = visitedCells;
}

// Handle canvas click events
function handleCanvasClick(event) {
    if (isSolving) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    cellSize = canvas.width / size;
    const cellX = Math.floor(x / cellSize);
    const cellY = Math.floor(y / cellSize);
    
    if (cellX >= 0 && cellX < size && cellY >= 0 && cellY < size) {
        // Check if setting start or end point
        if (keyState['s']) {
            start = { x: cellX, y: cellY };
            maze[cellY][cellX] = 0; // Ensure start is a path
        } else if (keyState['e']) {
            end = { x: cellX, y: cellY };
            maze[cellY][cellX] = 0; // Ensure end is a path
        } else {
            // Toggle wall/path
            maze[cellY][cellX] = maze[cellY][cellX] === 0 ? 1 : 0;
        }
        
        drawMaze();
    }
}

// Draw the maze on the canvas
function drawMaze() {
    cellSize = canvas.width / size;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw cells
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const x = j * cellSize;
            const y = i * cellSize;
            
            if (maze[i][j] === 1) {
                // Wall
                ctx.fillStyle = '#2c3e50';
                ctx.fillRect(x, y, cellSize, cellSize);
            } else {
                // Path
                ctx.fillStyle = '#ecf0f1';
                ctx.fillRect(x, y, cellSize, cellSize);
            }
            
            // Cell border
            ctx.strokeStyle = '#bdc3c7';
            ctx.strokeRect(x, y, cellSize, cellSize);
        }
    }
    
    // Draw start and end points
    drawPoint(start, '#2ecc71'); // Green for start
    drawPoint(end, '#e74c3c');   // Red for end
}

// Draw a point (start or end)
function drawPoint(point, color) {
    const x = point.x * cellSize;
    const y = point.y * cellSize;
    
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x + cellSize/2, y + cellSize/2, cellSize/3, 0, Math.PI * 2);
    ctx.fill();
}

// Solve the maze using selected algorithm
function solveMaze() {
    if (isSolving) return;
    
    const algorithm = document.querySelector('input[name="algorithm"]:checked').value;
    isSolving = true;
    
    if (algorithm === 'bfs') {
        solveWithBFS();
    } else {
        solveWithDFS();
    }
}

// Solve maze using BFS
function solveWithBFS() {
    const queue = [{ x: start.x, y: start.y, path: [] }];
    const visited = Array(size).fill().map(() => Array(size).fill(false));
    visited[start.y][start.x] = true;
    
    let found = false;
    let currentVisited = 0;
    
    function step() {
        if (queue.length === 0 || found) {
            isSolving = false;
            return;
        }
        
        const current = queue.shift();
        const { x, y, path } = current;
        
        // Check if we reached the end
        if (x === end.x && y === end.y) {
            found = true;
            pathLength = path.length + 1;
            visitedCells = currentVisited;
            updateStats();
            drawSolution(path);
            return;
        }
        
        // Explore neighbors
        const directions = [
            { dx: 0, dy: -1 }, // Up
            { dx: 1, dy: 0 },  // Right
            { dx: 0, dy: 1 },  // Down
            { dx: -1, dy: 0 }  // Left
        ];
        
        for (const dir of directions) {
            const newX = x + dir.dx;
            const newY = y + dir.dy;
            
            if (newX >= 0 && newX < size && newY >= 0 && newY < size && 
                !visited[newY][newX] && maze[newY][newX] === 0) {
                
                visited[newY][newX] = true;
                currentVisited++;
                queue.push({
                    x: newX,
                    y: newY,
                    path: [...path, { x, y }]
                });
                
                // Visualize the exploration
                if (!(newX === end.x && newY === end.y)) {
                    drawExploration(newX, newY);
                }
            }
        }
        
        // Continue the algorithm
        setTimeout(step, 50);
    }
    
    step();
}

// Solve maze using DFS
function solveWithDFS() {
    const stack = [{ x: start.x, y: start.y, path: [] }];
    const visited = Array(size).fill().map(() => Array(size).fill(false));
    visited[start.y][start.x] = true;
    
    let found = false;
    let currentVisited = 0;
    
    function step() {
        if (stack.length === 0 || found) {
            isSolving = false;
            return;
        }
        
        const current = stack.pop();
        const { x, y, path } = current;
        
        // Check if we reached the end
        if (x === end.x && y === end.y) {
            found = true;
            pathLength = path.length + 1;
            visitedCells = currentVisited;
            updateStats();
            drawSolution(path);
            return;
        }
        
        // Explore neighbors
        const directions = [
            { dx: 0, dy: -1 }, // Up
            { dx: 1, dy: 0 },  // Right
            { dx: 0, dy: 1 },  // Down
            { dx: -1, dy: 0 }  // Left
        ];
        
        for (const dir of directions) {
            const newX = x + dir.dx;
            const newY = y + dir.dy;
            
            if (newX >= 0 && newX < size && newY >= 0 && newY < size && 
                !visited[newY][newX] && maze[newY][newX] === 0) {
                
                visited[newY][newX] = true;
                currentVisited++;
                stack.push({
                    x: newX,
                    y: newY,
                    path: [...path, { x, y }]
                });
                
                // Visualize the exploration
                if (!(newX === end.x && newY === end.y)) {
                    drawExploration(newX, newY);
                }
            }
        }
        
        // Continue the algorithm
        setTimeout(step, 50);
    }
    
    step();
}

// Draw exploration of a cell
function drawExploration(x, y) {
    const cellX = x * cellSize;
    const cellY = y * cellSize;
    
    ctx.fillStyle = 'rgba(52, 152, 219, 0.5)';
    ctx.fillRect(cellX, cellY, cellSize, cellSize);
    
    // Redraw cell border
    ctx.strokeStyle = '#bdc3c7';
    ctx.strokeRect(cellX, cellY, cellSize, cellSize);
}

// Draw the solution path
function drawSolution(path) {
    // Draw the path
    ctx.strokeStyle = '#f1c40f';
    ctx.lineWidth = cellSize / 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    
    // Start from the beginning
    ctx.moveTo(
        start.x * cellSize + cellSize / 2,
        start.y * cellSize + cellSize / 2
    );
    
    // Draw through the path
    for (const point of path) {
        ctx.lineTo(
            point.x * cellSize + cellSize / 2,
            point.y * cellSize + cellSize / 2
        );
    }
    
    // Draw to the end
    ctx.lineTo(
        end.x * cellSize + cellSize / 2,
        end.y * cellSize + cellSize / 2
    );
    
    ctx.stroke();
    
    // Redraw start and end points on top
    drawPoint(start, '#2ecc71');
    drawPoint(end, '#e74c3c');
}

// Initialize the maze when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // The maze will be initialized after login via the auth system
    // This is just a fallback
    if (document.getElementById('app-screen').classList.contains('active')) {
        initMaze();
    }
});