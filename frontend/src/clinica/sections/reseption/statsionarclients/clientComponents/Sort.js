import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";

export const Sort = ({ property, data, setData }) => {
  return (
    <div className="btn-group-vertical ml-2">
      <FontAwesomeIcon
        onClick={() => 
          setData(
            [...data].sort((a, b) => (a[property] > b[property] ? 1 : -1))
          )
        }
        icon={faAngleUp}
        style={{ cursor: "pointer" }}
      />
      <FontAwesomeIcon
        icon={faAngleDown}
        style={{ cursor: "pointer" }}
        onClick={() =>
          setData(
            [...data].sort((a, b) => (b[property] > a[property] ? 1 : -1))
          )
        }
      />
    </div>
  );
};
