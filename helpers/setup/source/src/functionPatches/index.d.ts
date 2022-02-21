import {
  ActionConstructor as CommonActionConstructor,
  App as CommonApp,
  Effect as CommonEffect,
  MeiosisCell as CommonMeiosisCell,
  MeiosisContext as CommonMeiosisContext,
  MeiosisConfigBase,
  MeiosisSetup as CommonMeiosisSetup,
  Service as CommonService,
  Update as CommonUpdate
} from "../common";

/**
 * @template S the State type.
 */
export interface Patch<S> {
  /**
   * A function patch.
   *
   * @param {S} state the current state.
   *
   * @returns {S} the updated state.
   *
   * Examples:
   *
   * ```typescript
   * update(state => ({ ...state, count: 42 }));
   *
   * // Using Ramda
   * update(R.assoc('count', 42)));
   * ```
   */
  (state: S): S;
}

export type Update<S> = CommonUpdate<Patch<S>>;

export type ActionConstructor<S, A> = CommonActionConstructor<S, Patch<S>, A>;

export type Service<S> = CommonService<S, Patch<S>>;

export type Effect<S, A = unknown> = CommonEffect<S, Patch<S>, A>;

export type App<S, A = unknown> = CommonApp<S, Patch<S>, A>;

export type MeiosisContext<S, A = unknown> = CommonMeiosisContext<S, Patch<S>, A>;

export type MeiosisCell<S, A = unknown> = CommonMeiosisCell<S, Patch<S>, A>;

/**
 * Config for setting up Meiosis with function patches.
 */
export type MeiosisConfig<S, A = unknown> = MeiosisConfigBase<S, Patch<S>, A>;

export type MeiosisSetup<S, A = unknown> = CommonMeiosisSetup<S, Patch<S>, A>;

/**
 * Helper to setup the Meiosis pattern with function patches.
 *
 * @template S the State type.
 * @template A the Actions type.
 *
 * @param {MeiosisConfig<S, A>} config the Meiosis config for use with function
 * patches.
 *
 * @returns {import("../common").Meiosis<S, Patch<S>, A>} `{ states, update, actions }`,
 * where `states` and `update` are streams, and `actions` are the created actions.
 */
export function setup<S, A = unknown>(config: MeiosisConfig<S, A>): MeiosisSetup<S, A>;

export default setup;
