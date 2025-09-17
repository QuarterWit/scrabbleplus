export default function Stat({ label, value }:{ label: string; value: string | number }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-bold text-[#E9EDF3]">{value}</span>
      <span className="text-sm text-[#F5C97A]">{label}</span>
    </div>
  );
}
