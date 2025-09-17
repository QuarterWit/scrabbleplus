import Section from "../../../components/ui/Section";
import Card from "../../../components/ui/Card";

const MODES = ["Classic","Ranked (Elo)","Blitz (60s/turn)","Casual","Solo vs AI","Practice Board"];
export default function GameModes() {
  return (
    <Section id="modes" title="Game modes">
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
        {MODES.map(m => <Card key={m}><div className="font-medium">{m}</div><div className="text-sm text-gray-600">One-line blurb.</div></Card>)}
      </div>
    </Section>
  );
}
