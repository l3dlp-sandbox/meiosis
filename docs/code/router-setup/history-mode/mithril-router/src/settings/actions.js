import { Route } from "../router";
import { selectors } from "../state";

export const Actions = update => ({
  logout: () =>
    update({
      user: null,
      route: () => selectors.toRoute(Route.Home),
      message: "You have been logged out."
    })
});
