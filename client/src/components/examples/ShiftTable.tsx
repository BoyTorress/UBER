import ShiftTable from '../ShiftTable';

export default function ShiftTableExample() {
  const mockShifts = [
    { id: '1', date: '15 Nov 2025', hours: 8.5, grossEarnings: 42500, netEarnings: 36550 },
    { id: '2', date: '14 Nov 2025', hours: 6.0, grossEarnings: 31200, netEarnings: 26832 },
    { id: '3', date: '13 Nov 2025', hours: 7.5, grossEarnings: 38900, netEarnings: 33454 },
    { id: '4', date: '12 Nov 2025', hours: 5.5, grossEarnings: 25800, netEarnings: 22188 },
  ];

  return (
    <div className="p-6 bg-background">
      <ShiftTable
        shifts={mockShifts}
        onEdit={(id) => console.log('Edit shift', id)}
        onDelete={(id) => console.log('Delete shift', id)}
      />
    </div>
  );
}
