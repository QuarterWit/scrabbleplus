export default function VideoLoop() {
  return (
    <div className="rounded-2xl overflow-hidden border">
      <video autoPlay muted loop playsInline className="w-full h-auto">
        <source src="/assets/videos/hero-loop.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
