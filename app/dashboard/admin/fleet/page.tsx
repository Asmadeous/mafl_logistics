"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Search, Truck, AlertTriangle, Plus, Filter, ChevronDown, MoreHorizontal, Download } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"
import Link from "next/link"

// Mock fleet data
const vehicles = [
  {
    id: "TRK-001",
    type: "Heavy Duty Truck",
    make: "Volvo",
    model: "FH16",
    year: 2023,
    licensePlate: "KDD 123A",
    status: "Active",
    driver: "James Mwangi",
    location: "Nairobi",
    lastService: "Mar 15, 2025",
  },
  {
    id: "TRK-002",
    type: "Heavy Duty Truck",
    make: "Mercedes-Benz",
    model: "Actros",
    year: 2022,
    licensePlate: "KDE 456B",
    status: "Active",
    driver: "Peter Kamau",
    location: "Mombasa",
    lastService: "Apr 2, 2025",
  },
  {
    id: "TRK-003",
    type: "Medium Duty Truck",
    make: "Isuzu",
    model: "FTR",
    year: 2021,
    licensePlate: "KDF 789C",
    status: "In Maintenance",
    driver: "Unassigned",
    location: "Nairobi Workshop",
    lastService: "Apr 20, 2025",
  },
  {
    id: "TRK-004",
    type: "Heavy Duty Truck",
    make: "Scania",
    model: "R500",
    year: 2023,
    licensePlate: "KDG 012D",
    status: "Active",
    driver: "John Omondi",
    location: "Kisumu",
    lastService: "Feb 28, 2025",
  },
  {
    id: "TRK-005",
    type: "Flatbed Truck",
    make: "MAN",
    model: "TGX",
    year: 2022,
    licensePlate: "KDH 345E",
    status: "Active",
    driver: "Samuel Kipchirchir",
    location: "Nakuru",
    lastService: "Mar 10, 2025",
  },
  {
    id: "TRK-006",
    type: "Container Truck",
    make: "Volvo",
    model: "FM",
    year: 2021,
    licensePlate: "KDJ 678F",
    status: "Out of Service",
    driver: "Unassigned",
    location: "Mombasa Workshop",
    lastService: "Apr 15, 2025",
  },
  {
    id: "EQP-001",
    type: "Excavator",
    make: "Caterpillar",
    model: "336",
    year: 2020,
    licensePlate: "N/A",
    status: "Active",
    driver: "David Mutua",
    location: "Makueni",
    lastService: "Mar 5, 2025",
  },
  {
    id: "EQP-002",
    type: "Bulldozer",
    make: "Komatsu",
    model: "D85EX",
    year: 2021,
    licensePlate: "N/A",
    status: "Active",
    driver: "George Otieno",
    location: "Kajiado",
    lastService: "Apr 10, 2025",
  },
]

export default function FleetPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Fleet Management</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Vehicle
          </Button>
        </div>
      </div>

      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Coming Soon</AlertTitle>
        <AlertDescription>
          The full fleet management system is under development. Soon you'll be able to:
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Track vehicle locations in real-time with GPS</li>
            <li>Monitor fuel consumption and efficiency</li>
            <li>Schedule and track maintenance activities</li>
            <li>Manage driver assignments and schedules</li>
            <li>Generate fleet performance reports</li>
            <li>Set up preventive maintenance alerts</li>
            <li>Track vehicle expenses and total cost of ownership</li>
          </ul>
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
            <Truck className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-muted-foreground">+3 from last quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <div className="h-4 w-4 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">26</div>
            <p className="text-xs text-muted-foreground">81% of fleet</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">In Maintenance</CardTitle>
            <div className="h-4 w-4 rounded-full bg-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">13% of fleet</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Out of Service</CardTitle>
            <div className="h-4 w-4 rounded-full bg-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">6% of fleet</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fleet Inventory</CardTitle>
          <CardDescription>Manage your vehicles and equipment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search fleet..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-1">
                      <Filter className="h-4 w-4" />
                      <span>Filter</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuItem>All Vehicles</DropdownMenuItem>
                    <DropdownMenuItem>Trucks</DropdownMenuItem>
                    <DropdownMenuItem>Heavy Equipment</DropdownMenuItem>
                    <DropdownMenuItem>Active</DropdownMenuItem>
                    <DropdownMenuItem>In Maintenance</DropdownMenuItem>
                    <DropdownMenuItem>Out of Service</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Make/Model</TableHead>
                    <TableHead>License Plate</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Service</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell className="font-medium">{vehicle.id}</TableCell>
                      <TableCell>{vehicle.type}</TableCell>
                      <TableCell>{`${vehicle.make} ${vehicle.model} (${vehicle.year})`}</TableCell>
                      <TableCell>{vehicle.licensePlate}</TableCell>
                      <TableCell>{vehicle.driver}</TableCell>
                      <TableCell>{vehicle.location}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            vehicle.status === "Active"
                              ? "default"
                              : vehicle.status === "In Maintenance"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {vehicle.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{vehicle.lastService}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Link href={`/dashboard/admin/fleet/${vehicle.id}`} className="w-full">
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Update Status</DropdownMenuItem>
                            <DropdownMenuItem>Schedule Maintenance</DropdownMenuItem>
                            <DropdownMenuItem>Assign Driver</DropdownMenuItem>
                            <DropdownMenuItem>View Service History</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
