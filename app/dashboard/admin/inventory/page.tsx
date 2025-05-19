"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Search, Package, AlertTriangle } from "lucide-react"
import { useState } from "react"

// Mock data for inventory items
const inventoryItems = [
  {
    id: 1,
    name: "Spare Tires - Heavy Duty",
    sku: "TIRE-HD-001",
    category: "Vehicle Parts",
    quantity: 45,
    threshold: 20,
    location: "Warehouse A",
    lastUpdated: "2023-04-10",
  },
  {
    id: 2,
    name: "Engine Oil - 15W40",
    sku: "OIL-15W40",
    category: "Fluids",
    quantity: 120,
    threshold: 50,
    location: "Warehouse B",
    lastUpdated: "2023-04-12",
  },
  {
    id: 3,
    name: "Brake Pads - Heavy Truck",
    sku: "BRAKE-HT-002",
    category: "Vehicle Parts",
    quantity: 18,
    threshold: 25,
    location: "Warehouse A",
    lastUpdated: "2023-04-08",
  },
  {
    id: 4,
    name: "Air Filters - Standard",
    sku: "FILTER-AIR-STD",
    category: "Filters",
    quantity: 65,
    threshold: 30,
    location: "Warehouse C",
    lastUpdated: "2023-04-14",
  },
  {
    id: 5,
    name: "Hydraulic Fluid",
    sku: "FLUID-HYD-001",
    category: "Fluids",
    quantity: 32,
    threshold: 20,
    location: "Warehouse B",
    lastUpdated: "2023-04-11",
  },
]

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredItems = inventoryItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Inventory Management</h1>
        <Button className="bg-orange-600 hover:bg-orange-700">
          <Package className="mr-2 h-4 w-4" />
          Add Inventory Item
        </Button>
      </div>

      <Alert className="bg-yellow-50 border-yellow-200">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertTitle className="text-yellow-600">Coming Soon</AlertTitle>
        <AlertDescription>
          The full inventory management system is under development. This page currently shows placeholder data.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">347</div>
            <p className="text-sm text-gray-500">Across all warehouses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">12</div>
            <p className="text-sm text-gray-500">Items below threshold</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Out of Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">3</div>
            <p className="text-sm text-gray-500">Items to reorder</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>Track and manage your inventory levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="search"
                placeholder="Search inventory..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Threshold</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      {item.quantity}
                      {item.quantity < item.threshold ? (
                        <AlertTriangle className="inline-block ml-1 h-4 w-4 text-orange-500" />
                      ) : null}
                    </TableCell>
                    <TableCell>{item.threshold}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>{item.lastUpdated}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
