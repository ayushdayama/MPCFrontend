import { ScanHeart, LogOut } from "lucide-react";

function Header({ onLogout }) {
  return (
    <>
      <div className="theme-switcher">
        <button
          onClick={onLogout}
          style={{
            float: "right",
            background: "none",
            border: "none",
            color: "#e75480",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          Logout
          <LogOut />
        </button>
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
