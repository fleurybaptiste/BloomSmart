/** @format */

import { useNavigate } from 'react-router-dom';
import '../styles/App.css';
import homeLogo from '../images/logo_home.png';
import On from '../images/buttons/on.png';
import Off from '../images/buttons/off.png';
import Vmc from '../images/buttons/vmc.png';

function OnOff() {
    const result = 1 + 1;
    console.log(result);
    return result;
}

function App() {
    let navigate = useNavigate();

    return (
        <>
            <img className="home_logo" src={homeLogo} alt="logo" />
            <div className="action_button">
                <img className="vmc" onClick={() => navigate('/vmc')} src={Vmc} alt="VMC" />
                <button onClick={() => navigate('/vmc')}>VMC</button>
                <button onClick={() => navigate('/radiateur')}>Radiateur</button>
                <button onClick={() => navigate('/lumieres')}>Lumières</button>
                <button onClick={() => navigate('/alexa')}>Alexa</button>
                <button onClick={() => navigate('/prises')}>Prises</button>
            </div>
            <div className="on_off_button">
                <img className="on_button" onClick={OnOff} src={On} alt="On" />
                <img className="off_button" onClick={OnOff} src={Off} alt="Off" />
            </div>
        </>
    );
}

export default App;
