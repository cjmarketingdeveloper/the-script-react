import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

export default function UserProfilePage() {
  const dispatch = useDispatch();

  // Retrieve user & token from Redux state
  const currentUser = useSelector(
    (state) => state.auth?.user || state.user?.user || state.user
  );
  const token = useSelector(
    (state) => state.auth?.token || state.user?.token || currentUser?.token
  );

  // Check role permissions (True if admin or superadmin)
  const isAdmin = currentUser?.isAdmin || currentUser?.role === "admin";

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    practiceNumber: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });

  // Populate form with logged-in user details
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        surname: currentUser.surname || "",
        email: currentUser.email || "",
        phone: currentUser.phone || currentUser.phoneNumber || "",
        practiceNumber: currentUser.practiceNumber || "",
        role: currentUser.isAdmin ? "Admin" : currentUser.role || "User",
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", text: "" });

    try {
      const API_URL =
        process.env.REACT_APP_API_URL || "https://admin.thescript.co.za/api/";

      // Payload: Normal users can only send phone updates; Admins send full updates
      const updateData = isAdmin
        ? formData
        : { phone: formData.phone };

      const res = await axios.put(
        `${API_URL}user/update/${currentUser._id || currentUser.id}`,
        updateData,
        {
          headers: { token: `Bearer ${token}` },
        }
      );

      // Optional: Update local Redux state here if you have a user update action
      // dispatch(updateUserSuccess(res.data));

      setStatus({
        type: "success",
        text: "Profile updated successfully!",
      });
    } catch (err) {
      console.error("Error updating profile:", err);
      setStatus({
        type: "danger",
        text:
          err.response?.data?.message ||
          "Failed to update profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-xl my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-2 shadow-sm rounded-4 p-4 p-md-5" style={{ borderColor: "var(--color-script-accent)" }}>
            {/* Header */}
            <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
              <div>
                <h2 className="mb-1 fw-bold">My Profile</h2>
                <p className="text-muted mb-0">
                  Manage your personal account details
                </p>
              </div>
              <span
                className={`badge fs-6 px-3 py-2 rounded-pill`} 
                style={{backgroundColor: 'var(--color-script-accent)'}}
              >
                {isAdmin ? "Admin Role" : "Member"}
              </span>
            </div>

            {/* Status Alert */}
            {status.text && (
              <div className={`alert alert-${status.type} mb-4`} role="alert">
                {status.text}
              </div>
            )}

            {/* Profile Form */}
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                {/* First Name */}
                <div className="col-md-6">
                  <label htmlFor="name" className="form-label fw-semibold">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={`form-control form-control-lg rounded-pill px-4 ${
                      !isAdmin ? "bg-light text-muted" : ""
                    }`}
                    value={formData.name}
                    onChange={handleChange}
                    readOnly={!isAdmin}
                    required
                  />
                </div>

                {/* Surname */}
                <div className="col-md-6">
                  <label htmlFor="surname" className="form-label fw-semibold">
                    Surname
                  </label>
                  <input
                    type="text"
                    id="surname"
                    name="surname"
                    className={`form-control form-control-lg rounded-pill px-4 ${
                      !isAdmin ? "bg-light text-muted" : ""
                    }`}
                    value={formData.surname}
                    onChange={handleChange}
                    readOnly={!isAdmin}
                    required
                  />
                </div>

                {/* Email Address */}
                <div className="col-md-12">
                  <label htmlFor="email" className="form-label fw-semibold">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`form-control form-control-lg rounded-pill px-4 ${
                      !isAdmin ? "bg-light text-muted" : ""
                    }`}
                    value={formData.email}
                    onChange={handleChange}
                    readOnly={!isAdmin}
                    required
                  />
                </div>

                {/* Phone Number - EDITABLE FOR ALL USERS */}
                <div className="col-md-6">
                  <label htmlFor="phone" className="form-label fw-semibold">
                    Phone Number <span className="text-danger"></span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="form-control form-control-lg rounded-pill px-4 border-warning"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 082 123 4567"
                    required
                  />
                  <div className="form-text ms-2">Editable field</div>
                </div>

                {/* Practice Number */}
                <div className="col-md-6">
                  <label
                    htmlFor="practiceNumber"
                    className="form-label fw-semibold"
                  >
                    Practice Number
                  </label>
                  <input
                    type="text"
                    id="practiceNumber"
                    name="practiceNumber"
                    className={`form-control form-control-lg rounded-pill px-4 ${
                      !isAdmin ? "bg-light text-muted" : ""
                    }`}
                    value={formData.practiceNumber}
                    onChange={handleChange}
                    readOnly={!isAdmin}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-4 pt-3 text-end">
                <button
                  type="submit"
                  className="btn btn-script btn-lg px-5 rounded-pill shadow-sm"
                  disabled={loading}
                >
                  {loading ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}