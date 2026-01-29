
import { Stakeholder } from "@/types";

export const getRoleColor = (role: Stakeholder["role"]) => {
  const colors = {
    developer: "bg-blue-100 text-blue-800",
    contractor: "bg-green-100 text-green-800",
    authority: "bg-purple-100 text-purple-800",
    supervisor: "bg-yellow-100 text-yellow-800",
    architect: "bg-pink-100 text-pink-800",
    engineer: "bg-orange-100 text-orange-800"
  };
  return colors[role];
};

export const getOnboardingStatusColor = (status: Stakeholder["onboardingStatus"]) => {
  const colors = {
    pending: "bg-gray-100 text-gray-800",
    "in-progress": "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800"
  };
  return colors[status];
};
