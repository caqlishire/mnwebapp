'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// Advanced WebGL-based 3D canvas component
interface WebGLCanvasProps {
  width?: number;
  height?: number;
  className?: string;
  interactive?: boolean;
  animationSpeed?: number;
  colorScheme?: 'healthcare' | 'trust' | 'calm';
}

// Vertex shader source
const vertexShaderSource = `
  precision mediump float;
  attribute vec4 aVertexPosition;
  attribute vec3 aVertexNormal;
  attribute vec2 aTextureCoord;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;
  uniform mat4 uNormalMatrix;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uInteractionStrength;

  varying highp vec2 vTextureCoord;
  varying highp vec3 vLighting;
  varying highp vec3 vNormal;
  varying highp vec3 vPosition;

  void main(void) {
    // Add wave distortion based on time and mouse position
    vec4 position = aVertexPosition;
    float mouseDistance = distance(position.xy, uMouse);
    float wave = sin(uTime * 2.0 + mouseDistance * 5.0) * 0.1;
    position.z += wave * uInteractionStrength;
    
    gl_Position = uProjectionMatrix * uModelViewMatrix * position;
    vTextureCoord = aTextureCoord;
    vPosition = position.xyz;
    
    // Calculate lighting
    highp vec3 ambientLight = vec3(0.3, 0.3, 0.4);
    highp vec3 directionalLightColor = vec3(1, 1, 1);
    highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));
    
    highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
    highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
    vLighting = ambientLight + (directionalLightColor * directional);
    vNormal = transformedNormal.xyz;
  }
`;

// Fragment shader source with healthcare color schemes
const fragmentShaderSource = `
  precision mediump float;
  
  varying highp vec2 vTextureCoord;
  varying highp vec3 vLighting;
  varying highp vec3 vNormal;
  varying highp vec3 vPosition;
  
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uColorScheme; // 0: healthcare, 1: trust, 2: calm
  uniform float uInteractionStrength;

  // Healthcare color palettes (GLSL ES 1.00 compatible)
  vec3 getHealthcareColor(float idx) {
    if (idx < 0.5) return vec3(0.184, 0.427, 0.714); // Trust blue #2F6DB6
    else if (idx < 1.5) return vec3(0.020, 0.588, 0.412); // Calm green #059669
    else return vec3(0.937, 0.620, 0.043); // Warmth orange #f59e0b
  }

  // Noise function for organic textures
  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  // Smooth noise
  float smoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    float a = noise(i);
    float b = noise(i + vec2(1.0, 0.0));
    float c = noise(i + vec2(0.0, 1.0));
    float d = noise(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  // Fractal noise
  float fractalNoise(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    
    for(int i = 0; i < 4; i++) {
      value += amplitude * smoothNoise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    
    return value;
  }

  void main(void) {
    // Dynamic color selection based on scheme
    vec3 baseColor = getHealthcareColor(uColorScheme);
    
    // Add noise texture for organic feel
    float noiseValue = fractalNoise(vTextureCoord * 8.0 + uTime * 0.1);
    
    // Mouse interaction effect
    float mouseDistance = distance(vPosition.xy, uMouse);
    float mouseEffect = smoothstep(1.0, 0.0, mouseDistance) * uInteractionStrength;
    
    // Combine colors with lighting and effects
    vec3 color = baseColor;
    color += noiseValue * 0.1;
    color += mouseEffect * 0.3;
    color *= vLighting;
    
    // Add rim lighting effect
    float rimLight = 1.0 - dot(normalize(vNormal), vec3(0.0, 0.0, 1.0));
    color += rimLight * 0.2 * baseColor;
    
    // Final color with alpha based on interaction
    gl_FragColor = vec4(color, 0.8 + mouseEffect * 0.2);
  }
`;

// WebGL utility functions
class WebGLRenderer {
  private gl: WebGLRenderingContext;
  private program: WebGLProgram | null = null;
  private buffer: WebGLBuffer | null = null;
  private uniforms: Record<string, WebGLUniformLocation | null> = {};
  private time = 0;
  private mouse = { x: 0, y: 0 };
  private interactionStrength = 0;

