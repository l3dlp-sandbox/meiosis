import m from "mithril";

import { TeaDetails } from "../teaDetails";
import { Route } from "router-setup-common/src/router";

export const Tea = {
  view: ({ attrs: { state, router } }) => [
    m("h3", "Tea Page"),
    m(
      ".row",
      m(
        ".col-md-6",
        state.teas &&
          state.teas.map(tea =>
            m(
              "div",
              { key: tea.id },
              m("a", { href: router.toUrl(Route.TeaDetails, { id: tea.id }) }, tea.title)
            )
          )
      ),
      state.route.page === "TeaDetails" &&
        m(".col-md-6", m(TeaDetails, { state, id: state.route.params.id, router }))
    )
  ]
};
