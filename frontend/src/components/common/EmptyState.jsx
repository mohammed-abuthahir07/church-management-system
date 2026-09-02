import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Users, HeartHandshake, Calendar, Bell, Plus, Church, Sparkles } from 'lucide-react';
import './EmptyState.css';

export const EmptyState = ({
  icon: CustomIcon,
  type = 'default',
  title,
  description,
  actionText,
  onAction,
}) => {
  const reduceMotion = useReducedMotion();

  const presets = {
    members: {
      icon: Users,
      title: 'No members registered yet',
      description: 'Your church community will appear here once members are welcomed and added.',
      actionText: 'Add First Member',
    },
    pastors: {
      icon: Church,
      title: 'No pastors or leaders listed',
      description: 'Add ministers, pastors, and church leaders to manage assignments and pastoral care.',
      actionText: 'Add Pastor / Leader',
    },
    prayer: {
      icon: Sparkles,
      title: 'No prayer schedules set',
      description: 'Create a prayer schedule to gather the community in faithful prayer and worship.',
      actionText: 'Schedule Prayer',
    },
    events: {
      icon: Calendar,
      title: 'No upcoming church events',
      description: 'Plan Sunday services, gospel crusades, and fellowship gatherings for the congregation.',
      actionText: 'Create New Event',
    },
    donations: {
      icon: HeartHandshake,
      title: 'No donations recorded yet',
      description: 'Record tithes, offerings, and generous gifts from the congregation to maintain transparent stewardship.',
      actionText: 'Record Donation',
    },
    funds: {
      icon: HeartHandshake,
      title: 'No fund allocations found',
      description: 'Parish fund transfers and allocations will be listed here.',
      actionText: 'Allocate Funds',
    },
    notifications: {
      icon: Bell,
      title: 'No notifications',
      description: 'Announcements and pastoral communications sent across branches will appear here.',
      actionText: 'Send Notification',
    },
    branches: {
      icon: Church,
      title: 'No branches added yet',
      description: 'Register regional church branches to build and expand the church network.',
      actionText: 'Add New Branch',
    },
    default: {
      icon: Sparkles,
      title: 'No records found',
      description: 'Get started by creating your first entry.',
      actionText: 'Create Entry',
    },
  };

  const current = presets[type] || presets.default;
  const IconComponent = CustomIcon || current.icon;
  const displayTitle = title || current.title;
  const displayDesc = description || current.description;
  const displayAction = actionText !== undefined ? actionText : current.actionText;

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="church-card empty-state"
    >
      <div className="empty-state__icon animate-float">
        <IconComponent className="icon-xl" />
      </div>

      <h3 className="empty-state__title font-serif">{displayTitle}</h3>
      <p className="empty-state__desc">{displayDesc}</p>

      {displayAction && onAction && (
        <motion.button
          type="button"
          onClick={onAction}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="btn-gold"
        >
          <Plus className="icon-md" />
          <span>{displayAction}</span>
        </motion.button>
      )}
    </motion.div>
  );
};
