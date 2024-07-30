import React, { useState } from 'react'
import { IShape, IShapeType } from '../types/index';
import Canvas from './Canvas';

function Editor() {
    const [shapes, setShapes] = useState<IShape[]>([]);
    const [selectedShapeType, setSelectedShapeType] = useState<IShapeType | null>(null);
    const [focusedShape, setFocusedShape] = useState<IShape | null>(null);

    const selectShapeForDrawing = (shapeType: IShapeType) => {
        setSelectedShapeType(shapeType);
    };

    const addShapeToCanvas = (event: React.MouseEvent<SVGSVGElement>) => {
        if (!selectedShapeType) return;

        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        let width = 100;
        let height = 50;

        if (selectedShapeType === 'square') {
            width = 50;
            height = 50;
        } else if (selectedShapeType === 'circle') {
            width = 50;
            height = 50;
        } else if (
            selectedShapeType === 'diamond' ||
            selectedShapeType === 'rhombus'
        ) {
            width = 70;
            height = 70;
        } else if (selectedShapeType === 'arch') {
            width = 100;
            height = 50;
        } else if (selectedShapeType === 'line' || selectedShapeType === 'arrow') {
            width = 100;
            height = 0;
        }

        const newShape: IShape = {
            id: Date.now(),
            type: selectedShapeType,
            x: x - width / 2,
            y: y - height / 2,
            width: width,
            height: height,
            fill: 'transparent',
            stroke: '#ffffff',
        };

        setShapes([...shapes, newShape]);
        setSelectedShapeType(null);
    };

    const updateShapePosition = (shapeId: number, deltaX: number, deltaY: number) => {
        setShapes(
            shapes.map((shape) =>
                shape.id === shapeId
                    ? { ...shape, x: shape.x + deltaX, y: shape.y + deltaY }
                    : shape
            )
        );
    };

    const updateShapeSize = (shapeId: number, deltaX: number, deltaY: number) => {
        setShapes(
            shapes.map((shape) =>
                shape.id === shapeId
                    ? {
                        ...shape,
                        width: shape.width + deltaX,
                        height: shape.height + deltaY,
                    }
                    : shape
            )
        );
    };

    const handleCanvasClick = (event: React.MouseEvent<SVGSVGElement>) => {
        addShapeToCanvas(event);
    };

    return (
        <div style={{ overflow: "hidden" }}>
            {/* <Toolbar
                onShapeSelect={selectShapeForDrawing}
                focusedShape={focusedShape}
                setShapes={setShapes}
            /> */}
            <div style={{ overflow: "scroll", width: "100vw" }}>
                <Canvas
                    shapes={shapes}
                    onShapeMove={updateShapePosition}
                    onShapeResize={updateShapeSize}
                    onCanvasClick={handleCanvasClick}
                    focusedShape={focusedShape}
                    setFocusedShape={setFocusedShape}
                />
            </div>
        </div>
    );
}

export default Editor