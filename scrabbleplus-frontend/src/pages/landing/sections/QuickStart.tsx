import Section from "../../../components/ui/Section";
import JoinByCodeForm from "../../../components/composites/JoinByCodeForm";
import Button from "../../../components/ui/Button";

export default function QuickStart() {
  return (
    <Section id="quickstart" title="Jump in">
      <div className="flex flex-col md:flex-row gap-4">
        <Button>Quick Match</Button>
        <Button variant="default">Create Room</Button>
        <JoinByCodeForm onJoin={(c)=>console.log("join", c)} />
      </div>
    </Section>
  );
}
