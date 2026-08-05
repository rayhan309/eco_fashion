import { config } from "dotenv";
import dns from "node:dns";
import { resolve } from "node:path";

// Local routers often fail SRV lookups needed by mongodb+srv
dns.setServers(["8.8.8.8", "1.1.1.1"]);

config({ path: resolve(process.cwd(), ".env") });

async function main() {
  const { ensureSuperAdmin } = await import("../src/lib/auth/admin-users");
  const { dbConnect } = await import("../src/lib/dbConnect");
  const { AdminUser } = await import("../src/models/AdminUser");
  const { hashPassword } = await import("../src/lib/auth/password");

  const email = process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SUPER_ADMIN_PASSWORD;
  const name = process.env.SUPER_ADMIN_NAME?.trim() || "Super Admin";

  if (!email || !password) {
    throw new Error("Set SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD in .env");
  }

  await dbConnect();

  const existing = await AdminUser.findOne({ email });
  if (existing) {
    existing.name = name;
    existing.role = "super_admin";
    existing.passwordHash = await hashPassword(password);
    await existing.save();
    console.log("Updated existing Super Admin:");
    console.log(`  email: ${existing.email}`);
    console.log(`  name:  ${existing.name}`);
    console.log(`  role:  ${existing.role}`);
    return;
  }

  const byRole = await AdminUser.findOne({ role: "super_admin" });
  if (byRole) {
    byRole.email = email;
    byRole.name = name;
    byRole.passwordHash = await hashPassword(password);
    await byRole.save();
    console.log("Updated existing Super Admin (by role):");
    console.log(`  email: ${byRole.email}`);
    console.log(`  name:  ${byRole.name}`);
    console.log(`  role:  ${byRole.role}`);
    return;
  }

  const created = await ensureSuperAdmin();
  if (!created) {
    throw new Error("Could not create Super Admin (check SUPER_ADMIN_* env vars).");
  }
  console.log("Created Super Admin:");
  console.log(`  email: ${created.email}`);
  console.log(`  name:  ${created.name}`);
  console.log(`  role:  ${created.role}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Admin seed failed:", error);
    process.exit(1);
  });
