import { useState, useEffect, useRef } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const SUBJECTS = [
    {
        code: 'BMAT201L', name: 'Complex Variables & Linear Algebra', short: 'CVLA',
        modules: [
            { name: 'Analytic Functions', hours: 7 },
            { name: 'Conformal and Bilinear Transformations', hours: 7 },
            { name: 'Complex Integration', hours: 7 },
            { name: 'Vector Spaces', hours: 6 },
            { name: 'Linear Transformations', hours: 6 },
            { name: 'Inner Product Spaces', hours: 5 },
            { name: 'Matrices and System of Equations', hours: 5 },
            { name: 'Contemporary Issues', hours: 2 },
        ],
    },
    {
        code: 'BCSE308L', name: 'Computer Networks', short: 'CN',
        modules: [
            { name: 'Networking Principles and Layered Architecture', hours: 6 },
            { name: 'Data Link Layer', hours: 8 },
            { name: 'Medium Access Control', hours: 7 },
            { name: 'Network Layer', hours: 8 },
            { name: 'Routing Protocols', hours: 6 },
            { name: 'Transport Layer', hours: 5 },
            { name: 'Application Layer', hours: 3 },
            { name: 'Contemporary Issues', hours: 2 },
        ],
    },
    {
        code: 'BCSE304L', name: 'Theory of Computation', short: 'TOC',
        modules: [
            { name: 'Introduction to Languages and Grammars', hours: 4 },
            { name: 'Finite State Automata', hours: 8 },
            { name: 'Regular Expressions and Languages', hours: 7 },
            { name: 'Context Free Grammars', hours: 7 },
            { name: 'Pushdown Automata', hours: 5 },
            { name: 'Turing Machines', hours: 6 },
            { name: 'Recursive and Recursively Enumerable Languages', hours: 6 },
            { name: 'Contemporary Issues', hours: 2 },
        ],
    },
    {
        code: 'BCSE302L', name: 'Database Systems', short: 'DBMS',
        modules: [
            { name: 'Database Systems Concepts and Architecture', hours: 4 },
            { name: 'Relational Model and E-R Modeling', hours: 8 },
            { name: 'Relational Database Design', hours: 6 },
            { name: 'Physical Database Design and Query Processing', hours: 8 },
            { name: 'Transaction Processing and Recovery', hours: 8 },
        ],
    },
    {
        code: 'BCSE306L', name: 'Artificial Intelligence', short: 'AI',
        modules: [
            { name: 'Introduction', hours: 6 },
            { name: 'Problem Solving based on Searching', hours: 6 },
            { name: 'Local Search and Adversarial Search', hours: 5 },
            { name: 'Logic and Reasoning', hours: 8 },
            { name: 'Uncertain Knowledge and Reasoning', hours: 5 },
            { name: 'Planning', hours: 7 },
            { name: 'Communicating, Perceiving and Acting', hours: 6 },
            { name: 'Contemporary Issues', hours: 2 },
        ],
    },
];

const ACCENTS = ['#a89cf7', '#5badf7', '#34d99e', '#f07c56', '#f0b840'];
const GLOW = ['#a89cf720', '#5badf720', '#34d99e20', '#f07c5620', '#f0b84020'];

