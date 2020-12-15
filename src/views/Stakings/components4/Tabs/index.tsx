import React, { useState } from 'react';

import { Container, TabLinks, Button, TabContent, TabBottomline, Section } from './styles';

import Stakings from '../../Stakings';
import Subpage41 from '../../../Subpages/Subpage41';

const Tabs: React.FC = () => {
  const [nolock, setNolock] = useState('active');

  function handleTabLink(id: string): void {
    switch (id) {
      case 'nolock':
        setNolock('active');
        break;      
      default:
        break;
    }
  }

  return (
    <Container>
      <TabLinks>
        <Button
          type="button"
          className={nolock}
          onClick={() => handleTabLink('nolock')}
        >
          No Lock
        </Button>        
      </TabLinks>
      <TabBottomline>        
      </TabBottomline>
      <TabContent>
        <Section className={nolock}>
          <Subpage41/>
        </Section>        
      </TabContent>
    </Container>
  );
};

export default Tabs;
