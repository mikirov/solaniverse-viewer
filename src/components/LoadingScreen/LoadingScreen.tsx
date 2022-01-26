import React from 'react';
import styles from './LoadingScreen.module.css';

// @ts-ignore
const LoadingScreen = (props) => {

    if (!props.enabled) {
        return null;
    }
    return <div className={styles.container}>
        <video autoPlay muted className={styles.backgroundImage}>
            <source src="loading-video.mp4" type="video/mp4"/>
        </video>
    </div>

}

export default LoadingScreen;
