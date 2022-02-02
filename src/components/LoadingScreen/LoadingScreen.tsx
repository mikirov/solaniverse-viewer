import React, { useEffect } from 'react';
import styles from './LoadingScreen.module.css';
import ProgressIndicator from './ProgessIndicator';

// @ts-ignore
const LoadingScreen = (props) => {
    if (!props.enabled) {
        return null;
    }
    return <div className={styles.container}>
        <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}} >
            <video autoPlay muted loop className={styles.backgroundImage}>
                <source src="rotating-planet.mp4" type="video/mp4" />
            </video>
            <div style={{height: '2em'}}></div>
            <ProgressIndicator />
        </div>
    </div>
}

export default LoadingScreen;
