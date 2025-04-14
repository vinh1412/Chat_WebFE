import PropTypes from "prop-types";
import Modal from "react-modal";
Modal.setAppElement("#root");
Modal.defaultStyles = {};
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App({ children }) {
  return (
    <div className="w-screen h-screen overflow-hidden">
      {children}
      <ToastContainer />
    </div>
  );
}

// Kiểm tra kiểu dữ liệu của props
App.propTypes = {
  children: PropTypes.node.isRequired,
};

export default App;