const todayStr = () => new Date().toISOString().split('T')[0];
const daysUntil = (d) => {
    if (!d) return null;

    return Math.ceil(
        (new Date(d + 'T00:00:00').getTime() - new Date(new Date().toDateString()).getTime())
        / 86400000
    );
    const subPct = (tasks, si, sub) => {
        let c = 0, t = 0;
        sub.modules.forEach((_, mi) => {
            t += 2;
            const x = tasks[`${si}-${mi}`] || {};
            if (x.theory) c++; if (x.pyqs) c++;
        });
        return { c, t, pct: t > 0 ? Math.round((c / t) * 100) : 0 };
    };
    const getStreak = (dates) => {
        if (!dates?.length) return 0;
        const s = new Set(dates);
        const d = new Date();
        let n = 0;
        const fmt = (x) => x.toISOString().split('T')[0];
        if (!s.has(fmt(d))) d.setDate(d.getDate() - 1);
        while (s.has(fmt(d))) { n++; d.setDate(d.getDate() - 1); }
        return n;
    };

    function ParticleCanvas() {
        const ref = useRef(null);
        useEffect(() => {
            const cv = ref.current; if (!cv) return;
            const ctx = cv.getContext('2d');
            let W, H, raf;
            const pts = [];
            const resize = () => { W = cv.width = cv.offsetWidth; H = cv.height = cv.offsetHeight; };
            resize();
            window.addEventListener('resize', resize);
            for (let i = 0; i < 130; i++) {
                pts.push({
                    x: Math.random() * (W || 1400), y: Math.random() * (H || 900),
                    vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.5) * 0.15,
                    r: Math.random() * 1.2 + 0.3, a: Math.random() * 0.03 + 0.005,
                    col: Math.random() > 0.65 ? ACCENTS[Math.floor(Math.random() * ACCENTS.length)] : '#ffffff',
                });
            }
            const draw = () => {
                ctx.clearRect(0, 0, W, H);
                for (let i = 0; i < pts.length; i++) {
                    const p = pts[i];
                    p.x = (p.x + p.vx + W) % W; p.y = (p.y + p.vy + H) % H;
                    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    ctx.fillStyle = p.col + Math.round(p.a * 255).toString(16).padStart(2, '0');
                    ctx.fill();
                    for (let j = i + 1; j < pts.length; j++) {
                        const q = pts[j];
                        const dx = p.x - q.x, dy = p.y - q.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < 90) {
                            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
                            ctx.strokeStyle = `rgba(255,255,255,${(1 - dist / 90) * 0.03})`;
                            ctx.lineWidth = 0.5; ctx.stroke();
                        }
                    }
                }
                raf = requestAnimationFrame(draw);
            };
            draw();
            return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
        }, []);
        return <canvas ref={ref} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />;
    }

    function Toast({ msg, emoji, onDone }) {
        const [vis, setVis] = useState(false);
        useEffect(() => {
            requestAnimationFrame(() => setVis(true));
            const t = setTimeout(() => { setVis(false); setTimeout(onDone, 300); }, 2600);
            return () => clearTimeout(t);
        }, []);
        return (
            <div style={{
                background: '#1a1a22', border: '1px solid rgba(255,255,255,0.13)',
                color: '#f0f0ee', borderRadius: 40, padding: '11px 22px',
                fontSize: 13, fontWeight: 500, gap: 9, display: 'flex', alignItems: 'center',
                fontFamily: 'DM Sans, sans-serif',
                boxShadow: '0 16px 48px rgba(0,0,0,0.7), 0 4px 12px rgba(0,0,0,0.5)',
                whiteSpace: 'nowrap',
                transform: vis ? 'translateY(0) scale(1)' : 'translateY(14px) scale(0.93)',
                opacity: vis ? 1 : 0, transition: 'all 0.28s cubic-bezier(0.4,0,0.2,1)',
            }}>
                <span style={{ fontSize: 16 }}>{emoji}</span>{msg}
            </div>
        );
    }

    function SetupModal({ onSave, onCancel, existing }) {
        const [d, setD] = useState(existing || '');
        const min = new Date(); min.setDate(min.getDate() + 1);
        return (
            <div style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 300, padding: 20, backdropFilter: 'blur(18px)',
            }}>
                <div style={{
                    background: '#141418', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 24, padding: '44px 36px', maxWidth: 420, width: '100%',
                    boxShadow: '0 48px 120px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.04)',
                }}>
                    <div style={{ fontSize: 36, textAlign: 'center', marginBottom: 14 }}>🎯</div>
                    <h2 style={{ textAlign: 'center', color: '#f0f0ee', fontSize: 22, fontWeight: 700, margin: '0 0 10px', fontFamily: 'Syne, sans-serif', letterSpacing: '-0.03em' }}>
                        {existing ? 'Update exam date' : 'When do exams start?'}
                    </h2>
                    <p style={{ textAlign: 'center', color: '#555', fontSize: 14, margin: '0 0 28px', lineHeight: 1.7, fontFamily: 'DM Sans, sans-serif' }}>
                        We'll track your daily pace and flag if you're falling behind.
                    </p>
                    <input type="date" min={min.toISOString().split('T')[0]} value={d}
                        onChange={e => setD(e.target.value)} style={{
                            width: '100%', padding: '13px 16px', borderRadius: 12,
                            border: '1px solid rgba(255,255,255,0.1)', background: '#1e1e26',
                            color: '#f0f0ee', fontSize: 15, fontFamily: 'DM Mono, monospace',
                            outline: 'none', boxSizing: 'border-box', marginBottom: 14,
                            colorScheme: 'dark', cursor: 'pointer',
                            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.4)',
                        }} />
                    <button onClick={() => d && onSave(d)} disabled={!d} style={{
                        width: '100%', padding: 14, borderRadius: 12, border: 'none',
                        background: d ? '#a89cf7' : '#1e1e22', color: d ? '#09090b' : '#333',
                        fontSize: 15, fontWeight: 700, fontFamily: 'DM Sans, sans-serif',
                        cursor: d ? 'pointer' : 'default', transition: 'all 0.2s',
                        marginBottom: onCancel ? 12 : 0,
                        boxShadow: d ? '0 6px 24px rgba(168,156,247,0.45)' : 'none',
                    }}>
                        {existing ? 'Update →' : "Let's go →"}
                    </button>
                    {onCancel && (
                        <button onClick={onCancel} style={{
                            width: '100%', padding: 11, borderRadius: 12,
                            border: '1px solid rgba(255,255,255,0.07)', background: 'transparent',
                            color: '#555', fontSize: 13, fontFamily: 'DM Sans, sans-serif', cursor: 'pointer',
                        }}>Cancel</button>
                    )}
                </div>
            </div>
        );
    }

    // ── Stat Box ──────────────────────────────────────────────────────────────────
    function StatBox({ label, val, col, sub }) {
        return (
            <div style={{
                background: 'linear-gradient(145deg, #13131e 0%, #0e0e17 100%)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 16, padding: '18px 20px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.03)',
                display: 'flex', flexDirection: 'column', gap: 5,
            }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: '#35354a', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'DM Mono, monospace' }}>
                    {label}
                </div>
                <div style={{ fontSize: 26, fontWeight: 700, color: col, fontFamily: 'DM Mono, monospace', letterSpacing: '-0.04em', lineHeight: 1, textShadow: `0 0 28px ${col}55` }}>
                    {val}
                </div>
                {sub && <div style={{ fontSize: 11, color: '#35354a', fontFamily: 'DM Sans, sans-serif' }}>{sub}</div>}
            </div>
        );
    }

    // ── Detail Panel ──────────────────────────────────────────────────────────────
    function DetailPanel({ subject, sIdx, tasks, onToggle, onBack }) {
        const { c, t, pct } = subPct(tasks, sIdx, subject);
        const accent = ACCENTS[sIdx];
        const glow = GLOW[sIdx];

        const moduleStats = subject.modules.map((mod, mi) => {
            const id = `${sIdx}-${mi}`;
            const tk = tasks[id] || {};
            return { ...mod, mi, theory: !!tk.theory, pyqs: !!tk.pyqs, done: !!(tk.theory && tk.pyqs) };
        });

        const totalHours = subject.modules.reduce((s, m) => s + m.hours, 0);
        const doneHours = moduleStats.filter(m => m.done).reduce((s, m) => s + m.hours, 0);
        const theoryDone = moduleStats.filter(m => m.theory).length;
        const pyqsDone = moduleStats.filter(m => m.pyqs).length;
        const modsDone = moduleStats.filter(m => m.done).length;

        const subjectPieData = c > 0 || t > 0
            ? [
                { name: 'done', value: c, fill: accent },
                { name: 'remaining', value: t - c, fill: 'rgba(255,255,255,0.06)' },
            ].filter(d => d.value > 0)
            : [{ name: 'empty', value: 1, fill: 'rgba(255,255,255,0.06)' }];

        return (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

                {/* Top Nav */}
                <div style={{
                    flexShrink: 0, height: 68,
                    background: 'rgba(9,9,14,0.97)', backdropFilter: 'blur(20px)',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex', alignItems: 'center', padding: '0 36px', gap: 20,
                    boxShadow: '0 4px 32px rgba(0,0,0,0.6)',
                    zIndex: 20,
                }}>
                    <button onClick={onBack} style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '8px 18px', borderRadius: 11,
                        background: `${accent}1a`, border: `1.5px solid ${accent}50`,
                        color: accent, cursor: 'pointer', fontFamily: 'DM Mono, monospace',
                        fontSize: 12, fontWeight: 600, letterSpacing: '0.04em',
                        transition: 'all 0.2s',
                        boxShadow: `0 2px 14px ${accent}25, inset 0 1px 0 ${accent}20`,
                    }}>
                        ← Dashboard
                    </button>

                    <div style={{ width: 1, height: 30, background: 'rgba(255,255,255,0.07)' }} />

                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 10, color: '#35354a', fontFamily: 'DM Mono, monospace', marginBottom: 2, letterSpacing: '0.08em' }}>
                            {subject.code}
                        </div>
                        <div style={{ fontSize: 19, fontWeight: 700, color: '#f0f0ee', fontFamily: 'Syne, sans-serif', letterSpacing: '-0.03em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {subject.name}
                        </div>
                    </div>

                    {/* Progress inline */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
                        <div>
                            <div style={{ fontSize: 10, color: '#35354a', fontFamily: 'DM Mono, monospace', marginBottom: 2, letterSpacing: '0.08em' }}>PROGRESS</div>
                            <div style={{ fontSize: 20, fontWeight: 700, color: accent, fontFamily: 'DM Mono, monospace', textShadow: `0 0 24px ${accent}77` }}>
                                {pct}%
                            </div>
                        </div>
                        <div style={{ width: 140, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden', boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.5)' }}>
                            <div style={{
                                height: '100%', width: `${pct}%`,
                                background: `linear-gradient(90deg, ${accent}aa, ${accent})`,
                                borderRadius: 3, transition: 'width 0.7s ease',
                                boxShadow: `0 0 12px ${accent}88`,
                            }} />
                        </div>
                        <div style={{
                            padding: '6px 16px', borderRadius: 9,
                            background: glow, border: `1px solid ${accent}35`,
                            color: accent, fontSize: 13, fontWeight: 700,
                            fontFamily: 'DM Mono, monospace',
                            boxShadow: `0 2px 12px ${accent}20`,
                        }}>
                            {c}/{t} tasks
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

                    {/* LEFT — Modules */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '32px 32px 48px' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 24 }}>
                            <h2 style={{ fontSize: 17, fontWeight: 800, color: '#f0f0ee', fontFamily: 'Syne, sans-serif', letterSpacing: '-0.03em' }}>
                                Modules & Tasks
                            </h2>
                            <span style={{ fontSize: 12, color: '#35354a', fontFamily: 'DM Mono, monospace' }}>
                                {modsDone}/{subject.modules.length} complete
                            </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 14 }}>
                            {subject.modules.map((mod, mi) => {
                                const id = `${sIdx}-${mi}`;
                                const tk = tasks[id] || {};
                                const done = !!(tk.theory && tk.pyqs);
                                const half = (tk.theory || tk.pyqs) && !done;
                                const modPct = ((tk.theory ? 1 : 0) + (tk.pyqs ? 1 : 0)) / 2 * 100;
                                return (
                                    <div key={mi} style={{
                                        background: done
                                            ? `linear-gradient(145deg, ${accent}10 0%, #0f0f18 70%)`
                                            : 'linear-gradient(145deg, #121219 0%, #0d0d15 100%)',
                                        border: `1px solid ${done ? accent + '55' : half ? accent + '25' : 'rgba(255,255,255,0.07)'}`,
                                        borderRadius: 18, padding: '20px 22px',
                                        boxShadow: done
                                            ? `0 6px 32px rgba(0,0,0,0.5), 0 0 48px ${accent}0f, inset 0 1px 0 ${accent}22`
                                            : `0 4px 22px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)`,
                                        transition: 'all 0.25s ease',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16, gap: 12 }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: 14, fontWeight: 600, color: done ? accent : '#c8c8c4', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.4, marginBottom: 8 }}>
                                                    {mod.name}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden', maxWidth: 100 }}>
                                                        <div style={{ height: '100%', width: `${modPct}%`, background: accent, borderRadius: 2, boxShadow: modPct > 0 ? `0 0 6px ${accent}77` : 'none', transition: 'width 0.4s' }} />
                                                    </div>
                                                    <span style={{ fontSize: 10, color: '#35354a', fontFamily: 'DM Mono, monospace' }}>{mod.hours}h</span>
                                                </div>
                                            </div>
                                            {done && (
                                                <div style={{
                                                    width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                                                    background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    boxShadow: `0 0 20px ${accent}99`,
                                                }}>
                                                    <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                                                        <path d="M1 4.5L4.5 8L10 1" stroke="#09090b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', gap: 10 }}>
                                            {[['theory', '📖 Theory'], ['pyqs', '📝 PYQs']].map(([key, label]) => (
                                                <div key={key} onClick={() => onToggle(id, key)} style={{
                                                    flex: 1, display: 'flex', alignItems: 'center', gap: 9,
                                                    padding: '10px 14px', borderRadius: 11, cursor: 'pointer',
                                                    background: tk[key] ? `${accent}1e` : 'rgba(255,255,255,0.04)',
                                                    border: `1.5px solid ${tk[key] ? accent + '60' : 'rgba(255,255,255,0.07)'}`,
                                                    transition: 'all 0.18s', WebkitTapHighlightColor: 'transparent',
                                                    boxShadow: tk[key] ? `0 2px 14px ${accent}22, inset 0 1px 0 ${accent}22` : 'inset 0 1px 0 rgba(255,255,255,0.03)',
                                                }}>
                                                    <div style={{
                                                        width: 17, height: 17, borderRadius: '50%', flexShrink: 0,
                                                        border: `2px solid ${tk[key] ? accent : 'rgba(255,255,255,0.16)'}`,
                                                        background: tk[key] ? accent : 'transparent',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        boxShadow: tk[key] ? `0 0 10px ${accent}aa` : 'none',
                                                        transition: 'all 0.18s',
                                                    }}>
                                                        {tk[key] && (
                                                            <svg width="9" height="7" viewBox="0 0 10 8" fill="none">
                                                                <path d="M1 4L4 7L9 1" stroke="#09090b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <span style={{ fontSize: 13, fontWeight: 500, fontFamily: 'DM Sans, sans-serif', color: tk[key] ? accent : '#555' }}>
                                                        {label}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* RIGHT — Analytics */}
                    <div style={{
                        width: 320, flexShrink: 0,
                        borderLeft: '1px solid rgba(255,255,255,0.06)',
                        overflowY: 'auto', padding: '32px 28px 48px',
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.012) 0%, transparent 100%)',
                        boxShadow: '-12px 0 40px rgba(0,0,0,0.35)',
                    }}>
                        <h3 style={{ fontSize: 14, fontWeight: 800, color: '#f0f0ee', fontFamily: 'Syne, sans-serif', letterSpacing: '-0.02em', marginBottom: 24 }}>
                            Analytics
                        </h3>

                        {/* Donut */}
                        <div style={{
                            background: 'linear-gradient(145deg, #141420 0%, #0f0f18 100%)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: 20, padding: '22px 18px 18px', marginBottom: 16,
                            boxShadow: `0 8px 40px rgba(0,0,0,0.55), 0 0 60px ${accent}0a, inset 0 1px 0 rgba(255,255,255,0.05)`,
                        }}>
                            <div style={{ fontSize: 10, color: '#35354a', fontFamily: 'DM Mono, monospace', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
                                Completion Rate
                            </div>
                            <div style={{ position: 'relative', height: 180 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={subjectPieData} cx="50%" cy="50%"
                                            innerRadius={55} outerRadius={80}
                                            paddingAngle={subjectPieData.length > 1 ? 3 : 0}
                                            dataKey="value" startAngle={90} endAngle={-270}
                                            stroke="none" animationBegin={0} animationDuration={900}
                                        >
                                            {subjectPieData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div style={{
                                    position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                                    alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
                                }}>
                                    <div style={{ fontSize: 36, fontWeight: 700, color: '#f0f0ee', fontFamily: 'DM Mono, monospace', letterSpacing: '-0.05em', lineHeight: 1, textShadow: `0 0 36px ${accent}66` }}>
                                        {pct}%
                                    </div>
                                    <div style={{ fontSize: 11, color: '#555', fontFamily: 'DM Sans, sans-serif', marginTop: 5 }}>complete</div>
                                </div>
                            </div>
                        </div>

                        {/* Stats grid 2x3 */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                            {[
                                { label: 'Modules', val: `${modsDone}/${subject.modules.length}`, col: accent },
                                { label: 'Tasks', val: `${c}/${t}`, col: ACCENTS[1] },
                                { label: 'Theory ✓', val: `${theoryDone}/${subject.modules.length}`, col: ACCENTS[2] },
                                { label: 'PYQs ✓', val: `${pyqsDone}/${subject.modules.length}`, col: ACCENTS[3] },
                                { label: 'Hrs Done', val: `${doneHours}h`, col: ACCENTS[4] },
                                { label: 'Total Hrs', val: `${totalHours}h`, col: '#55556a' },
                            ].map(({ label, val, col }) => (
                                <div key={label} style={{
                                    background: 'linear-gradient(145deg, #141420 0%, #0f0f18 100%)',
                                    border: '1px solid rgba(255,255,255,0.07)',
                                    borderRadius: 14, padding: '14px 16px',
                                    boxShadow: '0 4px 16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
                                }}>
                                    <div style={{ fontSize: 9, color: '#35354a', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{label}</div>
                                    <div style={{ fontSize: 20, fontWeight: 700, color: col, fontFamily: 'DM Mono, monospace', textShadow: col !== '#55556a' ? `0 0 20px ${col}55` : 'none' }}>{val}</div>
                                </div>
                            ))}
                        </div>

                        {/* Per-module bars */}
                        <div style={{
                            background: 'linear-gradient(145deg, #141420 0%, #0f0f18 100%)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: 20, padding: '22px 22px',
                            boxShadow: '0 8px 36px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)',
                        }}>
                            <div style={{ fontSize: 10, color: '#35354a', fontFamily: 'DM Mono, monospace', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 18 }}>
                                Module Breakdown
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
                                {subject.modules.map((mod, mi) => {
                                    const id = `${sIdx}-${mi}`;
                                    const tk = tasks[id] || {};
                                    const modPct = ((tk.theory ? 1 : 0) + (tk.pyqs ? 1 : 0)) / 2 * 100;
                                    const done = !!(tk.theory && tk.pyqs);
                                    return (
                                        <div key={mi}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                                                <span style={{
                                                    fontSize: 12, color: done ? accent : '#555',
                                                    fontFamily: 'DM Sans, sans-serif', fontWeight: done ? 600 : 400,
                                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200,
                                                }}>
                                                    {mod.name}
                                                </span>
                                                <span style={{ fontSize: 10, color: done ? accent : '#35354a', fontFamily: 'DM Mono, monospace', flexShrink: 0, marginLeft: 8 }}>
                                                    {modPct === 100 ? '✓' : `${modPct}%`}
                                                </span>
                                            </div>
                                            <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)' }}>
                                                <div style={{
                                                    height: '100%', width: `${modPct}%`,
                                                    background: done ? `linear-gradient(90deg, ${accent}99, ${accent})` : `${accent}88`,
                                                    borderRadius: 2, transition: 'width 0.5s ease',
                                                    boxShadow: modPct > 0 ? `0 0 8px ${accent}66` : 'none',
                                                }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ── Main ──────────────────────────────────────────────────────────────────────
    export default function StudyTracker({ token, username, apiUrl, onLogout }) {
        const [tasks, setTasks] = useState({});
        const [examDate, setExamDate] = useState(null);
        const [showSetup, setShowSetup] = useState(false);
        const [firstRun, setFirstRun] = useState(false);
        const [selected, setSelected] = useState(null);
        const [toasts, setToasts] = useState([]);
        const [saved, setSaved] = useState(false);
        const [streak, setStreak] = useState(0);
        const [studyDates, setStudyDates] = useState([]);
        const saveTimer = useRef(null);
        const toastId = useRef(0);
        const didInit = useRef(false);

        useEffect(() => {
            fetch(`${apiUrl}/progress`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    const date = data.examDate;
                    const savedTasks = data.tasks;
                    const dates = JSON.parse(data.studyDates || '[]');

                    if (!date) { setFirstRun(true); setShowSetup(true); } else setExamDate(date);

                    if (savedTasks && savedTasks !== '{}') {
                        setTasks(JSON.parse(savedTasks));
                    } else {
                        const init = {};
                        SUBJECTS.forEach((s, si) => s.modules.forEach((_, mi) => {
                            init[`${si}-${mi}`] = { theory: false, pyqs: false };
                        }));
                        setTasks(init);
                    }
                    setStudyDates(dates);
                    setStreak(getStreak(dates));
                    didInit.current = true;
                })
                .catch(err => console.error('Failed to load progress', err));
        }, [apiUrl, token]);

        useEffect(() => {
            if (!didInit.current || !Object.keys(tasks).length) return;
            clearTimeout(saveTimer.current);
            saveTimer.current = setTimeout(() => {
                fetch(`${apiUrl}/progress`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        tasks,
                        examDate,
                        studyDates
                    })
                })
                    .then(() => {
                        setSaved(true);
                        setTimeout(() => setSaved(false), 2000);
                    });
            }, 1000);
        }, [tasks, examDate, studyDates, apiUrl, token]);

        const saveDate = (d) => { setExamDate(d); setShowSetup(false); setFirstRun(false); };
        const addToast = (msg, emoji = '✅') => { const id = ++toastId.current; setToasts(p => [...p, { id, msg, emoji }]); };

        const toggleTask = (taskId, type) => {
            setTasks(prev => {
                const was = prev[taskId] || {};
                const next = { ...prev, [taskId]: { ...was, [type]: !was[type] } };
                const now = next[taskId];
                if (now.theory && now.pyqs && !(was.theory && was.pyqs)) {
                    const [si, mi] = taskId.split('-').map(Number);
                    addToast(`${SUBJECTS[si]?.modules[mi]?.name} done!`, '🎉');
                }
                return next;
            });

            const today = todayStr();
            setStudyDates(prev => {
                if (!prev.includes(today)) {
                    const next = [...prev, today];
                    setStreak(getStreak(next));
                    return next;
                }
                return prev;
            });
        };

        const resetAll = () => {
            if (!confirm('Reset all progress?')) return;
            const init = {};
            SUBJECTS.forEach((s, si) => s.modules.forEach((_, mi) => {
                init[`${si}-${mi}`] = { theory: false, pyqs: false };
            }));
            setTasks(init);
            setExamDate(null);
            setStudyDates([]);
            setFirstRun(true);
            setShowSetup(true);
        };

        let totalTasks = 0, completedTasks = 0, completedMods = 0, totalMods = 0;
        SUBJECTS.forEach((s, si) => s.modules.forEach((_, mi) => {
            const t = tasks[`${si}-${mi}`] || {};
            totalTasks += 2; totalMods++;
            if (t.theory) completedTasks++; if (t.pyqs) completedTasks++;
            if (t.theory && t.pyqs) completedMods++;
        }));
        const overallPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        const remaining = totalTasks - completedTasks;
        const daysLeft = daysUntil(examDate);
        const dailyNeeded = daysLeft > 0 && remaining > 0 ? Math.ceil(remaining / daysLeft) : 0;

        const pace = (() => {
            if (daysLeft === null) return null;
            if (remaining === 0) return { label: 'All done', col: '#34d99e', bg: '#34d99e12' };
            if (daysLeft <= 0) return { label: 'Exam day!', col: '#a89cf7', bg: '#a89cf712' };
            if (dailyNeeded <= 3) return { label: 'On track', col: '#34d99e', bg: '#34d99e12' };
            if (dailyNeeded <= 7) return { label: 'Pace up', col: '#f0b840', bg: '#f0b84012' };
            return { label: 'Behind', col: '#f07c56', bg: '#f07c5612' };
        })();

        const completedBySubject = SUBJECTS.map((s, si) => ({
            name: s.short, value: subPct(tasks, si, s).c, fill: ACCENTS[si],
        })).filter(d => d.value > 0);
        const pieData = [
            ...completedBySubject,
            ...(remaining > 0 ? [{ name: 'remaining', value: remaining, fill: 'rgba(255,255,255,0.05)' }] : []),
        ];
        const displayPie = pieData.length > 0 ? pieData : [{ name: 'empty', value: 1, fill: 'rgba(255,255,255,0.05)' }];

        const css = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { background: #09090d; height: 100%; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-thumb { background: #1e1e2a; border-radius: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    .subj-card { transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s; cursor: pointer; -webkit-tap-highlight-color: transparent; }
    .subj-card:hover { transform: translateY(-4px); }
    .subj-card:active { transform: scale(0.98); }
    .ctrl-btn { transition: all 0.18s; border: 1px solid rgba(255,255,255,0.08); }
    .ctrl-btn:hover { background: rgba(255,255,255,0.07) !important; color: #ccc !important; }
    .legend-chip { transition: all 0.15s; }
    .legend-chip:hover { opacity: 0.75; transform: scale(0.97); }
    @keyframes dashIn {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes detailIn {
      from { opacity: 0; transform: translateX(28px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    .dash-anim { animation: dashIn 0.38s cubic-bezier(0.4,0,0.2,1) both; }
    .detail-anim { animation: detailIn 0.32s cubic-bezier(0.4,0,0.2,1) both; }
  `;

        return (
            <>
                <style>{css}</style>
                <ParticleCanvas />

                <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', zIndex: 400, display: 'flex', flexDirection: 'column-reverse', gap: 8, alignItems: 'center', pointerEvents: 'none' }}>
                    {toasts.map(t => <Toast key={t.id} msg={t.msg} emoji={t.emoji} onDone={() => setToasts(p => p.filter(x => x.id !== t.id))} />)}
                </div>

                {showSetup && <SetupModal onSave={saveDate} onCancel={firstRun ? null : () => setShowSetup(false)} existing={!firstRun ? examDate : null} />}

                <div style={{ position: 'relative', zIndex: 1 }}>

                    {/* Detail overlay */}
                    {selected !== null && (
                        <div className="detail-anim" style={{ position: 'fixed', inset: 0, background: '#09090d', zIndex: 50 }}>
                            <DetailPanel subject={SUBJECTS[selected]} sIdx={selected} tasks={tasks} onToggle={toggleTask} onBack={() => setSelected(null)} />
                        </div>
                    )}

                    {/* Main Dashboard */}
                    <div className="dash-anim" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

                        {/* Top Nav */}
                        <div style={{
                            height: 64, borderBottom: '1px solid rgba(255,255,255,0.06)',
                            background: 'rgba(9,9,14,0.95)', backdropFilter: 'blur(20px)',
                            display: 'flex', alignItems: 'center', padding: '0 36px', gap: 20,
                            position: 'sticky', top: 0, zIndex: 30,
                            boxShadow: '0 4px 40px rgba(0,0,0,0.65)',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginRight: 6 }}>
                                <div style={{
                                    width: 34, height: 34, borderRadius: 10,
                                    background: 'linear-gradient(135deg, #a89cf7, #5badf7)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 17, boxShadow: '0 4px 20px rgba(168,156,247,0.45)',
                                }}>📚</div>
                                <div>
                                    <div style={{ fontSize: 16, fontWeight: 800, color: '#f0f0ee', fontFamily: 'Syne, sans-serif', letterSpacing: '-0.04em', lineHeight: 1 }}>
                                        {username}'s Board
                                    </div>
                                    <div style={{ fontSize: 9, color: '#35354a', fontFamily: 'DM Mono, monospace', letterSpacing: '0.1em' }}>
                                        STUDY DASHBOARD
                                    </div>
                                </div>
                            </div>

                            <div style={{ width: 1, height: 30, background: 'rgba(255,255,255,0.07)' }} />

                            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flex: 1 }}>
                                {daysLeft !== null && (
                                    <div style={{
                                        padding: '5px 14px', borderRadius: 9, fontSize: 12, fontWeight: 600, fontFamily: 'DM Mono, monospace',
                                        background: daysLeft <= 3 ? '#f07c5616' : daysLeft <= 7 ? '#f0b84016' : '#34d99e16',
                                        color: daysLeft <= 3 ? '#f07c56' : daysLeft <= 7 ? '#f0b840' : '#34d99e',
                                        border: `1px solid ${daysLeft <= 3 ? '#f07c5628' : daysLeft <= 7 ? '#f0b84028' : '#34d99e28'}`,
                                        boxShadow: '0 2px 10px rgba(0,0,0,0.35)',
                                    }}>
                                        {daysLeft <= 0 ? '🏁 Exam day' : `📅 ${daysLeft} days left`}
                                    </div>
                                )}
                                {streak > 0 && (
                                    <div style={{ padding: '5px 14px', borderRadius: 9, fontSize: 12, fontWeight: 600, background: '#f0b84016', color: '#f0b840', fontFamily: 'DM Mono, monospace', border: '1px solid #f0b84028', boxShadow: '0 2px 10px rgba(0,0,0,0.35)' }}>
                                        🔥 {streak} day streak
                                    </div>
                                )}
                                {saved && <span style={{ fontSize: 11, color: '#34d99e66', fontFamily: 'DM Mono, monospace', fontWeight: 500 }}>✓ saved</span>}
                            </div>

                            <div style={{ display: 'flex', gap: 8 }}>
                                <button onClick={() => { setFirstRun(false); setShowSetup(true); }} className="ctrl-btn" style={{
                                    padding: '7px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', color: '#555',
                                    fontSize: 12, fontFamily: 'DM Mono, monospace', cursor: 'pointer', letterSpacing: '0.03em',
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.35)',
                                }}>
                                    Set Date
                                </button>
                                <button onClick={resetAll} className="ctrl-btn" style={{
                                    padding: '7px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', color: '#555',
                                    fontSize: 12, fontFamily: 'DM Mono, monospace', cursor: 'pointer', letterSpacing: '0.03em',
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.35)',
                                }}>
                                    Reset
                                </button>
                                <button onClick={onLogout} className="ctrl-btn" style={{
                                    padding: '7px 16px', borderRadius: 10, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444',
                                    border: '1px solid rgba(239, 68, 68, 0.2)', fontSize: 12, fontFamily: 'DM Mono, monospace', cursor: 'pointer', letterSpacing: '0.03em',
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.35)',
                                }}>
                                    Log out
                                </button>
                            </div>
                        </div>

                        {/* Dashboard body */}
                        <div style={{ display: 'flex', flex: 1 }}>

                            {/* LEFT SIDEBAR — 290px */}
                            <div style={{
                                width: 290, flexShrink: 0,
                                borderRight: '1px solid rgba(255,255,255,0.05)',
                                padding: '28px 24px 48px',
                                overflowY: 'auto',
                                background: 'linear-gradient(180deg, rgba(255,255,255,0.010) 0%, transparent 70%)',
                                boxShadow: '6px 0 32px rgba(0,0,0,0.28)',
                            }}>

                                {/* Pace */}
                                {pace && (
                                    <div style={{
                                        background: pace.bg,
                                        border: `1px solid ${pace.col}28`,
                                        borderRadius: 16, padding: '16px 18px', marginBottom: 22,
                                        boxShadow: `0 4px 28px rgba(0,0,0,0.45), 0 0 40px ${pace.col}0a, inset 0 1px 0 ${pace.col}14`,
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                                            <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', background: pace.col, color: '#09090b', fontFamily: 'DM Mono, monospace' }}>
                                                {pace.label}
                                            </span>
                                            {dailyNeeded > 0 && (
                                                <span style={{ fontSize: 24, fontWeight: 700, color: pace.col, fontFamily: 'DM Mono, monospace', letterSpacing: '-0.04em', textShadow: `0 0 24px ${pace.col}66` }}>
                                                    {dailyNeeded}<span style={{ fontSize: 11, fontWeight: 500 }}>/day</span>
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ fontSize: 12, color: '#45455a', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.5 }}>
                                            {remaining === 0 ? 'You finished everything! 🎉' : daysLeft > 0 ? `${remaining} tasks across ${daysLeft} days` : `${remaining} tasks still remaining`}
                                        </div>
                                    </div>
                                )}

                                {/* 2×2 stat grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 22 }}>
                                    <StatBox label="Done" val={`${overallPct}%`} col={ACCENTS[0]} sub="overall" />
                                    <StatBox label="Tasks" val={`${completedTasks}`} col={ACCENTS[1]} sub={`of ${totalTasks}`} />
                                    <StatBox label="Modules" val={`${completedMods}`} col={ACCENTS[2]} sub={`of ${totalMods}`} />
                                    <StatBox label="Target" val={remaining === 0 ? '🎉' : dailyNeeded > 0 ? `${dailyNeeded}` : '—'} col={ACCENTS[3]} sub={remaining === 0 ? 'all done' : 'per day'} />
                                </div>

                                {/* Donut */}
                                <div style={{
                                    background: 'linear-gradient(145deg, #141420 0%, #0f0f18 100%)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: 22, padding: '24px 18px 18px',
                                    boxShadow: '0 10px 50px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
                                }}>
                                    <div style={{ fontSize: 10, color: '#35354a', fontFamily: 'DM Mono, monospace', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
                                        Progress Breakdown
                                    </div>
                                    <div style={{ position: 'relative', height: 220 }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={displayPie} cx="50%" cy="50%"
                                                    innerRadius={68} outerRadius={98}
                                                    paddingAngle={displayPie.length > 1 ? 2 : 0}
                                                    dataKey="value" startAngle={90} endAngle={-270}
                                                    stroke="none" animationBegin={0} animationDuration={1100}
                                                >
                                                    {displayPie.map((e, i) => <Cell key={i} fill={e.fill} />)}
                                                </Pie>
                                                <Tooltip content={({ active, payload }) => {
                                                    if (!active || !payload?.length) return null;
                                                    const d = payload[0].payload;
                                                    if (d.name === 'remaining' || d.name === 'empty') return null;
                                                    return (
                                                        <div style={{ background: '#1a1a26', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 14px', fontSize: 12, color: '#f0f0ee', fontFamily: 'DM Mono, monospace', boxShadow: '0 10px 30px rgba(0,0,0,0.6)' }}>
                                                            {d.name}: {d.value} tasks
                                                        </div>
                                                    );
                                                }} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                                            <div style={{ fontSize: 44, fontWeight: 700, color: '#f0f0ee', fontFamily: 'DM Mono, monospace', letterSpacing: '-0.05em', lineHeight: 1 }}>
                                                {overallPct}%
                                            </div>
                                            <div style={{ fontSize: 12, color: '#555', marginTop: 6, fontFamily: 'DM Sans, sans-serif' }}>
                                                {remaining > 0 ? `${remaining} tasks left` : '🎉 all done'}
                                            </div>
                                        </div>
                                    </div>
                                    {/* Legend */}
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: 4 }}>
                                        {SUBJECTS.map((s, si) => {
                                            const { pct } = subPct(tasks, si, s);
                                            return (
                                                <div key={si} className="legend-chip" onClick={() => setSelected(si)} style={{
                                                    display: 'flex', alignItems: 'center', gap: 5,
                                                    padding: '4px 11px', borderRadius: 20, cursor: 'pointer',
                                                    background: GLOW[si], border: `1px solid ${ACCENTS[si]}30`,
                                                    boxShadow: `0 2px 8px rgba(0,0,0,0.3)`,
                                                }}>
                                                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: ACCENTS[si], boxShadow: `0 0 6px ${ACCENTS[si]}` }} />
                                                    <span style={{ fontSize: 11, fontWeight: 600, color: ACCENTS[si], fontFamily: 'DM Mono, monospace' }}>{s.short}</span>
                                                    <span style={{ fontSize: 10, color: '#555', fontFamily: 'DM Mono, monospace' }}>{pct}%</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT — Subject Grid */}
                            <div style={{ flex: 1, overflowY: 'auto', padding: '32px 32px 48px' }}>
                                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 26 }}>
                                    <div>
                                        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f0f0ee', fontFamily: 'Syne, sans-serif', letterSpacing: '-0.04em', marginBottom: 5 }}>
                                            Subjects
                                        </h2>
                                        <div style={{ fontSize: 13, color: '#35354a', fontFamily: 'DM Sans, sans-serif' }}>
                                            Click any subject to open tasks &amp; track progress
                                        </div>
                                    </div>
                                    <div style={{ fontSize: 12, color: '#35354a', fontFamily: 'DM Mono, monospace' }}>
                                        {completedMods}/{totalMods} modules done
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
                                    {SUBJECTS.map((s, si) => {
                                        const { c, t, pct } = subPct(tasks, si, s);
                                        const accent = ACCENTS[si];
                                        const doneMods = s.modules.filter((_, mi) => { const tk = tasks[`${si}-${mi}`] || {}; return tk.theory && tk.pyqs; }).length;

                                        return (
                                            <div key={si} className="subj-card" onClick={() => setSelected(si)} style={{
                                                background: pct > 0
                                                    ? `linear-gradient(145deg, ${accent}0d 0%, #0f0f18 65%)`
                                                    : 'linear-gradient(145deg, #121219 0%, #0d0d16 100%)',
                                                border: `1px solid ${pct > 0 ? accent + '48' : 'rgba(255,255,255,0.07)'}`,
                                                borderRadius: 22, padding: '26px 24px',
                                                boxShadow: pct > 0
                                                    ? `0 8px 48px rgba(0,0,0,0.55), 0 0 80px ${accent}0c, inset 0 1px 0 ${accent}1a`
                                                    : `0 6px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)`,
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
                                                    <div style={{
                                                        padding: '5px 12px', borderRadius: 9, fontSize: 11, fontWeight: 700,
                                                        color: accent, background: `${accent}1c`,
                                                        fontFamily: 'DM Mono, monospace', letterSpacing: '0.05em',
                                                        border: `1px solid ${accent}30`,
                                                        boxShadow: `0 2px 12px ${accent}1a`,
                                                    }}>
                                                        {s.short}
                                                    </div>
                                                    <div style={{
                                                        fontSize: 15, fontWeight: 700, fontFamily: 'DM Mono, monospace',
                                                        color: pct === 100 ? '#09090b' : accent,
                                                        background: pct === 100 ? accent : `${accent}22`,
                                                        padding: '4px 12px', borderRadius: 9,
                                                        boxShadow: pct === 100 ? `0 0 20px ${accent}77` : `0 2px 8px rgba(0,0,0,0.3)`,
                                                        border: `1px solid ${pct === 100 ? 'transparent' : accent + '30'}`,
                                                    }}>
                                                        {pct}%
                                                    </div>
                                                </div>

                                                <div style={{ fontSize: 10, color: '#35354a', fontFamily: 'DM Mono, monospace', marginBottom: 8, letterSpacing: '0.06em' }}>
                                                    {s.code}
                                                </div>

                                                <div style={{
                                                    fontSize: 16, fontWeight: 700, color: '#d5d5d0',
                                                    fontFamily: 'Syne, sans-serif', lineHeight: 1.35, marginBottom: 20,
                                                    letterSpacing: '-0.02em', minHeight: 48,
                                                }}>
                                                    {s.name}
                                                </div>

                                                <div style={{ height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 3, overflow: 'hidden', marginBottom: 14, boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.5)' }}>
                                                    <div style={{
                                                        height: '100%', width: `${pct}%`,
                                                        background: `linear-gradient(90deg, ${accent}88, ${accent})`,
                                                        borderRadius: 3, transition: 'width 0.7s ease',
                                                        boxShadow: pct > 0 ? `0 0 12px ${accent}99` : 'none',
                                                    }} />
                                                </div>

                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div style={{ display: 'flex', gap: 14 }}>
                                                        <span style={{ fontSize: 12, color: '#35354a', fontFamily: 'DM Mono, monospace' }}>
                                                            <span style={{ color: doneMods > 0 ? accent : '#35354a', fontWeight: 600 }}>{doneMods}</span>/{s.modules.length} mods
                                                        </span>
                                                        <span style={{ fontSize: 12, color: '#35354a', fontFamily: 'DM Mono, monospace' }}>
                                                            <span style={{ color: c > 0 ? accent : '#35354a', fontWeight: 600 }}>{c}</span>/{t} tasks
                                                        </span>
                                                    </div>
                                                    <span style={{ fontSize: 11, color: '#35354a', fontFamily: 'DM Mono, monospace', opacity: 0.7 }}>Open →</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
