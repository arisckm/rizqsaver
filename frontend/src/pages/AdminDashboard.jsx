import React, { useEffect, useState } from 'react';
import Navbar from '../components/ui/Navbar';
import api from '../lib/api';
import toast from 'react-hot-toast';

// Keeping your custom animation wrappers exactly as they were
import { DuoStaggerContainer, DuoStaggerItem, DuoButton } from '../components/ui/DuoInteractive';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('stats');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users'),
        ]);
        setStats(statsRes.data.data);
        setUsers(usersRes.data.data);
      } catch {
        toast.error('Failed to load admin data.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleVerify = async (id, current) => {
    try {
      await api.patch(`/admin/users/${id}/verify`);
      setUsers((prev) => prev.map((u) => u._id === id ? { ...u, isVerified: !current } : u));
      toast.success(current ? 'Donor unverified.' : 'Donor verified!');
    } catch {
      toast.error('Action failed.');
    }
  };

  const handleToggleActive = async (id, current) => {
    try {
      await api.patch(`/admin/users/${id}/toggle-active`);
      setUsers((prev) => prev.map((u) => u._id === id ? { ...u, isActive: !current } : u));
      toast.success(current ? 'User deactivated.' : 'User activated.');
    } catch {
      toast.error('Action failed.');
    }
  };

  const donors = users.filter((u) => u.role === 'donor');
  const receivers = users.filter((u) => u.role === 'receiver');

  return (
    <div className="min-h-screen bg-[#0e100d] text-[#f2efea] font-sans relative overflow-hidden">

      {/* Background Cloud Glows for Homepage Depth */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[10%] -right-[5%] w-[45vw] h-[45vw] rounded-full bg-[#4a5d4e] filter blur-[130px] opacity-10" />
        <div className="absolute bottom-[15%] -left-[10%] w-[40vw] h-[40vw] rounded-full bg-[#d4af37] filter blur-[140px] opacity-10" />
      </div>

      <div className="relative z-10">
        <Navbar />

        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-serif font-bold text-white mb-6">Admin Dashboard</h1>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mb-8 border-b border-[#232924] pb-4">
            {['stats', 'donors', 'receivers'].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`text-sm font-semibold px-5 py-2.5 rounded-xl capitalize border transition-all flex items-center gap-2 ${tab === t
                    ? 'bg-[#425244] border-[#536856] text-white shadow-md'
                    : 'bg-[#121512]/50 border-[#232924] text-[#b0b8ae] hover:text-white hover:border-[#343f35]'
                  }`}
              >
                {t === 'stats' && (
                  <svg className="w-4 h-4 text-[#d4af37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )}
                {t === 'donors' && (
                  <svg className="w-4 h-4 text-[#a3b899]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                )}
                {t === 'receivers' && (
                  <svg className="w-4 h-4 text-[#8cb894]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                )}
                {t}
              </button>
            ))}
          </div>

          {loading ? <p className="text-[#b0b8ae]">Loading dashboard data...</p> : (
            <>
              {/* 🌟 STATS TAB (Exactly your backend values mapped 1:1) */}
              {tab === 'stats' && stats && (
                <DuoStaggerContainer className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Users', value: stats.totalUsers },
                    { label: 'Donors', value: stats.donors },
                    { label: 'Receivers', value: stats.receivers },
                    { label: 'Total Listings', value: stats.totalListings },
                    { label: 'Active Listings', value: stats.activeListings },
                    { label: 'Total Bookings', value: stats.totalBookings },
                    { label: 'Completed', value: stats.completedBookings },
                  ].map(({ label, value }) => (
                    <DuoStaggerItem key={label} className="bg-[#121512]/60 backdrop-blur-xl border border-[#232924] rounded-2xl p-5 shadow-lg">
                      <p className="text-3xl font-serif font-black text-[#d4af37]">{value}</p>
                      <p className="text-sm text-[#b0b8ae] mt-1">{label}</p>
                    </DuoStaggerItem>
                  ))}
                </DuoStaggerContainer>
              )}

              {/* 🌟 USER LISTINGS TAB */}
              {(tab === 'donors' || tab === 'receivers') && (
                <DuoStaggerContainer className="space-y-3">
                  {(tab === 'donors' ? donors : receivers).map((u) => (
                    <DuoStaggerItem key={u._id} className="bg-[#121512]/60 backdrop-blur-xl border border-[#232924] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-white text-sm">{u.name}</p>

                          {u.organizationName && (
                            <span className="text-xs text-[#b0b8ae] bg-[#1a1f1b] px-2 py-0.5 rounded-md border border-[#2c352d]">
                              · {u.organizationName}
                            </span>
                          )}

                          {u.role === 'donor' && (
                            <span className={`text-xs px-2 py-0.5 rounded-md font-medium border flex items-center gap-1 ${u.isVerified
                                ? 'bg-[#142216] text-[#8cb894] border-[#203d24]'
                                : 'bg-[#292211] text-[#d4af37] border-[#42371c]'
                              }`}>
                              {u.isVerified ? (
                                <>
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                                  </svg>
                                  Verified
                                </>
                              ) : 'Unverified'}
                            </span>
                          )}

                          {!u.isActive && (
                            <span className="text-xs bg-[#2e1717] text-[#e57373] border border-[#4a2020] px-2 py-0.5 rounded-md flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636" />
                              </svg>
                              Inactive
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#b0b8ae] mt-1">{u.email} · {u.city || '—'}</p>
                      </div>

                      {/* Control Panel Action Buttons */}
                      <div className="flex gap-2 items-center">
                        {u.role === 'donor' && (
                          <DuoButton
                            onClick={() => handleVerify(u._id, u.isVerified)}
                            variant="secondary"
                            className="text-xs px-3 py-1.5 border border-[#2b332d] bg-[#161a16] text-white hover:border-[#4a5d4e]"
                          >
                            {u.isVerified ? 'Revoke Verification' : 'Verify Donor'}
                          </DuoButton>
                        )}
                        <DuoButton
                          onClick={() => handleToggleActive(u._id, u.isActive)}
                          className={`text-xs px-3 py-1.5 font-semibold transition-colors rounded-xl border ${u.isActive
                              ? 'bg-[#241515] text-[#e57373] border-[#442323] hover:bg-[#331a1a]'
                              : 'bg-[#142016] text-[#8cb894] border-[#203a24] hover:bg-[#1a2d1f]'
                            }`}
                        >
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </DuoButton>
                      </div>
                    </DuoStaggerItem>
                  ))}

                  {(tab === 'donors' ? donors : receivers).length === 0 && (
                    <p className="text-[#b0b8ae] text-sm pl-2">No {tab} registered yet.</p>
                  )}
                </DuoStaggerContainer>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}