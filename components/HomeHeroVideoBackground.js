export default function HomeHeroVideoBackground() {
  return (
    <div className="home-hero-video-slot" aria-hidden="true">
      <video className="home-hero-video" autoPlay muted loop playsInline preload="auto">
        <source src="/assets/hero-background.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
