import { useSelector } from "react-redux";

export default function SubscribeSection() {
  // Extract user from Redux auth state
  const { user } = useSelector((state) => state.auth);

  // Safely extract email (handles nested user objects if present)
  const userEmail = user?.email || user?.user?.email || "";

  return (
    <section className="subscribe-section">
      <h3>
        Want to stay updated with the pharmacy industry trends?
      </h3>
      <p>Sign up to our newsletter.</p>

      <form className="subscribe-form">
        <input
          type="email"
          value={userEmail}
          readOnly // 👈 Prevents editing while keeping the input selectable
          placeholder="you@example.com"
        />
        <button type="submit">
          Subscribe
        </button>
      </form>
    </section>
  );
}