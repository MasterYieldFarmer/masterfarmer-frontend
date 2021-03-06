import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import Countdown, { CountdownRenderProps } from 'react-countdown'
import styled, { keyframes } from 'styled-components'
import { useWallet } from 'use-wallet'
import Button from '../../../components/CardButton'
import CardContent from '../../../components/CardContent'
import Loader from '../../../components/Loader'
import Spacer from '../../../components/Spacer'
import { Farm } from '../../../contexts/Farms'
import useAllStakedValue, {
  StakedValue,
} from '../../../hooks/useAllStakedValue'
import useFarms from '../../../hooks/useFarms'
import useCrops from '../../../hooks/useCrops'
import { getEarned, getMasterChefContract } from '../../../crops/utils'
import { bnToDec } from '../../../utils'
import carrot from '../../../assets/img/carrot.gif'
import broccoli from '../../../assets/img/broccoli.gif'

interface FarmWithStakedValue extends Farm, StakedValue {
  apy: BigNumber
}
  
const FarmCards: React.FC = () => {
  const [farms] = useFarms()
  const stakedValue = useAllStakedValue()

  const cropsIndex = farms.findIndex(
    ({ tokenSymbol }) => tokenSymbol === 'CROPS',
  )

  const cropsPrice =
    cropsIndex >= 0 && stakedValue[cropsIndex]
      ? stakedValue[cropsIndex].tokenPriceInWeth
      : new BigNumber(0)

  const BLOCKS_PER_YEAR = new BigNumber(365)
  const CROPS_PER_BLOCK = new BigNumber(1)

  const rows = farms.reduce<FarmWithStakedValue[][]>(
    (farmRows, farm, i) => {

      const farmWithStakedValue = {
        ...farm,
        ...stakedValue[i],
        apy: stakedValue[i]
          ? cropsPrice
              .times(CROPS_PER_BLOCK)
              .times(BLOCKS_PER_YEAR)
              .times(stakedValue[i].poolWeight)
              .div(stakedValue[i].totalWethValue)
          : null,
      }

      const newFarmRows = [...farmRows]
      if (newFarmRows[newFarmRows.length - 1].length === 4) {
        newFarmRows.push([farmWithStakedValue])
      } else {
        newFarmRows[newFarmRows.length - 1].push(farmWithStakedValue)
      }
      return newFarmRows
    },
    [[]],
  )

  return (
    <StyledCards>
      {!!rows[0].length ? (
        rows.map((farmRow, i) => (
          <StyledRow key={i}>
            {farmRow.map((farm, j) => (
              <React.Fragment key={j}>
                <FarmCard farm={farm} />
                {(j === 0 || j === 1 || j === 2) && <StyledSpacer />}
              </React.Fragment>
            ))}
          </StyledRow>
        ))
      ) : (
        <StyledLoadingWrapper>
          <Loader text="Farming ..." />
        </StyledLoadingWrapper>
      )}
    </StyledCards>
  )
}

interface FarmCardProps {
  farm: FarmWithStakedValue
}

const FarmCard: React.FC<FarmCardProps> = ({ farm }) => {
  const [startTime, setStartTime] = useState(0)
  const [harvestable, setHarvestable] = useState(0)

  const { account } = useWallet()
  const { lpTokenAddress } = farm
  const crops = useCrops()

  const renderer = (countdownProps: CountdownRenderProps) => {
    const { hours, minutes, seconds } = countdownProps
    const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes
    const paddedHours = hours < 10 ? `0${hours}` : hours
    return (
      <span style={{ width: '100%' }}>
        {paddedHours}:{paddedMinutes}:{paddedSeconds}
      </span>
    )
  }

  useEffect(() => {
    async function fetchEarned() {
      if (crops) return
      const earned = await getEarned(
        getMasterChefContract(crops),
        lpTokenAddress,
        account,
      )
      setHarvestable(bnToDec(earned))
    }
    if (crops && account) {
      fetchEarned()
    }
  }, [crops, lpTokenAddress, account, setHarvestable])

  const poolActive = true // startTime * 1000 - Date.now() <= 0

  if (farm.tokenSymbol === 'CROPS'){
  return (
    <StyledCardWrapper>
      {farm.tokenSymbol === 'CROPS' && <StyledCardAccent />}
      
      <CarrotStyledCard>        
        <CardContent>
          <StyledContent>
            
            <StyledHeaderTitle>
                  ETH Carrot
              </StyledHeaderTitle>
              <img src={carrot} height="150" width ="150" style={{ marginTop: 10 }} />

            <StyledTitle>{farm.name}</StyledTitle>
            
            <StyledBigTitle>{farm.lpToken.toUpperCase()}</StyledBigTitle>
            
              <StyledHeaderTitle>

                {farm.apy
                  ? `${farm.apy
                      .times(new BigNumber(100))
                      .toNumber()
                      .toLocaleString('en-US')
                      .slice(0, -1)}%`
                  : 'Loading ...'}
                  APY
              </StyledHeaderTitle>

              <Spacer />
           

            <Button
              disabled={!poolActive}
              text={poolActive ? 'Select' : undefined}
              to={`/farms/${farm.id}`}
            >
              {!poolActive && (
                <Countdown
                  date={new Date(startTime * 1000)}
                  renderer={renderer}
                />
              )}
            </Button>
            
          </StyledContent>
        </CardContent>
        </CarrotStyledCard> 

    </StyledCardWrapper>
  )}
  else{
  return (
    <StyledCardWrapper>
      {farm.tokenSymbol === 'CROPS' && <StyledCardAccent />}
      <BroccoliStyledCard>
        <CardContent>
          <StyledContent>
           
            <StyledHeaderTitle>
                  USDC Broccoli
            </StyledHeaderTitle>              

            <img src={broccoli} height="150" width ="150" style={{ marginTop: 20 }} />

            <StyledTitle>{farm.name}</StyledTitle>

           
            
            <StyledBigTitle>{farm.lpToken.toUpperCase()}</StyledBigTitle>
            
              <StyledHeaderTitle>
                {farm.apy
                  ? `${farm.apy
                      .times(new BigNumber(100))
                      .toNumber()
                      .toLocaleString('en-US')
                      .slice(0, -1)}%`
                  : 'Loading ...'}
                  APY
              </StyledHeaderTitle>

              <Spacer />
                     

            <Button
              disabled={!poolActive}
              text={poolActive ? 'Select' : undefined}
              to={`/farms/${farm.id}`}
            >
              {!poolActive && (
                <Countdown
                  date={new Date(startTime * 1000)}
                  renderer={renderer}
                />
              )}
            </Button>
            
          </StyledContent>
        </CardContent>
        </BroccoliStyledCard>
    </StyledCardWrapper>
  )
  }
}

