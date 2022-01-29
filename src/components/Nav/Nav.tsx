import Wallet from "../Wallet/Wallet"
import styled from 'styled-components'
import { Row, Button } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

const Header = styled(Row)`

`

const CloseButton = styled(Button)`
    margin-left: 17px;
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
    padding-top: 5px;
    &:hover {
        background: #7438f5;
        color: white;
    }
    &:active {
        background: linear-gradient(311.99deg, rgba(0, 0, 0, 0.5) -22.55%, rgba(255, 255, 255, 0.5) 131.34%), #6311FF;;
        color: white;
    }
`

const Icons = styled.div`
    width: 80px;
    height: 40px;
    font-size: 23.79px;
    margin-right: 32px;
    color: #A4A4A4;
    line-height: 40px;
`

const TwitterIcon = styled.i`
    margin-right: 15px;

`
const DiscordIcon = styled.i`
    color: #7289DA;

`
const BackIcon = styled.div`
    font-family: SF Pro Display;
    font-style: normal;
    font-weight: normal;
    font-size: 21px;
    line-height: 30px;
    color: #18A0FB;
`

const BackButton = styled(Button)`
    font-family: Red Hat Display;
    font-style: normal;
    font-weight: normal;
    font-size: 21px;
    line-height: 30px; 
    color: #18A0FB;
    opacity: 0.75;
    height: 100%;
    padding-left: 6px;
`

const BackButtonWrapper = styled.div`
    display: flex;
    flex-flow: row;
    align-items: center;
`

const HeaderLeft = styled.div`
    display: flex;
    flew-flow: row;
`

const HeaderRight = styled.div`
    display: flex;
    flew-flow: row;
`

interface NavInterface {
    onClose: () => void;
    menuContentVisible: boolean;
    showMenuContent: () => void;
}

const Nav = ( { onClose, menuContentVisible, showMenuContent}: NavInterface) => {
    return(
        <Header justify="space-between">
            <HeaderLeft>
                {!menuContentVisible && <BackButtonWrapper onClick={showMenuContent}>
                    <BackIcon><ArrowLeftOutlined /></BackIcon>
                    <BackButton type="link">Back</BackButton>
                </BackButtonWrapper>
                }
            </HeaderLeft>
            <HeaderRight>
                <Icons>
                    <a href="https://twitter.com/solaniverse" target="_blank"><TwitterIcon className="fab fa-twitter" /></a>
                    <a href="https://discord.gg/solaniverse" target="_blank"><DiscordIcon  className="fab fa-discord" /></a>
                </Icons>
                <Wallet/>
                <CloseButton onClick={onClose}>Explore</CloseButton>
            </HeaderRight>
        </Header>
    )
}

export default Nav