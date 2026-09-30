import Button from "../../components/Button.jsx";
import { users } from "../../data/placeholder.js";

export default function UserManagement() {
  return (
    <>
      <div className="page-header">
        <div>
          <h1>User Management</h1>
          <p>Accounts with access to Commfix.</p>
        </div>
        <Button>+ Add Admin Account</Button>
      </div>
      <div className="table-wrap">
        <table className="list">
          <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td style={{ textTransform: "capitalize" }}>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