const RainbowLight = keyframes`
  
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
`

const StyledCardAccent = styled.div`
  background: linear-gradient(
    45deg,
    rgba(255, 0, 0, 1) 0%,
    rgba(255, 154, 0, 1) 10%,
    rgba(208, 222, 33, 1) 20%,
    rgba(79, 220, 74, 1) 30%,
    rgba(63, 218, 216, 1) 40%,
    rgba(47, 201, 226, 1) 50%,
    rgba(28, 127, 238, 1) 60%,
    rgba(95, 21, 242, 1) 70%,
    rgba(186, 12, 248, 1) 80%,
    rgba(251, 7, 217, 1) 90%,
    rgba(255, 0, 0, 1) 100%
  );
  background-size: 300% 300%;
  background-color:white;
  animation: ${RainbowLight} 2s linear infinite;
  border-radius: 12px;
  filter: blur(6px);
  position: absolute;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  z-index: -1;
`

const StyledCards = styled.div`
  width: 1080px;
  margin-right:70px;
  @media (max-width: 768px) {
    width: 100%;
  }
`

const CarrotStyledCard = styled.div`
  border-radius: 12px;
  box-shadow: inset 1px 1px 0px ${(props) => props.theme.color.grey[100]};
  display: flex;
  flex: 1;
  background-color:#ea6627;
  flex-direction: column;
`

const BroccoliStyledCard = styled.div`
  background: ${(props) => props.theme.color.grey[200]};
  border: 1px solid ${(props) => props.theme.color.grey[300]}ff;
  border-radius: 12px;
  box-shadow: inset 1px 1px 0px ${(props) => props.theme.color.grey[100]};
  display: flex;
  flex: 1;
  background-color:green;
  flex-direction: column;
`


const StyledLoadingWrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: center;
`

const StyledRow = styled.div`
  display: flex;
  margin-bottom: ${(props) => props.theme.spacing[4]}px;
  flex-flow: row wrap;
  width:140%;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`

const StyledCardWrapper = styled.div`
  display: flex;
  width: calc((900px - ${(props) => props.theme.spacing[4]}px * 2) / 3);
  position: relative;
`

const StyledTitle = styled.h4`
  color: ${(props) => props.theme.color.grey[600]};
  font-size: 20px;
  font-weight: 700;
  margin: ${(props) => props.theme.spacing[2]}px 0 0;
  padding: 0;
  margin-bottom:10px;
  margin-top:-13px;
  
`

const StyledBigTitle = styled.h4`
  color: ${(props) => props.theme.color.grey[600]};
  font-size: 20px;
  font-weight: 700;
  margin: ${(props) => props.theme.spacing[2]}px 0 0;
  padding: 0;
  margin-top:13px;
  
`

const StyledHeaderTitle = styled.h4`
  color: green;
  font-size: 20px;
  font-weight: 700;
  margin: ${(props) => props.theme.spacing[2]}px 0 0;
  padding: 0;
  margin-top:15px;
`

const StyledContent = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  background-color:white;
  border-radius:10px;
`

const StyledSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`

export default FarmCards
