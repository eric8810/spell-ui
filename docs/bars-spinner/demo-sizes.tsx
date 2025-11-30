import { BarsSpinner } from "@/registry/spell-ui/bars-spinner";

export default function BarsSpinnerDemoSizes() {
  return (
    <div className="flex items-center gap-4">
      <BarsSpinner size={16} />
      <BarsSpinner size={20} />
      <BarsSpinner size={24} />
      <BarsSpinner size={32} />
    </div>
  );
}
