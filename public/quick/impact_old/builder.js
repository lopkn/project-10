// Line Segment Builder with Grid Snapping
// Allows creating and configuring wall segments with wall type selection and mirroring

let segments = [];
let currentWallType = 'default';
let mirrorX = false;
let gridSize = 50; // Adjust as needed
let isBuilding = false;
let startPoint = null;

class LineSegment {
  constructor(x1, y1, x2, y2, wallType, isMirrored) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.wallType = wallType;
    this.isMirrored = isMirrored;
  }

  display() {
    stroke(0);
    strokeWeight(2);
    line(this.x1, this.y1, this.x2, this.y2);
  }

  toCallString() {
    return `build(${this.x1}, ${this.y1}, ${this.x2}, ${this.y2}, '${this.wallType}', ${this.isMirrored})`;
  }
}

function snapToGrid(value, snap) {
  return round(value / snap) * snap;
}

function drawBuilder() {
  // Display current settings
  fill(0);
  textSize(14);
  text(`Wall Type: ${currentWallType}`, 10, 20);
  text(`Mirror X: ${mirrorX ? 'ON' : 'OFF'}`, 10, 40);
  text(`Segments: ${segments.length}`, 10, 60);

  // Draw grid
  stroke(200);
  strokeWeight(1);
  for (let x = 0; x < width; x += gridSize) {
    line(x, 0, x, height);
  }
  for (let y = 0; y < height; y += gridSize) {
    line(0, y, width, y);
  }

  // Draw existing segments
  segments.forEach(seg => seg.display());

  // Draw preview line while building
  if (isBuilding && startPoint) {
    const snappedX = snapToGrid(mouseX, gridSize);
    const snappedY = snapToGrid(mouseY, gridSize);
    stroke(150, 200, 255);
    strokeWeight(2);
    line(startPoint.x, startPoint.y, snappedX, snappedY);
  }
}

function handleBuilderInput() {
  if (keyIsPressed) {
    // 'W' to cycle wall types
    if (key === 'w' || key === 'W') {
      const wallTypes = ['default', 'brick', 'stone', 'metal', 'glass'];
      let index = wallTypes.indexOf(currentWallType);
      currentWallType = wallTypes[(index + 1) % wallTypes.length];
    }
    // 'M' to toggle mirroring
    if (key === 'm' || key === 'M') {
      mirrorX = !mirrorX;
    }
    // 'C' to clear all segments
    if (key === 'c' || key === 'C') {
      segments = [];
    }
    // 'E' to export segments
    if (key === 'e' || key === 'E') {
      exportSegments();
    }
  }

  if (mouseIsPressed) {
    const snappedX = snapToGrid(mouseX, gridSize);
    const snappedY = snapToGrid(mouseY, gridSize);

    // Start building on left click
    if (mouseButton === LEFT && !isBuilding) {
      isBuilding = true;
      startPoint = { x: snappedX, y: snappedY };
    }
  } else {
    // Complete segment on mouse release
    if (isBuilding && startPoint) {
      const snappedX = snapToGrid(mouseX, gridSize);
      const snappedY = snapToGrid(mouseY, gridSize);
      
      if (snappedX !== startPoint.x || snappedY !== startPoint.y) {
        segments.push(
          new LineSegment(
            startPoint.x,
            startPoint.y,
            snappedX,
            snappedY,
            currentWallType,
            mirrorX
          )
        );
      }
      
      isBuilding = false;
      startPoint = null;
    }
  }
}

function exportSegments() {
  // Export as function calls
  let exportStr = '// Generated wall segments\n';
  segments.forEach(seg => {
    exportStr += seg.toCallString() + ';\n';
  });

  // Also export as array
  exportStr += '\n// Alternative: array format\n';
  exportStr += 'const wallSegments = [\n';
  segments.forEach((seg, i) => {
    exportStr += `  { x1: ${seg.x1}, y1: ${seg.y1}, x2: ${seg.x2}, y2: ${seg.y2}, type: '${seg.wallType}', mirrored: ${seg.isMirrored} }`;
    if (i < segments.length - 1) exportStr += ',';
    exportStr += '\n';
  });
  exportStr += '];\n';

  // Log to console for copying
  console.log(exportStr);
  alert('Segments exported to console. Press F12 to view.');
}
