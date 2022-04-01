import simpleStream, { Stream } from '../simple-stream';
import merge from 'mergerino';
import {
  CommonMeiosisComponent,
  CommonMeiosisConfig,
  CommonService,
  NestSetup,
  commonGetServices,
  nestSetup
} from '../common';
import { get } from '../util';

/**
 * A Mergerino function patch. This is a function that receives the current state and returns the
 * updated state.
 *
 * Example:
 *
 * ```typescript
 * update(state => ({ ...state, { count: 42 }}));
 * ```
 *
 * @template S the State type.
 */
export type FunctionPatch<S> = (state: S) => S;

/**
 * A Mergerino object patch. This is an object that contains updates to state properties.
 *
 * Example:
 *
 * ```typescript
 * update({ count: 42 });
 * ```
 *
 * @template S the State type.
 */
export type ObjectPatch<S> = {
  [K in Extract<keyof S, string>]?:
    | Patch<S[K]>
    | ((a: S[K]) => S[K] | null | undefined)
    | null
    | undefined;
};

/**
 * A Mergerino patch.
 *
 * Examples:
 *
 * ```typescript
 * update({ count: 42 });
 * update({ count: x => x + 1 });
 * ```
 *
 * @template S the State type.
 */
export type Patch<S> = FunctionPatch<S> | ObjectPatch<S> | Patch<S>[];

export interface Update<S> {
  (patch: Patch<S>): any;
}

export interface View<S> {
  (cell: MeiosisCell<S>, ...args: any[]): any;
}

export interface ViewComponent<S> {
  view: View<S>;
}

export type NestedViews<S> = {
  [K in keyof S]: ViewComponent<S>;
};

export interface MeiosisCell<S> {
  state: S;
  update: Update<S>;
  nest: <K extends Extract<keyof S, string>>(prop: K) => MeiosisCell<S[K]>;
  nested: NestedViews<S>;
}

export interface Service<S> extends CommonService<S> {
  run: (cell: MeiosisCell<S>) => any;
}

export interface MeiosisComponent<S> extends CommonMeiosisComponent<S> {
  /**
   * An array of service functions.
   */
  services?: Service<S>[];

  nested?: NestedComponents<S>;
}

export interface MeiosisViewComponent<S> extends MeiosisComponent<S> {
  view: View<S>;
}

type NestedComponents<S> = {
  [K in keyof S]?: MeiosisComponent<S[K]>;
};

/**
 * Meiosis Config.
 *
 * @template S the State type.
 */
export interface MeiosisConfig<S> extends CommonMeiosisConfig<S> {
  app?: MeiosisComponent<S>;
}

const nestPatch = <S, K extends Extract<keyof S, string>>(patch: Patch<S[K]>, prop: K): Patch<S> =>
  ({ [prop]: patch } as Patch<S>);

const nestUpdate =
  <S, K extends Extract<keyof S, string>>(parentUpdate: Update<S>, prop: K): Update<S[K]> =>
  (patch) =>
    parentUpdate(nestPatch(patch, prop));

const nestCell =
  <S, K extends Extract<keyof S, string>>(
    getState: () => S,
    parentUpdate: Update<S>,
    view: MeiosisComponent<S> | undefined
  ) =>
  (prop: K): MeiosisCell<S[K]> => {
    const getNestedState = () => getState()[prop];
    const nestedView = get(view, [prop, 'nested']);
    const nestedUpdate: Update<S[K]> = nestUpdate(parentUpdate, prop);

    const nested: MeiosisCell<S[K]> = {
      state: getNestedState(),
      update: nestedUpdate,
      nest: nestCell(getNestedState, nestedUpdate, nestedView),
      nested: nestedView
    };

    return nested;
  };

/**
 * Combines an array of patches into a single patch.
 *
 * @template S the State type.
 */
export const combinePatches = <S>(patches: Patch<S>[]): Patch<S> => patches;

const getServices = <S>(component: MeiosisComponent<S>): Service<S>[] =>
  commonGetServices(component);

/**
 * Helper to setup the Meiosis pattern with [Mergerino](https://github.com/fuzetsu/mergerino).
 *
 * @template S the State type.
 *
 * @param {MeiosisConfig<S>} config the Meiosis config for use with Mergerino
 *
 * @returns {Meiosis<S, Patch<S>>} `{ cells }`.
 */
export const setup = <S>({
  stream = simpleStream,
  app = {}
}: MeiosisConfig<S>): Stream<MeiosisCell<S>> =>
  nestSetup<S, Patch<S>, NestSetup<S, Patch<S>>, Service<S>, MeiosisCell<S>>({
    accumulator: merge,
    getServices,
    nestCell,
    stream,
    app
  });

export default setup;
