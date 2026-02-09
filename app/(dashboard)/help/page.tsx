"use client";

import { useEffect, useState } from "react";
import { Mail, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getBrandingFromDomain, getDefaultBranding, type Branding } from "@/lib/branding";

export default function HelpPage() {
  const [branding, setBranding] = useState<Branding>(getDefaultBranding);

  useEffect(() => {
    setBranding(getBrandingFromDomain(window.location.hostname));
  }, []);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Help & Support
        </h1>
        <p className="mt-1 text-muted-foreground">
          Get in touch with your project team
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="transition-colors hover:bg-accent/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Mail className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Email Support</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Send us an email and we'll respond within 24 hours.
                </p>
                <a
                  href={`mailto:${branding.supportEmail}`}
                  className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
                >
                  {branding.supportEmail}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-colors hover:bg-accent/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Start a Conversation</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Message your project team directly through the portal.
                </p>
                <a
                  href="/conversations"
                  className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
                >
                  Go to Conversations
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
