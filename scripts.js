document.addEventListener('DOMContentLoaded', () => {
    const appId = 'YOUR_APP_ID';
    const roomName = 'YourRoomName';
    const jwt = 'YOUR_VALID_JWT';

    function renderJitsiMeeting() {
        const root = document.getElementById('root');
        
        if (!root) return;

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/react@17/umd/react.development.js';
        script.async = true;
        
        const reactDomScript = document.createElement('script');
        reactDomScript.src = 'https://unpkg.com/react-dom@17/umd/react-dom.development.js';
        reactDomScript.async = true;

        const jitsiReactSdkScript = document.createElement('script');
        jitsiReactSdkScript.src = 'https://unpkg.com/@jitsi/react-sdk/dist/index.js';
        jitsiReactSdkScript.async = true;

        jitsiReactSdkScript.onload = () => {
            const { JaaSMeeting } = window.JitsiMeetJS;

            ReactDOM.render(
                React.createElement(JaaSMeeting, {
                    appId: appId,
                    roomName: roomName,
                    jwt: jwt,
                    configOverwrite: {
                        disableThirdPartyRequests: true,
                        disableLocalVideoFlip: true,
                        backgroundAlpha: 0.5
                    },
                    interfaceConfigOverwrite: {
                        VIDEO_LAYOUT_FIT: 'nocrop',
                        MOBILE_APP_PROMO: false,
                        TILE_VIEW_MAX_COLUMNS: 4
                    },
                    spinner: React.createElement('div', null, 'Loading...'),
                    onApiReady: (externalApi) => {
                        console.log('Jitsi API ready:', externalApi);
                        // You can add more logic here to interact with the Jitsi API
                    }
                }),
                root
            );
        };

        document.head.appendChild(script);
        document.head.appendChild(reactDomScript);
        document.head.appendChild(jitsiReactSdkScript);

        script.onload = () => {
            reactDomScript.onload = () => renderJitsiMeeting();
        };
    }

    renderJitsiMeeting();
});
