export const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/verify",
  "/verification",
  "/forgot-password",
  "/not-authorized",
];

// Add authenticated routes
export const AUTHENTICATED_ROUTES = [
  "/profile",
  "/settings",
  "/dashboard",
  "/bilikku",
];

export const AUTHORIZATION_ROUTES = [
  {
    role: "admin",
    allowRouteStartWith: ["/profile", "/dashboard"],
  },
  {
    role: "guest",
    allowRouteStartWith: ["/profile", "/bilikku"],
  },
];
