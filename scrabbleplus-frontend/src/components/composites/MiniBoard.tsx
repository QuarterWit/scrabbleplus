export default function MiniBoard() {
  return (
    <div className="grid grid-cols-5 grid-rows-5 gap-1">
      {Array.from({length:25}).map((_,i)=>(
        <div key={i} className="h-8 w-8 rounded-md bg-amber-100 border border-amber-200" />
      ))}
    </div>
  );
}
