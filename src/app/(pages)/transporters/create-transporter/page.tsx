"use client";

import CreateTransporterPage from "./CreateTransporterPage";
import withRole from "@/components/withRole";

// Only ADMIN and MANAGER can create customers
export default withRole(CreateTransporterPage, ["ADMIN", "MANAGER"]);
