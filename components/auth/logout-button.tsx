"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/use-auth-store";
import { Button } from "@/components/ui/button";

type LogoutButtonProps = {
  className?: string;
};

export function LogoutButton({ className }: LogoutButtonProps) {
  const router = useRouter();
  const setProfile = useAuthStore((state) => state.setProfile);

  async function onLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setProfile(null);
    toast.success("Logged out");
    router.push("/login");
    router.refresh();
  }

  return (
    <Button variant="outline" className={className} onClick={onLogout}>
      Logout
    </Button>
  );
}
