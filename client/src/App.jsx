import { createRoot } from "react-dom/client";
import LoginPage from './pages/LoginPage';

const App = () => {
  return (
    <div className="app">
      <LoginPage></LoginPage>
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);