  constructor(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      throw new Error('WebGL not supported');
    }
    this.gl = gl as WebGLRenderingContext;
    this.initShaders();
    this.initBuffers();
    this.initUniforms();
  }

  private createShader(type: number, source: string): WebGLShader | null {
    const shader = this.gl.createShader(type);
    if (!shader) return null;

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  private initShaders() {
    const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) return;

    this.program = this.gl.createProgram();
    if (!this.program) return;

    this.gl.attachShader(this.program, vertexShader);
    this.gl.attachShader(this.program, fragmentShader);
    this.gl.linkProgram(this.program);

    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      console.error('Program linking error:', this.gl.getProgramInfoLog(this.program));
      return;
    }

    this.gl.useProgram(this.program);
  }

  private initBuffers() {
    // Create a complex geometric mesh
    const vertices = this.generateComplexMesh();
    
    this.buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
  }

  private generateComplexMesh(): number[] {
    const vertices: number[] = [];
    const resolution = 50;
    
    // Generate a complex mesh with healthcare-inspired patterns
    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < resolution; j++) {
        const x = (i / resolution) * 2 - 1;
        const y = (j / resolution) * 2 - 1;
        
        // Create organic, flowing patterns
        const angle = Math.atan2(y, x);
        const radius = Math.sqrt(x * x + y * y);
        const wave = Math.sin(angle * 5 + radius * 10) * 0.1;
        
        // Position (x, y, z)
        vertices.push(x, y, wave);
        
        // Normal (nx, ny, nz) - calculated for lighting
        vertices.push(0, 0, 1);
        
        // Texture coordinates (u, v)
        vertices.push(i / resolution, j / resolution);
      }
    }
    
    return vertices;
  }

  private initUniforms() {
    if (!this.program) return;

    this.uniforms = {
      uTime: this.gl.getUniformLocation(this.program, 'uTime'),
      uMouse: this.gl.getUniformLocation(this.program, 'uMouse'),
      uColorScheme: this.gl.getUniformLocation(this.program, 'uColorScheme'),
      uInteractionStrength: this.gl.getUniformLocation(this.program, 'uInteractionStrength'),
      uModelViewMatrix: this.gl.getUniformLocation(this.program, 'uModelViewMatrix'),
      uProjectionMatrix: this.gl.getUniformLocation(this.program, 'uProjectionMatrix'),
      uNormalMatrix: this.gl.getUniformLocation(this.program, 'uNormalMatrix'),
    };
  }

  updateMouse(x: number, y: number) {
    this.mouse.x = x;
    this.mouse.y = y;
    this.interactionStrength = Math.min(this.interactionStrength + 0.1, 1.0);
  }

  render(colorScheme: number) {
    if (!this.program) return;

    this.time += 0.016; // ~60fps
    this.interactionStrength *= 0.95; // Fade interaction effect

    // Clear canvas
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    
    // Set uniforms
    this.gl.uniform1f(this.uniforms.uTime, this.time);
    this.gl.uniform2f(this.uniforms.uMouse, this.mouse.x, this.mouse.y);
    this.gl.uniform1f(this.uniforms.uColorScheme, colorScheme);
    this.gl.uniform1f(this.uniforms.uInteractionStrength, this.interactionStrength);

    // Set up matrices for 3D transformation
    const modelViewMatrix = this.createModelViewMatrix();
    const projectionMatrix = this.createProjectionMatrix();
    const normalMatrix = this.createNormalMatrix(modelViewMatrix);

    this.gl.uniformMatrix4fv(this.uniforms.uModelViewMatrix, false, modelViewMatrix);
    this.gl.uniformMatrix4fv(this.uniforms.uProjectionMatrix, false, projectionMatrix);
    this.gl.uniformMatrix4fv(this.uniforms.uNormalMatrix, false, normalMatrix);

    // Set up vertex attributes
    const positionLocation = this.gl.getAttribLocation(this.program, 'aVertexPosition');
    const normalLocation = this.gl.getAttribLocation(this.program, 'aVertexNormal');
    const texCoordLocation = this.gl.getAttribLocation(this.program, 'aTextureCoord');

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);

    // Position attribute (3 floats)
    this.gl.enableVertexAttribArray(positionLocation);
    this.gl.vertexAttribPointer(positionLocation, 3, this.gl.FLOAT, false, 8 * 4, 0);

    // Normal attribute (3 floats)
    this.gl.enableVertexAttribArray(normalLocation);
    this.gl.vertexAttribPointer(normalLocation, 3, this.gl.FLOAT, false, 8 * 4, 3 * 4);

    // Texture coordinate attribute (2 floats)
    this.gl.enableVertexAttribArray(texCoordLocation);
    this.gl.vertexAttribPointer(texCoordLocation, 2, this.gl.FLOAT, false, 8 * 4, 6 * 4);

    // Render
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 2500 * 3); // Approximate vertex count
  }

  private createModelViewMatrix(): Float32Array {
    // Simple identity matrix with slight rotation
    const rotation = this.time * 0.1;
    return new Float32Array([
      Math.cos(rotation), 0, Math.sin(rotation), 0,
      0, 1, 0, 0,
      -Math.sin(rotation), 0, Math.cos(rotation), 0,
      0, 0, -5, 1
    ]);
  }

  private createProjectionMatrix(): Float32Array {
    // Perspective projection matrix
    const fov = 45 * Math.PI / 180;
    const aspect = 1.0; // Square canvas
    const near = 0.1;
    const far = 100.0;
    
    const f = 1.0 / Math.tan(fov / 2);
    return new Float32Array([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (far + near) / (near - far), -1,
      0, 0, (2 * far * near) / (near - far), 0
    ]);
  }

  private createNormalMatrix(modelViewMatrix: Float32Array): Float32Array {
    // For simplicity, return identity - in production, calculate inverse transpose
    return new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
  }

  dispose() {
    if (this.buffer) this.gl.deleteBuffer(this.buffer);
    if (this.program) this.gl.deleteProgram(this.program);
  }
}

