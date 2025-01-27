import React, { useRef } from 'react';
import './App.css';
import { WebChatCustomElement } from '@ibm-watson/assistant-web-chat-react';
import { config } from './config';

/**
 * This example uses the `@ibm-watson/assistant-web-chat-react` library to import web chat into a React application.
 *
 * See https://www.npmjs.com/package/@ibm-watson/assistant-web-chat-react.
 */

function App() {
  const stylesInitializedRef = useRef(false);

  return (
    <WebChatCustomElement
      className="WebChatContainer"
      config={config}
      onViewChange={(event, instance) => viewChangeHandler(event, instance, stylesInitializedRef)}
    />
  );
}

/**
 * This function is called after a view change has occurred. It will trigger the animation for the main window and
 * then make the main window hidden or visible after the animation as needed.
 */
function viewChangeHandler(event, instance, stylesInitializedRef) {
  const customElement = document.querySelector('.WebChatContainer');
  if (!stylesInitializedRef.current) {
    // The first time we get this, set the styles to their initial, default state.
    instance.elements.getMainWindow().addClassName('HideWebChat');
    instance.elements.getMainWindow().addClassName('WebChatStyles');
    stylesInitializedRef.current = true;
  }

  const mainWindowChanged = event.oldViewState.mainWindow !== event.newViewState.mainWindow;
  if (mainWindowChanged) {
    if (event.reason === 'sessionHistory') {
      // If we're re-opening web chat from session history, skip the animation by leaving out "StartOpenAnimation".
      if (event.newViewState.mainWindow) {
        instance.elements.getMainWindow().addClassName('OpenAnimation');
        instance.elements.getMainWindow().removeClassName('HideWebChat');
      } else {
        instance.elements.getMainWindow().addClassName('HideWebChat');
      }
    } else if (event.newViewState.mainWindow) {
      // Move the main window to the off-screen position and then un-hide it.
      instance.elements.getMainWindow().addClassName('StartOpenAnimation');
      instance.elements.getMainWindow().removeClassName('HideWebChat');
      // Make the custom element visible.
      customElement.classList.remove('WebChatContainer--hidden');
      setTimeout(() => {
        // Give the browser a chance to render the off-screen state and then trigger the open animation.
        instance.elements.getMainWindow().addClassName('OpenAnimation');
        instance.elements.getMainWindow().removeClassName('StartOpenAnimation');
      });
    } else {
      // Trigger the animation to slide the main window to the hidden position.
      instance.elements.getMainWindow().addClassName('CloseAnimation');
      instance.elements.getMainWindow().removeClassName('OpenAnimation');
      setTimeout(() => {
        // After the animation is complete, hide the main window.
        instance.elements.getMainWindow().addClassName('HideWebChat');
        instance.elements.getMainWindow().removeClassName('CloseAnimation');

        // Make the custom element hidden.
        customElement.classList.add('WebChatContainer--hidden');
      }, 300);
    }
  }
}

export default App;
