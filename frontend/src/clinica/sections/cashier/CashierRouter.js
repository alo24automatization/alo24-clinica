import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { DebtClients } from "./debtclients/DebtClients";
import { DiscountClients } from "./discountclients/DiscountClients";
import Expense from "./expense/Expense";
import { OfflineClients } from "./offlineclients/OfflineClients";
import { StatsionarClients } from "./statsionarclients/StatsionarClients";

export const CashierRouter = () => {
  return (
    <div>
      <Switch>
        <Route path="/alo24" exact>
          <OfflineClients />
        </Route>
        <Route path="/alo24/statsionar">
          <StatsionarClients />
        </Route>
        <Route path="/alo24/discount">
          <DiscountClients />
        </Route>
        <Route path="/alo24/debt">
          <DebtClients />
        </Route>
        <Route path="/alo24/expense">
          <Expense />
        </Route>
        <Redirect to="/alo24" />
      </Switch>
    </div>
  );
};
