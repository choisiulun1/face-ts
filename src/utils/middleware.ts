import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );
  console.log("API URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

  // Get user session
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // Define protected routes

  const protectedRoutes = ["/dashboard", "/profile", "/settings"];

  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  if (!user && isProtectedRoute) {
    // Redirect to login only for protected routes
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  if (
    user &&
    (request.nextUrl.pathname === "/login" || request.nextUrl.pathname == "/")
  ) {
    // Redirect to dashboard if user is logged in
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
