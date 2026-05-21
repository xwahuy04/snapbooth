import { prisma } from "@/lib/prisma";
import { THEMES } from "@/lib/data";
import Link from "next/link";
import { ArrowLeft, Camera, Image } from "lucide-react";

// Force dynamic rendering so the page fetches the latest data on every request
export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const sessions = await prisma.session.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
        style={{
          borderBottom: "1px solid var(--border)",
          background: "var(--bg-header-rgba)",
          backdropFilter: "blur(12px)",
        }}
      >
        <Link href="/" className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              background: "var(--accent-blue)",
              boxShadow: "var(--shadow-blue)",
            }}
          >
            <Camera size={14} className="text-white" />
          </div>
          <span
            className="font-display font-bold text-lg"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.03em" }}
          >
            SnapBooth
          </span>
        </Link>
        <Link href="/booth">
          <button className="btn-primary text-xs">
            <Camera size={13} /> Mulai Foto
          </button>
        </Link>
      </header>

      {/* Content */}
      <div className="flex-1 w-full px-6 py-10 flex flex-col">
        <div className="max-w-5xl mx-auto w-full">
          <div className="mb-8">
            <Link
              href="/"
              className="text-xs font-medium flex items-center gap-1.5 hover:underline mb-3"
              style={{ color: "var(--text-secondary)" }}
            >
              <ArrowLeft size={12} /> Kembali ke Home
            </Link>
            <h1
              className="font-display font-bold text-3xl md:text-4xl"
              style={{ letterSpacing: "-0.03em", lineHeight: 1.2, marginBottom: "0.5rem" }}
            >
              Galeri Foto Strip
            </h1>
            <p
              className="text-sm md:text-base"
              style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}
            >
              Menampilkan {sessions.length} hasil karya foto dari studio
            </p>
          </div>

        {sessions.length === 0 ? (
          <div
            className="flex-1 flex flex-col items-center justify-center text-center py-20 rounded-2xl"
            style={{
              background: "var(--bg-secondary)",
              border: "2px dashed var(--border)",
            }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{
                background: "var(--accent-blue-50)",
                color: "var(--accent-blue)",
              }}
            >
              <Image size={28} />
            </div>
            <h3
              className="font-display font-semibold text-lg mb-1"
              style={{ color: "var(--text-primary)" }}
            >
              Belum ada foto strip
            </h3>
            <p
              className="text-sm max-w-xs mb-6"
              style={{ color: "var(--text-secondary)" }}
            >
              Jadilah orang pertama yang mengabadikan momen di SnapBooth!
            </p>
            <Link href="/booth">
              <button className="btn-primary text-sm">
                <Camera size={15} /> Mulai Foto Sekarang
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {sessions.map((session) => {
              const t =
                THEMES.find((th) => th.id === session.themeId) ?? THEMES[0];
              return (
                <Link
                  key={session.id}
                  href={`/result/${session.id}`}
                  className="group flex flex-col"
                >
                  <div
                    className="rounded-xl overflow-hidden p-2.5 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-lg"
                    style={{
                      background: t.backgroundColor,
                      border: "1px solid var(--border)",
                      boxShadow: "var(--shadow-sm)",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={session.imageUrl}
                      alt="Saved Photo Strip"
                      className="w-full h-auto rounded-lg object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-2.5 px-1 flex items-center justify-between">
                    <span
                      className="text-[11px] font-medium"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {new Date(session.createdAt).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </span>
                    <span className="text-xs opacity-60 group-hover:opacity-100 transition-all">
                      {t.emoji || "✨"}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
        </div>
      </div>
    </main>
  );
}
