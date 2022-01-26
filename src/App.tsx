import React, {MouseEventHandler, useEffect, useState} from 'react';
import Unity, {UnityContext} from "react-unity-webgl";
import Wallet from "./components/Wallet/Wallet";
import Player from "./components/Player/Player";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";
import styles from "./App.module.css"
import { Button, Row } from 'antd'
import styled from 'styled-components'

const unityContext = new UnityContext({
    loaderUrl: "Build/Build.loader.js",
    dataUrl: "Build/Build.data",
    frameworkUrl: "Build/Build.framework.js",
    codeUrl: "Build/Build.wasm",
    companyName: "Solverse",
    productName: "Solverse",
    productVersion: "0.1",
});

const Canvas = styled(Row)`
    position: relative;
`;


const MenuButton = styled(Button)`
    position: absolute;
    right: 28px;
    top: 47px;
    z-index: 10;
    background: linear-gradient(311.99deg, rgba(0, 0, 0, 0.5) -22.55%, rgba(255, 255, 255, 0.5) 131.34%), #6311FF;
    width: 110px;
    height: 40px;
    background-blend-mode: soft-light, normal;
    box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.25);
    border-radius: 11.25px;
    border: none;

    font-family: Luckiest Guy;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 20px;
    text-align: center;
    letter-spacing: 0.03em;
    color: white;
    text-shadow: 0px 3px 3px rgba(0, 0, 0, 0.25);
    &:hover {
        background: #7438f5;
        color: white;
    }
    &:active {
        background: linear-gradient(311.99deg, rgba(0, 0, 0, 0.5) -22.55%, rgba(255, 255, 255, 0.5) 131.34%), #6311FF;;
        color: white;
    }
`

function App() {

    const [initialized, setInitialized] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);

    const showMenu = () => {
        setMenuVisible(true)
    }

    const closeMenu = () => {
        setMenuVisible(false)
    }

    useEffect(() => {
        unityContext.on("SceneInitialized", () => {
            setInitialized(true);
        });
    }, []);

    const GeneratePlanet = (seed: number) => {
        unityContext.send("GameController", "GeneratePlanet", seed);
    }

    return (
        <>
        <Canvas justify="center">
            <LoadingScreen enabled={!initialized}/>
            {initialized && (<MenuButton onClick={showMenu}>Menu</MenuButton>)}
            {/*<SDCMenu onClose={closeMenu} visible={menuVisible}/>*/}

            <Unity
                unityContext={unityContext}
                tabIndex={1}
                className={styles.unity}
            />
        </Canvas>
        </>
    );
}

export default App;
