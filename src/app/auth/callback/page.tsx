"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/client";

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    const handleAuth = async () => {
      // 1. Extract tokens from URL fragment
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.replace("#", ""));
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");
      const supabase = createClient();

      if (!access_token || !refresh_token) {
        setError("Invalid authentication. Please log in again.");
        router.push("/login");
        return;
      }

      // 2. Set the session in Supabase using the tokens
      const { error: setSessionError } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      console.log("setSessionError", setSessionError);

      if (setSessionError) {
        setError("Failed to set session. Please try again.");
        router.push("/login");
        return;
      }

      // 3. Verify the session by fetching the user
      const { data, error: getUserError } = await supabase.auth.getUser();
      if (getUserError || !data?.user) {
        setError("Invalid token. Please log in again.");
        router.push("/login");
        return;
      }
      console.log("getUserError", getUserError);

      // 4. Remove tokens from URL for security
      window.history.replaceState(null, "", "/auth/callback");

      // 5. Redirect to dashboard after successful authentication
      router.replace("/dashboard"); // Replaces the current route
      window.location.href = "/dashboard"; // Forces a full page reload
      console.log("no redirect");
    };

    handleAuth();
  }, [router]);

  if (error) return <p className="text-red-500">{error}</p>;
  return <p>Verifying your email...</p>;
}
