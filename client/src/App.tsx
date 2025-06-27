import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Sidebar from "@/components/sidebar";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import PatientsPage from "@/pages/patients";
import MedicationsPage from "@/pages/medications";
import LabRecordsPage from "@/pages/lab-records";
import HealthMetricsPage from "@/pages/health-metrics";
import PrecisionMedicinePage from "@/pages/precision-medicine";
import VisitNotesPage from "@/pages/visit-notes";

function Router() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/patients" component={PatientsPage} />
        <Route path="/patients/:id" component={PatientsPage} />
        <Route path="/medications" component={MedicationsPage} />
        <Route path="/lab-records" component={LabRecordsPage} />
        <Route path="/health-metrics" component={HealthMetricsPage} />
        <Route path="/precision-medicine" component={PrecisionMedicinePage} />
        <Route path="/visit-notes" component={VisitNotesPage} />
        <Route component={NotFound} />
      </Switch>
    </div>
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
