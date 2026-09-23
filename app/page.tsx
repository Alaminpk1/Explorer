import { Explorer } from "@/components/Explorer";
import { ConfirmProvider } from "@/components/ui/ConfirmProvider";
import { UnsavedChangesProvider } from "@/state/UnsavedChangesProvider";
import { WorkspaceProvider } from "@/state/WorkspaceProvider";

// UnsavedChangesProvider uses useConfirm, so it must sit inside ConfirmProvider.
export default function Page() {
  return (
    <WorkspaceProvider>
      <ConfirmProvider>
        <UnsavedChangesProvider>
          <Explorer />
        </UnsavedChangesProvider>
      </ConfirmProvider>
    </WorkspaceProvider>
  );
}
