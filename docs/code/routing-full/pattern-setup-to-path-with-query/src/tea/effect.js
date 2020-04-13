import { teas } from "../teaDetails/data";

export const effect = ({ state, update }) => {
  if (state.loadTeas) {
    setTimeout(() => {
      update({ teas, loadTeas: false });
    }, 1000);
  }
};
