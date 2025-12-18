import NewTeam from "../components/NewTeam";
import prisma from "../../../../../prisma/prisma";

export default async function NewTeamPage() {
  // Optionally, fetch existing team members if needed.
  const teamMembers = await prisma.teamMember.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <NewTeam existingTeam={teamMembers} />;
}
