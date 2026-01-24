import React from 'react';

const CustomRoute = (Component, id) => {
    return (props) => (
      <div id={id}>
        <Component {...props} />
      </div>
    );
  };

export default CustomRoute;
