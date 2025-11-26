import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "My Account - Aunty Suzy",
  description: "Manage your Aunty Suzy membership account",
}

export default function AccountPage() {
  // TODO: This would connect to authentication
  const isLoggedIn = false

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-12">
        <div className="box-container max-w-md">
          <Card className="p-8">
            <h1 className="font-serif text-3xl text-foreground mb-4">My Account</h1>
            <p className="text-muted-foreground mb-8">
              Sign in to manage your membership, view orders, and update your preferences.
            </p>
            <div className="space-y-3">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Sign In</Button>
              <Button variant="outline" className="w-full bg-transparent">
                Create Account
              </Button>
            </div>
            <div className="mt-6 p-4 bg-accent rounded-lg">
              <p className="text-sm text-accent-foreground">
                <strong>Demo Info:</strong> This account page is ready for authentication integration. Connect with
                Supabase or your preferred auth provider to enable login.
              </p>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="box-container py-12">
        <h1 className="font-serif text-4xl text-foreground mb-12">My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="space-y-2">
            {[
              { label: "Dashboard", active: true },
              { label: "My Membership", active: false },
              { label: "Orders", active: false },
              { label: "Preferences", active: false },
              { label: "Billing", active: false },
            ].map((item) => (
              <button
                key={item.label}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  item.active ? "bg-primary text-primary-foreground font-semibold" : "text-foreground hover:bg-muted"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Welcome */}
            <Card className="p-8 bg-gradient-to-br from-primary/10 to-secondary/10">
              <h2 className="font-serif text-2xl text-foreground mb-2">Welcome back!</h2>
              <p className="text-muted-foreground">Your next box ships on December 15th.</p>
            </Card>

            {/* Membership Status */}
            <Card className="p-8">
              <h3 className="font-serif text-xl text-foreground mb-6">Your Membership</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-start pb-4 border-b border-border">
                  <div>
                    <p className="font-semibold text-foreground">Discovery Member</p>
                    <p className="text-sm text-muted-foreground">£35 per month</p>
                  </div>
                  <span className="bg-secondary/20 text-secondary px-3 py-1 rounded-full text-sm font-semibold">
                    Active
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Next billing date</p>
                    <p className="font-semibold text-foreground">December 15, 2024</p>
                  </div>
                  <Button variant="outline">Manage Subscription</Button>
                </div>
              </div>
            </Card>

            {/* Recent Orders */}
            <Card className="p-8">
              <h3 className="font-serif text-xl text-foreground mb-6">Recent Orders</h3>
              <div className="space-y-4">
                {[
                  {
                    order: "#AS-001",
                    date: "November 15, 2024",
                    status: "Delivered",
                  },
                  {
                    order: "#AS-002",
                    date: "October 15, 2024",
                    status: "Delivered",
                  },
                ].map((order) => (
                  <div
                    key={order.order}
                    className="flex justify-between items-center pb-4 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="font-semibold text-foreground">{order.order}</p>
                      <p className="text-sm text-muted-foreground">{order.date}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
