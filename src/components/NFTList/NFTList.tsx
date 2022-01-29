import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import React, {useEffect, useState} from 'react';
import bs58 from 'bs58';
import {getParsedNftAccountsByOwner} from "@nfteyez/sol-rayz";
import axios, {AxiosResponse} from "axios";
import {PublicKey} from "@solana/web3.js";
import styled from 'styled-components'
import {Drawer, Row, Col, Button} from 'antd'
import Nav from "../Nav/Nav";
import {MenuInterface} from "./NFTList.interface";
import OptionButton from "../OptionButton/OptionButton";

const MAX_NAME_LENGTH = 32;
const MAX_URI_LENGTH = 200;
const MAX_SYMBOL_LENGTH = 10;
const MAX_CREATOR_LEN = 32 + 1 + 1;
const MAX_CREATOR_LIMIT = 5;
const MAX_DATA_SIZE = 4 + MAX_NAME_LENGTH + 4 + MAX_SYMBOL_LENGTH + 4 + MAX_URI_LENGTH + 2 + 1 + 4 + MAX_CREATOR_LIMIT * MAX_CREATOR_LEN;
const MAX_METADATA_LEN = 1 + 32 + 32 + MAX_DATA_SIZE + 1 + 1 + 9 + 172;
const CREATOR_ARRAY_START = 1 + 32 + 32 + 4 + MAX_NAME_LENGTH + 4 + MAX_URI_LENGTH + 4 + MAX_SYMBOL_LENGTH + 2 + 1 + 4;

const TOKEN_METADATA_PROGRAM = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
const CANDY_MACHINE_V2_PROGRAM = new PublicKey('cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ');
const candyMachineId = new PublicKey('6aP4gwzV4dy8MxvAQg8k1AwSuKmttVN4fmuj2pk6uujE');


const styles = {
    drawStyle: {
        background: '#FEF9F1',
        paddingLeft: '30px',
        paddingTop: '12px',
        paddingRight: '10px'
    },
}

const MenuContent = styled(Row)`
    text-align: left;
    position: relative;
`

const OwnershipContent = styled.div`
    text-align: left;
`

const Logo = styled.img`
    width: 140px;
    height: 140px;
`

const Title = styled.div`
    width: 100%;
    margin-top: 50px;
    margin-bottom: 30px;
    font-family: Luckiest Guy;
    font-style: normal;
    font-weight: normal;
    font-size: 42px;
    color: #30AAD1;
`

const OwernshipTitle = styled.div`
    width: 100%;
    margin-top: 50px;
    margin-bottom: 30px;
    font-family: Luckiest Guy;
    font-style: normal;
    font-weight: normal;
    font-size: 42px;
    color: #30AAD1;
    //Figma are using gradient, leave it for now
    /* background-image: linear-gradient(30deg, #EB8FB3, #30AAD1);
    background-repeat: repeat;
    background-size: 100%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;  */
`

const NFTWrapper = styled(Col)`
    position: relative;
    display: flex;
`

const NFTImage = styled.img`
    width: 95%;
    height: 100%;
    z-index: 2;
`
const NFTShadow = styled.div`
    width: 90%;
    height: 100%;
    position: absolute;
    left: 20px;
    top: 10px;
    background: rgba(0, 0, 0, 0.1);
`
const NFTItems = styled(Row)`
    margin-top: 71px;
`

const Description = styled.div`
    text-align: left;
    width: 100%;
    font-family: Montserrat;
    font-style: normal;
    font-weight: normal;
    font-size: 21px;
    line-height: 30px;
    color: black;
    opacity: 0.75;
`

const LinkButton = styled.div`
    position: relative;
    background: linear-gradient(311.99deg, rgba(0, 0, 0, 0.5) -22.55%, rgba(255, 255, 255, 0.5) 131.34%), #18A0FB;
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
    padding-top : 5px;
    opacity: linear-gradient(311.99deg, rgba(0, 0, 0, 0.5) -22.55%, rgba(255, 255, 255, 0.5) 131.34%), #18A0FB;
    &:hover {
        background: linear-gradient(311.99deg, rgba(0, 0, 0, 0.5) -22.55%, rgba(255, 255, 255, 0.5) 131.34%), #18A0FB;
        color: #eeebeb;
    }
    &:active, &:focus {
        background: linear-gradient(311.99deg, rgba(0, 0, 0, 0.5) -22.55%, rgba(255, 255, 255, 0.5) 131.34%), #18A0FB;
        color: #eeebeb;
    }
`


const ButtonGroup = styled(Row)`
    margin-top: 85px;
`

const Text = styled.div`
    margin-top: 14px;
    font-family: Montserrat;
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 30px;
    /* identical to box height, or 107% */

    letter-spacing: -0.02em;

    color: #506274;
`
const halfWidth = (global.window.innerWidth)/2

