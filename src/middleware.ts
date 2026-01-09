import { auth } from "@/auth";
import {AppRoutes} from "@/routes";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;


  if (pathname.startsWith(AppRoutes.dashboard()) && !isLoggedIn) {
    return Response.redirect(new URL(AppRoutes.auth(), req.nextUrl));
  }

  if (pathname.startsWith(AppRoutes.auth()) && isLoggedIn) {
    return Response.redirect(new URL(AppRoutes.dashboard(), req.nextUrl));
  }
});

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
