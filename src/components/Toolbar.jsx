import React, { useState, useEffect } from "react";
import { MdDelete, MdFormatPaint, MdFormatLineSpacing } from "react-icons/md";
import { FaGripLines } from "react-icons/fa";
import useStore from "../../store";

const Toolbar = () => {
    const store = useStore.getState();
    const { setColor, setLineType, setLineThickness, setClear } = store;
    const lineThickness = useStore((state) => state.lineThickness);
    const lineType = useStore((state) => state.lineType);
    const color = useStore((state) => state.color);

    const [position, setPosition] = useState({ x: window.innerWidth / 3, y: 10 });
    const [isDragging, setIsDragging] = useState(false);
    const [touchStart, setTouchStart] = useState(null);

    const toolbarWidth = 400;
    const toolbarHeight = 60;

    useEffect(() => {
        if (!isDragging) return;

        const onDrag = (e) => {
            setPosition((prev) => {
                const newX = Math.min(
                    Math.max(prev.x + e.movementX, 10),
                    window.innerWidth - toolbarWidth - 10
                );
                const newY = Math.min(
                    Math.max(prev.y + e.movementY, 10),
                    window.innerHeight - toolbarHeight - 10
                );
                return { x: newX, y: newY };
            });
        };

        const stopDrag = () => setIsDragging(false);

        document.addEventListener("mousemove", onDrag);
        document.addEventListener("mouseup", stopDrag);

        return () => {
            document.removeEventListener("mousemove", onDrag);
            document.removeEventListener("mouseup", stopDrag);
        };
    }, [isDragging]);

    const onTouchStart = (e) => {
        setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    };

    const onTouchMove = (e) => {
        if (!touchStart) return;

        const deltaX = e.touches[0].clientX - touchStart.x;
        const deltaY = e.touches[0].clientY - touchStart.y;

        setPosition((prev) => ({
            x: Math.min(Math.max(prev.x + deltaX, 10), window.innerWidth - toolbarWidth - 10),
            y: Math.min(Math.max(prev.y + deltaY, 10), window.innerHeight - toolbarHeight - 10),
        }));

        setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    };

    const onTouchEnd = () => {
        setTouchStart(null);
    };

    const clearCanvas = () => {
        const isConfirmed = window.confirm("Are you sure you want to clear the canvas?");
        if (isConfirmed) {
            setClear(true);
        }
    };

    return (
        <div
            className="fixed bg-white text-black p-2 rounded-lg shadow-lg flex items-center gap-4 border border-gray-300 cursor-move"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: `${toolbarWidth}px`,
                height: `${toolbarHeight}px`,
                zIndex: 1000,
            }}
            onMouseDown={() => setIsDragging(true)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            <FaGripLines className="text-gray-500 cursor-move text-xl" />

            <button
                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                onClick={clearCanvas}
                title="Clear Canvas"
            >
                <MdDelete size={20} />
            </button>

            <div className="flex items-center gap-2">
                <MdFormatPaint size={20} className="text-gray-500" />
                <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-8 h-8 border border-gray-400 rounded-full"
                />
            </div>

            <div className="flex items-center gap-2">
                <MdFormatLineSpacing size={20} className="text-gray-500" />
                <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.1"
                    value={lineThickness}
                    onChange={(e) => setLineThickness(e.target.value)}
                    className="w-20"
                />
            </div>

            <div className="flex items-center gap-2">
                <label className="text-sm">Type:</label>
                <select
                    value={lineType}
                    onChange={(e) => setLineType(e.target.value)}
                    className="bg-gray-200 text-black p-1 rounded border border-gray-400 text-sm"
                >
                    <option value="solid">Solid</option>
                    <option value="dashed">Dashed</option>
                </select>
            </div>
        </div>
    );
};

export default Toolbar;