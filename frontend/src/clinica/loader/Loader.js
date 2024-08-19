import React from "react";

export const Loader = () => {
  return (
    <div>
      {/* Loading starts */}
      <div id="loading-wrapper">
        <div className="spinner-wrapper">
          <div className="spinner">
            <div className="inner" />
          </div>
          <div className="spinner">
            <div className="inner" />
          </div>
          <div className="spinner">
            <div className="inner" />
          </div>
          <div className="spinner">
            <div className="inner" />
          </div>
          <div className="spinner">
            <div className="inner" />
          </div>
          <div className="spinner">
            <div className="inner" />
          </div>
        </div>
      </div>
      {/* Loading ends */}
    </div>
  );
};
