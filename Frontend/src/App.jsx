import React from "react";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import StartPage from "./routes/StartPage";
import USRegister from "./routes/UnitedStatesRegister";
const App = () => {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route exact path="/" element={<Layout />}>
                        <Route index element={<StartPage/>} />
                        <Route path="/USA" element={<USRegister/>}/>
                    </Route>
                </Routes>

            </Router>

        </div>
    );
}

export default App