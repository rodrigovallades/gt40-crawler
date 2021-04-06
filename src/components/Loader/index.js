import React from 'react';
import PropTypes from 'prop-types';

import { STATUS } from '../../constants';

const Loader = ({ status }) =>
  status !== STATUS.RUNNING ? null : (
    <div className="app-loader">
      <div className="app-loader__spinner" />
    </div>
  );

Loader.propTypes = {
  status: PropTypes.string.isRequired,
};

export default Loader;
