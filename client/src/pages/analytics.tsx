import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Users, Activity, TrendingUp, Calendar, Pill, TestTube, Heart, UserCheck } from "lucide-react";

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

export default function AnalyticsPage() {
  const { data: patients } = useQuery({
    queryKey: ["/api/patients"],
  });

  const { data: allMedications } = useQuery({
    queryKey: ["/api/analytics/medications"],
  });

  const { data: allLabRecords } = useQuery({
    queryKey: ["/api/analytics/lab-records"],
  });

  const { data: allBodyComposition } = useQuery({
    queryKey: ["/api/analytics/body-composition"],
  });

  // Calculate demographics
  const demographics = patients ? {
    totalPatients: patients.length,
    ageGroups: patients.reduce((acc: any, patient: any) => {
      if (patient.dateOfBirth) {
        const age = new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear();
        const group = age < 18 ? 'Under 18' : age < 35 ? '18-34' : age < 50 ? '35-49' : age < 65 ? '50-64' : '65+';
        acc[group] = (acc[group] || 0) + 1;
      }
      return acc;
    }, {}),
    genderDistribution: patients.reduce((acc: any, patient: any) => {
      const gender = patient.gender || 'Unknown';
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {}),
  } : null;

  // Calculate service metrics
  const serviceMetrics = {
    totalMedications: allMedications?.length || 0,
    totalLabRecords: allLabRecords?.length || 0,
    totalBodyCompositionEntries: allBodyComposition?.length || 0,
    averageMedicationsPerPatient: patients && allMedications ? (allMedications.length / patients.length).toFixed(1) : 0,
  };

  // Top medication types
  const medicationTypes = allMedications ? 
    Object.entries(allMedications.reduce((acc: any, med: any) => {
      const type = med.name.split(' ')[0]; // Get first word as type
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {})).slice(0, 6).map(([name, count]) => ({ name, count })) : [];

  // Age group data for charts
  const ageGroupData = demographics ? 
    Object.entries(demographics.ageGroups).map(([group, count]) => ({ group, count })) : [];

  // Gender distribution for pie chart
  const genderData = demographics ?
    Object.entries(demographics.genderDistribution).map(([gender, count]) => ({ gender, count })) : [];

  // Monthly patient activity (mock data based on created dates)
  const monthlyActivity = patients ? 
    patients.reduce((acc: any, patient: any) => {
      if (patient.createdAt) {
        const month = new Date(patient.createdAt).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        acc[month] = (acc[month] || 0) + 1;
      }
      return acc;
    }, {}) : {};

  const monthlyData = Object.entries(monthlyActivity).map(([month, count]) => ({ month, count }));

  if (!patients) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Practice Analytics</h1>
        <div className="text-sm text-gray-500">
          Updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{demographics?.totalPatients || 0}</div>
            <p className="text-xs text-green-600">Active patient base</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Medications</CardTitle>
            <Pill className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{serviceMetrics.totalMedications}</div>
            <p className="text-xs text-blue-600">{serviceMetrics.averageMedicationsPerPatient} avg per patient</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Lab Records</CardTitle>
            <TestTube className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{serviceMetrics.totalLabRecords}</div>
            <p className="text-xs text-purple-600">Total lab tests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Health Metrics</CardTitle>
            <Heart className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{serviceMetrics.totalBodyCompositionEntries}</div>
            <p className="text-xs text-red-600">Body composition entries</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Age Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Patient Age Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ageGroupData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="group" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gender Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Gender Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ gender, count }) => `${gender}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Medications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Most Prescribed Medications</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={medicationTypes} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="count" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Patient Growth */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Patient Growth Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#F59E0B" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Service Utilization Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Service Utilization Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">Service Type</th>
                  <th className="text-left py-2 font-medium">Total Usage</th>
                  <th className="text-left py-2 font-medium">Avg per Patient</th>
                  <th className="text-left py-2 font-medium">Utilization Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-2">Medication Management</td>
                  <td className="py-2">{serviceMetrics.totalMedications}</td>
                  <td className="py-2">{serviceMetrics.averageMedicationsPerPatient}</td>
                  <td className="py-2">
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">High</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2">Laboratory Testing</td>
                  <td className="py-2">{serviceMetrics.totalLabRecords}</td>
                  <td className="py-2">{patients ? (serviceMetrics.totalLabRecords / patients.length).toFixed(1) : 0}</td>
                  <td className="py-2">
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Medium</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2">Health Monitoring</td>
                  <td className="py-2">{serviceMetrics.totalBodyCompositionEntries}</td>
                  <td className="py-2">{patients ? (serviceMetrics.totalBodyCompositionEntries / patients.length).toFixed(1) : 0}</td>
                  <td className="py-2">
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">Growing</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}