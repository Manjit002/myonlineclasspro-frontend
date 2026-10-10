import type { Expert } from "@/constants/experts-data";
import { ExpertAvatar } from "./expert-avatar";

/**
 * Directory card. `index` drives the accent colour cycle so the grid
 * keeps the original's varied top-accent treatment.
 */
export function ExpertCard({
  expert,
  index,
}: {
  expert: Expert;
  index: number;
}) {
  return (
    <article className="exp-card" data-accent={index % 6}>
      <div className="exp-card-top">
        <div className="exp-avatar">
          <ExpertAvatar expert={expert} />
        </div>
        <div className="exp-name-wrap">
          <h3 className="exp-name">
            {expert.name}
            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
              <path
                d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 14.4 7.2 16.9l.9-5.4L4.2 7.7l5.4-.8z"
                fill="#f0a500"
              />
            </svg>
          </h3>
          <p className="exp-subject">{expert.role}</p>
        </div>
      </div>

      <p className="exp-status">
        <span className="exp-status-dot" aria-hidden />
        {expert.status}
      </p>
      <p className="exp-cred">{expert.credentials}</p>
      <p className="exp-stars">
        <span aria-hidden>★★★★★</span>
        <span className="sr-only">Rated</span>
        <span className="exp-rating-num">{expert.rating}</span>
      </p>

      <dl className="exp-stats">
        <div>
          <dd className="exp-stat-n">{expert.orders}</dd>
          <dt className="exp-stat-l">Orders</dt>
        </div>
        <div>
          <dd className="exp-stat-n">{expert.successRate}</dd>
          <dt className="exp-stat-l">Success Rate</dt>
        </div>
      </dl>

      <a href={expert.href} className="exp-cta">
        Request This Expert
      </a>
    </article>
  );
}
