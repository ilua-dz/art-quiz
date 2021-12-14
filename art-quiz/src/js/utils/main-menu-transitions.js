import { HTMLElements, staticModules } from './html-elements';
import { smoothChangePage, renderSettings } from './render-functions';

const enableMainMenuTransitions = (app) => {
  HTMLElements.controlsBtn.addEventListener('click', () =>
    smoothChangePage(HTMLElements.controlsModule, ...staticModules)
  );

  HTMLElements.settingsBtn.addEventListener('click', () => {
    renderSettings(app);
    smoothChangePage(HTMLElements.settingsModule, ...staticModules);
  });

  HTMLElements.backBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      app.leaveGame();
      smoothChangePage(HTMLElements.startModule, ...staticModules);
    });
  });
};

export default enableMainMenuTransitions;
