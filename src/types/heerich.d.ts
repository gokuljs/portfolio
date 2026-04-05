declare module 'heerich' {
  interface StyleObject {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    opacity?: number;
    [key: string]: unknown;
  }

  interface FaceStyleMap {
    default?: StyleObject | ((x: number, y: number, z: number) => StyleObject);
    top?: StyleObject | ((x: number, y: number, z: number) => StyleObject);
    bottom?: StyleObject | ((x: number, y: number, z: number) => StyleObject);
    left?: StyleObject | ((x: number, y: number, z: number) => StyleObject);
    right?: StyleObject | ((x: number, y: number, z: number) => StyleObject);
    front?: StyleObject | ((x: number, y: number, z: number) => StyleObject);
    back?: StyleObject | ((x: number, y: number, z: number) => StyleObject);
  }

  interface GeometryOptions {
    type: 'box' | 'sphere' | 'line' | 'fill';
    position?: number[];
    center?: number[];
    size?: number | number[];
    radius?: number;
    from?: number[];
    to?: number[];
    mode?: 'union' | 'subtract' | 'intersect' | 'exclude';
    style?: FaceStyleMap;
    scale?: number[] | ((x: number, y: number, z: number) => number[] | null);
    scaleOrigin?: number[];
    opaque?: boolean;
    rotate?: { axis: 'x' | 'y' | 'z'; turns: number; center?: number[] };
    [key: string]: unknown;
  }

  interface CameraOptions {
    type?: 'oblique' | 'perspective' | 'orthographic' | 'isometric';
    angle?: number;
    distance?: number;
    pitch?: number;
    position?: number[];
  }

  interface HeerichOptions {
    tile?: number | number[];
    style?: StyleObject;
    camera?: CameraOptions;
  }

  export class Heerich {
    constructor(options?: HeerichOptions);
    applyGeometry(opts: GeometryOptions): void;
    addGeometry(opts: GeometryOptions): void;
    removeGeometry(opts: GeometryOptions): void;
    clear(): void;
    toSVG(opts?: { padding?: number }): string;
    getBounds(): { x: number; y: number; w: number; h: number };
    setCamera(opts?: CameraOptions): void;
  }
}
