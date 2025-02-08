import React, { useState, useEffect } from "react";
import { Stage, Layer, Line } from "react-konva";
import useStore from "../../store";

const PenTool = () => {
  const { setClear } = useStore();
  const [lines, setLines] = useState(() => {
    const savedLines = localStorage.getItem("savedLines");
    return savedLines ? JSON.parse(savedLines) : [];
  });

  const lineThickness = useStore((state) => state.lineThickness);
  const lineType = useStore((state) => state.lineType);
  const color = useStore((state) => state.color);
  const clear = useStore((state) => state.clear);
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasSize, setCanvasSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setCanvasSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getPointerPosition = (e) => {
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    if (!pos) return null;

    return {
      x: pos.x / canvasSize.width, // Normalize x
      y: pos.y / canvasSize.height, 
    };
  };

  const startDrawing = (e) => {
    e.evt.preventDefault();
    setIsDrawing(true);
    const pos = getPointerPosition(e);
    if (!pos) return;

    setLines((prevLines) => [
      ...prevLines,
      {
        id: Math.random(),
        points: [pos.x, pos.y], // Store as normalized values
        color,
        lineThickness,
        lineType,
      },
    ]);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.evt.preventDefault();
    const pos = getPointerPosition(e);
    if (!pos) return;

    setLines((prevLines) => {
      const newLines = [...prevLines];
      newLines[newLines.length - 1].points = [
        ...newLines[newLines.length - 1].points,
        pos.x,
        pos.y,
      ];
      return newLines;
    });
  };

  const endDrawing = () => {
    setIsDrawing(false);
    localStorage.setItem("savedLines", JSON.stringify(lines));
  };

  const clearCanvas = () => {
    setLines([]);
    localStorage.setItem("savedLines", "");
  };

  if (clear) {
    clearCanvas();
    setClear(false);
  }

  return (
    <div>
      <Stage
        width={canvasSize.width}
        height={canvasSize.height}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={endDrawing}
      >
        <Layer>
          {lines.map((line) => (
            <Line
              key={line.id}
              points={line.points.map((p, i) =>
                i % 2 === 0
                  ? p * canvasSize.width 
                  : p * canvasSize.height 
              )}
              stroke={line.color}
              strokeWidth={parseInt(line.lineThickness, 10)}
              lineCap="round"
              lineJoin="round"
              dash={line.lineType === "dashed" ? [10, 5] : []}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default PenTool;
