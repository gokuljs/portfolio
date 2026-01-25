'use client';

import React, { useEffect, useRef } from 'react';

export const CyberpunkBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    const vertexSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragmentSource = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;

      float hash(float n) {
        return fract(sin(n) * 43758.5453123);
      }

      float hash2d(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        float aspect = u_resolution.x / u_resolution.y;
        
        // Even smaller squares - increased columns for higher density
        float columns = 400.0;
        float rows = columns / aspect;
        vec2 grid = vec2(columns, rows);
        vec2 id = floor(uv * grid);
        vec2 gv = fract(uv * grid);
        
        // Mountain-like mask silhouette
        float mountain = sin(id.x * 0.015) * 0.12;
        mountain += sin(id.x * 0.04) * 0.08;
        mountain += sin(id.x * 0.08) * 0.04;
        
        float colHash = hash(id.x);
        float depthVariation = colHash * 0.3;
        
        // Lowering the threshold so the effect "comes way down" as requested
        // Base threshold at 0.4 means it can reach almost to the middle of the screen
        float threshold = 0.55 + mountain - depthVariation * 1.5;
        
        // Background grid - almost invisible but slightly more visible as it's larger now
        float bgGrid = step(0.15, gv.x) * step(0.15, 1.0 - gv.x) * step(0.15, gv.y) * step(0.15, 1.0 - gv.y);
        vec3 bgColor = vec3(0.0, 0.05, 0.02) * bgGrid * 0.04 * smoothstep(0.3, 1.0, uv.y);
        
        vec3 finalColor = bgColor;
        
        // Active Blocks
        if (uv.y > threshold) {
            float normalizedY = (uv.y - threshold) / (1.0 - threshold);
            
            // Brightness gradient - keep it dimmed but stretched across the larger depth
            float brightness = pow(normalizedY, 1.5) * 0.35;
            
            // Subtle flicker
            float flicker = step(0.3, hash2d(id + floor(u_time * (1.5 + colHash * 3.0))));
            
            // Block shape
            float block = step(0.2, gv.x) * step(0.2, 1.0 - gv.x) * step(0.2, gv.y) * step(0.2, 1.0 - gv.y);
            
            // Deep forest green
            vec3 activeGreen = vec3(0.0, 0.6, 0.25);
            finalColor += activeGreen * brightness * flicker * block;
            
            // Extremely subtle top edge glow
            float topEdge = smoothstep(0.98, 1.0, uv.y);
            finalColor += activeGreen * topEdge * 0.15;
        }
        
        // Soft bloom stretched vertically
        float bloom = smoothstep(0.4, 1.0, uv.y) * 0.05;
        finalColor += vec3(0.0, 0.4, 0.15) * bloom;

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const program = gl.createProgram();
    if (!program) return;
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    if (!vertexShader || !fragmentShader) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');

    const resize = () => {
      const pixelRatio = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * pixelRatio;
      canvas.height = window.innerHeight * pixelRatio;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    window.addEventListener('resize', resize);
    resize();

    let animationFrame: number;
    const render = (time: number) => {
      gl.useProgram(program);
      gl.uniform1f(timeLocation, time * 0.001);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrame = requestAnimationFrame(render);
    };

    animationFrame = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-screen pointer-events-none z-0"
      style={{ 
        background: 'black',
        mixBlendMode: 'screen',
        height: '100vh'
      }}
    />
  );
};
