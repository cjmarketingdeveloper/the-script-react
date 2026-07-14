export default function SubscribeSection() {
  return (
    <section
    className="subscribe-section"
    style={{ backgroundImage: "url('/assets/sub/subscribeimage.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center"
    }}
    >
      <h3>
        Want to stay updated with the pharmacy industry trends?
      </h3>
      <p>Sign up to our newsletter.</p>

      <form className="subscribe-form">
        <input
          type="email"
          placeholder="you@example.com"
        />
        <button type="submit">
          Subscribe
        </button>
      </form>
    </section>
  )
}
