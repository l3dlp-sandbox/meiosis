import React from "react";

import { Beverages } from "../beverages/view";
import { Beverage } from "../beverage/view";
import { childRoutes, get, head } from "routing-common/src/util";

const componentMap = {
  Beverages,
  Beverage
};

export const Coffee = ({ state, actions, routes }) => {
  const componentId = get(head(routes.routeChildren), ["case"]);
  const Component = componentMap[componentId];

  return (
    <div>
      <p>Coffee Page</p>
      {
        Component &&
        <Component
          state={state}
          actions={actions}
          routes={childRoutes(routes)} />
      }
    </div>
  );
};
