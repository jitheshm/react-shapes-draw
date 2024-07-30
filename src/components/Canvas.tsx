import React from 'react'
import { useCallback, useEffect, useState } from "react";
import { IPoint, IShape, IViewBox } from "../types/index";
import Shape from './Shape';

interface CanvasProps {
    shapes: IShape[];
    onShapeMove: (id: number, deltaX: number, deltaY: number) => void;
    onShapeResize: (id: number, deltaX: number, deltaY: number) => void;
    onCanvasClick: (e: React.MouseEvent<SVGSVGElement>) => void;
    focusedShape: IShape | null;
    setFocusedShape: React.Dispatch<React.SetStateAction<IShape | null>>;
}

const Canvas: React.FC<CanvasProps> = ({
    shapes,
    onShapeMove,
    onShapeResize,
    onCanvasClick,
    focusedShape,
    setFocusedShape,
}) => {
    const [draggedShape, setDraggedShape] = useState<IShape | null>(null);
    const [resizingShape, setResizingShape] = useState<IShape | null>(null);
    const [resizeDirection, setResizeDirection] = useState<string | null>(null);
    const [viewBox, setViewBox] = useState<IViewBox>({ x: 0, y: 0, width: 1000, height: 1000 });
    const [isPanning, setIsPanning] = useState<boolean>(false);
    const [panStart, setPanStart] = useState<IPoint>({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent, shape: IShape | null) => {
        e.preventDefault();
        if (shape) {
            setDraggedShape(shape);
            setFocusedShape(shape);
        } else {
            setIsPanning(true);
            setPanStart({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (draggedShape) {
            const deltaX = e.movementX;
            const deltaY = e.movementY;
            onShapeMove(draggedShape.id, deltaX, deltaY);
        } else if (resizingShape) {
            const deltaX = e.movementX;
            const deltaY = e.movementY;
            onShapeResize(resizingShape.id, deltaX, deltaY);
        } else if (isPanning) {
            const deltaX = panStart.x - e.clientX;
            const deltaY = panStart.y - e.clientY;

            if (e.currentTarget instanceof SVGSVGElement) {
                const svgWidth = e.currentTarget.clientWidth || 1;
                const svgHeight = e.currentTarget.clientHeight || 1;

                setViewBox(prevViewBox => ({
                    ...prevViewBox,
                    x: prevViewBox.x + deltaX * (prevViewBox.width / svgWidth),
                    y: prevViewBox.y + deltaY * (prevViewBox.height / svgHeight),
                }));
            }

            setPanStart({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseUp = () => {
        setDraggedShape(null);
        setResizingShape(null);
        setResizeDirection(null);
        setIsPanning(false);
    };

    const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!isPanning) {
            onCanvasClick(e);
            setFocusedShape(null);
        }
    };

    const handleResizeStart = (e: React.MouseEvent, shape: IShape, direction: string) => {
        e.stopPropagation();
        setResizingShape(shape);
        setResizeDirection(direction);
    };

    const handleWheel = useCallback((e: WheelEvent) => {
        e.preventDefault();
        const zoomIntensity = 0.1;
        const zoomFactor = Math.exp(e.deltaY * -zoomIntensity / 100);

        const target = e.currentTarget as SVGSVGElement;
        const svgRect = target.getBoundingClientRect();
        const mouseX = e.clientX - svgRect.left;
        const mouseY = e.clientY - svgRect.top;

        const viewBoxX = viewBox.x + (mouseX / svgRect.width) * viewBox.width;
        const viewBoxY = viewBox.y + (mouseY / svgRect.height) * viewBox.height;

        const newWidth = viewBox.width * zoomFactor;
        const newHeight = viewBox.height * zoomFactor;

        setViewBox({
            x: viewBoxX - (mouseX / svgRect.width) * newWidth,
            y: viewBoxY - (mouseY / svgRect.height) * newHeight,
            width: newWidth,
            height: newHeight,
        });
    }, [viewBox]);

    useEffect(() => {
        const svgElement = document.querySelector('svg');
        if (svgElement) {
            svgElement.addEventListener('wheel', handleWheel, { passive: false });
            return () => {
                svgElement.removeEventListener('wheel', handleWheel);
            };
        }
    }, [handleWheel]);

    return (
        <svg
            width="100%"
            height="100%"
            viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
            onMouseDown={(e) => handleMouseDown(e, null)}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onClick={handleClick}
            onWheel={handleWheel as any}
            style={{ border: '1px solid black' }}
        >
            {shapes.map((shape) => (
                <Shape
                    key={shape.id}
                    shape={shape}
                    onMouseDown={(e) => handleMouseDown(e, shape)}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onResizeStart={handleResizeStart}
                    isFocused={shape.id === focusedShape?.id}
                    onResize={(e) => {
                        if (resizeDirection === 'bottom-right') {
                            onShapeResize(shape.id, e.movementX, e.movementY);
                        } else if (resizeDirection === 'start') {
                            onShapeResize(shape.id, e.movementX, e.movementY);
                        } else if (resizeDirection === 'end') {
                            onShapeResize(shape.id, e.movementX, e.movementY);
                        }
                    }}
                />
            ))}
        </svg>
    );
};

export default Canvas;