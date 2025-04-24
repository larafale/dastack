'use client';

import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useState } from 'react';
import { formatLocale } from '@/lib/date';
import { cn } from '@/lib/utils';

function calIMC(weight: number, height: number) {
  if (height <= 0) return 0;
  return (weight / (height * height)).toFixed(2);
}

function IMCLabel(imc: number) {
  if (imc < 16.5) return 'Dénutrition';
  else if (imc < 18.5) return 'Maigreur';
  else if (imc < 25) return 'Poids normal';
  else if (imc < 30) return 'Surpoids';
  else if (imc < 35) return 'Obésité modérée';
  else if (imc < 40) return 'Obésité sévère';
  else return 'Obésité morbide';
}

const HeaderBlock = ({
  label,
  value,
  unit,
}: {
  label: string;
  value: any;
  unit?: string;
}) => {
  return (
    <div
      className={cn(
        'flex justify-between items-center sm:flex-col lg:flex-row xl:flex-col flex-1 gap-1 ',
        'p-3',
        'select-none',
        'border-t first:border-t-0 sm:border-t-0 lg:border-t xl:border-t-0',
        'first:border-l-0 sm:border-l lg:border-l-0 xl:border-l'
      )}
    >
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-lg font-bold leading-none sm:text-xl lg:text-base xl:text-xl">
        {value}{' '}
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </span>
    </div>
  );
};

export function SectionWeightBlock({ data }: { data: any }) {
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');
  const weights = data?.weight || [];
  const height = (data?.patient?.height || 0) / 100;

  // Sort weights by date in ascending order
  const sortedData = [...weights].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const chartData = sortedData.map((item) => ({
    ...item,
    date_f: formatLocale(item.date, 'dd MMM'),
    imc: calIMC(item.weight, height),
  }));

  // console.log('weights', chartData);

  const minWeight = Math.min(...sortedData.map((item) => item.weight));
  const maxWeight = Math.max(...sortedData.map((item) => item.weight));
  const lastWeight = sortedData[sortedData.length - 1]?.weight || 0;

  const minImc = Math.min(...sortedData.map((item) => item.imc || 0));
  const maxImc = Math.max(...sortedData.map((item) => item.imc || 0));
  const lastImc = chartData[chartData.length - 1]?.imc || 0;

  const weightRange = [minWeight - 5, maxWeight + 5];
  const color1 = 'hsl(var(--chart-4))';
  const color2 = 'hsl(var(--chart-2))';

  const chartConfig = {
    weight: {
      label: `Poids (${unit})`,
      color: color1,
    },
    imc: {
      label: `IMC`,
      color: color2,
    },
  };

  return (
    <Card className="">
      <CardHeader className="flex flex-col sm:flex-row lg:flex-col xl:flex-row space-y-0 p-0 ">
        <HeaderBlock label="Poids actuel" value={lastWeight} unit={unit} />
        <HeaderBlock label="Taille" value={height} unit="m" />
        <HeaderBlock
          label={`IMC (${IMCLabel(lastImc as number)})`}
          value={lastImc}
        />
      </CardHeader>
      {chartData.length > 1 && (
        <CardContent className="p-0 px-4 py-2">
          <div className="">
            <ChartContainer config={chartConfig}>
              <AreaChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(v) => formatLocale(v, 'MMM')}
                />
                <ChartTooltip
                  cursor={false}
                  labelFormatter={(v) => formatLocale(v, 'PP')}
                  // formatter={(value) => [`${value} ${unit}`, `${value} ${unit}`]}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <defs>
                  <linearGradient id="fill-1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color1} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={color1} stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="weight"
                  type="natural"
                  fill="url(#fill-1)"
                  fillOpacity={0.4}
                  stroke={color1}
                />
                <Area
                  dataKey="imc"
                  type="natural"
                  fill="transparent"
                  fillOpacity={0.4}
                  stroke={color2}
                />
              </AreaChart>
            </ChartContainer>

            {/* <ChartContainer
            config={chartConfig}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(v) => formatLocale(v, 'MMM')}
                  tickLine={false}
                  axisLine={false}
                  padding={{ left: 10, right: 10 }}
                />
                <YAxis
                  domain={weightRange}
                  tickCount={6}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value} ${unit}`}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => `${value} ${unit}`}
                      labelFormatter={(v) => formatLocale(v, 'MMM')}
                    />
                  }
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  strokeWidth={2}
                  stroke={color1}
                  activeDot={{ r: 6 }}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer> */}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
