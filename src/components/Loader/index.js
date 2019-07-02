import React from "react";

import { STATUS } from "../../constants";

const Loader = ({ status }) => {
  return status !== STATUS.RUNNING ? (null) : (
    <div className="app-loader">
      <div className="app-loader__spinner" />
    </div>
  );
};

export default Loader;
