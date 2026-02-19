const StatCard = ({ title, value, change, trend, icon }) => {
  const trendColor = trend === 'up' ? 'text-success' : 'text-danger';
  const trendIcon = trend === 'up' ? '↑' : '↓';

  return (
    <div className="dark:bg-card-dark bg-card-light rounded-xl p-4 border dark:border-border-dark border-border-light shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-sm font-medium dark:text-text-secondary-dark text-text-secondary-light">
          {title}
        </h3>
        <div className="w-10 h-10 rounded-lg bg-opacity-20 dark:bg-opacity-20 bg-accent flex items-center justify-center text-accent text-xl">
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold mb-1 dark:text-text-primary-dark text-text-primary-light">
        {value}
      </div>
      <div className={`text-sm flex items-center ${trendColor}`}>
        {trendIcon} {change} {trend === 'up' ? 'from last month' : 'so far'}
      </div>
    </div>
  );
};

export default StatCard;