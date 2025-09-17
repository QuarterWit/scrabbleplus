import { useState } from "react";
import Button from "../ui/Button";

export default function JoinByCodeForm({ onJoin }:{ onJoin?:(code:string)=>void }) {
  const [code, setCode] = useState("");
  return (
    <form
      className="flex w-full max-w-md gap-2"
      onSubmit={(e) => { e.preventDefault(); onJoin?.(code.trim()); }}
    >
      <input
        value={code}
        onChange={(e)=>setCode(e.target.value)}
        placeholder="Enter room code"
        className="flex-1 rounded-xl border border-gray-300 px-3 py-2"
      />
      <Button type="submit">Join</Button>
    </form>
  );
}
