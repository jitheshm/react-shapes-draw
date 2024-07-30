
export type IShapeType = 'rectangle' | 'circle' | 'triangle' | 'square' | 'diamond' | 'rhombus' | 'arch' | 'line' | 'arrow';

export interface IShape {
    id: number;
    type: IShapeType;
    x: number;
    y: number;
    width: number;
    height: number;
    fill: string;
    stroke: string;
}

export interface IViewBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface IPoint {
    x: number;
    y: number;
}
