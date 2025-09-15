import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateAdminUser } from "@/hooks/useCreateAdminUser";
import { UserPlus } from "lucide-react";

export const AdminSetup = () => {
  const createAdminMutation = useCreateAdminUser();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Create Admin User
        </CardTitle>
        <CardDescription>
          Create an admin user with full access to all modules
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p><strong>Email:</strong> ngo@gmai.com</p>
            <p><strong>Password:</strong> test@1234</p>
            <p><strong>Role:</strong> Super Admin</p>
          </div>
          <Button 
            onClick={() => createAdminMutation.mutate()}
            disabled={createAdminMutation.isPending}
            className="w-full"
          >
            {createAdminMutation.isPending ? 'Creating...' : 'Create Admin User'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};