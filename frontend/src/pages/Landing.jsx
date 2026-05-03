import { motion, useScroll, useTransform } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

const images = {
  hero: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80',
  neural: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
  research: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
  data: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
  paper: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80',
  brain: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
}

export default function Landing() {
  const navigate = useNavigate()
  const { scrollY } = useScroll()
  const yParallax = useTransform(scrollY, [0, 500], [0, -80])
  const [ringRotation, setRingRotation] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const interval = setInterval(() => {
      setRingRotation(r => r + 0.2)
    }, 16)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleMouse = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      })
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050510',
      overflow: 'hidden',
      fontFamily: 'Inter, sans-serif'
    }}>

      {/* NAVBAR */}
      <nav style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        padding: '20px 48px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        background: 'rgba(5,5,16,0.7)'
      }}>
        <div style={{
          fontSize: '18px',
          fontWeight: '800',
          color: '#fff',
          letterSpacing: '0.15em'
        }}>⚖️ VERITAS</div>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          {[
            { label: 'ABOUT', href: '#about' },
            { label: 'HOW IT WORKS', href: '#how' },
            { label: 'FEATURES', href: '#features' }
          ].map(item => (
            <span
              key={item.label}
              onClick={() => {
                const el = document.querySelector(item.href)
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }}
              style={{
                color: 'rgba(255,255,255,0.4)',
                fontSize: '12px',
                letterSpacing: '0.1em',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'color 0.2s'
              }}
              onMouseEnter={e => e.target.style.color = '#FFD700'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.4)'}
            >{item.label}</span>
          ))}
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: '#FFD700',
              color: '#050510',
              border: 'none',
              padding: '10px 24px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '800',
              fontSize: '12px',
              letterSpacing: '0.1em'
            }}>
            GET STARTED →
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div style={{
        position: 'relative',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {/* Background */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            radial-gradient(ellipse at 50% 0%, #1a0040 0%, #050510 50%),
            radial-gradient(ellipse at 20% 80%, #001a40 0%, transparent 60%),
            radial-gradient(ellipse at 80% 80%, #1a0020 0%, transparent 60%)
          `
        }} />

        {/* Stars */}
        {[...Array(120)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: Math.random() > 0.9 ? '2px' : '1px',
            height: Math.random() > 0.9 ? '2px' : '1px',
            background: 'white',
            borderRadius: '50%',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            opacity: Math.random() * 0.8 + 0.2
          }} />
        ))}

        {/* Hero image — AI brain with parallax */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            x: mousePos.x,
            y: mousePos.y,
            zIndex: 1
          }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${images.hero})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.12,
            filter: 'saturate(0.5) hue-rotate(200deg)'
          }} />
        </motion.div>

        {/* Rotating ring */}
        <div style={{
          position: 'absolute',
          bottom: '5%',
          left: '50%',
          transform: `translateX(-50%) rotate(${ringRotation}deg)`,
          zIndex: 3,
          width: '520px',
          height: '520px'
        }}>
          <svg viewBox="0 0 520 520" width="520" height="520">
            <defs>
              <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFD700" stopOpacity="0.9" />
                <stop offset="40%" stopColor="#fb923c" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            <circle cx="260" cy="260" r="240" fill="none"
              stroke="url(#ringGrad)" strokeWidth="1.5"
              strokeDasharray="8 4" />
            <circle cx="260" cy="260" r="200" fill="none"
              stroke="rgba(255,215,0,0.15)" strokeWidth="0.8"
              strokeDasharray="3 8" />
            {[...Array(36)].map((_, i) => {
              const angle = (i / 36) * Math.PI * 2
              const r1 = 235
              const r2 = i % 6 === 0 ? 218 : 228
              return (
                <line key={i}
                  x1={260 + r1 * Math.cos(angle)}
                  y1={260 + r1 * Math.sin(angle)}
                  x2={260 + r2 * Math.cos(angle)}
                  y2={260 + r2 * Math.sin(angle)}
                  stroke={i % 6 === 0 ? '#FFD700' : 'rgba(255,215,0,0.3)'}
                  strokeWidth={i % 6 === 0 ? '2' : '0.8'}
                />
              )
            })}
          </svg>
        </div>

        {/* Ray lines */}
        <div style={{
          position: 'absolute', bottom: 0,
          left: '50%', transform: 'translateX(-50%)',
          zIndex: 2
        }}>
          <svg width="1000" height="500" viewBox="0 0 1000 500">
            {[...Array(28)].map((_, i) => {
              const angle = (i / 28) * Math.PI
              const x2 = 500 + Math.cos(angle - Math.PI / 2) * 800
              const y2 = 500 + Math.sin(angle - Math.PI / 2) * 800
              return (
                <line key={i} x1="500" y1="500"
                  x2={x2} y2={y2}
                  stroke="#FFD700" strokeWidth="0.5" opacity="0.06" />
              )
            })}
          </svg>
        </div>

        {/* Pink cross */}
        <div style={{
          position: 'absolute', bottom: '14%',
          left: '50%', transform: 'translateX(-50%)',
          zIndex: 4
        }}>
          <div style={{ position: 'relative', width: '260px', height: '260px' }}>
            <div style={{
              position: 'absolute', width: '100%', height: '85px',
              top: '50%', left: 0, transform: 'translateY(-50%)',
              background: 'rgba(244,63,94,0.4)', backdropFilter: 'blur(3px)'
            }} />
            <div style={{
              position: 'absolute', width: '85px', height: '100%',
              top: 0, left: '50%', transform: 'translateX(-50%)',
              background: 'rgba(244,63,94,0.4)', backdropFilter: 'blur(3px)'
            }} />
          </div>
        </div>

        {/* Mountain */}
        <div style={{
          position: 'absolute', bottom: 0, left: '50%',
          transform: 'translateX(-50%)', zIndex: 5, width: '100%'
        }}>
          <svg viewBox="0 0 1440 300" width="100%" height="300"
            preserveAspectRatio="none">
            <defs>
              <linearGradient id="mtnGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2d1b69" />
                <stop offset="100%" stopColor="#050510" />
              </linearGradient>
              <radialGradient id="glowGrad" cx="50%" cy="30%" r="50%">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.5" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>
            </defs>
            <ellipse cx="720" cy="80" rx="220" ry="90"
              fill="url(#glowGrad)" />
            <path
              d="M0,300 L200,180 L320,220 L450,120 L580,200 L720,50 L860,190 L990,140 L1120,210 L1250,170 L1440,250 L1440,300 Z"
              fill="url(#mtnGrad)" />
            <path
              d="M0,300 L150,260 L350,240 L550,260 L720,200 L900,255 L1100,245 L1300,260 L1440,270 L1440,300 Z"
              fill="#050510" opacity="0.8" />
          </svg>
        </div>

        {/* Head silhouette */}
        <div style={{
          position: 'absolute', bottom: 0,
          left: '50%', transform: 'translateX(-50%)',
          zIndex: 6, width: '220px', height: '360px'
        }}>
          <svg viewBox="0 0 220 360" width="220" height="360">
            <defs>
              <radialGradient id="headGlow" cx="50%" cy="40%" r="50%">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#2d1b69" stopOpacity="1" />
              </radialGradient>
            </defs>
            <path
              d="M110,10 C55,10 20,55 20,110 C20,155 40,190 70,210 L70,360 L150,360 L150,210 C180,190 200,155 200,110 C200,55 165,10 110,10 Z"
              fill="url(#headGlow)" />
            <circle cx="110" cy="100" r="20" fill="#f97316" opacity="0.15" />
            <circle cx="110" cy="100" r="8" fill="#fbbf24" opacity="0.9" />
            <circle cx="110" cy="100" r="3" fill="#fff" />
          </svg>
        </div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          style={{
            position: 'absolute', top: '14%',
            left: 0, right: 0,
            textAlign: 'center', zIndex: 10,
            padding: '0 40px'
          }}>
          <div style={{
            color: 'rgba(255,255,255,0.35)',
            fontSize: '11px',
            letterSpacing: '0.3em',
            marginBottom: '20px',
            textTransform: 'uppercase'
          }}>
            Research Integrity Platform ®
          </div>
          <div style={{
            fontSize: 'clamp(36px, 5.5vw, 76px)',
            fontWeight: '900',
            color: '#FFD700',
            letterSpacing: '0.08em',
            lineHeight: '1.05',
            textTransform: 'uppercase',
            textShadow: '0 0 60px rgba(255,215,0,0.3)'
          }}>
            <div>ELIMINATE THE UNKNOWN.</div>
            <div>TRANSFORM THE KNOWN.</div>
          </div>
          <p style={{
            color: 'rgba(255,255,255,0.4)',
            fontSize: '15px',
            marginTop: '20px',
            letterSpacing: '0.03em',
            lineHeight: '1.7',
            maxWidth: '520px',
            margin: '20px auto 0'
          }}>
            A next-generation research integrity platform.<br />
            Every claim anchored. Every hallucination exposed.
          </p>
          <div style={{
            display: 'flex', gap: '16px',
            justifyContent: 'center', marginTop: '32px'
          }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/dashboard')}
              style={{
                background: '#FFD700', color: '#050510',
                border: 'none', padding: '14px 36px',
                borderRadius: '4px', cursor: 'pointer',
                fontWeight: '800', fontSize: '13px',
                letterSpacing: '0.12em'
              }}>
              START ANALYSING →
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              style={{
                background: 'transparent', color: '#FFD700',
                border: '1px solid rgba(255,215,0,0.4)',
                padding: '14px 36px', borderRadius: '4px',
                cursor: 'pointer', fontWeight: '700',
                fontSize: '13px', letterSpacing: '0.12em'
              }}>
              SEE HOW IT WORKS
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* MARQUEE */}
      <div style={{
        background: '#FFD700', padding: '14px 0',
        overflow: 'hidden', whiteSpace: 'nowrap'
      }}>
        <motion.div
          animate={{ x: [0, -1400] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{ display: 'inline-block' }}>
          {[...Array(8)].map((_, i) => (
            <span key={i} style={{
              color: '#050510', fontSize: '13px',
              fontWeight: '800', letterSpacing: '0.15em',
              marginRight: '60px'
            }}>
              ELIMINATE THE UNKNOWN · TRANSFORM THE KNOWN ·
              RESEARCH INTEGRITY · POWERED BY AI ·&nbsp;
            </span>
          ))}
        </motion.div>
      </div>

      {/* VISUAL FEATURES SECTION */}
      <div id="features" style={{ background: '#050510', padding: '120px 60px' }}>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '80px' }}>
          <div style={{
            color: 'rgba(255,215,0,0.5)', fontSize: '11px',
            letterSpacing: '0.3em', marginBottom: '16px'
          }}>
            WHAT WE DO
          </div>
          <div style={{
            fontSize: 'clamp(32px, 4vw, 54px)',
            fontWeight: '900', color: '#fff',
            letterSpacing: '0.04em', lineHeight: '1.1'
          }}>
            THREE LAYERS OF <span style={{ color: '#FFD700' }}>INTEGRITY.</span>
          </div>
        </motion.div>

        {/* Feature 1 — DNA with image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '60px', alignItems: 'center',
            marginBottom: '100px'
          }}>
          <div>
            <div style={{
              color: 'rgba(255,215,0,0.5)', fontSize: '11px',
              letterSpacing: '0.3em', marginBottom: '16px'
            }}>01 — KNOWLEDGE DNA</div>
            <h2 style={{
              fontSize: '42px', fontWeight: '900',
              color: '#fff', lineHeight: '1.1',
              marginBottom: '20px'
            }}>
              See the complete<br />
              <span style={{ color: '#FFD700' }}>topic landscape.</span>
            </h2>
            <p style={{
              color: 'rgba(255,255,255,0.45)',
              fontSize: '16px', lineHeight: '1.8',
              marginBottom: '32px'
            }}>
              Every research paper and essay gets converted into a visual
              DNA strand. Colored blocks represent topics. Block height
              shows depth of coverage. Missing topics appear as glowing
              red outlines — impossible to ignore.
            </p>
            <div style={{ display: 'flex', gap: '24px' }}>
              {['Topic Mapping', 'Gap Detection', 'Coverage Score'].map(tag => (
                <span key={tag} style={{
                  background: 'rgba(255,215,0,0.08)',
                  border: '1px solid rgba(255,215,0,0.2)',
                  color: '#FFD700', padding: '6px 14px',
                  borderRadius: '4px', fontSize: '12px',
                  fontWeight: '700', letterSpacing: '0.05em'
                }}>{tag}</span>
              ))}
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{
              borderRadius: '16px', overflow: 'hidden',
              border: '1px solid rgba(255,215,0,0.15)',
              position: 'relative'
            }}>
              <img
                src={images.neural}
                alt="Knowledge DNA visualization"
                style={{
                  width: '100%', height: '320px',
                  objectFit: 'cover', display: 'block',
                  filter: 'saturate(0.7) hue-rotate(200deg)'
                }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, rgba(255,215,0,0.15) 0%, rgba(139,92,246,0.15) 100%)'
              }} />
              <div style={{
                position: 'absolute', bottom: 20, left: 20,
                background: 'rgba(5,5,16,0.85)',
                border: '1px solid rgba(255,215,0,0.3)',
                borderRadius: '8px', padding: '12px 16px'
              }}>
                <div style={{ color: '#FFD700', fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em' }}>🧬 KNOWLEDGE DNA</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginTop: '4px' }}>6 topics mapped · 2 gaps detected</div>
              </div>
            </div>
            {/* Glow effect */}
            <div style={{
              position: 'absolute', inset: '-20px',
              background: 'radial-gradient(ellipse, rgba(255,215,0,0.05) 0%, transparent 70%)',
              zIndex: -1, pointerEvents: 'none'
            }} />
          </div>
        </motion.div>

        {/* Feature 2 — Heatmap with image (reversed) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '60px', alignItems: 'center',
            marginBottom: '100px'
          }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              borderRadius: '16px', overflow: 'hidden',
              border: '1px solid rgba(239,68,68,0.2)',
              position: 'relative'
            }}>
              <img
                src={images.research}
                alt="Hallucination Heatmap"
                style={{
                  width: '100%', height: '320px',
                  objectFit: 'cover', display: 'block',
                  filter: 'saturate(0.5) hue-rotate(320deg)'
                }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, rgba(239,68,68,0.2) 0%, rgba(251,146,60,0.1) 100%)'
              }} />
              <div style={{
                position: 'absolute', bottom: 20, left: 20,
                background: 'rgba(5,5,16,0.85)',
                border: '1px solid rgba(239,68,68,0.4)',
                borderRadius: '8px', padding: '12px 16px'
              }}>
                <div style={{ color: '#ef4444', fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em' }}>🌡️ HEATMAP ACTIVE</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginTop: '4px' }}>3 hallucinations detected</div>
              </div>
            </div>
            <div style={{
              position: 'absolute', inset: '-20px',
              background: 'radial-gradient(ellipse, rgba(239,68,68,0.05) 0%, transparent 70%)',
              zIndex: -1, pointerEvents: 'none'
            }} />
          </div>
          <div>
            <div style={{
              color: 'rgba(239,68,68,0.7)', fontSize: '11px',
              letterSpacing: '0.3em', marginBottom: '16px'
            }}>02 — HALLUCINATION HEATMAP</div>
            <h2 style={{
              fontSize: '42px', fontWeight: '900',
              color: '#fff', lineHeight: '1.1',
              marginBottom: '20px'
            }}>
              Catch fake citations<br />
              <span style={{ color: '#ef4444' }}>before they cost you.</span>
            </h2>
            <p style={{
              color: 'rgba(255,255,255,0.45)',
              fontSize: '16px', lineHeight: '1.8',
              marginBottom: '32px'
            }}>
              Every sentence in your essay gets a color code in real time.
              Green means verified against the paper. Yellow means weak match.
              Red means no anchor found — a potential AI hallucination.
              Hover any sentence to see the exact source quote.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              {[
                { label: '✓ Verified', color: '#22c55e' },
                { label: '⚠ Weak', color: '#eab308' },
                { label: '✗ Hallucinated', color: '#ef4444' }
              ].map(tag => (
                <span key={tag.label} style={{
                  background: `${tag.color}15`,
                  border: `1px solid ${tag.color}40`,
                  color: tag.color, padding: '6px 14px',
                  borderRadius: '4px', fontSize: '12px',
                  fontWeight: '700'
                }}>{tag.label}</span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Feature 3 — Graph with image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '60px', alignItems: 'center'
          }}>
          <div>
            <div style={{
              color: 'rgba(139,92,246,0.7)', fontSize: '11px',
              letterSpacing: '0.3em', marginBottom: '16px'
            }}>03 — KNOWLEDGE GRAPH</div>
            <h2 style={{
              fontSize: '42px', fontWeight: '900',
              color: '#fff', lineHeight: '1.1',
              marginBottom: '20px'
            }}>
              Trace every claim<br />
              <span style={{ color: '#8b5cf6' }}>to its source.</span>
            </h2>
            <p style={{
              color: 'rgba(255,255,255,0.45)',
              fontSize: '16px', lineHeight: '1.8',
              marginBottom: '32px'
            }}>
              An interactive visual graph maps every essay sentence to
              its matching paper chunk. Blue nodes are your claims.
              Purple nodes are paper sources. Red borders mean no match
              found. Edge thickness shows confidence of the connection.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              {[
                { label: '● Essay Claims', color: '#3b82f6' },
                { label: '● Paper Sources', color: '#8b5cf6' },
                { label: '● Unverified', color: '#ef4444' }
              ].map(tag => (
                <span key={tag.label} style={{
                  color: tag.color, fontSize: '12px',
                  fontWeight: '700', letterSpacing: '0.05em'
                }}>{tag.label}</span>
              ))}
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{
              borderRadius: '16px', overflow: 'hidden',
              border: '1px solid rgba(139,92,246,0.2)',
              position: 'relative'
            }}>
              <img
                src={images.data}
                alt="Knowledge Graph"
                style={{
                  width: '100%', height: '320px',
                  objectFit: 'cover', display: 'block',
                  filter: 'saturate(0.6) hue-rotate(240deg)'
                }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(139,92,246,0.2) 100%)'
              }} />
              <div style={{
                position: 'absolute', bottom: 20, left: 20,
                background: 'rgba(5,5,16,0.85)',
                border: '1px solid rgba(139,92,246,0.4)',
                borderRadius: '8px', padding: '12px 16px'
              }}>
                <div style={{ color: '#8b5cf6', fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em' }}>🕸️ KNOWLEDGE GRAPH</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginTop: '4px' }}>12 nodes · 8 verified connections</div>
              </div>
            </div>
            <div style={{
              position: 'absolute', inset: '-20px',
              background: 'radial-gradient(ellipse, rgba(139,92,246,0.06) 0%, transparent 70%)',
              zIndex: -1, pointerEvents: 'none'
            }} />
          </div>
        </motion.div>
      </div>

      {/* STATS SECTION */}
      <div style={{
        background: '#0a0420',
        borderTop: '1px solid rgba(255,215,0,0.08)',
        borderBottom: '1px solid rgba(255,215,0,0.08)',
        padding: '80px 60px',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '40px',
        textAlign: 'center'
      }}>
        {[
          { number: '3', label: 'Analysis Layers', color: '#FFD700' },
          { number: '< 60s', label: 'Analysis Time', color: '#22c55e' },
          { number: '100%', label: 'Source Verified', color: '#3b82f6' },
          { number: '0', label: 'Hallucinations Missed', color: '#ef4444' }
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}>
            <div style={{
              fontSize: '52px', fontWeight: '900',
              color: stat.color, letterSpacing: '-0.02em',
              lineHeight: '1'
            }}>{stat.number}</div>
            <div style={{
              color: 'rgba(255,255,255,0.4)',
              fontSize: '13px', marginTop: '8px',
              letterSpacing: '0.1em', fontWeight: '600'
            }}>{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* HOW IT WORKS */}
      <div id="how" style={{ background: '#050510', padding: '120px 60px' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '80px' }}>
          <div style={{
            color: 'rgba(255,215,0,0.5)', fontSize: '11px',
            letterSpacing: '0.3em', marginBottom: '16px'
          }}>HOW IT WORKS</div>
          <div style={{
            fontSize: 'clamp(28px, 3.5vw, 48px)',
            fontWeight: '900', color: '#fff', letterSpacing: '0.04em'
          }}>
            THREE STEPS TO <span style={{ color: '#FFD700' }}>TRUTH.</span>
          </div>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2px'
        }}>
          {[
            {
              step: '01',
              title: 'UPLOAD YOUR PAPER',
              desc: 'Drag and drop any research PDF. Veritas parses every page and builds an AI knowledge index in seconds.',
              icon: '📄',
              color: '#FFD700'
            },
            {
              step: '02',
              title: 'PASTE YOUR ESSAY',
              desc: 'Paste your draft or AI-generated essay. Every sentence will be individually checked against the paper.',
              icon: '✏️',
              color: '#22c55e'
            },
            {
              step: '03',
              title: 'SEE THE TRUTH',
              desc: 'Get your Knowledge DNA, Hallucination Heatmap, and Knowledge Graph in under 60 seconds.',
              icon: '⚡',
              color: '#8b5cf6'
            }
          ].map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              style={{
                background: '#0a0420',
                border: `1px solid ${step.color}20`,
                padding: '48px 40px'
              }}>
              <div style={{ fontSize: '48px', marginBottom: '24px' }}>{step.icon}</div>
              <div style={{
                color: step.color, fontSize: '11px',
                letterSpacing: '0.2em', marginBottom: '12px',
                fontWeight: '700'
              }}>{step.step}</div>
              <h3 style={{
                fontSize: '20px', fontWeight: '800',
                color: '#fff', letterSpacing: '0.05em',
                marginBottom: '16px'
              }}>{step.title}</h3>
              <p style={{
                color: 'rgba(255,255,255,0.4)',
                fontSize: '14px', lineHeight: '1.8'
              }}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA SECTION */}
      <div style={{
        background: '#0a0420',
        padding: '120px 60px',
        textAlign: 'center',
        borderTop: '1px solid rgba(255,215,0,0.08)'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}>
          <div style={{
            fontSize: 'clamp(32px, 5vw, 64px)',
            fontWeight: '900', color: '#fff',
            letterSpacing: '0.04em', lineHeight: '1.1',
            marginBottom: '24px'
          }}>
            READY TO ELIMINATE<br />
            <span style={{ color: '#FFD700' }}>THE UNKNOWN?</span>
          </div>
          <p style={{
            color: 'rgba(255,255,255,0.35)',
            fontSize: '16px', marginBottom: '48px',
            letterSpacing: '0.03em'
          }}>
            Upload your paper. Paste your essay. See the truth in under 60 seconds.
          </p>
          <motion.button
            whileHover={{ scale: 1.05, background: '#fff' }}
            onClick={() => navigate('/dashboard')}
            style={{
              background: '#FFD700', color: '#050510',
              border: 'none', padding: '18px 64px',
              borderRadius: '4px', cursor: 'pointer',
              fontWeight: '800', fontSize: '15px',
              letterSpacing: '0.12em',
              transition: 'background 0.2s'
            }}>
            START ANALYSING →
          </motion.button>
        </motion.div>
      </div>

      {/* FOOTER */}
      <div style={{
        background: '#050510',
        borderTop: '1px solid rgba(255,215,0,0.08)',
        padding: '48px 80px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{
          fontSize: '18px', fontWeight: '800',
          color: '#FFD700', letterSpacing: '0.15em'
        }}>⚖️ VERITAS</div>
        <div style={{
          color: 'rgba(255,255,255,0.15)',
          fontSize: '12px', letterSpacing: '0.1em'
        }}>
          VERITAS · RESEARCH INTEGRITY · 2025
        </div>
        <div style={{ display: 'flex', gap: '24px' }}>
          {['PRIVACY', 'TERMS', 'CONTACT'].map(link => (
            <span key={link} style={{
              color: 'rgba(255,255,255,0.25)',
              fontSize: '11px', letterSpacing: '0.1em',
              cursor: 'pointer'
            }}>{link}</span>
          ))}
        </div>
      </div>
    </div>
  )
}