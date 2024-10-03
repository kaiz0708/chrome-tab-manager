/** @format */

import Popup from "./components/popup/Popup";
import Login from "./components/Login";
import { useSelector, useDispatch } from "react-redux";
/* global chrome */
function App() {
   const isLogin = useSelector((state) => state.current.login);
   return <div>{isLogin === false ? <Popup /> : <Login />}</div>;
}

export default App;
