import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { DoctorClients } from "./doctorclients/DoctorClients";
import { Conclusion } from "./conclusion/Conclusion";
import Tables from "./tables/Tables";
import AdoptionTemplate from "./components/AdoptionTemplate";
import { BloodTest } from "./bloodtest/BloodTest";

export const LaborotoryRouter = () => {
  return (
    <div className="bg-slate-100">
      <Switch>
        <Route path="/alo24" exact>
          <DoctorClients />
        </Route>
        <Route path="/alo24/tables">
          <Tables />
        </Route>
        <Route path="/alo24/adoption">
          <AdoptionTemplate />
        </Route>
        <Route path="/alo24/conclusion">
          <Conclusion />
        </Route>
        <Route path="/alo24/bloodtest">
          <BloodTest />
        </Route>
        <Redirect to="/alo24" />
      </Switch>
    </div>
  );
};
