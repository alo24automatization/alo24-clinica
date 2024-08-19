import { Redirect, Route, Switch } from "react-router-dom";
import Departments from "./pages/Departments";
import DepartmentsTurns from "./pages/DepartmentsTurns";
import React from "react";

const TurnRouter = () => {
    return (
        <Switch>
            <Route path="/alo24" exact>
                <Departments />
            </Route>
            <Route path="/alo24/turns" exact>
                <DepartmentsTurns />
            </Route>
            <Redirect to="/alo24" />
        </Switch>
    );
};

export default TurnRouter;
