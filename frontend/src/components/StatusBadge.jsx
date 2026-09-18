import React from 'react';

const StatusBadge = ({ status }) => {
  const norm = (status || '').toLowerCase();

  let badgeClass = 'badge';
  if (norm === 'applied') badgeClass += ' badge-applied';
  else if (norm === 'shortlisted') badgeClass += ' badge-shortlisted';
  else if (norm === 'selected') badgeClass += ' badge-selected';
  else if (norm === 'rejected') badgeClass += ' badge-rejected';
  else if (norm === 'active') badgeClass += ' badge-active';
  else if (norm === 'upcoming') badgeClass += ' badge-upcoming';
  else if (norm === 'closed') badgeClass += ' badge-closed';
  else badgeClass += ' badge-applied';

  return <span className={badgeClass}>{status || 'Pending'}</span>;
};

export default StatusBadge;
