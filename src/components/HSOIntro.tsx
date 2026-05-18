import { useEffect, useState } from "react";

export function HSOIntro() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setDone(true), 3800);
    return () => window.clearTimeout(timer);
  }, []);

  if (done) return null;

  return (
    <div className="hso-pro-intro" aria-label="HSO intro animation" role="presentation">
      <div className="hso-pro-gradient" aria-hidden="true" />
      <div className="hso-pro-noise" aria-hidden="true" />

      <div className="hso-pro-stage" aria-hidden="true">
        <div className="hso-pro-mark">
          <span className="hso-pro-letter hso-pro-h">H</span>
          <span className="hso-pro-letter hso-pro-s">S</span>
          <span className="hso-pro-letter hso-pro-o">
            O
            <span className="hso-pro-o-layer" aria-hidden="true" />
          </span>
        </div>
      </div>

      <span className="hso-pro-reveal" aria-hidden="true" />
    </div>
  );
}
