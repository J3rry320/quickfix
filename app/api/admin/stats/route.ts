import { RepairRequest } from "@/models/RepairRequest";
import { Brand } from "@/models/Brand";
import { DeviceModel } from "@/models/DeviceModel";
import { RepairService } from "@/models/RepairService";
import { ContactSubmission } from "@/models/ContactSubmission";
import { BlogPost } from "@/models/BlogPost";
import { withAdminAuth } from "@/lib/api/auth";
import { apiSuccess } from "@/lib/api/response";

export const GET = withAdminAuth(async () => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [
    totalRepairs,
    pendingRepairs,
    inProgressRepairs,
    completedRepairs,
    cancelledRepairs,
    todayRepairs,
    totalBrands,
    activeBrands,
    totalModels,
    totalServices,
    activeServices,
    totalContacts,
    newContacts,
    inProgressContacts,
    resolvedContacts,
    totalBlogs,
    publishedBlogs,
    recentRequests,
    recentContacts,
  ] = await Promise.all([
    RepairRequest.countDocuments(),
    RepairRequest.countDocuments({ status: "pending" }),
    RepairRequest.countDocuments({
      status: { $in: ["confirmed", "in_progress"] },
    }),
    RepairRequest.countDocuments({ status: "completed" }),
    RepairRequest.countDocuments({ status: "cancelled" }),
    RepairRequest.countDocuments({ createdAt: { $gte: startOfToday } }),

    Brand.countDocuments(),
    Brand.countDocuments({ isActive: true }),

    DeviceModel.countDocuments(),

    RepairService.countDocuments(),
    RepairService.countDocuments({ isActive: true }),

    ContactSubmission.countDocuments(),
    ContactSubmission.countDocuments({ status: "new" }),
    ContactSubmission.countDocuments({ status: "in_progress" }),
    ContactSubmission.countDocuments({ status: "resolved" }),

    BlogPost.countDocuments(),
    BlogPost.countDocuments({ status: "published" }),

    RepairRequest.find()
      .populate("service", "name slug startingPrice")
      .sort({ createdAt: -1 })
      .limit(5)
      .select("bookingReference customer device service pricing status createdAt")
      .lean(),

    ContactSubmission.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name phone email subject status createdAt")
      .lean(),
  ]);

  return apiSuccess({
    stats: {
      repairs: {
        total: totalRepairs,
        pending: pendingRepairs,
        inProgress: inProgressRepairs,
        completed: completedRepairs,
        cancelled: cancelledRepairs,
        today: todayRepairs,
      },
      catalogue: {
        brands: {
          total: totalBrands,
          active: activeBrands,
        },
        models: {
          total: totalModels,
        },
        services: {
          total: totalServices,
          active: activeServices,
        },
      },
      contacts: {
        total: totalContacts,
        new: newContacts,
        inProgress: inProgressContacts,
        resolved: resolvedContacts,
      },
      blogs: {
        total: totalBlogs,
        published: publishedBlogs,
        draft: totalBlogs - publishedBlogs,
      },
      recentRequests,
      recentContacts,
    },
  });
});
