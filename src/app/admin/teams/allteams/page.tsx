import AllTeam from "../components/AllTeam";
import prisma from "../../../../../prisma/prisma";

export default async function AllTeamPage() {
  const teamMembers = await prisma.teamMember.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Convert Date fields to strings and only pass needed fields
  const formattedTeamMembers = teamMembers.map((member) => ({
    id: member.id,
    name: member.name,
    description: member.description,
    image: member.image,
    createdAt: member.createdAt.toISOString(),
  }));

  return <AllTeam teamMembers={formattedTeamMembers} />;
}
