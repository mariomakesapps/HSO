/**
 * Fixed ambient backdrop that sits behind every route.
 *
 * Built entirely from CSS gradients rather than an image or video: it costs a
 * few KB of CSS, resolves crisply at any viewport size, and adds nothing to the
 * LCP critical path.
 *
 * Three colour fields rather than four, and no repeating light sweep — a shine
 * that crosses the page every twenty seconds pulls the eye off the content.
 * What is left is slow enough to read as atmosphere rather than animation.
 *
 * The field colours are driven by `data-atmo` on <html> (see lib/atmosphere.ts)
 * and interpolate between themes, so moving from Research to Competitions
 * washes the page from sage to coral instead of cutting.
 *
 * Every layer animates on transform/opacity only, so the compositor handles the
 * motion without repainting. Mobile drops the heaviest layers and the
 * reduced-motion query freezes everything (see index.css).
 */
export function Atmosphere() {
  return (
    <div className="hso-atmosphere" aria-hidden="true">
      <div className="hso-atmosphere__field hso-atmosphere__field--a" />
      <div className="hso-atmosphere__field hso-atmosphere__field--b" />
      <div className="hso-atmosphere__field hso-atmosphere__field--c" />
      <div className="hso-atmosphere__ribbon" />
      <div className="hso-atmosphere__grid" />
      <div className="hso-atmosphere__grain" />
      <div className="hso-atmosphere__vignette" />
    </div>
  );
}

export default Atmosphere;
