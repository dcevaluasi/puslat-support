import Link from "next/link";
import { Package, Users, DoorOpen } from "lucide-react";

export default function Home() {
  const menus = [
    {
      title: "Peminjaman BMN",
      description: "Kelola peminjaman Barang Milik Negara",
      href: "/peminjaman-bmn",
      icon: Package,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Aktivitas Pegawai",
      description: "Monitor aktivitas dan kehadiran pegawai",
      href: "/dashboard/employee/activity",
      icon: Users,
      gradient: "from-cyan-500 to-blue-600"
    },
    {
      title: "Penggunaan Ruang Rapat",
      description: "Reservasi dan jadwal ruang rapat",
      href: "/dashboard/meeting-room/activity",
      icon: DoorOpen,
      gradient: "from-blue-600 to-indigo-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900">
      <main className="flex min-h-screen w-full max-w-6xl mx-auto flex-col gap-12 py-16 px-6">

        {/* Header */}
        <div className="flex flex-col gap-6 text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
            <span className="text-3xl">🌊</span>
          </div>
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-400">
              Pusat Pelatihan KP
            </h1>
            <p className="mt-3 text-lg text-blue-700 dark:text-blue-300">
              Sistem Manajemen Support Pusat Pelatihan KP
            </p>
          </div>
        </div>

        {/* Menu Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {menus.map((menu) => {
            const Icon = menu.icon;
            return (
              <Link
                key={menu.href}
                href={menu.href}
                className="group relative flex flex-col gap-6 rounded-2xl bg-white/80 backdrop-blur-sm p-8 transition-all hover:scale-105 hover:shadow-2xl dark:bg-slate-800/80 border border-blue-100 dark:border-blue-900/50"
              >
                {/* Icon with gradient background */}
                <div className={`w-14 h-14 bg-gradient-to-br ${menu.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                <div className="flex-1">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                    {menu.title}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {menu.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
                  Buka
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>

                {/* Hover gradient overlay */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${menu.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
              </Link>
            );
          })}
        </div>

      </main>
    </div>
  );
}