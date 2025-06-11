// main.jsx
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { BrowserRouter } from "react-router";
import { SocketProvider } from "./context/SocketContext.jsx";
import "./index.css"

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <SocketProvider>
        <App />
      </SocketProvider>
    </BrowserRouter>
  </Provider>
);
