import { Card } from "@/components/ui/card";


const ShowcaseComponent = ({ title, component, controls, controlsClassName }: { title: string, component: React.ReactNode, controls: React.ReactNode, controlsClassName?: string }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">{title}</h2>
      <Card className="p-4">
        {component}
      </Card>
      <div className={controlsClassName || "flex items-center gap-2"}>
        {controls}
      </div>
    </div>
  );
};

export default ShowcaseComponent;