const NFTList = ({onClose, visible}: MenuInterface) => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    // @ts-ignore
    const {ownedNFTs, setOnwedNFTs} = useState([]);
    const [menuContentVisible, setMenuContentVisible] = useState(true)
    const [ownershipContentVisible, setOwnershipContentVisible] = useState(false)

    const getMintAddresses = async (firstCreatorAddress: PublicKey) => {
        const metadataAccounts = await connection.getProgramAccounts(
            TOKEN_METADATA_PROGRAM,
            {
                // The mint address is located at byte 33 and lasts for 32 bytes.
                dataSlice: { offset: 33, length: 32 },

                filters: [
                    // Only get Metadata accounts.
                    { dataSize: MAX_METADATA_LEN },

                    // Filter using the first creator.
                    {
                        memcmp: {
                            offset: CREATOR_ARRAY_START,
                            bytes: firstCreatorAddress.toBase58(),
                        },
                    },
                ],
            },
        );

        return metadataAccounts.map((metadataAccountInfo) => (
            bs58.encode(metadataAccountInfo.account.data)
        ));
    };

    const getCandyMachineCreator = async (candyMachine: PublicKey): Promise<[PublicKey, number]> => (
        PublicKey.findProgramAddress(
            [Buffer.from('candy_machine'), candyMachine.toBuffer()],
            CANDY_MACHINE_V2_PROGRAM,
        )
    );

    const getAllPlanetNftAddresses = async () => {
        const candyMachineCreator = await getCandyMachineCreator(candyMachineId);
        return getMintAddresses(candyMachineCreator[0]);
    };
    const getAllNftData = async () => {
        try {
            const nfts = await getParsedNftAccountsByOwner({
                publicAddress: publicKey,
                connection
            });
            if(nfts)
            {
                const allMintedNFTs = await getAllPlanetNftAddresses();
                const ownedPlanets = nfts.map(ownedNFT => allMintedNFTs.includes(ownedNFT.mint));
                console.log(ownedPlanets);
            }
            return nfts;

        } catch (error) {
            console.log(error);
            return null;
        }
    };
    const getNftTokenData = async () => {
        try {
            let nftData = await getAllNftData() as any;
            const data = Object.keys(nftData).map((key) => nftData[key]);                                                                    let arr = [];
            let array = []
            for(let value of nftData)
            {
                const uri = value.data.uri;
                const val = await axios.get(uri);
                array.push(val);
            }
            return array;
        } catch (error) {
            console.log(error);
            return [];
        }
    };


    useEffect(() => {
        if (!publicKey)
        {
            return;
        }
        setOnwedNFTs(getNftTokenData())
    }, [publicKey, connection]);

    const backgroundEnable = {
        normal: 'linear-gradient(311.99deg, rgba(0, 0, 0, 0.5) -22.55%, rgba(255, 255, 255, 0.5) 131.34%), #6311FF',
        hover: '#7438f5'
    };

    const backgroundDisable = {
        normal: 'linear-gradient(311.99deg, rgba(0, 0, 0, 0.5) -22.55%, rgba(255, 255, 255, 0.5) 131.34%), #939099',
        hover: '#939099'
    };

    const showMenuContent = () => {
        setMenuContentVisible(true)
        setOwnershipContentVisible(false)
    }

    const showOwnershipContent = () => {
        setOwnershipContentVisible(true)
        setMenuContentVisible(false)
    }


      return (
          <Drawer width={halfWidth} mask={false} closable={false} drawerStyle={styles.drawStyle} placement="right" onClose={onClose} visible={visible}>
              <Nav onClose={onClose} menuContentVisible={menuContentVisible} showMenuContent={showMenuContent} />
              {menuContentVisible && <MenuContent>
                  <Logo src="/logo.svg"></Logo>
                  <Title>
                      Welcome to Solaniverse
                  </Title>
                  <Description>{`Explore the`}&#160;<strong>galaxy</strong>&#160;{`on Solana!`}</Description>
                  <br/>
                  <br/>
                  <Description>{`Earn resources by owning a planet`}
                      <br/>
                      {`passively earn resources, providing liquity.`}
                  </Description>
                  <ButtonGroup gutter={[12,23.5]}>
                      <Col span={8}>
                          <OptionButton title="Planets" background={backgroundEnable} comingsoon={false} onClick={showOwnershipContent}/>
                      </Col>
                      {/* Second Row */}
                      <Col span={8}>
                          <OptionButton title="resources" comingsoon={true} background={backgroundDisable} onClick={() => ""}/>
                      </Col>
                      {/* Third Row */}
                      <Col span={8}>
                          <OptionButton title="Interstellar Council" comingsoon={true} background={backgroundDisable} onClick={() => ""}/>
                      </Col>

                      <Col span={24}>
                          <Text>Looking for something else?</Text>
                      </Col>

                      {/* Last Row */}
                      <Col span={8}>
                          <LinkButton><a style={{color: 'white'}} href={""} target="_blank" rel="noreferrer">Space shuttle</a></LinkButton>
                      </Col>
                      <Col span={8}>
                          <LinkButton><a style={{color: 'white'}} href={""} target="_blank" rel="noreferrer">Solaniverse Planets</a></LinkButton>
                      </Col>
                      <Col span={8}>
                          <LinkButton><a style={{color: 'white'}} href={"https://www.solaniverse.online/#roadmap"} target="_blank" rel="noreferrer">Roadmap</a></LinkButton>
                      </Col>
                  </ButtonGroup>
              </MenuContent>
              }
              {ownershipContentVisible && (
              <OwnershipContent>
                  <OwernshipTitle>Ownership</OwernshipTitle>
                  <Description>These are the NFTs you own</Description>
                  <NFTItems gutter={[18,28]}>
                      {ownedNFTs.map((item: AxiosResponse)=> (
                          <NFTWrapper span={8}>
                              <NFTImage src={item.data.uri} alt=""/>
                              <NFTShadow/>
                          </NFTWrapper>
                      ))}
                  </NFTItems>
              </OwnershipContent>
          )}

          </Drawer>
    );
};

export default NFTList;
