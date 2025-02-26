"use client"
import React, { useState } from 'react';


const BuildingForm: React.FC = () => {
    const [units, setUnits] = useState<number>(1);    
    const [floors, setFloors] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);
    const [xWidth, setXWidth] = useState<number>(0);
    const [yWidth, setYWidth] = useState<number>(0);
    const [structuralSystem, setStructuralSystem] = useState<string>('Concrete Core + Steel Modules');

    return (
        <form>
            <div>
                <label>Units:</label>
                <select
                    value={units}
                    onChange={(e) => setUnits(Number(e.target.value))}
                >
                    <option value="1">SI: Meters-Kilograms-Sec</option>
                    <option value="2">FPS: Feet-Points-Sec</option>
                </select>
            </div>            
            <div>
                <label>Number of Floors:</label>
                <input
                    type="number"
                    value={floors}
                    onChange={(e) => setFloors(Number(e.target.value))}
                />
            </div>
            <div>
                <label>Building Height (ft):</label>
                <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                />
            </div>
            <div>
                <label>Building X-width:</label>
                <input
                    type="number"
                    value={xWidth}
                    onChange={(e) => setXWidth(Number(e.target.value))}
                />
            </div>
            <div>
                <label>Building Y-width:</label>
                <input
                    type="number"
                    value={yWidth}
                    onChange={(e) => setYWidth(Number(e.target.value))}
                />
            </div>
            <div>
                <label>Structural System:</label>
                <select
                    value={structuralSystem}
                    onChange={(e) => setStructuralSystem(e.target.value)}
                >
                    <option value="Concrete Core + Steel Modules">Concrete Core + Steel Modules</option>
                    <option value="Steel Frame">Steel Frame</option>
                </select>
            </div>
        </form>
    );
};

export default BuildingForm;