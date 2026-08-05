import { Storefront } from "@/components/Storefront";
import { getTenant } from "@/tenants";

export default function HomePage() {
  return <Storefront tenant={getTenant()} />;
}
