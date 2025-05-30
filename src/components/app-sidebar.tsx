import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import NewExerciseDialog from "./dialogs/new-exercise-dialog";
import { Input } from "./ui/input";

function AppSideBar() {
  return (
    <Sidebar variant="sidebar">
      <SidebarHeader className="text-center">EZ 100</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <NewExerciseDialog
                  trigger={
                    <SidebarMenuButton>
                      <span>New Button</span>
                    </SidebarMenuButton>
                  }
                />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Input type="search" placeholder="Search your exercises..." />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
          <SidebarGroupContent></SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSideBar;
