import { Section } from "@/components/ui/section";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      <Section title="Account">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Email notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive updates about your orders via email
              </p>
            </div>
            <div className="text-sm text-muted-foreground">Coming soon</div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">SMS notifications</p>
              <p className="text-sm text-muted-foreground">
                Get text alerts for important updates
              </p>
            </div>
            <div className="text-sm text-muted-foreground">Coming soon</div>
          </div>
        </div>
      </Section>

      <Section title="Support">
        <div className="space-y-2">
          <p className="text-muted-foreground">
            Need help? Contact your service provider:
          </p>
          <a
            href="mailto:support@serviceengine.xyz"
            className="font-medium text-primary hover:underline"
          >
            support@serviceengine.xyz
          </a>
        </div>
      </Section>
    </div>
  );
}
