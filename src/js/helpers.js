import { mapData } from "./mapData";

export const randomCoords = () => {
    const coord = {
        x: Math.round(Math.random() * mapData.maxX + mapData.minX),
        y: Math.floor(Math.random() * (mapData.maxY - mapData.minY + 1) + mapData.minY)
    }

    if (mapData.blockedSpaces.includes(`${coord.x}x${coord.y}`)) {
        return randomCoords()
    }

    return coord
}