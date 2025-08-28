class Boid {
  constructor(x, y, type = null) {
    this.position = { x, y };
    this.velocity = { 
      x: (Math.random() - 0.5) * 2, 
      y: (Math.random() - 0.5) * 2 
    };
    this.acceleration = { x: 0, y: 0 };
    this.maxSpeed = 2;
    this.maxForce = 0.05;
    this.separationRadius = 25;
    this.alignmentRadius = 50;
    this.cohesionRadius = 50;
    this.avoidRadius = 50;
    this.huntRadius = 80;
    this.fleeRadius = 100;
    
    // Boid type system (rock-paper-scissors)
    const types = ['triangle', 'circle', 'diamond'];
    this.type = type || types[Math.floor(Math.random() * types.length)];
    this.shape = this.type;
    
    // Trail system with fade
    this.trail = [];
    this.maxTrailLength = 20;
    
    // Visual properties
    this.color = { r: 240, g: 240, b: 240 };
    this.size = this.type === 'circle' ? 3 : 4;
    this.animationPhase = Math.random() * Math.PI * 2;
    
    // Rock-paper-scissors relationships
    this.defeats = this.getDefeats();
    this.defeatedBy = this.getDefeatedBy();
  }
  
  getDefeats() {
    switch (this.type) {
      case 'triangle': return 'circle';    // Triangle cuts Circle
      case 'circle': return 'diamond';     // Circle rolls over Diamond
      case 'diamond': return 'triangle';   // Diamond cuts Triangle
      default: return null;
    }
  }
  
  getDefeatedBy() {
    switch (this.type) {
      case 'triangle': return 'diamond';   // Triangle cut by Diamond
      case 'circle': return 'triangle';    // Circle cut by Triangle
      case 'diamond': return 'circle';     // Diamond rolled over by Circle
      default: return null;
    }
  }

  separate(boids) {
    const steer = { x: 0, y: 0 };
    let count = 0;

    for (let other of boids) {
      const d = this.distance(this.position, other.position);
      if (d > 0 && d < this.separationRadius) {
        const diff = {
          x: this.position.x - other.position.x,
          y: this.position.y - other.position.y
        };
        const normalized = this.normalize(diff);
        normalized.x /= d;
        normalized.y /= d;
        steer.x += normalized.x;
        steer.y += normalized.y;
        count++;
      }
    }

    if (count > 0) {
      steer.x /= count;
      steer.y /= count;
      const normalized = this.normalize(steer);
      steer.x = normalized.x * this.maxSpeed - this.velocity.x;
      steer.y = normalized.y * this.maxSpeed - this.velocity.y;
      return this.limit(steer, this.maxForce);
    }
    return { x: 0, y: 0 };
  }

  align(boids) {
    const sum = { x: 0, y: 0 };
    let count = 0;

    for (let other of boids) {
      const d = this.distance(this.position, other.position);
      if (d > 0 && d < this.alignmentRadius) {
        sum.x += other.velocity.x;
        sum.y += other.velocity.y;
        count++;
      }
    }

    if (count > 0) {
      sum.x /= count;
      sum.y /= count;
      const normalized = this.normalize(sum);
      const steer = {
        x: normalized.x * this.maxSpeed - this.velocity.x,
        y: normalized.y * this.maxSpeed - this.velocity.y
      };
      return this.limit(steer, this.maxForce);
    }
    return { x: 0, y: 0 };
  }

  cohesion(boids) {
    const sum = { x: 0, y: 0 };
    let count = 0;

    for (let other of boids) {
      const d = this.distance(this.position, other.position);
      if (d > 0 && d < this.cohesionRadius) {
        sum.x += other.position.x;
        sum.y += other.position.y;
        count++;
      }
    }

    if (count > 0) {
      sum.x /= count;
      sum.y /= count;
      return this.seek(sum);
    }
    return { x: 0, y: 0 };
  }

  seek(target) {
    const desired = {
      x: target.x - this.position.x,
      y: target.y - this.position.y
    };
    const normalized = this.normalize(desired);
    const steer = {
      x: normalized.x * this.maxSpeed - this.velocity.x,
      y: normalized.y * this.maxSpeed - this.velocity.y
    };
    return this.limit(steer, this.maxForce);
  }

  update() {
    this.velocity.x += this.acceleration.x;
    this.velocity.y += this.acceleration.y;
    this.velocity = this.limit(this.velocity, this.maxSpeed);
    
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    
    // Add current position to trail AFTER updating position
    if (this.maxTrailLength > 0) {
      // Check if we moved too far (teleported) - if so, clear trail
      if (this.trail.length > 0) {
        const lastPos = this.trail[this.trail.length - 1];
        const dist = Math.sqrt(
          Math.pow(this.position.x - lastPos.x, 2) + 
          Math.pow(this.position.y - lastPos.y, 2)
        );
        if (dist > 50) { // If moved more than 50 pixels, clear trail
          this.trail = [];
        }
      }
      
      this.trail.push({ x: this.position.x, y: this.position.y });
      if (this.trail.length > this.maxTrailLength) {
        this.trail.shift();
      }
    }
    
    
    // Update animation phase
    this.animationPhase += 0.2;
    
    this.acceleration.x = 0;
    this.acceleration.y = 0;
  }
  
  createCatchEvent(prey) {
    // Add catch event to global system if it exists
    if (window.boidsSystem && window.boidsSystem.addCatchEvent) {
      window.boidsSystem.addCatchEvent({
        x: (this.position.x + prey.position.x) / 2, // Midpoint between hunter and prey
        y: (this.position.y + prey.position.y) / 2,
        hunterColor: { r: this.color.r, g: this.color.g, b: this.color.b },
        preyColor: { r: prey.color.r, g: prey.color.g, b: prey.color.b },
        age: 0,
        hunterType: this.type,
        preyType: prey.type
      });
    }
  }

  applyForce(force) {
    this.acceleration.x += force.x;
    this.acceleration.y += force.y;
  }

  flock(boids, mousePos = null) {
    // Basic flocking behaviors (only with same type)
    const sameTypeBoids = boids.filter(b => b.type === this.type);
    const sep = this.separate(sameTypeBoids);
    const ali = this.align(sameTypeBoids);
    const coh = this.cohesion(sameTypeBoids);
    
    // Rock-paper-scissors behaviors
    const hunt = this.hunt(boids);
    const flee = this.flee(boids);
    
    // Apply forces with different weights
    sep.x *= 1.5;
    sep.y *= 1.5;
    ali.x *= 1.0;
    ali.y *= 1.0;
    coh.x *= 1.0;
    coh.y *= 1.0;
    hunt.x *= 0.8;
    hunt.y *= 0.8;
    flee.x *= 2.5; // Fleeing is stronger than hunting
    flee.y *= 2.5;
    
    this.applyForce(sep);
    this.applyForce(ali);
    this.applyForce(coh);
    this.applyForce(hunt);
    this.applyForce(flee);
    
    // Mouse avoidance
    if (mousePos) {
      const avoid = this.avoid(mousePos);
      avoid.x *= 2.0;
      avoid.y *= 2.0;
      this.applyForce(avoid);
    }
  }

  borders(width, height) {
    let wrapped = false;
    
    if (this.position.x < 0) {
      this.position.x = width;
      wrapped = true;
    }
    if (this.position.y < 0) {
      this.position.y = height;
      wrapped = true;
    }
    if (this.position.x > width) {
      this.position.x = 0;
      wrapped = true;
    }
    if (this.position.y > height) {
      this.position.y = 0;
      wrapped = true;
    }
    
    // Clear trail when wrapping to prevent lines across screen
    if (wrapped) {
      this.trail = [];
    }
  }

  render(ctx, showTrails = true) {
    // Render trail first (behind boid)
    if (showTrails && this.trail.length > 1) {
      this.renderTrail(ctx);
    }
    
    // Render boid
    const theta = Math.atan2(this.velocity.y, this.velocity.x) + Math.PI / 2;
    
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(theta);
    
    // Set color
    ctx.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
    
    // Render based on shape
    switch (this.shape) {
      case 'triangle':
        this.renderTriangle(ctx);
        break;
      case 'circle':
        this.renderCircle(ctx);
        break;
      case 'diamond':
        this.renderDiamond(ctx);
        break;
      case 'butterfly':
        this.renderButterfly(ctx);
        break;
      default:
        this.renderTriangle(ctx);
    }
    
    ctx.restore();
  }
  
  renderTrail(ctx) {
    if (this.trail.length < 2) return;
    
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Render trail segments with fading effect like tracks in snow
    for (let i = 1; i < this.trail.length; i++) {
      const age = i / this.trail.length;
      const fadeOpacity = Math.pow(age, 0.7) * 0.4; // Exponential fade for natural look
      const fadeWidth = age * 2;
      
      // Add some randomness to make it more organic
      const jitter = (Math.sin(i * 0.5) * 0.3);
      
      ctx.strokeStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${fadeOpacity})`;
      ctx.lineWidth = Math.max(0.3, fadeWidth + jitter);
      
      ctx.beginPath();
      ctx.moveTo(this.trail[i - 1].x, this.trail[i - 1].y);
      ctx.lineTo(this.trail[i].x, this.trail[i].y);
      ctx.stroke();
    }
    
    ctx.restore();
  }
  
  renderTriangle(ctx) {
    ctx.beginPath();
    ctx.moveTo(0, -this.size);
    ctx.lineTo(-this.size / 2, this.size);
    ctx.lineTo(this.size / 2, this.size);
    ctx.closePath();
    ctx.fill();
  }
  
  renderCircle(ctx) {
    const pulseSize = this.size + Math.sin(this.animationPhase) * 0.5;
    ctx.beginPath();
    ctx.arc(0, 0, pulseSize, 0, Math.PI * 2);
    ctx.fill();
  }
  
  renderDiamond(ctx) {
    ctx.beginPath();
    ctx.moveTo(0, -this.size);
    ctx.lineTo(this.size, 0);
    ctx.lineTo(0, this.size);
    ctx.lineTo(-this.size, 0);
    ctx.closePath();
    ctx.fill();
  }
  
  renderButterfly(ctx) {
    const wingFlap = Math.sin(this.animationPhase * 2) * 0.3;
    
    // Body
    ctx.beginPath();
    ctx.moveTo(0, -this.size);
    ctx.lineTo(0, this.size);
    ctx.lineWidth = 1;
    ctx.strokeStyle = ctx.fillStyle;
    ctx.stroke();
    
    // Wings
    ctx.beginPath();
    ctx.ellipse(-this.size / 2, -this.size / 2, this.size / 2, this.size / 4 + wingFlap, 0, 0, Math.PI * 2);
    ctx.ellipse(this.size / 2, -this.size / 2, this.size / 2, this.size / 4 + wingFlap, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  distance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  normalize(vector) {
    const mag = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    if (mag > 0) {
      return { x: vector.x / mag, y: vector.y / mag };
    }
    return { x: 0, y: 0 };
  }

  limit(vector, max) {
    const mag = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    if (mag > max) {
      return { x: (vector.x / mag) * max, y: (vector.y / mag) * max };
    }
    return vector;
  }
  
  avoid(target) {
    const d = this.distance(this.position, target);
    if (d > 0 && d < this.avoidRadius) {
      const steer = {
        x: this.position.x - target.x,
        y: this.position.y - target.y
      };
      const normalized = this.normalize(steer);
      normalized.x *= this.maxSpeed;
      normalized.y *= this.maxSpeed;
      normalized.x -= this.velocity.x;
      normalized.y -= this.velocity.y;
      return this.limit(normalized, this.maxForce);
    }
    return { x: 0, y: 0 };
  }
  
  hunt(boids) {
    const steer = { x: 0, y: 0 };
    let count = 0;
    
    for (let other of boids) {
      const d = this.distance(this.position, other.position);
      if (d > 0 && d < this.huntRadius && other.type === this.defeats) {
        steer.x += other.position.x;
        steer.y += other.position.y;
        count++;
        
        // Check for catch (very close distance)
        if (d < 8) {
          this.createCatchEvent(other);
        }
      }
    }
    
    if (count > 0) {
      steer.x /= count;
      steer.y /= count;
      return this.seek(steer);
    }
    return { x: 0, y: 0 };
  }
  
  flee(boids) {
    const steer = { x: 0, y: 0 };
    let count = 0;
    
    for (let other of boids) {
      const d = this.distance(this.position, other.position);
      if (d > 0 && d < this.fleeRadius && other.type === this.defeatedBy) {
        const diff = {
          x: this.position.x - other.position.x,
          y: this.position.y - other.position.y
        };
        const normalized = this.normalize(diff);
        normalized.x /= d; // Weight by distance
        normalized.y /= d;
        steer.x += normalized.x;
        steer.y += normalized.y;
        count++;
      }
    }
    
    if (count > 0) {
      steer.x /= count;
      steer.y /= count;
      const normalized = this.normalize(steer);
      steer.x = normalized.x * this.maxSpeed - this.velocity.x;
      steer.y = normalized.y * this.maxSpeed - this.velocity.y;
      return this.limit(steer, this.maxForce);
    }
    return { x: 0, y: 0 };
  }
}

class BoidsSystem {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.boids = [];
    this.animationId = null;
    this.isRunning = false;
    this.isEnabled = true;
    this.currentTheme = 'light';
    this.colors = {
      light: 'rgba(51, 51, 51, 0.15)',
      dark: 'rgba(240, 240, 240, 0.15)'
    };
    this.frameCount = 0;
    this.lastFrameTime = 0;
    this.fps = 60;
    this.fpsHistory = [];
    this.performanceScale = 1;
    this.mousePos = null;
    this.scrollOpacity = 1;
    this.isScrollVisible = true;
    
    // Catch event system
    this.catchEvents = [];
    this.maxCatchEvents = 50;
    this.catchEventLifetime = 30; // frames
    
    this.settings = {
      boidCount: 60,
      maxSpeed: 2,
      maxForce: 0.05,
      separationRadius: 25,
      alignmentRadius: 50,
      cohesionRadius: 50,
      avoidRadius: 50,
      separationWeight: 1.5,
      alignmentWeight: 1.0,
      cohesionWeight: 1.0,
      avoidanceWeight: 2.0,
      
      // Visual settings
      showTrails: true,
      showCatchEffects: true,
      trailLength: 20,
      boidShape: 'mixed',
      colorMode: 'grouping'
    };
  }

  init() {
    this.createCanvas();
    this.setupBoids();
    this.detectTheme();
    this.setupThemeListener();
    this.setupMouseTracking();
    this.setupScrollListener();
    this.createControlPanel();
    this.start();
  }

  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'boids-canvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '-1';
    
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    
    this.ctx.scale(dpr, dpr);
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
  }

  setupBoids() {
    const boidCount = this.getBoidCount();
    this.boids = [];
    
    const types = ['triangle', 'circle', 'diamond'];
    const baseCount = Math.floor(boidCount / 3);
    const remainder = boidCount % 3;
    
    // Ensure each type gets exactly equal representation
    const typeCounts = [
      baseCount + (remainder > 0 ? 1 : 0), // triangles
      baseCount + (remainder > 1 ? 1 : 0), // circles  
      baseCount                             // diamonds
    ];
    
    // Create boids for each type
    for (let typeIndex = 0; typeIndex < types.length; typeIndex++) {
      const type = types[typeIndex];
      const countForThisType = typeCounts[typeIndex];
      
      for (let i = 0; i < countForThisType; i++) {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const boid = new Boid(x, y, type);
        this.applySettingsToBoid(boid);
        this.boids.push(boid);
      }
    }
    
    // Shuffle array to mix types randomly
    for (let i = this.boids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.boids[i], this.boids[j]] = [this.boids[j], this.boids[i]];
    }
  }

  getBoidCount() {
    if (this.isMobile()) return 15; // Reduced for better mobile performance
    if (window.innerWidth < 1024) return 30;
    if (window.innerWidth < 1920) return 60;
    return 80;
  }

  detectTheme() {
    const root = document.documentElement;
    const theme = root.getAttribute('data-theme') || 'dark';
    this.currentTheme = theme;
  }

  setupThemeListener() {
    const observer = new MutationObserver(() => {
      this.detectTheme();
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
  }

  isMobile() {
    return window.innerWidth < 768;
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      // Set global reference for boids to access
      window.boidsSystem = this;
      this.animate();
    }
  }

  stop() {
    if (this.isRunning) {
      this.isRunning = false;
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
    }
  }

  animate(currentTime = 0) {
    if (!this.isRunning || !this.isEnabled) return;
    
    this.updatePerformanceMetrics(currentTime);
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    const boidsToRender = Math.floor(this.boids.length * this.performanceScale);
    for (let i = 0; i < boidsToRender; i++) {
      const boid = this.boids[i];
      boid.flock(this.boids, this.mousePos);
      
      // Update visual properties
      this.updateBoidVisuals(boid);
      
      boid.update();
      boid.borders(window.innerWidth, window.innerHeight);
      boid.render(this.ctx, this.settings.showTrails);
    }
    
    // Render catch events (on top of everything)
    this.renderCatchEvents();
    
    // Update catch events aging
    this.updateCatchEvents();
    
    this.animationId = requestAnimationFrame((time) => this.animate(time));
  }
  
  addCatchEvent(event) {
    this.catchEvents.push(event);
    
    // Remove oldest events if we exceed the limit
    if (this.catchEvents.length > this.maxCatchEvents) {
      this.catchEvents.shift();
    }
  }
  
  updateCatchEvents() {
    // Update and remove old events
    this.catchEvents = this.catchEvents.filter(event => {
      event.age++;
      return event.age < this.catchEventLifetime;
    });
  }
  
  renderCatchEvents() {
    if (!this.settings.showCatchEffects) return;
    
    this.ctx.save();
    
    for (let event of this.catchEvents) {
      const ageRatio = event.age / this.catchEventLifetime;
      const expansion = ageRatio * 20; // Expand outward
      const fadeOpacity = (1 - ageRatio) * 0.8; // Fade out
      
      // Create a burst effect with multiple elements
      this.ctx.strokeStyle = `rgba(255, 255, 255, ${fadeOpacity})`;
      this.ctx.lineWidth = 2;
      
      // Draw radiating lines
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI * 2) / 6;
        const innerRadius = expansion * 0.3;
        const outerRadius = expansion;
        
        this.ctx.beginPath();
        this.ctx.moveTo(
          event.x + Math.cos(angle) * innerRadius,
          event.y + Math.sin(angle) * innerRadius
        );
        this.ctx.lineTo(
          event.x + Math.cos(angle) * outerRadius,
          event.y + Math.sin(angle) * outerRadius
        );
        this.ctx.stroke();
      }
      
      // Draw central burst circle
      this.ctx.fillStyle = `rgba(${event.hunterColor.r}, ${event.hunterColor.g}, ${event.hunterColor.b}, ${fadeOpacity * 0.5})`;
      this.ctx.beginPath();
      this.ctx.arc(event.x, event.y, expansion * 0.4, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Draw outer ring
      this.ctx.strokeStyle = `rgba(${event.preyColor.r}, ${event.preyColor.g}, ${event.preyColor.b}, ${fadeOpacity})`;
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.arc(event.x, event.y, expansion * 0.7, 0, Math.PI * 2);
      this.ctx.stroke();
    }
    
    this.ctx.restore();
  }
  
  updateBoidVisuals(boid) {
    // Update trail length
    boid.maxTrailLength = this.settings.trailLength;
    
    // Update shape - preserve type-based shape when 'mixed'
    if (this.settings.boidShape === 'mixed') {
      boid.shape = boid.type; // Keep original type as shape
    } else {
      boid.shape = this.settings.boidShape;
    }
    
    // Update color based on mode
    switch (this.settings.colorMode) {
      case 'grouping':
        this.updateGroupingColor(boid);
        break;
      case 'velocity':
        this.updateVelocityColor(boid);
        break;
      case 'direction':
        this.updateDirectionColor(boid);
        break;
      case 'rainbow':
        this.updateRainbowColor(boid);
        break;
      case 'theme':
      default:
        this.updateThemeColor(boid);
        break;
    }
  }
  
  updateGroupingColor(boid) {
    // Assign distinct colors based on boid type/group
    switch (boid.type) {
      case 'triangle':
        // Red/orange for triangles
        boid.color.r = 255;
        boid.color.g = 100;
        boid.color.b = 50;
        break;
      case 'circle':
        // Blue/cyan for circles
        boid.color.r = 50;
        boid.color.g = 150;
        boid.color.b = 255;
        break;
      case 'diamond':
        // Green/lime for diamonds
        boid.color.r = 100;
        boid.color.g = 255;
        boid.color.b = 80;
        break;
      default:
        // Fallback to theme color
        this.updateThemeColor(boid);
        break;
    }
  }
  
  updateVelocityColor(boid) {
    const speed = Math.sqrt(boid.velocity.x * boid.velocity.x + boid.velocity.y * boid.velocity.y);
    const normalizedSpeed = Math.min(speed / boid.maxSpeed, 1);
    
    // Blue (slow) to Red (fast)
    boid.color.r = Math.floor(normalizedSpeed * 255);
    boid.color.g = Math.floor((1 - normalizedSpeed) * 100);
    boid.color.b = Math.floor((1 - normalizedSpeed) * 255);
  }
  
  updateDirectionColor(boid) {
    const angle = Math.atan2(boid.velocity.y, boid.velocity.x);
    const normalizedAngle = (angle + Math.PI) / (2 * Math.PI); // 0 to 1
    
    // Convert to HSL
    const hue = normalizedAngle * 360;
    const rgb = this.hslToRgb(hue, 70, 60);
    boid.color.r = rgb.r;
    boid.color.g = rgb.g;
    boid.color.b = rgb.b;
  }
  
  updateRainbowColor(boid) {
    const time = Date.now() * 0.001;
    const hue = (time * 50 + boid.position.x * 0.1) % 360;
    const rgb = this.hslToRgb(hue, 80, 60);
    boid.color.r = rgb.r;
    boid.color.g = rgb.g;
    boid.color.b = rgb.b;
  }
  
  updateThemeColor(boid) {
    if (this.currentTheme === 'dark') {
      boid.color.r = 240;
      boid.color.g = 240;
      boid.color.b = 240;
    } else {
      boid.color.r = 51;
      boid.color.g = 51;
      boid.color.b = 51;
    }
  }
  
  hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h * 6) % 2 - 1));
    const m = l - c / 2;
    
    let r, g, b;
    
    if (h < 1/6) {
      r = c; g = x; b = 0;
    } else if (h < 2/6) {
      r = x; g = c; b = 0;
    } else if (h < 3/6) {
      r = 0; g = c; b = x;
    } else if (h < 4/6) {
      r = 0; g = x; b = c;
    } else if (h < 5/6) {
      r = x; g = 0; b = c;
    } else {
      r = c; g = 0; b = x;
    }
    
    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255)
    };
  }

  updatePerformanceMetrics(currentTime) {
    if (this.lastFrameTime > 0) {
      const deltaTime = currentTime - this.lastFrameTime;
      this.fps = 1000 / deltaTime;
      this.fpsHistory.push(this.fps);
      
      if (this.fpsHistory.length > 60) {
        this.fpsHistory.shift();
      }
      
      if (this.frameCount % 60 === 0) {
        this.adjustPerformance();
      }
    }
    
    this.lastFrameTime = currentTime;
    this.frameCount++;
  }

  adjustPerformance() {
    const avgFps = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;
    
    if (avgFps < 30 && this.performanceScale > 0.5) {
      this.performanceScale *= 0.9;
      // Reduce trail length on low performance
      if (this.settings.trailLength > 5) {
        this.settings.trailLength = Math.max(5, this.settings.trailLength - 2);
      }
    } else if (avgFps > 55 && this.performanceScale < 1) {
      this.performanceScale *= 1.1;
      if (this.performanceScale > 1) this.performanceScale = 1;
    }
  }

  setupMouseTracking() {
    document.addEventListener('mousemove', (e) => {
      this.mousePos = { x: e.clientX, y: e.clientY };
    });
    
    document.addEventListener('mouseleave', () => {
      this.mousePos = null;
    });
  }
  
  setupScrollListener() {
    let ticking = false;
    
    const updateScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const heroSection = document.querySelector('#home') || document.querySelector('.hero');
      
      if (heroSection) {
        const heroRect = heroSection.getBoundingClientRect();
        const heroBottom = heroRect.bottom;
        const heroHeight = heroRect.height;
        
        // Calculate fade based on how much of hero is visible
        let visibilityRatio = 1;
        
        if (scrollTop > 50) {
          // Start fading much faster - after just 50px of scroll
          const fadeDistance = windowHeight * 0.4; // Fade over 40% of viewport height
          const fadeProgress = Math.min(1, (scrollTop - 50) / fadeDistance);
          visibilityRatio = 1 - fadeProgress;
        } else {
          // At the very top - fully visible
          visibilityRatio = 1;
        }
        
        this.scrollOpacity = Math.max(0, visibilityRatio);
        this.isScrollVisible = visibilityRatio > 0.01;
        
        // Update canvas opacity
        if (this.canvas) {
          this.canvas.style.opacity = this.scrollOpacity;
        }
        
        // Update control panel visibility
        const controlPanel = document.querySelector('.boids-controls');
        const toggleBtn = document.querySelector('.boids-toggle-btn');
        
        if (controlPanel && toggleBtn) {
          if (this.isScrollVisible) {
            toggleBtn.style.opacity = this.scrollOpacity;
            toggleBtn.style.pointerEvents = 'auto';
          } else {
            toggleBtn.style.opacity = '0';
            toggleBtn.style.pointerEvents = 'none';
            controlPanel.classList.remove('open');
          }
        }
        
        // Disable animation when not visible for performance
        if (!this.isScrollVisible && this.isEnabled) {
          this.isEnabled = false;
          this.wasEnabledBeforeScroll = true;
        } else if (this.isScrollVisible && !this.isEnabled) {
          // Re-enable when visible again (regardless of previous state)
          this.isEnabled = true;
          this.wasEnabledBeforeScroll = false;
          // Force restart the animation loop
          this.isRunning = false;
          this.start();
        }
      }
      
      ticking = false;
    };
    
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateScroll);
    
    // Initial check
    updateScroll();
  }
  
  createControlPanel() {
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'boids-toggle-btn';
    toggleBtn.innerHTML = '🐦';
    toggleBtn.setAttribute('aria-label', 'Toggle boids controls');
    toggleBtn.setAttribute('tabindex', '0');
    toggleBtn.setAttribute('role', 'button');
    
    const controlPanel = document.createElement('div');
    controlPanel.className = 'boids-controls';
    
    controlPanel.innerHTML = `
      <h3>Ecosystem Controls</h3>
      <div style="color: var(--secondary-text); font-size: 0.8rem; margin-bottom: 1rem;">
        <span style="color: #ff6432;">▲ Triangles</span> cut <span style="color: #3296ff;">● Circles</span><br>
        <span style="color: #3296ff;">● Circles</span> roll over <span style="color: #64ff50;">♦ Diamonds</span><br>
        <span style="color: #64ff50;">♦ Diamonds</span> cut <span style="color: #ff6432;">▲ Triangles</span>
      </div>
      <div class="control-group">
        <label for="boidCountSlider">Population: <span class="control-value" id="boidCount">${this.settings.boidCount}</span></label>
        <input type="range" id="boidCountSlider" min="15" max="150" value="${this.settings.boidCount}" aria-labelledby="boidCount">
      </div>
      <div class="control-group">
        <label for="maxSpeedSlider">Movement Speed: <span class="control-value" id="maxSpeed">${this.settings.maxSpeed}</span></label>
        <input type="range" id="maxSpeedSlider" min="0.5" max="5" step="0.1" value="${this.settings.maxSpeed}" aria-labelledby="maxSpeed">
      </div>
      <div class="control-group">
        <label for="separationRadiusSlider">Personal Space: <span class="control-value" id="separationRadius">${this.settings.separationRadius}</span></label>
        <input type="range" id="separationRadiusSlider" min="10" max="100" value="${this.settings.separationRadius}" aria-labelledby="separationRadius">
      </div>
      <div class="control-group">
        <label for="alignmentRadiusSlider">Group Alignment: <span class="control-value" id="alignmentRadius">${this.settings.alignmentRadius}</span></label>
        <input type="range" id="alignmentRadiusSlider" min="10" max="100" value="${this.settings.alignmentRadius}" aria-labelledby="alignmentRadius">
      </div>
      <div class="control-group">
        <label for="cohesionRadiusSlider">Group Attraction: <span class="control-value" id="cohesionRadius">${this.settings.cohesionRadius}</span></label>
        <input type="range" id="cohesionRadiusSlider" min="10" max="100" value="${this.settings.cohesionRadius}" aria-labelledby="cohesionRadius">
      </div>
      <hr style="margin: 1rem 0; border: 1px solid var(--border-color);">
      <div class="control-group">
        <label for="trailLengthSlider">Trail Length: <span class="control-value" id="trailLength">${this.settings.trailLength}</span></label>
        <input type="range" id="trailLengthSlider" min="0" max="50" value="${this.settings.trailLength}" aria-labelledby="trailLength">
      </div>
      <div class="control-group">
        <label for="colorModeSelect">Color Mode:</label>
        <select id="colorModeSelect">
          <option value="grouping" ${this.settings.colorMode === 'grouping' ? 'selected' : ''}>Grouping</option>
          <option value="direction" ${this.settings.colorMode === 'direction' ? 'selected' : ''}>Direction</option>
          <option value="velocity" ${this.settings.colorMode === 'velocity' ? 'selected' : ''}>Velocity</option>
          <option value="rainbow" ${this.settings.colorMode === 'rainbow' ? 'selected' : ''}>Rainbow</option>
          <option value="theme" ${this.settings.colorMode === 'theme' ? 'selected' : ''}>Theme</option>
        </select>
      </div>
      <div class="control-group">
        <label>
          <input type="checkbox" id="showTrailsCheckbox" ${this.settings.showTrails ? 'checked' : ''}>
          Show Snow Trails
        </label>
      </div>
      <div class="control-group">
        <label>
          <input type="checkbox" id="showCatchEffectsCheckbox" ${this.settings.showCatchEffects ? 'checked' : ''}>
          Show Catch Effects
        </label>
      </div>
      <div class="control-buttons">
        <button class="control-btn" id="toggleBoids" aria-pressed="false">Disable</button>
        <button class="control-btn" id="resetSettings">Reset</button>
      </div>
    `;
    
    controlPanel.setAttribute('role', 'dialog');
    controlPanel.setAttribute('aria-label', 'Boids animation controls');
    controlPanel.setAttribute('aria-hidden', 'true');
    
    document.body.appendChild(toggleBtn);
    document.body.appendChild(controlPanel);
    
    this.setupControlEventListeners(toggleBtn, controlPanel);
  }
  
  setupControlEventListeners(toggleBtn, controlPanel) {
    const togglePanel = () => {
      const isOpen = controlPanel.classList.contains('open');
      controlPanel.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', !isOpen);
      if (!isOpen) {
        controlPanel.setAttribute('aria-hidden', 'false');
      } else {
        controlPanel.setAttribute('aria-hidden', 'true');
      }
    };
    
    toggleBtn.addEventListener('click', togglePanel);
    toggleBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        togglePanel();
      }
    });
    
    document.addEventListener('click', (e) => {
      if (!controlPanel.contains(e.target) && !toggleBtn.contains(e.target)) {
        controlPanel.classList.remove('open');
      }
    });
    
    // Settings sliders
    const sliders = {
      boidCount: document.getElementById('boidCountSlider'),
      maxSpeed: document.getElementById('maxSpeedSlider'),
      separationRadius: document.getElementById('separationRadiusSlider'),
      alignmentRadius: document.getElementById('alignmentRadiusSlider'),
      cohesionRadius: document.getElementById('cohesionRadiusSlider'),
      trailLength: document.getElementById('trailLengthSlider')
    };
    
    Object.entries(sliders).forEach(([key, slider]) => {
      slider.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        this.settings[key] = value;
        document.getElementById(key).textContent = value;
        
        if (key === 'boidCount') {
          this.setupBoids();
        } else {
          this.updateBoidSettings();
        }
      });
    });
    
    // Color mode selector
    document.getElementById('colorModeSelect').addEventListener('change', (e) => {
      this.settings.colorMode = e.target.value;
    });
    
    // Show trails checkbox
    document.getElementById('showTrailsCheckbox').addEventListener('change', (e) => {
      this.settings.showTrails = e.target.checked;
    });
    
    // Show catch effects checkbox
    document.getElementById('showCatchEffectsCheckbox').addEventListener('change', (e) => {
      this.settings.showCatchEffects = e.target.checked;
      if (!e.target.checked) {
        this.catchEvents = []; // Clear existing events when disabled
      }
    });
    
    // Toggle button
    document.getElementById('toggleBoids').addEventListener('click', (e) => {
      this.isEnabled = !this.isEnabled;
      e.target.textContent = this.isEnabled ? 'Disable' : 'Enable';
      e.target.classList.toggle('active', !this.isEnabled);
      e.target.setAttribute('aria-pressed', this.isEnabled ? 'false' : 'true');
      
      if (this.isEnabled) {
        // Force restart the animation loop
        this.isRunning = false;
        this.start();
      } else {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    });
    
    // Reset button
    document.getElementById('resetSettings').addEventListener('click', () => {
      this.resetSettings();
    });
  }
  
  applySettingsToBoid(boid) {
    boid.maxSpeed = this.settings.maxSpeed;
    boid.maxForce = this.settings.maxForce;
    boid.separationRadius = this.settings.separationRadius;
    boid.alignmentRadius = this.settings.alignmentRadius;
    boid.cohesionRadius = this.settings.cohesionRadius;
    boid.avoidRadius = this.settings.avoidRadius;
  }
  
  updateBoidSettings() {
    this.boids.forEach(boid => {
      this.applySettingsToBoid(boid);
    });
  }
  
  resetSettings() {
    this.settings = {
      boidCount: 60,
      maxSpeed: 2,
      maxForce: 0.05,
      separationRadius: 25,
      alignmentRadius: 50,
      cohesionRadius: 50,
      avoidRadius: 50,
      separationWeight: 1.5,
      alignmentWeight: 1.0,
      cohesionWeight: 1.0,
      avoidanceWeight: 2.0,
      
      // Visual settings
      showTrails: true,
      showCatchEffects: true,
      trailLength: 20,
      boidShape: 'mixed',
      colorMode: 'grouping'
    };
    
    // Update UI
    document.getElementById('boidCountSlider').value = this.settings.boidCount;
    document.getElementById('maxSpeedSlider').value = this.settings.maxSpeed;
    document.getElementById('separationRadiusSlider').value = this.settings.separationRadius;
    document.getElementById('alignmentRadiusSlider').value = this.settings.alignmentRadius;
    document.getElementById('cohesionRadiusSlider').value = this.settings.cohesionRadius;
    document.getElementById('trailLengthSlider').value = this.settings.trailLength;
    document.getElementById('colorModeSelect').value = this.settings.colorMode;
    document.getElementById('showTrailsCheckbox').checked = this.settings.showTrails;
    document.getElementById('showCatchEffectsCheckbox').checked = this.settings.showCatchEffects;
    
    document.getElementById('boidCount').textContent = this.settings.boidCount;
    document.getElementById('maxSpeed').textContent = this.settings.maxSpeed;
    document.getElementById('separationRadius').textContent = this.settings.separationRadius;
    document.getElementById('alignmentRadius').textContent = this.settings.alignmentRadius;
    document.getElementById('cohesionRadius').textContent = this.settings.cohesionRadius;
    document.getElementById('trailLength').textContent = this.settings.trailLength;
    
    // Clear existing catch events when resetting
    this.catchEvents = [];
    
    this.setupBoids();
  }
  
  destroy() {
    this.stop();
    if (this.canvas) {
      document.body.removeChild(this.canvas);
    }
    const toggleBtn = document.querySelector('.boids-toggle-btn');
    const controlPanel = document.querySelector('.boids-controls');
    if (toggleBtn) document.body.removeChild(toggleBtn);
    if (controlPanel) document.body.removeChild(controlPanel);
  }
}

let boidsSystem;

document.addEventListener('DOMContentLoaded', () => {
  // Check for browser compatibility
  if (!window.HTMLCanvasElement || !window.requestAnimationFrame || !window.MutationObserver) {
    console.warn('Browser does not support required features for boids animation');
    return;
  }
  
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    try {
      boidsSystem = new BoidsSystem();
      boidsSystem.init();
    } catch (error) {
      console.warn('Boids system failed to initialize:', error);
      // Graceful fallback - remove any partially created elements
      const toggleBtn = document.querySelector('.boids-toggle-btn');
      const controlPanel = document.querySelector('.boids-controls');
      const canvas = document.querySelector('#boids-canvas');
      if (toggleBtn) document.body.removeChild(toggleBtn);
      if (controlPanel) document.body.removeChild(controlPanel);
      if (canvas) document.body.removeChild(canvas);
    }
  }
});

window.addEventListener('beforeunload', () => {
  if (boidsSystem) {
    boidsSystem.destroy();
  }
});