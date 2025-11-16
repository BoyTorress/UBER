import EarningsChart from '../EarningsChart';

export default function EarningsChartExample() {
  const mockData = [
    { day: 'Lun', earnings: 28500, hours: 6 },
    { day: 'Mar', earnings: 32100, hours: 7 },
    { day: 'Mié', earnings: 25800, hours: 5.5 },
    { day: 'Jue', earnings: 31200, hours: 6.5 },
    { day: 'Vie', earnings: 38900, hours: 8 },
    { day: 'Sáb', earnings: 42500, hours: 9 },
    { day: 'Dom', earnings: 36400, hours: 7.5 },
  ];

  return (
    <div className="p-6 bg-background">
      <EarningsChart data={mockData} title="Ganancias por Día" />
    </div>
  );
}
