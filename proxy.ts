import { auth } from "@/auth";

// Используем export default, так как auth() возвращает готовую функцию-обработчик.
// Это соответствует требованию "The file must export a single function, either as a default export..."
export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // Логика редиректов
  const isOnDashboard = pathname.startsWith("/dashboard");
  const isOnAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");

  // 1. Если юзер хочет на Dashboard, но не вошел -> Login
  if (isOnDashboard && !isLoggedIn) {
    return Response.redirect(new URL("/login", req.nextUrl));
  }

  // 2. Если юзер уже вошел и пытается открыть Login -> Dashboard
  if (isOnAuthPage && isLoggedIn) {
    return Response.redirect(new URL("/dashboard", req.nextUrl));
  }
});

// Конфигурация матчера
export const config = {
  // Исключаем API auth, статику и системные файлы
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};