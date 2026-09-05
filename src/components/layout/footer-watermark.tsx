/**
 * Large brand signature at the very end of the footer.
 *
 * Server component — it is purely decorative text with CSS-only
 * styling, so it ships no JavaScript.
 *
 * aria-hidden because the brand name is already announced by the
 * footer logo and copyright; repeating it here would just be noise
 * for a screen reader.
 */
export function FooterWatermark() {
  return (
    <div className="ft-watermark" aria-hidden="true">
      <span className="ft-watermark-text">
        MYONLINECLASS<span className="wm-pro">PRO</span>
      </span>
    </div>
  );
}
