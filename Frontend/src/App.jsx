import React from "react";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import StartPage from "./routes/StartPage";
import USRegister from "./routes/UnitedStatesRegister";
import RURegister from "./routes/RussiaRegister";
import CNRegister from "./routes/ChinaRegister";
import FRRegister from "./routes/FranceRegister";
import UKRegister from "./routes/UKRegister";
import GRRegister from "./routes/GermanyRegister";

const App = () => {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route exact path="/" element={<Layout />}>
                        <Route index element={<StartPage/>} />
                        <Route path="/United States" element={<USRegister/>}/>
                        <Route path="/Russia" element={<RURegister/>}/>
                        <Route path="/China" element={<CNRegister/>}/>
                        <Route path="/France" element={<FRRegister/>}/>
                        <Route path="/United Kingdom" element={<UKRegister/>}/>
                        <Route path="/Germany" element={<GRRegister/>}/>
                    </Route>
                </Routes>

            </Router>

        </div>
    );
}

export default App