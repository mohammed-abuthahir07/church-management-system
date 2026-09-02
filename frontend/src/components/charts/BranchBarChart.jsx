import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { formatIndianCurrency } from '../../utils/currency';

export const BranchBarChart = ({
  data = [],
  xKey = 'branch_name',
  bars = [
    { key: 'total_members', name: 'Members', color: '#1B3573' },
    { key: 'total_pastors', name: 'Pastors', color: '#D4AF37' },
  ],
  isCurrency = false,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-empty">
        No comparative branch data available
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="chart-tooltip__title font-serif">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="chart-tooltip__row">
              <span className="chart-tooltip__name">
                <span
                  className="chart-tooltip__swatch"
                  style={{ backgroundColor: entry.color }}
                />
                {entry.name}:
              </span>
              <span className="chart-tooltip__value">
                {isCurrency || entry.dataKey?.includes('donation') || entry.dataKey?.includes('amount')
                  ? formatIndianCurrency(entry.value)
                  : new Intl.NumberFormat('en-IN').format(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
        <XAxis
          dataKey={xKey}
          tick={{ fill: '#64748B', fontSize: 11 }}
          axisLine={{ stroke: '#CBD5E1' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#64748B', fontSize: 11 }}
          axisLine={{ stroke: '#CBD5E1' }}
          tickLine={false}
          tickFormatter={(val) => (isCurrency ? `₹${val}` : val)}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
        {bars.map((bar, idx) => (
          <Bar
            key={idx}
            dataKey={bar.key}
            name={bar.name}
            fill={bar.color}
            radius={[4, 4, 0, 0]}
            animationDuration={700}
            animationBegin={idx * 80}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};
