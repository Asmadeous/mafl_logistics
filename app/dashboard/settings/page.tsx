"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/hooks/use-toast"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)
  const [language, setLanguage] = useState("english")
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveSettings = () => {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
      })
    }, 1000)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how the application looks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label className="text-base">Theme</Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    className="flex flex-col items-center justify-center h-24"
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="h-6 w-6 mb-2" />
                    <span>Light</span>
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    className="flex flex-col items-center justify-center h-24"
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="h-6 w-6 mb-2" />
                    <span>Dark</span>
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    className="flex flex-col items-center justify-center h-24"
                    onClick={() => setTheme("system")}
                  >
                    <div className="flex">
                      <Sun className="h-6 w-6" />
                      <Moon className="h-6 w-6" />
                    </div>
                    <span className="mt-2">System</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage your notification preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications in the app</p>
                </div>
                <Switch id="push-notifications" checked={pushNotifications} onCheckedChange={setPushNotifications} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="marketing-emails">Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">Receive marketing and promotional emails</p>
                </div>
                <Switch id="marketing-emails" checked={marketingEmails} onCheckedChange={setMarketingEmails} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Language</CardTitle>
            <CardDescription>Choose your preferred language</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={language} onValueChange={setLanguage}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="english" id="english" />
                <Label htmlFor="english">English</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="french" id="french" />
                <Label htmlFor="french">French</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="spanish" id="spanish" />
                <Label htmlFor="spanish">Spanish</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="swahili" id="swahili" />
                <Label htmlFor="swahili">Swahili</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Privacy</CardTitle>
            <CardDescription>Manage your privacy settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="data-collection">Data Collection</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow us to collect usage data to improve our services
                  </p>
                </div>
                <Switch id="data-collection" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="third-party">Third-Party Sharing</Label>
                  <p className="text-sm text-muted-foreground">Allow sharing data with trusted partners</p>
                </div>
                <Switch id="third-party" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSaveSettings} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  )
}
