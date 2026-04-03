import LogsPanel from "@/components/dashboard/LogsPanel";
import { getProjectById } from "@/lib/server/projects";

export default async function Page({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProjectById(projectId);

  return (
    <main>
      <div>Name: {project.name}</div>
      <LogsPanel projectId={projectId} />
    </main>
  );
}
