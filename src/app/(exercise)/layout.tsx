import AppSideBar from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import ExerciseHeader from "./exercise-header";
import { ThemeToggle } from "@/components/theme-toggle";

async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSideBar />

      <main className="w-full h-[100vh] overflow-hidden">
        <div className="flex items-center py-2 px-4 border-b justify-between">
          <div className="flex gap-4 items-center">
            <SidebarTrigger />
            <ExerciseHeader />
          </div>
          <ThemeToggle />
        </div>
        <div
          id="scroll-area"
          className="overflow-y-auto h-[calc(100vh-44.9px)] flex flex-col"
        >
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}

export default Layout;
