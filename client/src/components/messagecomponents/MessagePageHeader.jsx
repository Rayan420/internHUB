import { BiSearch } from "react-icons/bi";

const Header = ({ setShowModal }) => {
  return (
    <header className="header">
      <div className="header-container">
        <div
          className="header-compose"
          style={{ cursor: "pointer" }}
          onClick={() => setShowModal(true)}
        >
          <i className="bx bx-pencil" style={{ color: "white" }}>
            <span className="compose-message">Compose Message</span>{" "}
          </i>
        </div>
      </div>
    </header>
  );
};

export default Header;
