import { useState } from "react";
import "../../style/CreateEditor.css";
import inviteModel from "../../models/invite";
import { Navigate, useNavigate, useParams } from "react-router-dom";

function InviteForm({ docId }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [inviteStatus, setInviteStatus] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email) {
      setInviteStatus("Enter an email");
      return;
    }

    const result = await inviteModel.sendInvite(id, email);

    if (result.success) {
      setInviteStatus(result.message);
      setEmail("");
    } else {
      setInviteStatus(result.message || "Could not send invite. Try again");
    }
  }

  return (
    <div className="editor-container">
      <form className="editor-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Invite by email</label>
        <input
          type="email"
          id="email"
          name="email"
          className="input-field"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div>
          <p className="info-text">
            <strong>Test emails authorized with Mailgun:</strong><br />
            hassan1998dev@gmail.com<br />
            mats.jonstromer@gmail.com<br />
            <em>Use one of these emails to test sending invites.</em>
          </p>
        </div>
        <div className="button-group">
          <button type="submit" className="create-btn">
            Send invite
          </button>

          <button type="button"
            className="back-btn"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>
        {inviteStatus && <p className="status-message">{inviteStatus}</p>}
      </form>
    </div>
  );
}

export default InviteForm;
