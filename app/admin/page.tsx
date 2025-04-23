import { redirect } from "next/navigation"
import { adminRoutes } from "./routes"

export default function AdminPage() {
  redirect(adminRoutes.dashboard)
}
