const express = require("express");
module.exports.routers = (app) => {
  app.use(express.json({ extended: true }));
  app.use(express.urlencoded({ extended: true }));
  app.use(
    "/api",
    require("./clinica_and_director_and_user/clinica_and_director_and_user")
  );
  app.use("/api/upload", require("./uploadFiles/upload"));
  app.use("/api/sections", require("./sectionAndBaseUrl/getSections"));
  app.use("/api/baseurl", require("./sectionAndBaseUrl/getBaseUrl"));
  app.use(
    "/api/services",
    require("./services/departments_services_rooms_warehouse")
  );
  app.use("/api/offlineclient", require("./offlineclient/offlineclient.route"));
  app.use(
    "/api/statsionarclient",
    require("./statsionarclient/statsionarclient.route")
  );
  app.use("/api/onlineclient", require("./onlineclient/onlineclient.route"));
  app.use("/api/adver", require("./adver/adver.route"));
  app.use("/api/cashier", require("./cashier/cashier.route"));
  app.use("/api/doctor", require("./doctor/doctor.route"));
  app.use("/api/labaratory", require("./labaratory/labaratory.route"));
  app.use("/api", require("./charts/charts.route"));
  app.use("/api", require("./doctor_procient/doctor_procient_route"));
  app.use("/api", require("./counter_agent/counter_agent.route"));
};
