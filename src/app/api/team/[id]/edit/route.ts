import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { NEXT_AUTH_CONFIG } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Await the promise to extract the id
  const { id } = await params;
  const session = await getServerSession(NEXT_AUTH_CONFIG);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const teamMemberId = Number.parseInt(id, 10);
  if (isNaN(teamMemberId)) {
    return NextResponse.json(
      { error: "Invalid team member ID" },
      { status: 400 }
    );
  }
  try {
    const teamMember = await prisma.teamMember.findUnique({
      where: { id: teamMemberId },
    });
    if (!teamMember) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(teamMember);
  } catch (error) {
    console.error("Error fetching team member:", error);
    return NextResponse.json(
      { error: "Error fetching team member" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(NEXT_AUTH_CONFIG);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const teamMemberId = Number.parseInt(id, 10);
  if (isNaN(teamMemberId)) {
    return NextResponse.json(
      { error: "Invalid team member ID" },
      { status: 400 }
    );
  }
  try {
    const body = await req.json();
    const updatedTeamMember = await prisma.teamMember.update({
      where: { id: teamMemberId },
      data: {
        name: body.name,
        description: body.description,
        image: body.image || null,
      },
    });
    return NextResponse.json(updatedTeamMember);
  } catch (error) {
    console.error("Error updating team member:", error);
    return NextResponse.json(
      { error: "Failed to update team member" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(NEXT_AUTH_CONFIG);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const teamMemberId = Number.parseInt(id, 10);
  if (isNaN(teamMemberId)) {
    return NextResponse.json(
      { error: "Invalid team member ID" },
      { status: 400 }
    );
  }
  try {
    await prisma.teamMember.delete({ where: { id: teamMemberId } });
    return NextResponse.json({ message: "Team member deleted successfully" });
  } catch (error) {
    console.error("Error deleting team member:", error);
    return NextResponse.json(
      { error: "Failed to delete team member" },
      { status: 500 }
    );
  }
}
