// middleware.ts
import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;


  if (pathname.startsWith("/dashboard") && !isLoggedIn) {
    return Response.redirect(new URL("/auth", req.nextUrl));
  }

  if (pathname.startsWith("/auth") && isLoggedIn) {
    return Response.redirect(new URL("/dashboard", req.nextUrl));
  }
});

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
