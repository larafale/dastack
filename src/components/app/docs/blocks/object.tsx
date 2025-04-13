import { Card, CardContent } from '@/components/ui/card';
import React from 'react';

// Helper function to render different types of values
const renderValue = (value: unknown): React.ReactNode => {
  if (value === null || value === undefined) {
    return <span className="text-gray-400">None</span>;
  }

  if (typeof value === 'object') {
    if (Array.isArray(value)) {
      return value.length > 0 ? (
        value.map((item, i) => <div key={i}>{renderValue(item)}</div>)
      ) : (
        <span className="text-gray-400">Empty array</span>
      );
    }
    return (
      <pre className="text-xs overflow-auto">
        {JSON.stringify(value, null, 2)}
      </pre>
    );
  }

  return String(value);
};

export function ObjectBlock({ data, title }: { data: any; title: string }) {
  return (
    <>
      <h4 className="text-sm font-medium mb-2 uppercase p-2">{title}</h4>
      <dl className="grid grid-cols-1 gap-2 text-sm">
        {Object.entries(data).map(([key, value]) => (
          <React.Fragment key={key}>
            <dt className="text-muted-foreground font-medium p-2 py-1 text-xs font-mono capitalize bg-muted">
              {key}:
            </dt>
            <dd className="px-2 ">{renderValue(value)}</dd>
          </React.Fragment>
        ))}
      </dl>
    </>
  );
}

export function ObjectCard({ data, title }: { data: any; title: string }) {
  return (
    <Card className="">
      <CardContent className="p-2">
        <h4 className="text-sm font-medium mb-2 uppercase p-2">{title}</h4>
        <dl className="grid grid-cols-1 gap-2 text-sm">
          {Object.entries(data).map(([key, value]) => (
            <React.Fragment key={key}>
              <dt className="text-muted-foreground font-medium p-2 py-1 text-xs font-mono capitalize bg-muted">
                {key}:
              </dt>
              <dd className="px-2 ">{renderValue(value)}</dd>
            </React.Fragment>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
