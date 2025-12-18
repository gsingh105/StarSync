import React from 'react';

const KundliChart = ({ data }) => {
    if (!data || !data["0"]) return null;

    const planetArray = Object.keys(data)
        .filter(key => !isNaN(key))
        .map(key => data[key]);

    const startRasi = data["0"].rasi_no;

    const getSignForHouse = (houseNum) => {
        let sign = (startRasi + houseNum - 1) % 12;
        return sign === 0 ? 12 : sign;
    };

    const getPlanetsForHouse = (houseNum) => {
        return planetArray
            .filter(p => p.house === houseNum && p.name !== "As")
            .map(p => p.name);
    };

    // Mathematical centers for each house in a 100x100 SVG coordinate system
    const houses = [
        { id: 1,  x: 50, y: 35 }, { id: 2,  x: 25, y: 15 },
        { id: 3,  x: 12, y: 35 }, { id: 4,  x: 32, y: 50 },
        { id: 5,  x: 12, y: 65 }, { id: 6,  x: 25, y: 85 },
        { id: 7,  x: 50, y: 65 }, { id: 8,  x: 75, y: 85 },
        { id: 9,  x: 88, y: 65 }, { id: 10, x: 68, y: 50 },
        { id: 11, x: 88, y: 35 }, { id: 12, x: 75, y: 15 }
    ];

    return (
        <div className="w-full space-y-8 animate-in fade-in duration-1000">
            {/* SVG Chart */}
            <div className="relative w-full max-w-[500px] mx-auto group">
                {/* Glow effect background */}
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                
                <div className="relative bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-xl border border-slate-200 dark:border-white/5">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        {/* Define traditional North Indian Grid Lines */}
                        <g className="stroke-slate-300 dark:stroke-slate-700 stroke-[0.5] fill-none">
                            <rect x="5" y="5" width="90" height="90" />
                            <line x1="5" y1="5" x2="95" y2="95" />
                            <line x1="95" y1="5" x2="5" y2="95" />
                            <line x1="50" y1="5" x2="95" y2="50" />
                            <line x1="95" y1="50" x2="50" y2="95" />
                            <line x1="50" y1="95" x2="5" y2="50" />
                            <line x1="5" y1="50" x2="50" y2="5" />
                        </g>

                        {/* Map Signs and Planets */}
                        {houses.map((house) => {
                            const planets = getPlanetsForHouse(house.id);
                            return (
                                <g key={house.id}>
                                    {/* Sign Number */}
                                    <text 
                                        x={house.x} 
                                        y={house.id === 1 || house.id === 7 ? house.y - 4 : house.y - 2} 
                                        textAnchor="middle" 
                                        className="fill-red-600 dark:fill-red-500 font-bold text-[4px]"
                                    >
                                        {getSignForHouse(house.id)}
                                    </text>
                                    
                                    {/* Planets List */}
                                    {planets.map((p, i) => (
                                        <text 
                                            key={i} 
                                            x={house.x} 
                                            y={house.id === 1 || house.id === 7 ? house.y + (i * 4) + 2 : house.y + (i * 4) + 3} 
                                            textAnchor="middle" 
                                            className="fill-slate-800 dark:fill-slate-200 font-black text-[3.5px] tracking-tighter"
                                        >
                                            {p}
                                        </text>
                                    ))}
                                </g>
                            );
                        })}
                    </svg>
                </div>
            </div>

            {/* Planets Detailed Table */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {planetArray.map((p, idx) => (
                    <div 
                        key={idx} 
                        className="p-3 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 shadow-sm hover:border-amber-500/50 transition-colors group"
                    >
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">{p.name}</span>
                            <span className="text-[10px] font-bold text-amber-500">{Math.floor(p.local_degree)}°</span>
                        </div>
                        <p className="text-xs font-black dark:text-white truncate">{p.full_name}</p>
                        <p className="text-[10px] text-slate-500 font-medium">
                            {p.zodiac} • {p.nakshatra.substring(0,6)}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KundliChart;