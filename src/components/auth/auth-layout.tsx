import Image from "next/image";
import { ShieldCheck, MessageSquare, Wallet } from "lucide-react";
import { LOGO_SRC } from "@/constants/images";

/**
 * Shared shell for the auth pages: a brand panel alongside the form.
 *
 * Server component — purely presentational, so it adds no client JS. The
 * panel is supporting content and is hidden below 900px, where the form
 * takes the full column.
 *
 * Used by both /login and /signup so the two stay consistent without a
 * second copy of this markup.
 */

const POINTS = [
  {
    Icon: ShieldCheck,
    title: "Track every order",
    body: "See status, deadlines and progress the moment they change.",
  },
  {
    Icon: MessageSquare,
    title: "Message your expert",
    body: "Ask questions and share files without leaving your dashboard.",
  },
  {
    Icon: Wallet,
    title: "Wallet and installments",
    body: "Review payments, balances and instalment plans in one place.",
  },
];

export function AuthLayout({
  title,
  lead,
  children,
}: {
  title: string;
  lead: string;
  children: React.ReactNode;
}) {
  return (
    <section className="auth-section">
      <div className="site-container auth-shell">
        <div className="auth-split">
          {/* aria-hidden: the form beside it already carries the page's
              accessible heading, so this is decorative reinforcement. */}
          <aside className="auth-brand" aria-hidden="true">
            <div className="auth-brand-logo">
              <Image
                src={LOGO_SRC}
                alt=""
                width={40}
                height={40}
                unoptimized
                style={{ height: 40, width: "auto", objectFit: "contain" }}
              />
              <span className="auth-brand-name">
                MyOnlineClass<span className="text-gold">Pro</span>
              </span>
            </div>

            <h2 className="auth-brand-title">{title}</h2>
            <p className="auth-brand-lead">{lead}</p>

            <div className="auth-brand-points">
              {POINTS.map(({ Icon, title: t, body }) => (
                <div key={t} className="auth-brand-point">
                  <span className="auth-brand-icon">
                    <Icon size={17} />
                  </span>
                  <p>
                    <strong>{t}</strong>
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </aside>

          {children}
        </div>
      </div>
    </section>
  );
}
