import Link from "next/link";

import { getProjects } from "@/lib/server/projects";

import LogsPanel from "@/components/dashboard/LogsPanel";

export const metadata = {
  title: "Dashboard",
};

export default async function Dashboard() {
  const projects = await getProjects();

  return (
    <main>
      <section className="flex flex-col items-center min-h-dvh px-4 md:px-8 py-16">
        <div>
          <h1 className="text-3xl font-bold font-heading">Dashboard</h1>
        </div>
        <div className="w-full max-w-7xl">
          <h2 className="mb-4 text-2xl font-bold font-heading">Projects</h2>
          {projects.length != 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => {
                return (
                  <div
                    key={project.id}
                    className="pt-2 px-4 pb-4 border border-(--border) rounded-lg bg-white dark:bg-neutral-900 shadow">
                    <h3 className="mb-2 text-lg font-bold font-heading">
                      {project.name}
                    </h3>
                    <Link
                      href={`/dashboard/project/${project.id}`}
                      className="px-2 py-2 rounded text-center text-white bg-blue-500">
                      View
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <section>
        <LogsPanel />
      </section>
    </main>
  );
}
