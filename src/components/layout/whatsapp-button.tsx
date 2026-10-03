/**
 * Floating WhatsApp button, bottom-left.
 *
 * The number and the prefilled message are taken verbatim from the
 * original index.html's .wa-btn so the conversation opens exactly as it
 * does on the live site. Styling is the current site's, not the
 * original's.
 *
 * Server component -- it is a plain link with no interactivity, so
 * there is no reason to ship JS for it.
 */
const WHATSAPP_HREF =
  "https://wa.me/15818096586?text=Hi%2C%20I%20need%20help%20with%20my%20online%20class!";

const WA_PATH =
  "M16 2C8.268 2 2 8.268 2 16c0 2.49.652 4.83 1.792 6.858L2 30l7.338-1.765A13.934 13.934 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6c-2.248 0-4.348-.6-6.15-1.646l-.44-.26-4.356 1.05 1.076-4.238-.286-.458A11.564 11.564 0 014.4 16C4.4 9.594 9.594 4.4 16 4.4S27.6 9.594 27.6 16 22.406 27.6 16 27.6zm6.348-8.72c-.348-.174-2.06-1.016-2.38-1.132-.318-.116-.55-.174-.78.174-.232.348-.9 1.132-1.1 1.364-.202.232-.404.26-.75.086-.35-.174-1.476-.544-2.81-1.734-1.04-.928-1.742-2.072-1.946-2.42-.204-.348-.022-.536.152-.708.158-.156.35-.406.524-.61.174-.202.232-.348.348-.58.116-.232.058-.434-.03-.61-.086-.174-.78-1.882-1.07-2.578-.282-.676-.568-.584-.78-.594-.202-.01-.434-.012-.666-.012-.232 0-.61.086-.928.434-.318.348-1.214 1.188-1.214 2.896 0 1.708 1.244 3.358 1.418 3.59.174.232 2.448 3.738 5.934 5.24.83.358 1.478.572 1.982.732.832.264 1.59.226 2.188.138.668-.1 2.06-.842 2.35-1.656.29-.812.29-1.508.204-1.656-.086-.144-.318-.232-.668-.406z";

export function WhatsAppButton() {
  return (
    <a
      className="wa-fab"
      href={WHATSAPP_HREF}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
    >
      <span className="wa-fab-tooltip" aria-hidden>
        Chat on WhatsApp
      </span>
      <svg viewBox="0 0 32 32" aria-hidden>
        <path d={WA_PATH} />
      </svg>
    </a>
  );
}
