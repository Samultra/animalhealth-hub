
import React from "react";
import Navbar from "@/components/layout/Navbar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import HealthMetricsCard from "@/components/dashboard/HealthMetricsCard";
import AnimalProfileCard from "@/components/dashboard/AnimalProfileCard";
import VitalSignsChart from "@/components/dashboard/VitalSignsChart";
import MedicationTracker from "@/components/dashboard/MedicationTracker";
import ActivityLog from "@/components/dashboard/ActivityLog";

// Sample data
const healthMetrics = [
  { id: "1", name: "Temperature", value: 38.2, unit: "°C", change: 1.2, status: "good" },
  { id: "2", name: "Heart Rate", value: 72, unit: "bpm", change: -2.5, status: "excellent" },
  { id: "3", name: "Respiratory Rate", value: 15, unit: "bpm", change: 0.8, status: "good" },
  { id: "4", name: "Blood Pressure", value: 130, unit: "mmHg", change: 5, status: "average" },
  { id: "5", name: "Oxygen Saturation", value: 97, unit: "%", change: -1, status: "excellent" },
];

const animals = [
  {
    id: "1",
    name: "Max",
    species: "Dog",
    breed: "Labrador",
    age: "5 years",
    weight: "28 kg",
    temperature: "38.2°C",
    heartRate: "72 bpm",
    healthStatus: "excellent",
    lastCheckup: "2 days ago",
    imageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8ZG9nfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: "2",
    name: "Luna",
    species: "Cat",
    breed: "Siamese",
    age: "3 years",
    weight: "4.5 kg",
    temperature: "38.6°C",
    heartRate: "140 bpm",
    healthStatus: "good",
    lastCheckup: "1 week ago",
    imageUrl: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8Y2F0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: "3",
    name: "Charlie",
    species: "Horse",
    breed: "Arabian",
    age: "8 years",
    weight: "450 kg",
    temperature: "38.0°C",
    heartRate: "36 bpm",
    healthStatus: "average",
    lastCheckup: "1 month ago",
    imageUrl: "https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8aG9yc2V8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
  },
];

const chartData = {
  temperatureData: [
    { date: "Jan", value: 38.2 },
    { date: "Feb", value: 38.6 },
    { date: "Mar", value: 38.5 },
    { date: "Apr", value: 38.9 },
    { date: "May", value: 38.7 },
    { date: "Jun", value: 38.4 },
    { date: "Jul", value: 38.2 },
  ],
  heartRateData: [
    { date: "Jan", value: 70 },
    { date: "Feb", value: 72 },
    { date: "Mar", value: 68 },
    { date: "Apr", value: 75 },
    { date: "May", value: 72 },
    { date: "Jun", value: 70 },
    { date: "Jul", value: 68 },
  ],
  weightData: [
    { date: "Jan", value: 27.5 },
    { date: "Feb", value: 27.8 },
    { date: "Mar", value: 28.2 },
    { date: "Apr", value: 28.5 },
    { date: "May", value: 28.0 },
    { date: "Jun", value: 28.2 },
    { date: "Jul", value: 28.0 },
  ],
};

const medications = [
  { id: "1", name: "Amoxicillin", dosage: "250mg", schedule: "Twice daily", status: "completed", time: "8:00 AM" },
  { id: "2", name: "Rimadyl", dosage: "75mg", schedule: "Once daily", status: "upcoming", time: "12:30 PM" },
  { id: "3", name: "Heartgard", dosage: "1 chew", schedule: "Monthly", status: "upcoming", time: "Tomorrow" },
  { id: "4", name: "Vitamin B", dosage: "1 tablet", schedule: "Once daily", status: "missed", time: "Yesterday" },
];

const activities = [
  { id: "1", type: "Walk", duration: "30 min", date: "Today", intensity: "medium" },
  { id: "2", type: "Play", duration: "15 min", date: "Yesterday", intensity: "high" },
  { id: "3", type: "Training", duration: "20 min", date: "2 days ago", intensity: "medium" },
  { id: "4", type: "Rest", duration: "All day", date: "3 days ago", intensity: "low" },
];

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardHeader 
          title="Animal Health Dashboard" 
          subtitle="Monitor health metrics and activities for your animals"
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {animals.map((animal, index) => (
            <div key={animal.id} className="col-span-1">
              <AnimalProfileCard animal={animal} />
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="col-span-1">
            <HealthMetricsCard metrics={healthMetrics} />
          </div>
          <div className="col-span-1 lg:col-span-2">
            <VitalSignsChart data={chartData} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <MedicationTracker medications={medications} />
          </div>
          <div>
            <ActivityLog activities={activities} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
