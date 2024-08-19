import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { DoctorClients } from "./doctorclients/DoctorClients";
import Templates from "./templates/Templates";
import AdoptionTemplate from "./components/AdoptionTemplate";
import { ConclusionClients } from "./conclusion/ConclusionClients";
import Conclusion from "./conclusion/Conclusion";
import DoctorProfit from "./DoctorProfit";
import StatsionarDoctorProfit from "./StatsionarDoctorProfit";
import DirectProfit from "./DirectProfit";
import { OnlineClients } from "./OnlineClients";
import StatsionarRoom from "./StatsionarRoom";
import DoctorComplaint from "./DoctorComplaint";
import { OfflineClients } from "../reseption/offlineclients/OfflineClients";
// import Tables from "./tables/Tables";

export const DoctorRouter = () => {
  return (
    <div>
      <Switch>
        <Route path="/alo24" exact>
          <DoctorClients />
        </Route>
        <Route path="/alo24/clients" exact>
          <OfflineClients />
        </Route>
        <Route path="/alo24/templates">
          <Templates />
        </Route>
        <Route path="/alo24/adoption">
          <AdoptionTemplate />
        </Route>
        <Route path="/alo24/conclusionclients">
          <ConclusionClients />
        </Route>
        <Route path="/alo24/conclusion">
          <Conclusion />
        </Route>
        <Route path="/alo24/doctor_profit">
          <DoctorProfit />
        </Route>
        <Route path="/alo24/settings">
          <DoctorComplaint />
        </Route>
        <Route path="/alo24/doctor_statsionar_profit">
          <StatsionarDoctorProfit />
        </Route>
        <Route path="/alo24/direct_profit">
          <DirectProfit />
        </Route>
        <Route path="/alo24/onlineclients">
          <OnlineClients />
        </Route>
        <Route path="/alo24/statsionar_room">
          <StatsionarRoom />
        </Route>
        <Redirect to="/alo24" />
      </Switch>
    </div>
  );
};
