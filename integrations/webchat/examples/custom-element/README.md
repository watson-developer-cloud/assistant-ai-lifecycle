# Custom elements for IBM watsonx Assistant web chat

**For a full walk through of how this code works, please visit the [tutorial page](https://cloud.ibm.com/docs/watson-assistant?topic=watson-assistant-web-chat-develop-size-position) in the IBM watsonx Assistant documentation.**

This code is for extending the IBM watsonx Assistant web chat. If you are new to developing with web chat, please start with the [web chat development overview](https://cloud.ibm.com/docs/watson-assistant?topic=watson-assistant-web-chat-develop). The code in this folder is commented with links and references to the web chat APIs used.

## Custom elements

This example demonstrates how to use a custom element to change the size and position of the main web chat window. This can be used to move web chat into a sidepanel, have it run in a "fullscreen" mode and more.

It demonstrates:

- How to use a [**view:change**](https://web-chat.global.assistant.watson.cloud.ibm.com/docs.html?to=api-events#viewchange) event handler to show or hide the main web chat window when it is opened or closed.
- How to use the [**element**](https://web-chat.global.assistant.watson.cloud.ibm.com/docs.html?to=api-configuration#configurationobject) configuration property to specify which custom element to use.
- How to apply custom animation to the entrance and exit of web chat in a sidebar view.
- How to embed the web chat in fullscreen mode.

## Running the Code

### Running the JavaScript Examples

1. Open the [client/javascript/index.html](client/javascript/index.html), [client/javascript-fullscreen/index.html](client/javascript-fullscreen/index.html) or [client/javascript-animation/index.html](client/javascript-animiation/index.html) file in a web browser. The animation one is a slightly more complex example that demonstrates how to animate that opening or closing of web chat as a sidebar.

### Running the React Examples

1. `cd client/react` or `cd client/react-animation` 
2. `npm install`
3. `npm run start`
4. Open a web browser to `localhost:3000`
5. Try opening and closing web chat.

## Setting up your own assistant

This example is configured to use an existing assistant set up for common use by anyone running this example. If you want to set up your own assistant, you'll need to perform the following steps.

- Import the [actions.json](actions.json) file located in the repository for this example.
- Modify the `integrationID`, `region`, `serviceInstanceID` and `subscriptionID` (only for enterprise accounts) in the `watsonAssistantChatOptions` used in this example to match those in the web chat embed code for your assistant.