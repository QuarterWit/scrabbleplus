type Row = { rank:number; name:string; rating:number };
const sample: Row[] = [
  { rank:1, name:"Luna", rating:1820 },
  { rank:2, name:"Orion", rating:1785 },
  { rank:3, name:"Echo", rating:1760 },
];

export default function LeaderboardTable() {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-[320px] w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500">
            <th className="py-2 pr-4">Rank</th><th className="py-2 pr-4">Player</th><th className="py-2">Rating</th>
          </tr>
        </thead>
        <tbody>
          {sample.map(r=>(
            <tr key={r.rank} className="border-t">
              <td className="py-2 pr-4">{r.rank}</td>
              <td className="py-2 pr-4">{r.name}</td>
              <td className="py-2">{r.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
