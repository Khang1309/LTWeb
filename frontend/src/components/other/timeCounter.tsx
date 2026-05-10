import { useState, useEffect } from "react";

export default function TimeCounter({ targetDate }: { targetDate: Date }) {
    // 1. A helper function to do the math
    const calculateTimeLeft = () => {
        // Difference between the target date and right now (in milliseconds)
        const difference = targetDate.getTime() - new Date().getTime();

        let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        } else {
            // The timer hit 0
            timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        return timeLeft;
    };

    // 2. Store the time left in state
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    // 3. Set up the timer loop
    useEffect(() => {
        // Recalculate the time every 1000ms (1 second)
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        // Cleanup function: stop the timer if the component is removed from the screen
        return () => clearInterval(timer);
    }, [targetDate]); // Re-run if the targetDate changes

    // 4. A helper to add a leading zero (e.g., "09" instead of "9")
    const formatNumber = (num: number) => (num < 10 ? `0${num}` : num);

    return (
        <div className="flex items-center gap-2 text-center">
            <TimeBox value={formatNumber(timeLeft.days)} label="Days" />
            <span className="text-2xl font-bold text-white">:</span>
            <TimeBox value={formatNumber(timeLeft.hours)} label="Hours" />
            <span className="text-2xl font-bold text-white">:</span>
            <TimeBox value={formatNumber(timeLeft.minutes)} label="Mins" />
            <span className="text-2xl font-bold text-white">:</span>
            <TimeBox value={formatNumber(timeLeft.seconds)} label="Secs" />
        </div>
    );
}

// A mini-component to make the UI look like a digital clock
function TimeBox({ value, label }) {
    return (
        <div className="flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-black text-xl font-bold text-white shadow-md">
                {value}
            </div>
            {/* <span className="mt-1 text-xs font-medium text-gray-500">{label}</span> */}
        </div>
    );
}