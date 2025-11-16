import ConfigurationForm from '../ConfigurationForm';

export default function ConfigurationFormExample() {
  return (
    <div className="p-6 bg-background">
      <ConfigurationForm
        initialData={{
          hasRent: true,
          weeklyRent: '150000',
          monthlyGoal: '800000',
          avgKmPerHour: '25',
          vehicleEfficiency: '12.5',
          fuelPrice: '1350',
        }}
        onSave={(data) => console.log('Configuration saved:', data)}
      />
    </div>
  );
}
