import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { OfflineClients } from "./offlineclients/OfflineClients";
import { StatsionarClients } from "./statsionarclients/StatsionarClients";
import { OnlineClients } from "./onlineclients/OnlineClients";
import { OfflineClients as CashierOffline } from "../cashier/offlineclients/OfflineClients";
import { StatsionarClients as CashierStatsionar } from "../cashier/statsionarclients/StatsionarClients";
import { DiscountClients } from "../cashier/discountclients/DiscountClients";
import { DebtClients } from "../cashier/debtclients/DebtClients";
import Expense from "../cashier/expense/Expense";
import { OnlineClientsDoctor } from "./onlineclients/OnlineClientsDoctor";

export const ReseptionRouter = () => {
  return (
    <div>
      <Switch>
        <Route path="/alo24" exact>
          <OfflineClients />
        </Route>
        <Route path="/alo24/statsionar">
          <StatsionarClients />
        </Route>
        <Route path="/alo24/online">
          <OnlineClients />
        </Route>
        <Route path="/alo24/online_info">
          <OnlineClientsDoctor />
        </Route>
        <Route path="/alo24/cashier">
          <CashierOffline />
        </Route>
        <Route path="/alo24/cashier_statsionar">
          <CashierStatsionar />
        </Route>
        <Route path="/alo24/cashier_discount">
          <DiscountClients />
        </Route>
        <Route path="/alo24/cashier_debt">
          <DebtClients />
        </Route>
        <Route path="/alo24/cashier_expense">
          <Expense />
        </Route>
        <Redirect to="/alo24" />
      </Switch>
    </div>
  );
};
