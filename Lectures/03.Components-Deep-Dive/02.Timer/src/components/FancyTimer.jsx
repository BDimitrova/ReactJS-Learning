import { useState, useEffect } from "react";
import styles from './FancyTimer.module.css';

export default function FancyTimer() {
    const [time, setTime] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setTime((oldTime) => oldTime + 1);
        }, 1000);

        return () => {
            clearTimeout(timer);
        }
    }, []);

    const addSecondsHandler = () => {
        setTime((prevTime) => prevTime + 10);
    };

    return (
        <>
            <h2 className={styles['fancy-timer']}>Fancy Timer:</h2>
            <p>{time}</p>

            <button onClick={addSecondsHandler}>Add Seconds</button>
        </>
    );
}
