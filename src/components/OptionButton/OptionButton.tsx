import styled from 'styled-components'
import { Button } from 'antd'

interface PlatteInterface {
    hover: string;
    normal: string;
}

const ContentButton = styled(Button)<{background: PlatteInterface, comingsoon: boolean}>`
    position: relative;
    background: ${props => props.background.normal} ;
    height: 52.5px;
    width: 193.5px;

    background-blend-mode: soft-light, normal;
    box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.25);
    border-radius: 11.25px;
    border: none;
    font-family: Luckiest Guy;
    font-style: normal;
    font-weight: 400;
    font-size: 27px;
    line-height: 52.5px;
    text-align: center;
    letter-spacing: 3%;
    color: #eeebeb;
    text-shadow: 0px 3px 3px rgba(0, 0, 0, 0.25);
    opacity: ${props => props.comingsoon? 0.3 : 1};
    &:hover {
        background: ${props => props.background.hover};
        color: #eeebeb;
    }
    &:active, &:focus {
        background: ${props => props.background.normal};
        color: #eeebeb;
    }
`

const ComingSoonWrapper = styled.div`
    position: absolute;
    left:50%;
    top: -10px;
`

const ComingSoon = styled.img`
    width: 120px;
`

interface SDCButtonInterface {
    title: string;
    onClick: () => void;
    comingsoon: boolean;
    background: PlatteInterface;
}

const OptionButton = ({ title, onClick, comingsoon, background }: SDCButtonInterface) => {
    return (
        <>
        <ContentButton comingsoon={comingsoon} background={background} onClick={onClick}>{title}
        </ContentButton>
        {comingsoon && <ComingSoonWrapper><ComingSoon src={'/comingsoon.svg'}></ComingSoon></ComingSoonWrapper>}
        </>

    )
}

export default OptionButton;