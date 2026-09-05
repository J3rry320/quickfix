import { apiSuccess } from "@/lib/api/response";

export async function POST() {
  const response = apiSuccess({ loggedOut: true });

  response.cookies.set({
    name: "admin_session",
    value: "",
    maxAge: 0,
    path: "/",
    httpOnly: true,
  });

  return response;
}

export async function GET() {
  return POST();
}
