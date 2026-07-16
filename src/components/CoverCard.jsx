import { Link } from 'react-router-dom';

export default function CoverCard({
  image,
  href,
  badge,
  footer,
  overlay,
  cardClass = '',
}) {
  return (
    <div className="cover-card-wrapper">
      {badge && <div className="latest-badge">{badge}</div>}

      <Link to={href}>
        <div
          className={`cover-card ${cardClass}`}
          style={{ backgroundImage: `url(${image})` }}
        />
        {overlay && <div className="cover-overlay">{overlay}</div>}
      </Link>

      {footer && <div className="cover-footer">{footer}</div>}
    </div>
  );
}