import React from 'react';
import { IShape } from "../types/index";

interface ShapeProps {
    shape: IShape;
    onMouseDown: (e: React.MouseEvent, shape: IShape) => void;
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseUp: () => void;
    onResizeStart: (e: React.MouseEvent, shape: IShape, direction: string) => void;
    onResize: (e: React.MouseEvent) => void;
    isFocused: boolean;
  }

const Shape: React.FC<ShapeProps> = ({
    shape,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onResizeStart,
    onResize,
    isFocused,
}) => {
    const renderShape = () => {
        switch (shape.type) {
            case 'rectangle':
            case 'square':
                return (
                    <rect
                        x={shape.x}
                        y={shape.y}
                        width={shape.width}
                        height={shape.height}
                        stroke={shape.stroke}
                        fill={shape.fill}
                        onMouseDown={(e) => onMouseDown(e, shape)}
                        onMouseMove={onMouseMove}
                        onMouseUp={onMouseUp}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    />
                );
            case 'circle':
                return (
                    <circle
                        cx={shape.x + shape.width / 2}
                        cy={shape.y + shape.height / 2}
                        r={shape.width / 2}
                        stroke={shape.stroke}
                        fill={shape.fill}
                        onMouseDown={(e) => onMouseDown(e, shape)}
                        onMouseMove={onMouseMove}
                        onMouseUp={onMouseUp}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    />
                );
            case 'triangle':
                const x1 = shape.x;
                const y1 = shape.y + shape.height;
                const x2 = shape.x + shape.width;
                const y2 = shape.y + shape.height;
                const x3 = shape.x + shape.width / 2;
                const y3 = shape.y;
                return (
                    <polygon
                        points={`${x1},${y1} ${x2},${y2} ${x3},${y3}`}
                        stroke={shape.stroke}
                        fill={shape.fill}
                        onMouseDown={(e) => onMouseDown(e, shape)}
                        onMouseMove={onMouseMove}
                        onMouseUp={onMouseUp}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    />
                );
            case 'diamond':
            case 'rhombus':
                const dx1 = shape.x + shape.width / 2;
                const dy1 = shape.y;
                const dx2 = shape.x + shape.width;
                const dy2 = shape.y + shape.height / 2;
                const dx3 = shape.x + shape.width / 2;
                const dy3 = shape.y + shape.height;
                const dx4 = shape.x;
                const dy4 = shape.y + shape.height / 2;
                return (
                    <polygon
                        points={`${dx1},${dy1} ${dx2},${dy2} ${dx3},${dy3} ${dx4},${dy4}`}
                        stroke={shape.stroke}
                        fill={shape.fill}
                        onMouseDown={(e) => onMouseDown(e, shape)}
                        onMouseMove={onMouseMove}
                        onMouseUp={onMouseUp}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    />
                );
            case 'arch':
                // const arcX = shape.x + shape.width / 2;
                const arcY = shape.y + shape.height;
                return (
                    <path
                        d={`M ${shape.x} ${arcY} A ${shape.width / 2} ${shape.height
                            } 0 0 1 ${shape.x + shape.width} ${arcY}`}
                        stroke={shape.stroke}
                        fill={shape.fill}
                        onMouseDown={(e) => onMouseDown(e, shape)}
                        onMouseMove={onMouseMove}
                        onMouseUp={onMouseUp}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    />
                );
            case 'line':
                return (
                    <line
                        x1={shape.x}
                        y1={shape.y}
                        x2={shape.x + shape.width}
                        y2={shape.y + shape.height}
                        stroke={shape.stroke}
                        strokeWidth="2"
                        onMouseDown={(e) => onMouseDown(e, shape)}
                        onMouseMove={onMouseMove}
                        onMouseUp={onMouseUp}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    />
                );
            case 'arrow':
                const angle = Math.atan2(shape.height, shape.width);
                const arrowHeadSize = 10;
                const endX = shape.x + shape.width;
                const endY = shape.y + shape.height;
                const arrowPoint1X =
                    endX - arrowHeadSize * Math.cos(angle - Math.PI / 6);
                const arrowPoint1Y =
                    endY - arrowHeadSize * Math.sin(angle - Math.PI / 6);
                const arrowPoint2X =
                    endX - arrowHeadSize * Math.cos(angle + Math.PI / 6);
                const arrowPoint2Y =
                    endY - arrowHeadSize * Math.sin(angle + Math.PI / 6);
                return (
                    <g
                        onMouseDown={(e) => onMouseDown(e, shape)}
                        onMouseMove={onMouseMove}
                        onMouseUp={onMouseUp}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        <line
                            x1={shape.x}
                            y1={shape.y}
                            x2={endX}
                            y2={endY}
                            stroke={shape.stroke}
                            strokeWidth="2"
                        />
                        <polygon
                            points={`${endX},${endY} ${arrowPoint1X},${arrowPoint1Y} ${arrowPoint2X},${arrowPoint2Y}`}
                            fill={shape.stroke}
                        />
                    </g>
                );
            default:
                return null;
        }
    };
    return (
        <>
            {renderShape()}
            {isFocused && (
                <>
                    {shape.type !== 'line' && shape.type !== 'arrow' && (
                        <circle
                            cx={shape.x + shape.width}
                            cy={shape.y + shape.height}
                            r={5}
                            fill="red"
                            cursor="se-resize"
                            onMouseDown={(e) => onResizeStart(e, shape, 'bottom-right')}
                            onMouseMove={onResize}
                            onMouseUp={onMouseUp}
                        />
                    )}
                    {(shape.type === 'line' || shape.type === 'arrow') && (
                        <>
                            <circle
                                cx={shape.x}
                                cy={shape.y}
                                r={5}
                                fill="red"
                                cursor="move"
                                onMouseDown={(e) => onResizeStart(e, shape, 'start')}
                                onMouseMove={onResize}
                                onMouseUp={onMouseUp}
                            />
                            <circle
                                cx={shape.x + shape.width}
                                cy={shape.y + shape.height}
                                r={5}
                                fill="red"
                                cursor="move"
                                onMouseDown={(e) => onResizeStart(e, shape, 'end')}
                                onMouseMove={onResize}
                                onMouseUp={onMouseUp}
                            />
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default Shape