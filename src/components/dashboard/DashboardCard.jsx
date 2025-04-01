
import React from 'react';

const DashboardCard = ({ title, icon, value, description, className = "", iconClassName = "" }) => {
  return (
    <div className={`bg-white rounded-lg p-6 shadow-md ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-700">{title}</h3>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {description && (
            <p className="text-sm text-gray-500 mt-2">{description}</p>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-full bg-primary/10 text-primary ${iconClassName}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;
