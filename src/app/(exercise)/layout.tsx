import AppSideBar from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { cookies } from "next/headers";

async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSideBar />

      <main className="w-full h-[100vh]">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}

export default Layout;
