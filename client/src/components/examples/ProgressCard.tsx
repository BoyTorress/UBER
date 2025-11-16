import ProgressCard from '../ProgressCard';

export default function ProgressCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-background">
      <ProgressCard
        title="Progreso hacia Arriendo Semanal"
        current={120000}
        target={150000}
      />
      <ProgressCard
        title="Meta Mensual"
        current={485000}
        target={800000}
      />
    </div>
  );
}
