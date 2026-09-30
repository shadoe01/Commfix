import { useState } from "react";
import EmptyState from "../../components/EmptyState.jsx";
import { notifications as initialNotifications } from "../../data/placeholder.js";
import Button from "../../components/Button.jsx";

export default function AdminNotifications() {
  const [items, setItems] = useState(initialNotifications);

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Notifications</h1>
          <p>System-wide activity.</p>
        </div>
        <Button variant="secondary" onClick={markAllRead}>Mark All as Read</Button>
      </div>
      {items.length === 0 ? (
        <EmptyState title="You're all caught up" />
      ) : (
        <div className="card" style={{ padding: 0 }}>
          {items.map((n) => (
            <div key={n.id} className={`notif-card${n.read ? "" : " unread"}`}>
              <p>{n.message}</p>
              <span className="notif-time">{n.date}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
