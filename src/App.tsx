import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import Home from './pages/Home';
import Results from './pages/Results';
import About from './pages/About';
import Properties from './pages/Properties';
import Detail from './pages/Detail';
import GenericHeader from './pages/Admin';
import Admin from './pages/Admin';
import { Provider } from 'react-redux';
import store from './redux/store.js';


/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { users } from './pages/Data';

setupIonicReact();

const App: React.FC = () => (
    <Provider store={store}>
<IonApp>
    <IonReactRouter>
        <IonRouterOutlet>
            <Route exact path="/">
                <Home />
                
            </Route>
            <Route exact path="/Results">
                <Results />
                
            </Route>
            <Route exact path="/About">
                <About />
                
            </Route>
            <Route exact path="/Properties">
                <Properties /> 
                
            </Route>
            <Route exact path="/Detail">
                <Detail />
                
            </Route>
             <Route exact path="/Admin">
                <Admin />
                
                
            </Route>

        </IonRouterOutlet>
    </IonReactRouter>
</IonApp>
</Provider>
);

export default App;