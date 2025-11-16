import ShiftForm from '../ShiftForm';

export default function ShiftFormExample() {
  return (
    <div className="p-6 bg-background">
      <ShiftForm
        onSubmit={(data) => console.log('Shift submitted:', data)}
        config={{
          avgKmPerHour: 25,
          vehicleEfficiency: 12.5,
          fuelPrice: 1350,
        }}
      />
    </div>
  );
}
