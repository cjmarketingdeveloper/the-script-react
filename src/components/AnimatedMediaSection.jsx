export default function AnimatedMediaSection() {
  return (
    <section className="media-surround">
      <div className="media-grid">
        <img src="/animationimages/1.jpg" className="media-corner tl medium" />
        <img src="/animationimages/2.jpg" className="media-corner tr medium" />

        <video
          src="/animations/orb video -02.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="media-center"
        />

        <img src="/animationimages/3.jpg" className="media-corner bl medium" />
        <img src="/animationimages/4.jpg" className="media-corner br medium" />
      </div>
    </section>
  )
}
