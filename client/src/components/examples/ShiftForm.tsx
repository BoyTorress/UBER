import ShiftForm from '../ShiftForm';

export default function ShiftFormExample() {
  return (
    <div className="p-6 bg-background">
      <ShiftForm
        onSubmit={(data) => console.log('Shift submitted:', data)}
      />
    </div>
  );
}
