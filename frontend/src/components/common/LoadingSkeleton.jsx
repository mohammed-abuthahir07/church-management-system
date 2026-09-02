import React from 'react';
import './LoadingSkeleton.css';

export const TableSkeleton = ({ rows = 5, columns = 5 }) => {
  return (
    <div className="church-card table-skeleton">
      <div className="table-skeleton__head">
        <div className="table-skeleton__title skeleton-shimmer" />
        <div className="table-skeleton__action skeleton-shimmer" />
      </div>
      <div className="table-skeleton__body">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="table-skeleton__row">
            {Array.from({ length: columns }).map((_, cIdx) => (
              <div key={cIdx} className="table-skeleton__cell skeleton-shimmer" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const CardSkeleton = ({ count = 4 }) => {
  return (
    <div className="card-skeleton-grid">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="church-card card-skeleton">
          <div className="card-skeleton__top">
            <div className="card-skeleton__label skeleton-shimmer" />
            <div className="card-skeleton__icon skeleton-shimmer" />
          </div>
          <div className="card-skeleton__value skeleton-shimmer" />
          <div className="card-skeleton__sub skeleton-shimmer" />
        </div>
      ))}
    </div>
  );
};

export const DashboardSkeleton = () => {
  return (
    <div className="dashboard-skeleton">
      <div className="dashboard-skeleton__hero skeleton-shimmer" />
      <CardSkeleton count={4} />
      <div className="dashboard-skeleton__charts">
        <div className="dashboard-skeleton__panel skeleton-shimmer" />
        <div className="dashboard-skeleton__panel skeleton-shimmer" />
      </div>
    </div>
  );
};
