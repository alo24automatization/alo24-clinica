import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import CreateCounterDoctor from "./doctors/CreateCounterDoctor";
import Doctors from "./doctors/Doctors";
import StatsionarDoctors from "./doctors/StatsionarDoctors";
import VisitPage from "./VisitPage";
import DoctorsClients from "./doctors/DoctorsClients";

export const CounterAgentRouter = () => {
    return (
        <div>
            <Switch>
                <Route path="/alo24" exact>
                    <CreateCounterDoctor />
                </Route>
                <Route path="/alo24/counter_doctors_report" exact>
                    <Doctors />
                </Route>
                <Route path="/alo24/counter_doctors_report/:id" exact>
                    <DoctorsClients />
                </Route>
                <Route path="/alo24/visit_page" exact>
                    <VisitPage />
                </Route>
                <Route path="/alo24/statsionar_doctors_report" exact>
                    <StatsionarDoctors />
                </Route>
                <Redirect to="/alo24" />
            </Switch>
        </div>
    );
};