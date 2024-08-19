import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const TurnCheck = (props) => {
  const { clinica, connector, smallCheckType } = props;
  console.log(smallCheckType);
  const { t } = useTranslation();
  const [departments, setDeparmtents] = useState([]);
  useEffect(() => {
    if (connector && connector.services && connector.services.length > 0) {
      let all = [];
      for (const service of connector?.services) {
        let isExist = [...all].findIndex(
          (item) => item?.department === service?.department?._id
        );
        if (isExist >= 0) {
          all[isExist].turn = service.turn;
        } else {
          all.push({
            department: service?.department?._id,
            name: service?.department?.name,
            turn: service?.turn,
            letter: service?.department?.letter,
            room: service?.department?.room,
            floor: service?.department?.floor,
            probirka: service?.department?.probirka,
            brondate: connector.client.was_online
              ? connector.client.brondate
              : null,
            bronTime: connector.client.was_online
              ? connector.client.bronTime
              : null,
          });
        }
      }
      setDeparmtents(all);
    }
  }, [connector]);
  // Check if services is defined and log its contents
  const formatDate = (born) => {
    if (!born) return null;
    let date = new Date(born);
    let day = String(date.getDate()).padStart(2, "0");
    let month = String(date.getMonth() + 1).padStart(2, "0");
    let year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };
  const filteredDepartments = departments.filter(
    (dep) =>
      connector?.services?.length > 0 &&
      connector?.services.some(
        (service) =>
          service?.department?._id === dep?.department && !service.payment
      )
  );
  return (smallCheckType === "all" ? departments : filteredDepartments).map(
    (item, index) => (
      <div
        key={item._id}
        className={`w-full ${
          index === 0 ? "mt-2" : "mt-10"
        } border-b-4 p-2 pb-5 border-black`}
      >
        <div
          className={"w-full gap-y-2 flex flex-col justify-center items-center"}
        >
          <h1 className={"text-xl font-semibold text-center"}>
            {clinica?.name}
          </h1>
          <h1
            className={
              "border-b-2 text-2xl  border-black font-semibold text-center"
            }
          >
            {item.name}
          </h1>
          <ul>
            <li className="flex items-center gap-x-3">
              <span className="text-2xl  font-semibold text-right">Mijoz:</span>
              <span className={"text-2xl  font-semibold text-right"}>
                {connector?.client?.fullname}
              </span>
            </li>
            <li className="flex items-center gap-x-3">
              <span className="text-2xl  font-semibold text-right">ID:</span>
              <span className={"text-2xl  font-semibold text-right"}>
                {connector.client.id}
              </span>
            </li>
            <li className="flex items-center gap-x-3">
              <span className="text-2xl  font-semibold text-right">
                Tug'ilgan sanasi:
              </span>
              <span className={"text-2xl  font-semibold text-right"}>
                {formatDate(connector.client.born)}
              </span>
            </li>
            <li className="flex items-center gap-x-3">
              <span className="text-2xl  font-semibold text-right">
                Kelgan sanasi:
              </span>
              <span className={"text-2xl  font-semibold text-right"}>
                {formatDate(connector?.createdAt)}
              </span>
            </li>
          </ul>

          <span
            className={
              "border-2 mt-3 border-black font-semibold text-center text-6xl px-4 py-2"
            }
          >
            {item?.letter + "-" + item?.turn}
          </span>
          <div className={"grid grid-cols-2 mt-1"}>
            <span
              className={
                "border-r-2  px-2 border-black text-3xl font-semibold text-right mr-1"
              }
            >
              {item?.floor}
            </span>
            <span className={" text-3xl px-2 font-semibold"}>
              {item?.room}-Xona
            </span>
          </div>
        </div>
        <div className={"mt-3"}>
          {connector.services.length > 0 &&
            connector?.services
              .filter(
                (service) =>
                  service?.department?._id === item.department &&
                  (smallCheckType === "all"
                    ? service.payment
                    : !service.payment)
              )
              .map((service, index) => {
                console.log(service);
                return (
                  <div key={service._id} className="text-[18px] space-y-2">
                    <span className=" block font-semibold">
                      {" "}
                      {index + 1}. {service.service.name}
                    </span>{" "}
                    <span className="block text-right font-extrabold">
                      {service.pieces +
                        " * " +
                        service.service.price +
                        "=" +
                        service.pieces * service.service.price}
                    </span>
                  </div>
                );
              })}
        </div>
        <div className="mt-3">
          <span className="font-semibold text-xl">Umumiy:</span>
          <span className="font-extrabold text-xl">
            {" "}
            {connector.services.length > 0 &&
              connector?.services
                .filter(
                  (service) =>
                    service?.department?._id === item.department &&
                    (smallCheckType === "all"
                      ? service.payment
                      : !service.payment)
                )
                .reduce(
                  (prev, item) => prev + item.service.price * item.pieces,
                  0
                )}
          </span>
        </div>
      </div>
    )
  );
};

export default TurnCheck;
