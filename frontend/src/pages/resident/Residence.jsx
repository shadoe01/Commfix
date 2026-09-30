import { currentResident } from "../../data/placeholder.js";

export default function Residence() {
  return (
    <>
      <div className="page-header">
        <div>
          <h1>Residence Information</h1>
          <p>Details tied to your household record.</p>
        </div>
      </div>
      <div className="card" style={{ maxWidth: 480 }}>
        <div className="field"><label>Household</label><input defaultValue={currentResident.household} disabled /></div>
        <div className="field"><label>Address</label><input defaultValue={currentResident.address} disabled /></div>
        <p className="field-hint">Contact barangay staff to update household records.</p>
      </div>
    </>
  );
}
