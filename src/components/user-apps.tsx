import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserApps } from "@/actions/user-apps";
import { AppCard } from "./app-card";
import { LoadingSpinner } from "./ui/loading-spinner";

interface UserAppsProps {
  initialUserApps: any[];
}

export function UserApps({ initialUserApps }: UserAppsProps) {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["userApps"],
    queryFn: getUserApps,
    initialData: initialUserApps,
  });

  const onAppDeleted = () => {
    queryClient.invalidateQueries({ queryKey: ["userApps"] });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          Failed to load your apps. Please try refreshing the page.
        </p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          You haven't created any apps yet.
        </p>
        <p className="text-sm text-gray-500">
          Start by describing what you'd like to build above!
        </p>
      </div>
    );
  }
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 px-4 sm:px-8">Your Apps</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 sm:px-8">
        {data.map((app) => (
          <AppCard 
            key={app.id}
            id={app.id}
            name={app.name}
            createdAt={app.createdAt}
            onDelete={onAppDeleted}
          />
        ))}
      </div>
    </div>
  );
}
