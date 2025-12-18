"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import { useState } from "react";

interface TeamMember {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
  createdAt: string;
}

interface AllTeamProps {
  teamMembers: TeamMember[];
}

const AllTeam: React.FC<AllTeamProps> = ({ teamMembers }) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (teamId: number) => {
    if (!confirm("Are you sure you want to delete this team member?")) return;

    setDeletingId(teamId);
    try {
      const res = await fetch(`/api/team?id=${teamId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete team member");

      alert("Team member deleted successfully!");
      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-8 w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Team Members</h1>
        <Button onClick={() => router.push("/admin/teams/newteam")}>
          Create New Team Member
        </Button>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table className="border-collapse">
          <TableHeader>
            <TableRow className="border-b">
              <TableHead className="px-4 py-2">Image</TableHead>
              <TableHead className="px-4 py-2">Name</TableHead>
              <TableHead className="px-4 py-2">Description</TableHead>
              <TableHead className="px-4 py-2">Date</TableHead>
              <TableHead className="px-4 py-2 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamMembers.map((member) => (
              <TableRow key={member.id} className="border-b">
                <TableCell className="px-4 py-2">
                  {member.image ? (
                    <div className="relative w-16 h-16 rounded-md overflow-hidden">
                      <Image
                        src={
                          member.image.startsWith("/")
                            ? member.image
                            : `/uploads/${member.image}`
                        }
                        alt={`${member.name} image`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 64px) 100vw, 64px"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No Image</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="px-4 py-2 font-medium">
                  {member.name}
                </TableCell>
                <TableCell className="px-4 py-2">
                  {member.description && member.description.length > 30
                    ? member.description.slice(0, 30) + "..."
                    : member.description || ""}
                </TableCell>
                <TableCell className="px-4 py-2">
                  {new Date(member.createdAt).toLocaleDateString("en-CA")}
                </TableCell>
                <TableCell className="px-4 py-2 text-center">
                  <div className="flex gap-1 justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push(`/admin/teams/${member.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        router.push(`/admin/teams/${member.id}/edit`)
                      }
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500"
                      onClick={() => handleDelete(member.id)}
                      disabled={deletingId === member.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AllTeam;
