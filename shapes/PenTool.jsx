import React, { useState, useRef } from "react";
import { Stage, Layer, Line } from "react-konva";
import useStore from "../store";

const PenTool = () => {
  const [lines, setLines] = useState([]);
  const { screenHeight, screenWidth } = useStore.getState();
  const [normalLines, setNormalLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("black");
  const [lineThickness, setLineThickness] = useState(3);
  const [lineType, setLineType] = useState("solid");
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const stageRef = useRef(null);
  const layerRef = useRef(null);

  const getPointerPosition = (e) => {
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    return pos ? { x: pos.x, y: pos.y } : null;
  };

  const startDrawing = (e) => {
    e.evt.preventDefault();
    setIsDrawing(true);
    const pos = getPointerPosition(e);
    if (!pos) return;

    setUndoStack((prev) => [...prev, [...lines]]);
    setLines((prevLines) => [
      ...prevLines,
      {
        id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER) + 1,
        points: [pos.x, pos.y],
        color,
        lineThickness,
        lineType,
      },
    ]);

    setNormalLines((prevLines) => [
      ...prevLines,
      {
        id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER) + 1,
        points: [pos.x / screenWidth, pos.y / screenHeight],
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

    setNormalLines((prevLines) => {
      const newLines = [...prevLines];
      newLines[newLines.length - 1].points = [
        ...newLines[newLines.length - 1].points,
        pos.x / screenWidth,
        pos.y / screenHeight,
      ];
      return newLines;
    });
  };

  const endDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    setLines([]);
    setUndoStack([]);
    setRedoStack([]);
  };

  const undo = () => {
    if (undoStack.length > 0) {
      const previousState = undoStack[undoStack.length - 1];
      setRedoStack((prev) => [...prev, [...lines]]);
      setLines(previousState);
      setUndoStack(undoStack.slice(0, undoStack.length - 1));
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const redoState = redoStack[redoStack.length - 1];
      setUndoStack((prev) => [...prev, [...lines]]);
      setLines(redoState);
      setRedoStack(redoStack.slice(0, redoStack.length - 1));
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "10px" }}>
        <button onClick={undo}>Undo</button>
        <button onClick={redo}>Redo</button>
        <button onClick={clearCanvas}>Clear Page</button>
      </div>

      <div>
        <label>Select Color: </label>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
      </div>

      <div>
        <label>Line Thickness: </label>
        <input
          type="range"
          min="1"
          max="10"
          value={lineThickness}
          onChange={(e) => setLineThickness(e.target.value)}
        />
      </div>

      <div>
        <label>Line Type: </label>
        <select value={lineType} onChange={(e) => setLineType(e.target.value)}>
          <option value="solid">Solid</option>
          <option value="dashed">Dashed</option>
        </select>
      </div>

      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        ref={stageRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={endDrawing}
      >
        <Layer ref={layerRef}>
          {lines.map((line) => (
            <Line
              key={line.id}
              points={line.points}
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