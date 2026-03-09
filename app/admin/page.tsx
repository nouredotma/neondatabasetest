import { prisma } from "@/lib/prisma";
import { User, Mail, Phone, MessageSquare, FileText, Camera, ExternalLink } from "lucide-react";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const submissions = await prisma.subscriber.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen p-6 md:p-10 bg-[#262624]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-white/40 text-sm">
              Review incoming applications.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full">
            <p className="text-white/60 text-xs font-medium">
              Total: <span className="text-white">{submissions.length}</span>
            </p>
          </div>
        </div>

        {/* Table */}
        {submissions.length === 0 ? (
          <div className="text-center py-20 text-white/40 border border-white/10 rounded-md bg-white/5">
            <MessageSquare className="mx-auto mb-3 opacity-20" size={40} />
            <p className="text-lg font-medium">No submissions yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-md border border-white/10 bg-white/5 backdrop-blur-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-white/30 text-center">Img</th>
                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-white/30">Name</th>
                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-white/30">Contact</th>
                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-white/30">Message</th>
                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-white/30">Action</th>
                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-white/30 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {submissions.map((sub: any) => (
                  <tr
                    key={sub.id}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-5 py-4">
                      <div className="mx-auto relative w-10 h-10 rounded-full overflow-hidden bg-white/10 border border-white/10">
                        {sub.profileImage ? (
                          <Image
                            src={sub.profileImage}
                            alt={`${sub.firstName}`}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/10">
                            <Camera size={16} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col">
                        <span className="text-white font-medium text-sm">
                          {sub.firstName} {sub.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5 text-white/50 text-xs">
                          <Mail size={10} className="text-[#d97757]/70" />
                          {sub.email}
                        </div>
                        <div className="flex items-center gap-1.5 text-white/50 text-xs">
                          <Phone size={10} className="text-[#d97757]/70" />
                          {sub.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-white/40 text-xs max-w-xs line-clamp-1 italic">
                        {sub.message}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      {sub.resume ? (
                        <a
                          href={sub.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#d97757]/10 text-[#d97757] rounded-full text-[10px] font-bold hover:bg-[#d97757]/20 transition-all"
                        >
                          <FileText size={12} />
                          Resume
                        </a>
                      ) : (
                        <span className="text-white/10 text-[10px] italic">Empty</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-white/60 text-xs">
                          {new Date(sub.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
