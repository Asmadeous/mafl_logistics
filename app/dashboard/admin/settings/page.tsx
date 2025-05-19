"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { LayoutDashboard, Bell, Palette, Shield, BarChart, Settings, Users } from "lucide-react"

export default function DashboardSettingsPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Mock admin data - in a real app, this would come from your auth context
  const adminData = {
    name: "Admin User",
    email: "admin@mafl-logistics.com",
    avatar: "/confident-leader.png",
    role: "Administrator",
  }

  const handleSave = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Settings</h1>
        <p className="text-muted-foreground">Configure your dashboard experience and preferences.</p>
      </div>

      <Tabs defaultValue="layout" className="w-full">
        <TabsList className="grid grid-cols-5 w-full max-w-3xl mb-8">
          <TabsTrigger value="layout" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Layout</span>
          </TabsTrigger>
          <TabsTrigger value="widgets" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span className="hidden sm:inline">Widgets</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="access" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Access</span>
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Layout Settings */}
        <TabsContent value="layout" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Layout</CardTitle>
              <CardDescription>Customize how your dashboard is organized and displayed.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Layout Options</h3>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="compact-mode">Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Use a more compact layout to fit more content on screen.
                      </p>
                    </div>
                    <Switch id="compact-mode" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sidebar-collapsed">Start with Collapsed Sidebar</Label>
                      <p className="text-sm text-muted-foreground">
                        Sidebar will be collapsed by default when you load the dashboard.
                      </p>
                    </div>
                    <Switch id="sidebar-collapsed" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sticky-header">Sticky Header</Label>
                      <p className="text-sm text-muted-foreground">
                        Keep the dashboard header visible while scrolling.
                      </p>
                    </div>
                    <Switch id="sticky-header" defaultChecked />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Default View</h3>
                <RadioGroup defaultValue="overview" className="grid gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="overview" id="overview" />
                    <Label htmlFor="overview">Overview (Summary of all key metrics)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="analytics" id="analytics" />
                    <Label htmlFor="analytics">Analytics (Detailed charts and reports)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="activity" id="activity" />
                    <Label htmlFor="activity">Activity (Recent actions and events)</Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Dashboard Sections Order</h3>
                <p className="text-sm text-muted-foreground">Drag and drop to reorder dashboard sections.</p>
                <div className="space-y-2 border rounded-md p-4">
                  <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <div className="flex items-center">
                      <span className="text-muted-foreground mr-2">1</span>
                      <span>Key Performance Indicators</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <div className="flex items-center">
                      <span className="text-muted-foreground mr-2">2</span>
                      <span>Recent Orders</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <div className="flex items-center">
                      <span className="text-muted-foreground mr-2">3</span>
                      <span>Revenue Charts</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <div className="flex items-center">
                      <span className="text-muted-foreground mr-2">4</span>
                      <span>Upcoming Appointments</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Reset to Default</Button>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Dashboard Widgets Settings */}
        <TabsContent value="widgets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Widgets</CardTitle>
              <CardDescription>Configure which widgets appear on your dashboard and how they behave.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Widget Visibility</h3>
                <div className="grid gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="widget-kpi" defaultChecked />
                    <div className="grid gap-1.5">
                      <Label htmlFor="widget-kpi">Key Performance Indicators</Label>
                      <p className="text-sm text-muted-foreground">Show summary of key business metrics.</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="widget-orders" defaultChecked />
                    <div className="grid gap-1.5">
                      <Label htmlFor="widget-orders">Recent Orders</Label>
                      <p className="text-sm text-muted-foreground">Display the most recent customer orders.</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="widget-revenue" defaultChecked />
                    <div className="grid gap-1.5">
                      <Label htmlFor="widget-revenue">Revenue Charts</Label>
                      <p className="text-sm text-muted-foreground">Show revenue trends and comparisons.</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="widget-appointments" defaultChecked />
                    <div className="grid gap-1.5">
                      <Label htmlFor="widget-appointments">Upcoming Appointments</Label>
                      <p className="text-sm text-muted-foreground">Display scheduled appointments and meetings.</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="widget-inventory" defaultChecked />
                    <div className="grid gap-1.5">
                      <Label htmlFor="widget-inventory">Inventory Status</Label>
                      <p className="text-sm text-muted-foreground">Show inventory levels and alerts.</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="widget-activity" defaultChecked />
                    <div className="grid gap-1.5">
                      <Label htmlFor="widget-activity">Recent Activity</Label>
                      <p className="text-sm text-muted-foreground">Display recent system activities and events.</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Widget Display Options</h3>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="widget-refresh">Widget Auto-Refresh Interval</Label>
                    <Select defaultValue="5">
                      <SelectTrigger>
                        <SelectValue placeholder="Select refresh interval" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Never</SelectItem>
                        <SelectItem value="1">Every minute</SelectItem>
                        <SelectItem value="5">Every 5 minutes</SelectItem>
                        <SelectItem value="15">Every 15 minutes</SelectItem>
                        <SelectItem value="30">Every 30 minutes</SelectItem>
                        <SelectItem value="60">Every hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="data-range">Default Date Range for Reports</Label>
                    <Select defaultValue="7">
                      <SelectTrigger>
                        <SelectValue placeholder="Select date range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Today</SelectItem>
                        <SelectItem value="7">Last 7 days</SelectItem>
                        <SelectItem value="30">Last 30 days</SelectItem>
                        <SelectItem value="90">Last quarter</SelectItem>
                        <SelectItem value="365">Last year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Custom Widgets</h3>
                <p className="text-sm text-muted-foreground">Add custom widgets to your dashboard.</p>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Custom Widgets
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Reset to Default</Button>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Dashboard Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Notifications</CardTitle>
              <CardDescription>Configure which dashboard notifications you receive and how.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Dashboard Alerts</h3>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="alert-orders">New Orders</Label>
                      <p className="text-sm text-muted-foreground">Receive alerts when new orders are placed.</p>
                    </div>
                    <Switch id="alert-orders" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="alert-inventory">Inventory Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when inventory items are running low.
                      </p>
                    </div>
                    <Switch id="alert-inventory" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="alert-appointments">Appointment Reminders</Label>
                      <p className="text-sm text-muted-foreground">Receive reminders about upcoming appointments.</p>
                    </div>
                    <Switch id="alert-appointments" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="alert-system">System Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified about system updates and maintenance.
                      </p>
                    </div>
                    <Switch id="alert-system" defaultChecked />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Alert Thresholds</h3>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="threshold-inventory">Low Inventory Threshold (%)</Label>
                    <Input id="threshold-inventory" type="number" defaultValue="20" min="1" max="100" />
                    <p className="text-sm text-muted-foreground">
                      Alert when inventory falls below this percentage of maximum stock.
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="threshold-revenue">Revenue Alert Threshold (%)</Label>
                    <Input id="threshold-revenue" type="number" defaultValue="15" min="1" max="100" />
                    <p className="text-sm text-muted-foreground">
                      Alert when revenue drops more than this percentage compared to previous period.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Delivery</h3>
                <div className="grid gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="notify-dashboard" defaultChecked />
                    <Label htmlFor="notify-dashboard">Dashboard Notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="notify-email" defaultChecked />
                    <Label htmlFor="notify-email">Email Notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="notify-browser" defaultChecked />
                    <Label htmlFor="notify-browser">Browser Notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="notify-mobile" />
                    <Label htmlFor="notify-mobile">Mobile Push Notifications</Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Reset to Default</Button>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Dashboard Appearance Settings */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Appearance</CardTitle>
              <CardDescription>Customize how your dashboard looks and feels.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Theme</h3>
                <RadioGroup defaultValue="system" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col items-center gap-2 border rounded-md p-4 cursor-pointer hover:bg-accent">
                    <div className="h-20 w-full bg-white border rounded-md"></div>
                    <RadioGroupItem value="light" id="theme-light" className="sr-only" />
                    <Label htmlFor="theme-light" className="font-medium cursor-pointer">
                      Light
                    </Label>
                  </div>
                  <div className="flex flex-col items-center gap-2 border rounded-md p-4 cursor-pointer hover:bg-accent">
                    <div className="h-20 w-full bg-gray-900 border rounded-md"></div>
                    <RadioGroupItem value="dark" id="theme-dark" className="sr-only" />
                    <Label htmlFor="theme-dark" className="font-medium cursor-pointer">
                      Dark
                    </Label>
                  </div>
                  <div className="flex flex-col items-center gap-2 border rounded-md p-4 cursor-pointer hover:bg-accent">
                    <div className="h-20 w-full bg-gradient-to-r from-white to-gray-900 border rounded-md"></div>
                    <RadioGroupItem value="system" id="theme-system" className="sr-only" />
                    <Label htmlFor="theme-system" className="font-medium cursor-pointer">
                      System
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Color Scheme</h3>
                <RadioGroup defaultValue="default" className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="flex flex-col items-center gap-2 border rounded-md p-4 cursor-pointer hover:bg-accent">
                    <div className="h-10 w-full bg-blue-600 rounded-md"></div>
                    <RadioGroupItem value="default" id="color-default" className="sr-only" />
                    <Label htmlFor="color-default" className="font-medium cursor-pointer">
                      Default
                    </Label>
                  </div>
                  <div className="flex flex-col items-center gap-2 border rounded-md p-4 cursor-pointer hover:bg-accent">
                    <div className="h-10 w-full bg-green-600 rounded-md"></div>
                    <RadioGroupItem value="green" id="color-green" className="sr-only" />
                    <Label htmlFor="color-green" className="font-medium cursor-pointer">
                      Green
                    </Label>
                  </div>
                  <div className="flex flex-col items-center gap-2 border rounded-md p-4 cursor-pointer hover:bg-accent">
                    <div className="h-10 w-full bg-purple-600 rounded-md"></div>
                    <RadioGroupItem value="purple" id="color-purple" className="sr-only" />
                    <Label htmlFor="color-purple" className="font-medium cursor-pointer">
                      Purple
                    </Label>
                  </div>
                  <div className="flex flex-col items-center gap-2 border rounded-md p-4 cursor-pointer hover:bg-accent">
                    <div className="h-10 w-full bg-orange-600 rounded-md"></div>
                    <RadioGroupItem value="orange" id="color-orange" className="sr-only" />
                    <Label htmlFor="color-orange" className="font-medium cursor-pointer">
                      Orange
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Data Visualization</h3>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="chart-style">Chart Style</Label>
                    <Select defaultValue="modern">
                      <SelectTrigger>
                        <SelectValue placeholder="Select chart style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="classic">Classic</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="colorful">Colorful</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="animate-charts">Animate Charts</Label>
                      <p className="text-sm text-muted-foreground">Enable animations in charts and graphs.</p>
                    </div>
                    <Switch id="animate-charts" defaultChecked />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Accessibility</h3>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="high-contrast">High Contrast Mode</Label>
                      <p className="text-sm text-muted-foreground">Increase contrast for better visibility.</p>
                    </div>
                    <Switch id="high-contrast" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="large-text">Larger Text</Label>
                      <p className="text-sm text-muted-foreground">Increase text size throughout the dashboard.</p>
                    </div>
                    <Switch id="large-text" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="reduced-motion">Reduce Motion</Label>
                      <p className="text-sm text-muted-foreground">Minimize animations and transitions.</p>
                    </div>
                    <Switch id="reduced-motion" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Reset to Default</Button>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Dashboard Access Settings */}
        <TabsContent value="access" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Access & Permissions</CardTitle>
              <CardDescription>Manage who can access your dashboard and what they can see.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Dashboard Sharing</h3>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="share-reports">Share Reports</Label>
                      <p className="text-sm text-muted-foreground">Allow sharing dashboard reports with other users.</p>
                    </div>
                    <Switch id="share-reports" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="public-dashboards">Public Dashboards</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow creation of public dashboard views with restricted data.
                      </p>
                    </div>
                    <Switch id="public-dashboards" />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Data Export Options</h3>
                <div className="grid gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="export-pdf" defaultChecked />
                    <Label htmlFor="export-pdf">PDF Export</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="export-excel" defaultChecked />
                    <Label htmlFor="export-excel">Excel Export</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="export-csv" defaultChecked />
                    <Label htmlFor="export-csv">CSV Export</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="export-image" defaultChecked />
                    <Label htmlFor="export-image">Image Export</Label>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Team Access</h3>
                <p className="text-sm text-muted-foreground">Manage which team members can access this dashboard.</p>
                <div className="border rounded-md divide-y">
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/confident-leader.png" alt="Jane Smith" />
                        <AvatarFallback>JS</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">Jane Smith</p>
                        <p className="text-xs text-muted-foreground">Operations Manager</p>
                      </div>
                    </div>
                    <Select defaultValue="edit">
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Select access" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="view">View Only</SelectItem>
                        <SelectItem value="edit">Can Edit</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="none">No Access</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/confident-fleet-manager.png" alt="John Doe" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">John Doe</p>
                        <p className="text-xs text-muted-foreground">Fleet Manager</p>
                      </div>
                    </div>
                    <Select defaultValue="view">
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Select access" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="view">View Only</SelectItem>
                        <SelectItem value="edit">Can Edit</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="none">No Access</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/focused-logistics-professional.png" alt="Sarah Johnson" />
                        <AvatarFallback>SJ</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">Sarah Johnson</p>
                        <p className="text-xs text-muted-foreground">Logistics Coordinator</p>
                      </div>
                    </div>
                    <Select defaultValue="view">
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Select access" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="view">View Only</SelectItem>
                        <SelectItem value="edit">Can Edit</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="none">No Access</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Users className="h-4 w-4 mr-2" />
                  Invite Team Member
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Reset to Default</Button>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
