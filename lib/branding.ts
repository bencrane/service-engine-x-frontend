export interface Branding {
  readonly name: string;
  readonly initial: string;
  readonly supportEmail: string;
}

/**
 * Get branding based on the current domain.
 * Call this from client components using window.location.hostname.
 */
export function getBrandingFromDomain(hostname: string): Branding {
  const domain = hostname.toLowerCase();

  if (domain.includes("revenueactivation")) {
    return {
      name: "Revenue Activation",
      initial: "R",
      supportEmail: "team@revenueactivation.com",
    };
  }

  if (domain.includes("outboundsolutions")) {
    return {
      name: "Outbound Solutions",
      initial: "O",
      supportEmail: "team@outboundsolutions.com",
    };
  }

  // Default branding
  return {
    name: "Service Engine",
    initial: "S",
    supportEmail: "team@serviceengine.xyz",
  };
}

/**
 * Hook-friendly version for client components.
 * Returns default branding during SSR, actual branding on client.
 */
export function getDefaultBranding(): Branding {
  return {
    name: "Service Engine",
    initial: "S",
    supportEmail: "team@serviceengine.xyz",
  };
}
