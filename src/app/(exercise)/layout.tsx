import AppSideBar from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import ExerciseHeader from "./exercise-header";
import { ScrollArea } from "@/components/ui/scroll-area";

async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSideBar />

      <main className="w-full h-[100vh] overflow-hidden">
        <div className="flex items-center py-2 px-4 gap-4 border-b">
          <SidebarTrigger />
          <ExerciseHeader />
        </div>
        <ScrollArea
          className="overflow-y-auto h-[calc(100vh-44.9px)]"
          type="always"
          color="red"
        >
          {children}
        </ScrollArea>
      </main>
    </SidebarProvider>
  );
}

export default Layout;
