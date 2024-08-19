import React from "react";
import { Director } from "./sections/director/Director";
import { Reseption } from "./sections/reseption/Reseption";
import { Cashier } from "./sections/cashier/Cashier";
import { Doctor } from "./sections/doctor/Doctor";
import { Laborotory } from "./sections/laborotory/Laborotory";
import { CounterAgent } from "./sections/counter_agent/CounterAgent";
import Turns from "./sections/turns/Turns";

export const Counter = ({ section }) => {
  switch (section) {
    case "Director":
      return <Director />;
    case "Reseption":
      return <Reseption />;
    case "Cashier":
      return <Cashier />;
    case "Doctor":
      return <Doctor />;
    case "Laborotory":
      return <Laborotory />;
    case "CounterAgent":
      return <CounterAgent />;
    case "Turn":
      return <Turns />;
    default:
      return <h1>Topilmadi</h1>;
  }
};
