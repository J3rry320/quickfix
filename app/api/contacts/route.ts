import { NextRequest } from "next/server";
import { ContactSubmission } from "@/models/ContactSubmission";
import { withPublicApi } from "@/lib/api/public";
import { apiSuccess } from "@/lib/api/response";
import { createContactSchema } from "@/lib/api/validators";

export const POST = withPublicApi(
  async (request: NextRequest) => {
    const body = await request.json();
    const validatedData = createContactSchema.parse(body);

    const submission = await ContactSubmission.create({
      ...validatedData,
      status: "new",
    });

    return apiSuccess(
      {
        message: "Your message has been received. Our team will contact you shortly.",
        submissionId: submission._id,
      },
      201
    );
  },
  { csrf: true, rateLimitType: "auth" }
);