export default function WebGLCanvas({
  width = 400,
  height = 400,
  className = '',
  interactive = true,
  animationSpeed = 1,
  colorScheme = 'healthcare'
}: WebGLCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<WebGLRenderer | null>(null);
  const animationRef = useRef<number>();
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const colorSchemeMap = {
    healthcare: 0,
    trust: 1,
    calm: 2
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = width;
    canvas.height = height;

    try {
      rendererRef.current = new WebGLRenderer(canvas);
      setIsLoaded(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'WebGL initialization failed');
      return;
    }

    const animate = () => {
      if (rendererRef.current) {
        rendererRef.current.render(colorSchemeMap[colorScheme]);
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive || !rendererRef.current || !canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      
      rendererRef.current.updateMouse(x, y);
    };

    if (interactive) {
      canvas.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (canvas && interactive) {
        canvas.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [width, height, interactive, colorScheme]);

  if (error) {
    return (
      <div 
        className={`${className} flex items-center justify-center bg-gray-100 rounded-lg`}
        style={{ width, height }}
      >
        <div className="text-center p-4">
          <div className="text-gray-500 mb-2">WebGL not available</div>
          <div className="text-sm text-gray-400">
            3D effects require WebGL support
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: isLoaded ? 1 : 0.5, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <canvas
        ref={canvasRef}
        className="rounded-lg shadow-depth-2 hover:shadow-depth-3 transition-shadow duration-500"
        style={{ 
          width: `${width}px`, 
          height: `${height}px`,
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
        }}
      />
      
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="animate-spin w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full" />
        </div>
      )}
      
      {interactive && isLoaded && (
        <div className="absolute bottom-2 left-2 text-xs text-gray-500 pointer-events-none">
          Move mouse to interact
        </div>
      )}
    </motion.div>
  );
}