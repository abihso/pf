const ActivityItem = ({ title, body }) => {
  return (
    <div className="flex items-start gap-4 pb-4 border-b dark:border-border-dark border-border-light last:border-b-0 last:pb-0">
      <div className="w-10 h-10 rounded-full dark:bg-accent-dark bg-accent-light flex items-center justify-center text-accent text-xl mt-1 flex-shrink-0">
        ℹ 
      </div>
      <div className="flex-1">
        <h4 className="font-medium dark:text-text-primary-dark text-text-primary-light mb-1">
          {title}
        </h4>
        <p className="text-sm dark:text-text-secondary-dark text-text-secondary-light mb-1">
          {body}
        </p>
        
      </div>
    </div>
  );
};

export default ActivityItem;