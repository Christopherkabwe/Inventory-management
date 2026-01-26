"use client";

import CreateCustomerPage from "./CreateCustomerPage";
import withRole from "@/components/withRole";

// Only ADMIN and MANAGER can create customers
export default withRole(CreateCustomerPage, ["ADMIN", "MANAGER"]);
