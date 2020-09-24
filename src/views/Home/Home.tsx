import React from 'react'
import styled from 'styled-components'
import gardener from '../../assets/img/gardener.png'
import Button from '../../components/Button'
import Container from '../../components/Container'
import Page from '../../components/Page'
import PageHeader from '../../components/PageHeader'
import Spacer from '../../components/Spacer'
import Balances from './components/Balances'

const Home: React.FC = () => {
  return (
    <Page>
      <PageHeader
        icon="🧑&zwj;🌾"
        title="MasterGardener is Ready"
        subtitle="Stake UniSwap & SushiSwap LP tokens to grow your very own DAIKON!"
      />

      <Container>
        <Balances />
      </Container>
      <Spacer size="lg" />
      <StyledInfo>
        🏆<b>Pro Tip</b>: DAIKON-DAI SushiSwap-LP token pool yields 4x(!) more
        rewards per block. Or add some variety to your crops with DAIKON-YAM, DAIKON-SUSHI, DAIKON-PICKLE and DAIKON-SHROOM for 2x rewards!
      </StyledInfo>
      <Spacer size="lg" />
      <div
        style={{
          margin: '0 auto',
        }}
      >
        <Button text="See Farms" to="/farms" variant="secondary" />
      </div>
    </Page>
  )
}

const StyledInfo = styled.h3`
  color: ${(props) => props.theme.color.grey[500]};
  font-size: 16px;
  font-weight: 400;
  margin: 0;
  padding: 0;
  text-align: center;

  > b {
    color: ${(props) => props.theme.color.grey[600]};
  }
`

export default Home
