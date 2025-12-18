import EditTeam from "../../components/EditTeam";
import prisma from "../../../../../../prisma/prisma";

export default async function EditTeamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const teamMember = await prisma.teamMember.findUnique({
    where: { id: Number.parseInt(id) },
  });

  if (!teamMember) {
    return <div>Team member not found</div>;
  }

  return (
    <EditTeam
      teamMember={{
        ...teamMember,
        createdAt: teamMember.createdAt.toISOString(),
      }}
    />
  );
}
