import React from 'react';
import { JaaSMeeting } from '@jitsi/react-sdk';

// Assuming you have a Spinner component defined elsewhere
import Spinner from './Spinner';

const JitsiMeetingComponent = ({ appId, roomName, jwt }) => {
  return (
    <JaaSMeeting
      appId={appId}
      roomName={roomName}
      jwt={jwt}
      configOverwrite={{
        disableThirdPartyRequests: true,
        disableLocalVideoFlip: true,
        backgroundAlpha: 0.5
      }}
      interfaceConfigOverwrite={{
        VIDEO_LAYOUT_FIT: 'nocrop',
        MOBILE_APP_PROMO: false,
        TILE_VIEW_MAX_COLUMNS: 4
      }}
      spinner={<Spinner />}
      onApiReady={(externalApi) => {
        console.log('Jitsi API ready:', externalApi);
        // You can add more logic here to interact with the Jitsi API
      }}
    />
  );
};

export default JitsiMeetingComponent;
