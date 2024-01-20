/** @format */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home';
import Vmc from './pages/vmc';
import Radiateurs from './pages/radiateur';
import Lumieres from './pages/lumieres';
import Alexa from './pages/alexa';
import Prises from './pages/prises';

export default function PublicRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<HomePage />} />
                <Route path="/vmc" element={<Vmc />} />
                <Route path="/radiateurs" element={<Radiateurs />} />
                <Route path="/lumieres" element={<Lumieres />} />
                <Route path="/alexa" element={<Alexa />} />
                <Route path="/prises" element={<Prises />} />
            </Routes>
        </BrowserRouter>
    );
}
