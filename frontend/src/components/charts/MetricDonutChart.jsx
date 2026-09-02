import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import { formatIndianCurrency } from '../../utils/currency';

const CHURCH_PALETTE = ['#D4AF37', '#1B3573', '#38BDF8', '#10B981', '#A855F7', '#F59E0B', '#64748B'];

export const MetricDonutChart = ({
  data = [],
  nameKey = 'name',
  valueKey = 'value',
  isCurrency = false,
  innerRadius = 55,
  outerRadius = 80,
}) => {
  if (!data || data.length === 0 || data.every((d) => Number(d[valueKey]) === 0)) {
    return (
      <div className="chart-empty">
        No distribution data available
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const entry = payload[0];
      return (
        <div className="chart-tooltip">
          <p className="chart-tooltip__title font-serif">{entry.name}</p>
          <p className="chart-tooltip__value">
            {isCurrency ? formatIndianCurrency(entry.value) : new Intl.NumberFormat('en-IN').format(entry.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey={valueKey}
          nameKey={nameKey}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={3}
          animationDuration={750}
          animationBegin={80}
        >
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={CHURCH_PALETTE[index % CHURCH_PALETTE.length]}
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth={1}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
      </PieChart>
    </ResponsiveContainer>
  );
};
