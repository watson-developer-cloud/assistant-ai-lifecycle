// This is the standard web chat configuration object. You can modify these values with the embed code for your
// own assistant if you wish to try this example with your assistant. You can find the documentation for this at
// https://web-chat.global.assistant.watson.cloud.ibm.com/docs.html?to=api-configuration#configurationobject.
const config = {
  integrationID: '07b05ae0-7e2e-47d1-a309-d0f5b9915ac5',
  region: 'us-south',
  serviceInstanceID: '9a3613d2-3ce6-4928-8eb6-4d659d87ae68',
  subscriptionID: null,
  // You would likely use our own launcher in this scenario.
  // See https://github.com/watson-developer-cloud/assistant-toolkit/tree/master/integrations/webchat/examples/custom-launcher.
  // showLauncher: false
};

export { config };
