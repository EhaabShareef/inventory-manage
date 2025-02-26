"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Users, Package, List, AlertCircle } from 'lucide-react';
import { getDashboardStats } from "@/actions/dashboard";
import { DashboardStats } from "@/types/inventory";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    getDashboardStats().then(setStats);
  }, []);

  if (!stats) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Welcome, {stats.currentUser.username}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <Card className="col-span-1 md:col-span-3 lg:col-span-4 bg-yellow-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium text-yellow-800">Attention Needed</CardTitle>
            <AlertTriangle className="h-6 w-6 text-yellow-800" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-yellow-800">{stats.expiredItems} items with expired prices</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <List className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCategories}</div>
          </CardContent>
        </Card>
        <Card className="col-span-1 md:col-span-3 lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Recently Expired Items</CardTitle>
            <AlertCircle className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {stats.recentlyExpiredItems.map((item) => (
                <li key={item.id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                  <span>{item.itemName}</span>
                  <span className="text-sm text-gray-500">{item.category.name}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}