import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/LoginPage";
import Dashboard from "@/pages/Dashboard";
import ConfigurationPage from "@/pages/ConfigurationPage";

function Router() {
  return (
    <Switch>
      <Route path="/">
        <LoginPage onLogin={(email, password, remember) => {
          console.log('Login:', { email, password, remember });
        }} />
      </Route>
      <Route path="/dashboard">
        <Dashboard />
      </Route>
      <Route path="/configuracion">
        <ConfigurationPage />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
