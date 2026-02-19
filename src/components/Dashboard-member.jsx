import StatCard from './StatCard';
import ActivityItem from './ActivityItem';
import ActionButton from './ActionButton';
import axios from 'axios';
import { useEffect } from 'react';

const DashboardMember = ({ stats, activities, quickActions,dashboardInfo}) => {
        

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold dark:text-text-primary-dark text-text-primary-light">
          {dashboardInfo[0]}
        </h1>
        <p className="text-sm dark:text-text-secondary-dark text-text-secondary-light">
          {dashboardInfo[1]}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="dark:bg-card-dark bg-card-light rounded-xl p-4 border dark:border-border-dark border-border-light shadow-sm">
            <h2 className="text-lg font-semibold mb-4 dark:text-text-primary-dark text-text-primary-light">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => (
                <ActionButton key={index} {...action} />
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="dark:bg-card-dark bg-card-light rounded-xl p-4 border dark:border-border-dark border-border-light shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold dark:text-text-primary-dark text-text-primary-light">
                Messages
              </h2>
              <a href="#activities" className="text-sm text-accent">
                View All
              </a>
            </div>
            <div className="space-y-4">
              {activities.length > 0 ? (
                activities.map((activity, index) => (
                  <ActivityItem key={index} {...activity} />
                ))
              ) : (
                <p> No Data Available </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMember;