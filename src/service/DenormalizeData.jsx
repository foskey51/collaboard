import useStore from "../../store";

const DenormalizeData = (lines) => {
    const { screenWidth, screenHeight } = useStore.getState();

    if (!lines || lines.length === 0) {
        console.warn("No lines available to normalize.");
        return;
    } 

    if (!lastLine || !lastLine.points || !Array.isArray(lastLine.points)) {
        console.warn("Last line is invalid:", lastLine);
        return;
    }

    const lastLine = lines[lines.length - 1];

    const normalizedPoints = lastLine.points.map((point, index) =>
        index % 2 === 0
            ? point * screenWidth 
            : point * screenHeight 
    );

    return { 
        id: lastLine.id, 
        points: normalizedPoints, 
        color: lastLine.color, 
        lineThickness: lastLine.lineThickness, 
        lineType: lastLine.lineType 
    };
};

export default DenormalizeData;
