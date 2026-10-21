import { ScanHeart, LogOut } from "lucide-react";
import CalendarSyncControl from "./CalendarSyncControl";

function Header({ onLogout }) {
  return (
    <>
      <div className="theme-switcher">
        <div className="header-actions">
          <CalendarSyncControl />
          <button className="logout-button" onClick={onLogout}>
            Logout
            <LogOut size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
      <h1
        className="title"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          marginBottom: 25,
        }}
      >
        <ScanHeart
          color="#e75480"
          size={38}
          style={{ verticalAlign: "middle", marginBottom: 4 }}
        />
        <span>Cycle Sense</span>
      </h1>
    </>
  );
}

export default Header;
