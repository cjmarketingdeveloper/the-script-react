import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUserProfile } from "../reduxAuth/authSlice"; // Adjust path if needed

export default function UserProfilePage() {
  const dispatch = useDispatch();

  // 🟢 Safe selector with default fallback
  const authState = useSelector((state) => state.auth || {});
  const user = authState.user;
  const loading = authState.isLoading || false;

  // Handles both flat user object and nested user object structures
  const currentUser = user?.user || user;
  const isAdmin = currentUser?.isAdmin || currentUser?.role === "admin";

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    phone: "",
    job: "",
  });

  const [status, setStatus] = useState({ type: "", text: "" });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        surname: currentUser.surname || "",
        phone: currentUser.phone || currentUser.phoneNumber || "",
        job: currentUser.job || currentUser.jobTitle || "",
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", text: "" });

    const userId = currentUser?._id || currentUser?.id;

    if (!userId) {
      setStatus({ type: "danger", text: "User ID missing. Please log in again." });
      return;
    }

    // Exact payload structure required by backend
    const payload = {
      id: userId,
      data: {
        name: formData.name,
        surname: formData.surname,
        phone: formData.phone,
        job: formData.job,
      },
    };

    try {
      await dispatch(updateUserProfile(payload)).unwrap();
      setStatus({
        type: "success",
        text: "Personal details updated successfully!",
      });
    } catch (err) {
      setStatus({
        type: "danger",
        text: typeof err === "string" ? err : "Failed to update profile.",
      });
    }
  };

  return (
    <div className="container-xl my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
            <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
              <div>
                <h2 className="mb-1 fw-bold">My Profile</h2>
                <p className="text-muted mb-0">Manage your personal details</p>
              </div>
              <span
                className={`badge fs-6 px-3 py-2 rounded-pill ${
                  isAdmin ? "bg-danger" : "bg-primary"
                }`}
              >
                {isAdmin ? "Admin Role" : "Member"}
              </span>
            </div>

            {status.text && (
              <div className={`alert alert-${status.type} mb-4`} role="alert">
                {status.text}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="name" className="form-label fw-semibold">First Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={`form-control form-control-lg rounded-pill px-4 ${!isAdmin ? "bg-light text-muted" : ""}`}
                    value={formData.name}
                    onChange={handleChange}
                    readOnly={!isAdmin}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="surname" className="form-label fw-semibold">Surname</label>
                  <input
                    type="text"
                    id="surname"
                    name="surname"
                    className={`form-control form-control-lg rounded-pill px-4 ${!isAdmin ? "bg-light text-muted" : ""}`}
                    value={formData.surname}
                    onChange={handleChange}
                    readOnly={!isAdmin}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="phone" className="form-label fw-semibold">
                    Phone Number <span className="text-danger">*</span>
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
                </div>

                <div className="col-md-6">
                  <label htmlFor="job" className="form-label fw-semibold">Job / Title</label>
                  <input
                    type="text"
                    id="job"
                    name="job"
                    className={`form-control form-control-lg rounded-pill px-4 ${!isAdmin ? "bg-light text-muted" : ""}`}
                    value={formData.job}
                    onChange={handleChange}
                    readOnly={!isAdmin}
                  />
                </div>
              </div>

              <div className="mt-4 pt-3 text-end">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg px-5 rounded-pill shadow-sm"
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