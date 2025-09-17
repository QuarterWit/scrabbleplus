export default function AchievementsStrip() {
  const items = ["7-day streak", "3 bingos today", "120 highest word"];
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((t,i)=>(
        <span key={i} className="rounded-full bg-indigo-50 text-indigo-700 px-3 py-1 text-xs">{t}</span>
      ))}
    </div>
  );
}
