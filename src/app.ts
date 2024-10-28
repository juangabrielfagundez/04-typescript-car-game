import { render } from "./utils/render";
import { MainScreen } from "./components/MainScreen";

window.addEventListener("load", () => {
  const app = document.getElementById("app")!;
  render(new MainScreen(), app);
});
