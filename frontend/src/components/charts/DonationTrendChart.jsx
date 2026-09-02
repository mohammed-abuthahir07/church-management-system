import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { formatIndianCurrency } from '../../utils/currency';

export const DonationTrendChart = ({
  data = [],
  xKey = 'month_name',
  yKey = 'total_amount',
  color = '#D4AF37',
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-empty">
        No donation trend history available
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="chart-tooltip__title font-serif">{label}</p>
          <p className="chart-tooltip__value">
            {formatIndianCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="donationAreaGold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.4} />
            <stop offset="95%" stopColor={color} stopOpacity={0.0} />
          </linearGradient>
        </defs>
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
          tickFormatter={(val) => `₹${val}`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey={yKey}
          stroke={color}
          strokeWidth={2.5}
          fillOpacity={1}
          fill="url(#donationAreaGold)"
          animationDuration={800}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
