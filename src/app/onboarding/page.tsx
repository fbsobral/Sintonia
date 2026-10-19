import { redirect } from "next/navigation";
import { getUser } from "@/lib/session";
import { OnboardingFlow } from "@/components/OnboardingFlow";

export const metadata = { title: "Começar" };

export default async function Onboarding() {
  const user = await getUser();
  if (user.partner) redirect("/hoje");
  return <OnboardingFlow />;
}
