import Card from '../components/common/Card'
import ThemeToggle from '../components/layout/ThemeToggle'

export default function Settings() {
  return (
    <div className="space-y-6">
      <h2 className="text-white text-xl font-bold">Settings</h2>
      <Card className="max-w-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-medium">Dark Mode</p>
            <p className="text-gray-400 text-sm">Toggle between dark and light theme</p>
          </div>
          <ThemeToggle />
        </div>
      </Card>
    </div>
  )
}