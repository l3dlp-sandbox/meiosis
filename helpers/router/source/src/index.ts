import createRouteMatcher from 'feather-route-matcher';
import qs from 'qs';
import { Route, Router, RouterConfig, ToUrl } from './types';
import {
  addHistoryEventListener,
  createGetUrl,
  createToUrl,
  doSyncLocationBar,
  getConfig,
  getQuery
} from './util';

/**
 * Creates a router.
 */
export const createRouter = ({
  routeConfig,
  rootPath,
  wdw = window
}: RouterConfig): Router => {
  const routeMatcher = createRouteMatcher(routeConfig);
  const { prefix, historyMode } = getConfig(rootPath);

  const getUrl = createGetUrl(prefix, historyMode, wdw);
  const getPath = () => getUrl().substring(prefix.length) || '/';
  const toUrl: ToUrl = createToUrl(routeConfig, prefix, historyMode);

  const getRoute = (path) => {
    let matchPath = path || '/';
    if (matchPath.startsWith('?')) {
      matchPath = '/' + matchPath;
    }
    const match = routeMatcher(matchPath);
    const queryParams = qs.parse(getQuery(path));
    const params = Object.assign(queryParams, match.params);

    return Object.assign(match, { params });
  };

  const initialRoute = getRoute(getPath());

  const start = (onRouteChange) => {
    if (historyMode) {
      addHistoryEventListener(wdw, prefix, (href) => {
        wdw.history.pushState({}, '', href);
        if (wdw.onpopstate) {
          wdw.onpopstate(new PopStateEvent('router'));
        }
      });
    }
    wdw.onpopstate = () => onRouteChange(getRoute(getPath()));
  };

  const syncLocationBar = ({ value, params, replace }: Route) => {
    doSyncLocationBar({ replace, url: toUrl(value, params), getUrl, wdw });
  };

  return { initialRoute, toUrl, start, syncLocationBar };
};
