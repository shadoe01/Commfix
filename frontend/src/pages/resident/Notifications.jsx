import { useNavigate } from "react-router-dom";
import EmptyState from "../../components/EmptyState.jsx";
import { notifications } from "../../data/placeholder.js";

export default function Notifications() {
  const navigate = useNavigate();

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Notifications</h1>
          <p>Updates about your reports.</p>
        </div>
      </div>
      {notifications.length === 0 ? (
        <EmptyState title="You're all caught up" />
      ) : (
        <div className="card" style={{ padding: 0 }}>
          {notifications.map((n) => (
            <button
              key={n.id}
              className={`notif-card${n.read ? "" : " unread"}`}
              style={{ width: "100%", textAlign: "left", border: "none", cursor: "pointer" }}
              onClick={() => navigate("/my-reports/0001")}
            >
              <p>{n.message}</p>
              <span className="notif-time">{n.date}</span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
