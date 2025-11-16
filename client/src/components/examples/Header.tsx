import Header from '../Header';

export default function HeaderExample() {
  return (
    <div className="min-h-screen bg-background">
      <Header
        userName="Juan Pérez"
        onLogout={() => console.log('Logout clicked')}
      />
      <div className="container py-8 px-4">
        <p className="text-muted-foreground">Contenido de la página debajo del header...</p>
      </div>
    </div>
  );
}
