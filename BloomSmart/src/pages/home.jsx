/** @format */

import { useNavigate } from 'react-router-dom';
import '../styles/App.css';
import homeLogo from '../images/logo_home.png';
import { PiFanFill } from 'react-icons/pi';
import { FaHotjar, FaLightbulb, FaPowerOff } from 'react-icons/fa';
import { BsAlexa } from 'react-icons/bs';
import { MdOutlet } from 'react-icons/md';
// import On from '../images/buttons/on.png';
// import Off from '../images/buttons/off.png';

function On() {
    const result = `Mise sous tension`;
    alert(result);
    return result;
}

function Off() {
    const result = `Mise hors tension`;
    alert(result);
    return result;
}

function App() {
    let navigate = useNavigate();

    return (
        <>
            <img className="home_logo" src={homeLogo} alt="logo" />
            <div className="action_button">
                <button onClick={() => navigate('/vmc')}>
                    <PiFanFill />
                </button>
                <button onClick={() => navigate('/radiateurs')}>
                    <FaHotjar />
                </button>
                <button onClick={() => navigate('/lumieres')}>
                    <FaLightbulb />
                </button>
                <button onClick={() => navigate('/alexa')}>
                    <BsAlexa />
                </button>
                <button onClick={() => navigate('/prises')}>
                    <MdOutlet />
                </button>
            </div>
            <div className="on_off_button">
                <button className="on_button" onClick={On}>
                    <FaPowerOff color="green" />
                </button>
                <button className="off_button" onClick={Off}>
                    <FaPowerOff color="red" />
                </button>
                {/* <img className="off_button" onClick={OnOff} src={Off} alt="Off" /> */}
            </div>
        </>
    );
}

export default App;
