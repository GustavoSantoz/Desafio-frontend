import "./App.css";
import Route from "./routes/routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div>
      <ToastContainer limit={1}/>
      <Route />
    </div>
  );
}
export default App;
