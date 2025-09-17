import Section from "../../../components/ui/Section";
import LeaderboardTable from "../../../components/composites/LeaderboardTable";
import AchievementsStrip from "../../../components/composites/AchievementsStrip";

export default function Competitive() {
  return (
    <Section id="competitive" title="Climb the ladder" subtitle="Season ends Sep 30 — earn the Onyx Tile">
      <div className="grid md:grid-cols-2 gap-6">
        <LeaderboardTable />
        <AchievementsStrip />
      </div>
    </Section>
  );
}
