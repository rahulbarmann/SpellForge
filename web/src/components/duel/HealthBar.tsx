import { useState } from "react";

export const HealthBar = () => {
    const [health, setHealth] = useState(100);
    function decreaseHealth() {
        setHealth((prevHealth) => (prevHealth > 0 ? prevHealth - 10 : 0));
    }
    return (
        <div className="w-full h-8 border-2 border-black bg-white rounded mb-2">
            <div
                className={`h-full rounded transition-all duration-300 ease-in-out bg-black`}
                style={{
                    width: `${health}%`,
                    transitionProperty: "width", // Ensure width transition is included
                }}
                onClick={decreaseHealth}
            ></div>
        </div>
    );
};
