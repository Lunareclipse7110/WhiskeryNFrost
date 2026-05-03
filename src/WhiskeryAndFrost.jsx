import { useState, useEffect, useRef } from "react";

// ── API base URL — change this when you deploy ──────────────
const API = "https://whiskerynfrost.onrender.com";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --navy-deep: #070f1c; --navy: #0d1f3c; --navy-mid: #162a50; --navy-light: #1e3a6e;
    --beige: #e8d5b0; --beige-pale: #fdf8f3; --gold: #c9a96e; --gold-light: #e8c98a;
    --cream: #faf5ee; --white: #ffffff; --text-light: rgba(255,255,255,0.85);
    --text-muted: rgba(255,255,255,0.5); --error: #e05c5c; --success: #4caf7d;
  }
  html { scroll-behavior: smooth; }
  body { font-family: 'Jost', sans-serif; background: var(--cream); color: var(--navy); overflow-x: hidden; }
  ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: var(--navy-deep); }
  ::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 3px; }

  .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; padding: 0 60px; display: flex; align-items: center; justify-content: space-between; height: 80px; transition: all 0.4s ease; }
  .nav.scrolled { background: rgba(7,15,28,0.96); backdrop-filter: blur(12px); height: 68px; border-bottom: 1px solid rgba(201,169,110,0.2); }
  .nav-logo { display: flex; flex-direction: column; align-items: flex-start; text-decoration: none; }
  .nav-logo-main { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: var(--white); letter-spacing: 3px; text-transform: uppercase; line-height: 1; }
  .nav-logo-sub { font-family: 'Cormorant Garamond', serif; font-size: 10px; font-style: italic; color: var(--gold); letter-spacing: 4px; text-transform: uppercase; margin-top: 2px; }
  .nav-links { display: flex; gap: 40px; list-style: none; }
  .nav-links a { font-family: 'Jost', sans-serif; font-size: 12px; font-weight: 500; color: var(--text-light); text-decoration: none; letter-spacing: 2.5px; text-transform: uppercase; position: relative; transition: color 0.3s; cursor: pointer; }
  .nav-links a::after { content: ''; position: absolute; bottom: -4px; left: 0; width: 0; height: 1px; background: var(--gold); transition: width 0.3s ease; }
  .nav-links a:hover { color: var(--gold); } .nav-links a:hover::after { width: 100%; }
  .nav-cta { padding: 10px 28px; background: transparent; border: 1px solid var(--gold); color: var(--gold); font-family: 'Jost', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; cursor: pointer; transition: all 0.3s ease; }
  .nav-cta:hover { background: var(--gold); color: var(--navy-deep); }

  .hero { position: relative; height: 100vh; min-height: 700px; background: var(--navy-deep); display: flex; align-items: center; overflow: hidden; }
  .hero-bg { position: absolute; inset: 0; background-image: radial-gradient(ellipse 80% 80% at 70% 50%, rgba(30,58,110,0.6) 0%, transparent 60%), radial-gradient(ellipse 40% 60% at 20% 80%, rgba(201,169,110,0.08) 0%, transparent 50%); }
  .hero-lines { position: absolute; inset: 0; overflow: hidden; }
  .hero-lines::before { content: ''; position: absolute; top: 0; right: 28%; width: 1px; height: 100%; background: linear-gradient(to bottom, transparent, rgba(201,169,110,0.3) 30%, rgba(201,169,110,0.3) 70%, transparent); }
  .hero-lines::after { content: ''; position: absolute; top: 0; right: 55%; width: 1px; height: 100%; background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.05) 30%, rgba(255,255,255,0.05) 70%, transparent); }
  .hero-orb { position: absolute; right: 8%; top: 50%; transform: translateY(-50%); width: 380px; height: 380px; border: 1px solid rgba(201,169,110,0.15); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
  .hero-orb::before { content: ''; position: absolute; width: 300px; height: 300px; border: 1px solid rgba(201,169,110,0.1); border-radius: 50%; }
  .hero-orb-letter { font-family: 'Playfair Display', serif; font-size: 100px; color: rgba(201,169,110,0.08); font-weight: 300; font-style: italic; user-select: none; }
  .hero-content { position: relative; z-index: 2; padding: 0 60px; max-width: 700px; animation: heroIn 1.2s ease both; }
  @keyframes heroIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  .hero-tag { display: inline-flex; align-items: center; gap: 12px; margin-bottom: 28px; }
  .hero-tag-line { width: 40px; height: 1px; background: var(--gold); }
  .hero-tag span { font-size: 11px; font-weight: 500; color: var(--gold); letter-spacing: 4px; text-transform: uppercase; }
  .hero-title { font-family: 'Playfair Display', serif; font-size: clamp(52px,7vw,88px); font-weight: 600; line-height: 1.05; color: var(--white); margin-bottom: 12px; }
  .hero-title em { font-style: italic; color: var(--gold); display: block; }
  .hero-sub { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 300; font-style: italic; color: rgba(232,213,176,0.7); margin-bottom: 40px; line-height: 1.5; }
  .hero-btns { display: flex; gap: 20px; }
  .btn-gold { padding: 16px 44px; background: var(--gold); color: var(--navy-deep); font-family: 'Jost', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; border: none; cursor: pointer; transition: all 0.3s; position: relative; overflow: hidden; }
  .btn-gold::after { content: ''; position: absolute; inset: 0; background: rgba(255,255,255,0.15); transform: translateX(-100%); transition: transform 0.3s; }
  .btn-gold:hover::after { transform: translateX(0); } .btn-gold:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(201,169,110,0.4); }
  .btn-outline { padding: 16px 44px; background: transparent; color: var(--white); font-family: 'Jost', sans-serif; font-size: 11px; font-weight: 500; letter-spacing: 3px; text-transform: uppercase; border: 1px solid rgba(255,255,255,0.3); cursor: pointer; transition: all 0.3s; }
  .btn-outline:hover { border-color: rgba(255,255,255,0.7); transform: translateY(-2px); }
  .hero-scroll { position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 8px; animation: bounce 2s ease-in-out infinite; }
  .hero-scroll span { font-size: 10px; letter-spacing: 3px; color: var(--gold); text-transform: uppercase; }
  .scroll-line { width: 1px; height: 50px; background: linear-gradient(to bottom, var(--gold), transparent); }
  @keyframes bounce { 0%,100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(8px); } }
  .hero-stats { position: absolute; bottom: 40px; right: 60px; display: flex; gap: 48px; }
  .stat { text-align: right; }
  .stat-n { font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 600; color: var(--gold); display: block; line-height: 1; }
  .stat-l { font-size: 10px; letter-spacing: 2px; color: var(--text-muted); text-transform: uppercase; margin-top: 4px; }

  .marquee-band { background: var(--navy); padding: 18px 0; overflow: hidden; border-top: 1px solid rgba(201,169,110,0.2); border-bottom: 1px solid rgba(201,169,110,0.2); }
  .marquee-track { display: flex; animation: mq 30s linear infinite; width: max-content; }
  @keyframes mq { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  .mq-item { display: flex; align-items: center; gap: 20px; padding: 0 40px; white-space: nowrap; }
  .mq-item span { font-family: 'Cormorant Garamond', serif; font-size: 16px; font-style: italic; font-weight: 300; color: rgba(232,213,176,0.6); letter-spacing: 2px; }
  .mq-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--gold); flex-shrink: 0; }

  .section { padding: 100px 60px; }
  .sec-label { display: inline-flex; align-items: center; gap: 12px; margin-bottom: 20px; }
  .sec-label-line { width: 30px; height: 1px; background: var(--gold); }
  .sec-label span { font-size: 10px; font-weight: 600; letter-spacing: 4px; color: var(--gold); text-transform: uppercase; }
  .sec-title { font-family: 'Playfair Display', serif; font-size: clamp(36px,4vw,56px); font-weight: 600; line-height: 1.1; color: var(--navy); }
  .sec-title.light { color: var(--white); } .sec-title em { font-style: italic; color: var(--gold); }

  /* MENU */
  .menu-section { background: var(--beige-pale); }
  .menu-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 60px; flex-wrap: wrap; gap: 24px; }
  .menu-filter { display: flex; gap: 8px; flex-wrap: wrap; }
  .fbtn { padding: 8px 20px; background: transparent; border: 1px solid rgba(13,31,60,0.2); color: rgba(13,31,60,0.5); font-family: 'Jost', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; transition: all 0.25s; }
  .fbtn.active, .fbtn:hover { background: var(--navy); border-color: var(--navy); color: var(--gold); }
  .menu-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 28px; }

  /* Loading skeleton */
  .skeleton-card { background: var(--white); height: 340px; animation: shimmer 1.5s ease-in-out infinite; }
  @keyframes shimmer { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
  .menu-error { text-align: center; padding: 60px 20px; }
  .menu-error-icon { font-size: 48px; display: block; margin-bottom: 16px; }
  .menu-error-txt { font-family: 'Cormorant Garamond', serif; font-size: 18px; font-style: italic; color: rgba(13,31,60,0.5); margin-bottom: 20px; }
  .retry-btn { padding: 12px 28px; background: var(--navy); border: none; color: var(--gold); font-family: 'Jost', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; }

  .mcard { background: var(--white); position: relative; overflow: hidden; cursor: pointer; transition: transform 0.35s, box-shadow 0.35s; animation: cardIn 0.5s ease both; }
  @keyframes cardIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .mcard:hover { transform: translateY(-6px); box-shadow: 0 20px 60px rgba(13,31,60,0.12); }
  .mcard-img { height: 220px; overflow: hidden; position: relative; display: flex; align-items: center; justify-content: center; }
  .mcard-emoji { font-size: 72px; transition: transform 0.4s; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.1)); }
  .mcard:hover .mcard-emoji { transform: scale(1.1) translateY(-4px); }
  .mcard-badge { position: absolute; top: 16px; left: 16px; padding: 4px 12px; background: var(--navy); color: var(--gold); font-size: 9px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; }
  .mcard-body { padding: 24px; }
  .mcard-cat { font-size: 9px; font-weight: 600; letter-spacing: 3px; color: var(--gold); text-transform: uppercase; margin-bottom: 6px; }
  .mcard-name { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 600; color: var(--navy); margin-bottom: 8px; line-height: 1.2; }
  .mcard-desc { font-family: 'Cormorant Garamond', serif; font-size: 15px; font-style: italic; color: rgba(13,31,60,0.55); line-height: 1.5; margin-bottom: 20px; }
  .mcard-foot { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(201,169,110,0.2); padding-top: 16px; }
  .mcard-price { font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 600; color: var(--navy); }
  .add-btn { width: 40px; height: 40px; background: var(--navy); border: none; color: var(--gold); font-size: 22px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.25s; }
  .add-btn:hover { background: var(--gold); color: var(--navy); }
  .add-btn.added { background: var(--gold); color: var(--navy); font-size: 16px; }

  /* STORY */
  .story-section { background: var(--navy-deep); display: grid; grid-template-columns: 1fr 1fr; min-height: 600px; overflow: hidden; }
  .story-vis { position: relative; background: linear-gradient(135deg, var(--navy-mid) 0%, var(--navy-deep) 100%); display: flex; align-items: center; justify-content: center; overflow: hidden; }
  .story-vis-inner { position: relative; z-index: 2; text-align: center; }
  .story-big { font-family: 'Playfair Display', serif; font-size: 180px; font-weight: 700; color: rgba(201,169,110,0.08); line-height: 1; display: block; letter-spacing: -8px; user-select: none; }
  .story-badge { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 200px; height: 200px; border: 1px solid rgba(201,169,110,0.2); border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; }
  .story-badge::before { content: ''; position: absolute; width: 170px; height: 170px; border: 1px solid rgba(201,169,110,0.1); border-radius: 50%; }
  .story-badge-year { font-family: 'Playfair Display', serif; font-size: 48px; font-weight: 700; color: var(--gold); line-height: 1; }
  .story-badge-txt { font-size: 9px; letter-spacing: 3px; color: var(--text-muted); text-transform: uppercase; }
  .story-content { padding: 80px 70px; display: flex; flex-direction: column; justify-content: center; }
  .story-body { font-family: 'Cormorant Garamond', serif; font-size: 19px; font-weight: 300; font-style: italic; color: rgba(232,213,176,0.75); line-height: 1.8; margin: 24px 0 40px; }
  .pillars { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .pillar { padding: 24px; border: 1px solid rgba(201,169,110,0.15); transition: border-color 0.3s; }
  .pillar:hover { border-color: rgba(201,169,110,0.4); }
  .pillar-icon { font-size: 28px; margin-bottom: 12px; display: block; }
  .pillar-title { font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 600; color: var(--white); margin-bottom: 6px; }
  .pillar-text { font-size: 12px; line-height: 1.6; color: var(--text-muted); }

  /* SPECIALTIES */
  .spec-section { background: var(--cream); }
  .spec-grid { display: grid; grid-template-columns: 1.4fr 1fr 1fr; grid-template-rows: auto auto; gap: 20px; margin-top: 60px; }
  .sc { background: var(--navy); padding: 50px 40px; position: relative; overflow: hidden; transition: transform 0.3s; }
  .sc:hover { transform: translateY(-4px); }
  .sc.feat { grid-row: span 2; background: linear-gradient(160deg, var(--navy-mid) 0%, var(--navy-deep) 100%); }
  .sc-glow { position: absolute; bottom: -40px; right: -40px; width: 150px; height: 150px; background: radial-gradient(circle, rgba(201,169,110,0.15) 0%, transparent 70%); border-radius: 50%; }
  .sc-num { font-family: 'Playfair Display', serif; font-size: 13px; font-weight: 600; color: rgba(201,169,110,0.4); letter-spacing: 3px; margin-bottom: 24px; display: block; }
  .sc-emoji { font-size: 52px; margin-bottom: 20px; display: block; }
  .sc-title { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 600; color: var(--white); margin-bottom: 12px; line-height: 1.2; }
  .sc.feat .sc-title { font-size: 36px; }
  .sc-desc { font-family: 'Cormorant Garamond', serif; font-size: 16px; font-style: italic; font-weight: 300; color: rgba(232,213,176,0.6); line-height: 1.6; }
  .sc-price { margin-top: 32px; font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 500; color: var(--gold); }
  .sc-price span { font-family: 'Jost', sans-serif; font-size: 11px; font-weight: 400; color: var(--text-muted); letter-spacing: 2px; margin-left: 8px; }

  /* TESTIMONIALS */
  .testi-section { background: var(--navy); padding: 100px 60px; }
  .testi-head { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 60px; }
  .testi-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
  .tc { background: rgba(255,255,255,0.04); border: 1px solid rgba(201,169,110,0.12); padding: 36px; transition: all 0.3s; }
  .tc:hover { background: rgba(255,255,255,0.07); border-color: rgba(201,169,110,0.25); transform: translateY(-4px); }
  .tc-quote { font-family: 'Playfair Display', serif; font-size: 52px; font-weight: 700; color: var(--gold); opacity: 0.3; line-height: 1; margin-bottom: 4px; display: block; }
  .tc-text { font-family: 'Cormorant Garamond', serif; font-size: 18px; font-style: italic; font-weight: 300; color: rgba(232,213,176,0.8); line-height: 1.7; margin-bottom: 28px; }
  .tc-author { display: flex; align-items: center; gap: 14px; }
  .tc-avatar { width: 42px; height: 42px; border-radius: 50%; background: var(--navy-light); display: flex; align-items: center; justify-content: center; font-size: 18px; border: 1px solid rgba(201,169,110,0.2); }
  .tc-name { font-family: 'Jost', sans-serif; font-size: 13px; font-weight: 600; color: var(--white); letter-spacing: 1px; }
  .tc-role { font-size: 11px; letter-spacing: 1.5px; color: var(--gold); text-transform: uppercase; margin-top: 2px; }
  .tc-stars { color: var(--gold); font-size: 13px; margin-bottom: 16px; }

  /* CTA */
  .cta-section { background: var(--beige-pale); padding: 100px 60px; display: flex; align-items: center; justify-content: space-between; gap: 60px; border-top: 1px solid rgba(201,169,110,0.2); }
  .cta-l { max-width: 580px; }
  .cta-title { font-family: 'Playfair Display', serif; font-size: clamp(36px,4vw,52px); font-weight: 600; color: var(--navy); line-height: 1.1; margin-bottom: 16px; }
  .cta-title em { font-style: italic; color: var(--gold); }
  .cta-txt { font-family: 'Cormorant Garamond', serif; font-size: 19px; font-style: italic; font-weight: 300; color: rgba(13,31,60,0.6); line-height: 1.6; margin-bottom: 40px; }
  .cta-form { display: flex; max-width: 480px; }
  .cta-inp { flex: 1; padding: 16px 22px; background: white; border: 1px solid rgba(13,31,60,0.15); border-right: none; font-family: 'Jost', sans-serif; font-size: 13px; color: var(--navy); outline: none; }
  .cta-inp::placeholder { color: rgba(13,31,60,0.35); } .cta-inp:focus { border-color: var(--gold); }
  .cta-sub { padding: 16px 32px; background: var(--navy); border: 1px solid var(--navy); color: var(--gold); font-family: 'Jost', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; }
  .cta-sub:hover { background: var(--navy-light); }
  .contact-list { list-style: none; }
  .contact-list li { display: flex; align-items: center; gap: 12px; padding: 14px 0; border-bottom: 1px solid rgba(201,169,110,0.2); font-family: 'Cormorant Garamond', serif; font-size: 17px; color: rgba(13,31,60,0.7); }
  .contact-list li:last-child { border-bottom: none; }
  .c-icon { color: var(--gold); font-size: 18px; }

  /* FOOTER */
  .footer { background: var(--navy-deep); padding: 70px 60px 30px; border-top: 1px solid rgba(201,169,110,0.15); }
  .footer-top { display: grid; grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: 60px; margin-bottom: 60px; }
  .f-brand { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; color: var(--white); letter-spacing: 3px; text-transform: uppercase; display: block; margin-bottom: 4px; }
  .f-tag { font-family: 'Cormorant Garamond', serif; font-size: 12px; font-style: italic; color: var(--gold); letter-spacing: 3px; display: block; margin-bottom: 20px; }
  .f-desc { font-family: 'Cormorant Garamond', serif; font-size: 15px; font-weight: 300; font-style: italic; color: var(--text-muted); line-height: 1.7; margin-bottom: 24px; }
  .f-socials { display: flex; gap: 12px; }
  .f-soc { width: 38px; height: 38px; border: 1px solid rgba(201,169,110,0.2); display: flex; align-items: center; justify-content: center; color: var(--text-muted); font-size: 11px; font-weight: 600; font-family: 'Jost', sans-serif; cursor: pointer; transition: all 0.25s; }
  .f-soc:hover { border-color: var(--gold); color: var(--gold); background: rgba(201,169,110,0.08); }
  .f-col-title { font-family: 'Jost', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 3px; color: var(--gold); text-transform: uppercase; margin-bottom: 24px; }
  .f-links { list-style: none; }
  .f-links li { margin-bottom: 12px; }
  .f-links a { font-family: 'Cormorant Garamond', serif; font-size: 15px; font-weight: 300; color: var(--text-muted); text-decoration: none; transition: color 0.25s; cursor: pointer; }
  .f-links a:hover { color: var(--beige); }
  .f-contact-item { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 16px; }
  .f-c-icon { color: var(--gold); font-size: 16px; margin-top: 2px; }
  .f-c-txt { font-family: 'Cormorant Garamond', serif; font-size: 15px; font-weight: 300; color: var(--text-muted); line-height: 1.5; }
  .footer-bottom { border-top: 1px solid rgba(255,255,255,0.05); padding-top: 28px; display: flex; justify-content: space-between; align-items: center; }
  .f-copy { font-size: 11px; letter-spacing: 1.5px; color: rgba(255,255,255,0.2); font-family: 'Jost', sans-serif; }
  .f-bot-links { display: flex; gap: 28px; }
  .f-bot-links a { font-size: 10px; letter-spacing: 2px; color: rgba(255,255,255,0.2); text-decoration: none; text-transform: uppercase; transition: color 0.25s; font-family: 'Jost', sans-serif; cursor: pointer; }
  .f-bot-links a:hover { color: var(--gold); }

  /* CART */
  .cart-overlay { position: fixed; inset: 0; z-index: 200; background: rgba(7,15,28,0.7); backdrop-filter: blur(4px); opacity: 0; pointer-events: none; transition: opacity 0.3s; }
  .cart-overlay.open { opacity: 1; pointer-events: all; }
  .cart-drawer { position: fixed; top: 0; right: 0; bottom: 0; z-index: 201; width: 480px; background: var(--navy-deep); border-left: 1px solid rgba(201,169,110,0.2); transform: translateX(100%); transition: transform 0.4s cubic-bezier(0.4,0,0.2,1); display: flex; flex-direction: column; }
  .cart-drawer.open { transform: translateX(0); }
  .cart-hdr { padding: 26px 32px 20px; border-bottom: 1px solid rgba(201,169,110,0.15); display: flex; justify-content: space-between; align-items: center; }
  .cart-hdr-title { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 600; color: var(--white); }
  .cart-close { width: 36px; height: 36px; background: transparent; border: 1px solid rgba(255,255,255,0.15); color: var(--white); font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.25s; }
  .cart-close:hover { border-color: var(--gold); color: var(--gold); }
  .cart-steps { display: flex; padding: 14px 32px; border-bottom: 1px solid rgba(201,169,110,0.1); }
  .cs { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 5px; position: relative; }
  .cs:not(:last-child)::after { content: ''; position: absolute; top: 11px; left: 58%; width: 84%; height: 1px; background: rgba(255,255,255,0.08); z-index: 0; }
  .cs.done::after, .cs.act::after { background: rgba(201,169,110,0.25); }
  .cs-dot { width: 22px; height: 22px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 700; color: var(--text-muted); z-index: 1; background: var(--navy-deep); transition: all 0.3s; font-family: 'Jost', sans-serif; }
  .cs.act .cs-dot { border-color: var(--gold); color: var(--gold); background: rgba(201,169,110,0.1); }
  .cs.done .cs-dot { border-color: var(--success); color: var(--navy-deep); background: var(--success); }
  .cs-lbl { font-size: 9px; letter-spacing: 1.5px; color: var(--text-muted); text-transform: uppercase; font-family: 'Jost', sans-serif; }
  .cs.act .cs-lbl { color: var(--gold); } .cs.done .cs-lbl { color: var(--success); }
  .cart-body { flex: 1; overflow-y: auto; padding: 20px 32px; }
  .ci { display: flex; gap: 14px; padding: 16px 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .ci-emoji { width: 54px; height: 54px; background: var(--navy-mid); display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0; }
  .ci-info { flex: 1; }
  .ci-name { font-family: 'Playfair Display', serif; font-size: 15px; color: var(--white); margin-bottom: 3px; }
  .ci-price { font-family: 'Cormorant Garamond', serif; font-size: 14px; font-style: italic; color: var(--gold); }
  .ci-ctrl { display: flex; align-items: center; gap: 10px; margin-top: 8px; }
  .qbtn { width: 26px; height: 26px; background: var(--navy-light); border: none; color: var(--white); font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
  .qbtn:hover { background: var(--gold); color: var(--navy); }
  .qnum { font-family: 'Jost', sans-serif; font-size: 14px; color: var(--white); min-width: 20px; text-align: center; }
  .cart-foot { padding: 18px 32px 26px; border-top: 1px solid rgba(201,169,110,0.15); }
  .tot-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
  .tot-lbl { font-family: 'Jost', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 2.5px; color: var(--text-muted); text-transform: uppercase; }
  .tot-sub { font-family: 'Cormorant Garamond', serif; font-size: 15px; color: var(--text-muted); font-style: italic; }
  .tot-grand { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 600; color: var(--gold); }
  .tot-divider { border: none; border-top: 1px solid rgba(201,169,110,0.15); margin: 12px 0 16px; }
  .cart-btn-primary { width: 100%; padding: 16px; background: var(--gold); border: none; color: var(--navy-deep); font-family: 'Jost', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; cursor: pointer; transition: all 0.3s; }
  .cart-btn-primary:hover { background: var(--gold-light); }
  .cart-btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }
  .cart-btn-back { width: 100%; padding: 11px; margin-top: 10px; background: transparent; border: 1px solid rgba(255,255,255,0.12); color: var(--text-muted); font-family: 'Jost', sans-serif; font-size: 10px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; transition: all 0.25s; }
  .cart-btn-back:hover { border-color: var(--gold); color: var(--gold); }
  .cart-empty-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; color: var(--text-muted); }
  .cart-empty-icon { font-size: 52px; opacity: 0.5; }
  .cart-empty-txt { font-family: 'Cormorant Garamond', serif; font-size: 18px; font-style: italic; text-align: center; }
  .cart-cnt { position: absolute; top: -8px; right: -8px; width: 20px; height: 20px; border-radius: 50%; background: var(--gold); color: var(--navy-deep); font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
  .cart-icon-wrap { position: relative; cursor: pointer; }

  /* ADDRESS */
  .addr-step { flex: 1; overflow-y: auto; padding: 20px 32px; }
  .step-title { font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 600; color: var(--white); margin-bottom: 16px; }
  .saved-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
  .saved-card { padding: 14px 16px; border: 1px solid rgba(255,255,255,0.1); cursor: pointer; transition: all 0.25s; background: rgba(255,255,255,0.03); position: relative; }
  .saved-card:hover { border-color: rgba(201,169,110,0.3); }
  .saved-card.sel { border-color: var(--gold); background: rgba(201,169,110,0.08); }
  .saved-card-lbl { font-family: 'Jost', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 2px; color: var(--gold); text-transform: uppercase; margin-bottom: 4px; }
  .saved-card-txt { font-family: 'Cormorant Garamond', serif; font-size: 14px; color: rgba(232,213,176,0.7); line-height: 1.5; }
  .sel-tick { position: absolute; top: 12px; right: 14px; color: var(--gold); font-size: 15px; }
  .or-div { display: flex; align-items: center; gap: 12px; margin: 18px 0; }
  .or-div-line { flex: 1; height: 1px; background: rgba(255,255,255,0.08); }
  .or-div span { font-size: 10px; letter-spacing: 2px; color: var(--text-muted); text-transform: uppercase; font-family: 'Jost', sans-serif; }
  .add-new-btn { width: 100%; padding: 12px; background: transparent; border: 1px dashed rgba(201,169,110,0.3); color: var(--gold); font-family: 'Jost', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; transition: all 0.25s; }
  .add-new-btn:hover { border-color: var(--gold); background: rgba(201,169,110,0.06); }
  .back-to-saved { font-size: 11px; color: var(--gold); cursor: pointer; letter-spacing: 1.5px; font-family: 'Jost', sans-serif; }
  .fg { margin-bottom: 14px; }
  .flabel { font-family: 'Jost', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 2px; color: var(--gold); text-transform: uppercase; display: block; margin-bottom: 7px; }
  .finput { width: 100%; padding: 11px 14px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); color: var(--white); font-family: 'Jost', sans-serif; font-size: 13px; outline: none; transition: border-color 0.25s; }
  .finput::placeholder { color: rgba(255,255,255,0.22); }
  .finput:focus { border-color: var(--gold); }
  .finput.err { border-color: var(--error); }
  .ferr { font-size: 10px; color: var(--error); margin-top: 3px; display: block; font-family: 'Jost', sans-serif; }
  .frow { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

  /* PAYMENT */
  .pay-step { flex: 1; overflow-y: auto; padding: 20px 32px; }
  .addr-prev { background: rgba(201,169,110,0.06); border: 1px solid rgba(201,169,110,0.15); padding: 13px 16px; margin-bottom: 18px; }
  .addr-prev-lbl { font-size: 9px; font-weight: 600; letter-spacing: 2px; color: var(--gold); text-transform: uppercase; font-family: 'Jost', sans-serif; margin-bottom: 5px; }
  .addr-prev-txt { font-family: 'Cormorant Garamond', serif; font-size: 14px; color: rgba(232,213,176,0.7); line-height: 1.5; }
  .ord-mini { background: rgba(255,255,255,0.04); border: 1px solid rgba(201,169,110,0.12); padding: 16px; margin-bottom: 20px; }
  .ord-mini-title { font-size: 10px; font-weight: 600; letter-spacing: 2px; color: var(--gold); text-transform: uppercase; font-family: 'Jost', sans-serif; margin-bottom: 12px; }
  .ord-row { display: flex; justify-content: space-between; padding: 5px 0; font-family: 'Cormorant Garamond', serif; font-size: 15px; color: rgba(232,213,176,0.65); }
  .ord-row.grand { border-top: 1px solid rgba(201,169,110,0.2); margin-top: 6px; padding-top: 10px; font-weight: 500; color: var(--gold); font-size: 17px; }
  .pay-opts { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
  .pay-opt { padding: 15px 16px; border: 1px solid rgba(255,255,255,0.1); cursor: pointer; transition: all 0.25s; display: flex; align-items: center; gap: 14px; background: rgba(255,255,255,0.03); }
  .pay-opt:hover { border-color: rgba(201,169,110,0.3); }
  .pay-opt.sel { border-color: var(--gold); background: rgba(201,169,110,0.08); }
  .pay-radio { width: 18px; height: 18px; border: 1px solid rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.25s; }
  .pay-opt.sel .pay-radio { border-color: var(--gold); }
  .pay-radio-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--gold); transform: scale(0); transition: transform 0.2s; }
  .pay-opt.sel .pay-radio-dot { transform: scale(1); }
  .pay-opt-icon { font-size: 22px; }
  .pay-opt-name { font-family: 'Jost', sans-serif; font-size: 14px; font-weight: 600; color: var(--white); }
  .pay-opt-desc { font-family: 'Cormorant Garamond', serif; font-size: 13px; font-style: italic; color: var(--text-muted); margin-top: 2px; }
  .upi-extra { margin-top: 14px; animation: fadeUp 0.3s ease; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
  .upi-chips { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 8px; }
  .upi-chip { padding: 4px 10px; border: 1px solid rgba(201,169,110,0.2); color: var(--gold); font-size: 10px; cursor: pointer; font-family: 'Jost', sans-serif; letter-spacing: 1px; transition: all 0.2s; }
  .upi-chip:hover { border-color: var(--gold); background: rgba(201,169,110,0.08); }

  /* SUCCESS */
  .success-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 32px; text-align: center; }
  .success-icon { font-size: 64px; margin-bottom: 20px; animation: popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
  @keyframes popIn { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .success-title { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 600; color: var(--white); margin-bottom: 10px; }
  .success-title em { font-style: italic; color: var(--gold); }
  .success-txt { font-family: 'Cormorant Garamond', serif; font-size: 17px; font-style: italic; font-weight: 300; color: var(--text-muted); line-height: 1.7; margin-bottom: 24px; }
  .success-oid { font-family: 'Jost', sans-serif; font-size: 11px; letter-spacing: 3px; color: var(--gold); text-transform: uppercase; background: rgba(201,169,110,0.1); padding: 10px 20px; margin-bottom: 16px; }
  .success-pay-tag { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; border: 1px solid rgba(201,169,110,0.2); margin-bottom: 16px; font-size: 12px; color: var(--text-muted); font-family: 'Jost', sans-serif; letter-spacing: 1px; }
  .success-addr { font-family: 'Cormorant Garamond', serif; font-size: 13px; font-style: italic; color: var(--text-muted); margin-bottom: 28px; line-height: 1.6; }
  .success-continue { padding: 14px 36px; background: var(--gold); border: none; color: var(--navy-deep); font-family: 'Jost', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; cursor: pointer; transition: all 0.3s; }
  .success-continue:hover { background: var(--gold-light); }

  /* Placing order spinner */
  .placing-wrap { display: flex; align-items: center; justify-content: center; gap: 10px; }
  .placing-spinner { width: 16px; height: 16px; border: 2px solid var(--navy-deep); border-top-color: transparent; border-radius: 50%; animation: spin 0.7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .toast { position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%) translateY(80px); background: var(--navy); border: 1px solid rgba(201,169,110,0.3); color: var(--white); padding: 13px 28px; font-family: 'Jost', sans-serif; font-size: 13px; font-weight: 500; letter-spacing: 1px; z-index: 300; transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s; opacity: 0; pointer-events: none; white-space: nowrap; }
  .toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }
  .tg { color: var(--gold); margin-right: 8px; }

  @media (max-width: 900px) {
    .nav { padding: 0 24px; } .nav-links { display: none; }
    .hero-content { padding: 0 24px; } .hero-orb { display: none; } .hero-stats { display: none; }
    .section { padding: 70px 24px; }
    .story-section { grid-template-columns: 1fr; } .story-content { padding: 60px 24px; }
    .spec-grid { grid-template-columns: 1fr; } .sc.feat { grid-row: span 1; }
    .testi-grid { grid-template-columns: 1fr; }
    .cta-section { flex-direction: column; padding: 70px 24px; }
    .footer-top { grid-template-columns: 1fr 1fr; gap: 40px; }
    .cart-drawer { width: 100%; } .frow { grid-template-columns: 1fr; }
  }
  /* ── AI RECOMMENDATIONS ─────────────────────────────────── */
  .rec-section { margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(201,169,110,0.15); }
  .rec-heading { font-family: 'Jost', sans-serif; font-size: 9px; font-weight: 600; letter-spacing: 3px; color: var(--gold); text-transform: uppercase; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
  .rec-heading::before { content: '✦ AI Picks for You'; }
  .rec-list { display: flex; flex-direction: column; gap: 8px; }
  .rec-card { display: flex; align-items: center; gap: 12px; padding: 10px 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); transition: all 0.25s; cursor: pointer; }
  .rec-card:hover { border-color: rgba(201,169,110,0.3); background: rgba(201,169,110,0.05); }
  .rec-emoji { font-size: 22px; width: 32px; text-align: center; flex-shrink: 0; }
  .rec-info { flex: 1; min-width: 0; }
  .rec-name { font-family: 'Playfair Display', serif; font-size: 13px; color: var(--white); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .rec-reason { font-family: 'Cormorant Garamond', serif; font-size: 12px; font-style: italic; color: var(--text-muted); margin-top: 2px; }
  .rec-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
  .rec-price { font-family: 'Playfair Display', serif; font-size: 14px; color: var(--gold); }
  .rec-add { background: none; border: 1px solid rgba(201,169,110,0.3); color: var(--gold); width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 16px; line-height: 1; transition: all 0.2s; padding: 0; }
  .rec-add:hover { background: var(--gold); color: var(--navy-deep); border-color: var(--gold); }
  .rec-loading { display: flex; align-items: center; gap: 10px; padding: 10px 0; color: var(--text-muted); font-family: 'Cormorant Garamond', serif; font-size: 14px; font-style: italic; }
  .rec-spin { width: 12px; height: 12px; border: 1px solid rgba(201,169,110,0.3); border-top-color: var(--gold); border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0; }
`;

const SAVED_ADDRS = [
  { id: "home",   label: "Home",   text: "12, Brigade Road, Shivajinagar, Bengaluru – 560001" },
  { id: "office", label: "Office", text: "Level 4, HQTC, Electronic City Phase 1, Bengaluru – 560006" },
];

const TESTIMONIALS = [
  { name: "Rohan M.",  role: "Food Critic",  text: "Every morning begins here. The croissants alone are reason enough — pure, unadulterated craft.", stars: 5, av: "👨" },
  { name: "Priya K.",  role: "Food Blogger", text: "The chocolate fondant changed my understanding of what a dessert can be. Genuinely special.", stars: 5, av: "👩🏽" },
  { name: "Ananya S.", role: "Regular Guest", text: "From the matcha latte to the sourdough, everything feels like it was made specifically for you.", stars: 5, av: "👩" },
];

const MQ = ["Artisan Breads","French Pastries","Signature Cakes","Specialty Beverages","Baked Fresh Daily","Est. 2018","Crafted with Love"];

export default function FrostAndFlour() {
  const [scrolled, setScrolled]   = useState(false);
  const [filter, setFilter]       = useState("All");

  // ── Menu from DB ──────────────────────────────────────────
  const [menuItems, setMenuItems]   = useState([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuError, setMenuError]   = useState(null);

  // ── Cart ──────────────────────────────────────────────────
  const [cart, setCart]           = useState([]);
  const [open, setOpen]           = useState(false);
  const [step, setStep]           = useState(0);
  const [toast, setToast]         = useState({ show: false, msg: "" });
  const [addedIds, setAddedIds]   = useState({});
  const [email, setEmail] = useState("");
  // ── AI Recommendations ────────────────────────────────────
  const [recs, setRecs]           = useState([]);
  const [recsLoading, setRecsLoading] = useState(false);

  // ── Address ───────────────────────────────────────────────
  const [savedSel, setSavedSel]   = useState(null);
  const [useNew, setUseNew]       = useState(false);
  const [nAddr, setNAddr]         = useState({ name:"", phone:"", line1:"", line2:"", city:"Bengaluru", pin:"" });
  const [aErr, setAErr]           = useState({});

  // ── Payment ───────────────────────────────────────────────
  const [payM, setPayM]           = useState(null);
  const [upiId, setUpiId]         = useState("");
  const [upiErr, setUpiErr]       = useState("");
  const [placing, setPlacing]     = useState(false);
  const [oid, setOid]             = useState("");

  const menuRef = useRef(null);

  // ── Fetch AI recommendations ──────────────────────────────
  const fetchRecs = async (cartItems) => {
    if (!cartItems || cartItems.length === 0) { setRecs([]); return; }
    setRecsLoading(true);
    try {
      const res  = await fetch(`${API}/recommendations`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ cartItems, currentFilter: filter }),
      });
      const json = await res.json();
      if (json.success) setRecs(json.data);
    } catch { setRecs([]); }
    finally { setRecsLoading(false); }
  };

  // ── Fetch menu from API on mount ─────────────────────────
  const fetchMenu = async () => {
    setMenuLoading(true);
    setMenuError(null);
    try {
      const res  = await fetch(`${API}/menu`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setMenuItems(json.data);
    } catch (err) {
      setMenuError("Could not load menu. Is the server running?");
    } finally {
      setMenuLoading(false);
    }
  };

  useEffect(() => { fetchMenu(); }, []);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  useEffect(() => {
  if (open && step === 0 && cart.length > 0) {
    fetchRecs(cart);
  }
  if (!open) {
    setRecs([]);   // clear old recs when drawer closes so next open feels fresh
  }
}, [open]);

  const cats  = ["All", ...Array.from(new Set(menuItems.map(i => i.category)))];
  const shown = filter === "All" ? menuItems : menuItems.filter(i => i.category === filter);

  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const count    = cart.reduce((s, c) => s + c.qty, 0);
  const delFee   = subtotal > 0 ? 49 : 0;
  const grand    = subtotal + delFee;

  const toast_ = (msg) => { setToast({show:true,msg}); setTimeout(() => setToast({show:false,msg:""}), 2800); };

  const filterScroll = (cat) => {
    setFilter(cat);
    setTimeout(() => menuRef.current?.scrollIntoView({behavior:"smooth", block:"start"}), 60);
  };

  const addToCart = (item) => {
    setCart(prev => { const ex = prev.find(c => c._id===item._id); return ex ? prev.map(c => c._id===item._id ? {...c,qty:c.qty+1} : c) : [...prev,{...item,qty:1}]; });
    setAddedIds(p => ({...p, [item._id]:true}));
    setTimeout(() => setAddedIds(p => ({...p, [item._id]:false})), 1200);
    toast_(`✦ ${item.name} added`);
  };
  const updQty = (id, d) => setCart(prev => prev.map(c => c._id===id ? {...c,qty:Math.max(0,c.qty+d)} : c).filter(c=>c.qty>0));

  const openCart  = () => { setOpen(true); setStep(0); };
  const closeCart = () => { setOpen(false); setTimeout(() => setStep(0), 400); };

  const getAddr = () => {
    if (!useNew && savedSel) { const s = SAVED_ADDRS.find(a => a.id===savedSel); return s?.text || ""; }
    return [nAddr.name, nAddr.phone, nAddr.line1, nAddr.line2, nAddr.city, nAddr.pin].filter(Boolean).join(", ");
  };

  const validateAddr = () => {
    if (!useNew && savedSel) return true;
    const e = {};
    if (!nAddr.name.trim()) e.name = "Name required";
    if (!/^\d{10}$/.test(nAddr.phone.trim())) e.phone = "Valid 10-digit number required";
    if (!nAddr.line1.trim()) e.line1 = "Address line 1 required";
    if (!/^\d{6}$/.test(nAddr.pin.trim())) e.pin = "Valid 6-digit pincode required";
    setAErr(e);
    return !Object.keys(e).length;
  };

  const validatePay = () => {
    if (!payM) { toast_("✦ Select a payment method"); return false; }
    if (payM === "upi" && (!upiId.trim() || !upiId.includes("@"))) { setUpiErr("Enter valid UPI ID (e.g. name@upi)"); return false; }
    setUpiErr(""); return true;
  };

  // ── POST order to backend ─────────────────────────────────
  const placeOrder = async () => {
    if (!validatePay()) return;
    setPlacing(true);
    try {
      const addrLabel = !useNew && savedSel
        ? SAVED_ADDRS.find(a => a.id===savedSel)?.label
        : "New Address";

      const payload = {
        items: cart.map(c => ({
          menuItemId: c._id,
          name:  c.name,
          emoji: c.emoji,
          price: c.price,
          qty:   c.qty,
        })),
        subtotal,
        deliveryFee: delFee,
        total: grand,
        address: {
          type:  !useNew && savedSel ? "saved" : "new",
          label: addrLabel,
          text:  getAddr(),
        },
        paymentMethod: payM,
        upiId: payM === "upi" ? upiId : null,
      };

      const res  = await fetch(`${API}/orders`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      setOid(json.data.orderId);
      setStep(3);
    } catch (err) {
      toast_("❌ Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  const reset = () => {
    setCart([]); setSavedSel(null); setUseNew(false); setPayM(null);
    setUpiId(""); setUpiErr(""); setNAddr({name:"",phone:"",line1:"",line2:"",city:"Bengaluru",pin:""});
    setAErr({}); closeCart();
  };

  const STEP_LABELS = ["Basket","Address","Payment"];

  return (
    <>
      <style>{STYLES}</style>
      <div className={`toast ${toast.show?"show":""}`}><span className="tg">✦</span>{toast.msg}</div>
      <div className={`cart-overlay ${open?"open":""}`} onClick={step<3?closeCart:undefined}/>

      {/* ─── CART DRAWER ─── */}
      <div className={`cart-drawer ${open?"open":""}`}>
        <div className="cart-hdr">
          <span className="cart-hdr-title">
            {step===0?"Your Order":step===1?"Delivery Address":step===2?"Payment":"Order Confirmed!"}
          </span>
          <button className="cart-close" onClick={closeCart}>✕</button>
        </div>

        {step < 3 && (
          <div className="cart-steps">
            {STEP_LABELS.map((lbl,i)=>(
              <div key={lbl} className={`cs ${step===i?"act":step>i?"done":""}`}>
                <div className="cs-dot">{step>i?"✓":i+1}</div>
                <span className="cs-lbl">{lbl}</span>
              </div>
            ))}
          </div>
        )}

        {/* STEP 0 */}
        {step===0 && (
          <>
            {cart.length===0 ? (
              <div className="cart-empty-wrap">
                <span className="cart-empty-icon">🧺</span>
                <span className="cart-empty-txt">Your basket is empty.<br/>Explore our menu to begin.</span>
              </div>
            ) : (
              <div className="cart-body">
               {cart.map(item=>(
                  <div className="ci" key={item._id}>
                    <div className="ci-emoji">{item.emoji}</div>
                    <div className="ci-info">
                      <div className="ci-name">{item.name}</div>
                      <div className="ci-price">₹{(item.price*item.qty).toLocaleString("en-IN")}</div>
                      <div className="ci-ctrl">
                        <button className="qbtn" onClick={()=>updQty(item._id,-1)}>−</button>
                        <span className="qnum">{item.qty}</span>
                        <button className="qbtn" onClick={()=>updQty(item._id,1)}>+</button>
                      </div>
                    </div>
                  </div>
                ))}
                {/* ── AI RECOMMENDATIONS ── */}
                {(recsLoading || recs.length > 0) && (
                  <div className="rec-section">
                    <div className="rec-heading"/>
                    {recsLoading ? (
                      <div className="rec-loading">
                        <div className="rec-spin"/>
                        Finding perfect pairings...
                      </div>
                    ) : (
                      <div className="rec-list">
                        {recs.map(item => (
                          <div className="rec-card" key={item._id} onClick={() => addToCart(item)}>
                            <span className="rec-emoji">{item.emoji}</span>
                            <div className="rec-info">
                              <div className="rec-name">{item.name}</div>
                              <div className="rec-reason">{item.aiReason}</div>
                            </div>
                            <div className="rec-right">
                              <span className="rec-price">₹{item.price}</span>
                              <button
                                className="rec-add"
                                onClick={e => { e.stopPropagation(); addToCart(item); }}
                              >+</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            {cart.length>0 && (
              <div className="cart-foot">
                <div className="tot-row"><span className="tot-lbl">Subtotal</span><span className="tot-sub">₹{subtotal.toLocaleString("en-IN")}</span></div>
                <div className="tot-row"><span className="tot-lbl">Delivery Fee</span><span className="tot-sub">₹{delFee}</span></div>
                <hr className="tot-divider"/>
                <div className="tot-row" style={{marginBottom:"18px"}}><span className="tot-lbl">Total</span><span className="tot-grand">₹{grand.toLocaleString("en-IN")}</span></div>
                <button className="cart-btn-primary" onClick={()=>setStep(1)}>Continue to Address →</button>
              </div>
            )}
          </>
        )}

        {/* STEP 1 */}
        {step===1 && (
          <>
            <div className="addr-step">
              {!useNew ? (
                <>
                  <div className="step-title">Saved Addresses</div>
                  <div className="saved-list">
                    {SAVED_ADDRS.map(a=>(
                      <div key={a.id} className={`saved-card ${savedSel===a.id?"sel":""}`} onClick={()=>setSavedSel(a.id)}>
                        {savedSel===a.id && <span className="sel-tick">✓</span>}
                        <div className="saved-card-lbl">{a.label}</div>
                        <div className="saved-card-txt">{a.text}</div>
                      </div>
                    ))}
                  </div>
                  <div className="or-div"><div className="or-div-line"/><span>or add new</span><div className="or-div-line"/></div>
                  <button className="add-new-btn" onClick={()=>{setUseNew(true);setSavedSel(null);}}>+ Add New Address</button>
                </>
              ) : (
                <>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"18px"}}>
                    <div className="step-title" style={{marginBottom:0}}>New Delivery Address</div>
                    <span className="back-to-saved" onClick={()=>{setUseNew(false);setAErr({});}}>← Saved</span>
                  </div>
                  <div className="fg"><label className="flabel">Full Name</label><input className={`finput ${aErr.name?"err":""}`} placeholder="Arjun Sharma" value={nAddr.name} onChange={e=>setNAddr(p=>({...p,name:e.target.value}))}/>{aErr.name&&<span className="ferr">{aErr.name}</span>}</div>
                  <div className="fg"><label className="flabel">Phone Number</label><input className={`finput ${aErr.phone?"err":""}`} placeholder="9876543210" maxLength={10} value={nAddr.phone} onChange={e=>setNAddr(p=>({...p,phone:e.target.value}))}/>{aErr.phone&&<span className="ferr">{aErr.phone}</span>}</div>
                  <div className="fg"><label className="flabel">Address Line 1</label><input className={`finput ${aErr.line1?"err":""}`} placeholder="Flat / House No., Street, Building" value={nAddr.line1} onChange={e=>setNAddr(p=>({...p,line1:e.target.value}))}/>{aErr.line1&&<span className="ferr">{aErr.line1}</span>}</div>
                  <div className="fg"><label className="flabel">Address Line 2 <span style={{color:"var(--text-muted)",fontSize:"9px"}}>(Optional)</span></label><input className="finput" placeholder="Locality, Landmark" value={nAddr.line2} onChange={e=>setNAddr(p=>({...p,line2:e.target.value}))}/></div>
                  <div className="frow">
                    <div className="fg"><label className="flabel">City</label><input className="finput" placeholder="Bengaluru" value={nAddr.city} onChange={e=>setNAddr(p=>({...p,city:e.target.value}))}/></div>
                    <div className="fg"><label className="flabel">Pincode</label><input className={`finput ${aErr.pin?"err":""}`} placeholder="560006" maxLength={6} value={nAddr.pin} onChange={e=>setNAddr(p=>({...p,pin:e.target.value}))}/>{aErr.pin&&<span className="ferr">{aErr.pin}</span>}</div>
                  </div>
                </>
              )}
            </div>
            <div className="cart-foot">
              <button className="cart-btn-primary" disabled={!savedSel&&!useNew} onClick={()=>{if(validateAddr())setStep(2);}}>Continue to Payment →</button>
              <button className="cart-btn-back" onClick={()=>setStep(0)}>← Back to Basket</button>
            </div>
          </>
        )}

        {/* STEP 2 */}
        {step===2 && (
          <>
            <div className="pay-step">
              <div className="addr-prev"><div className="addr-prev-lbl">📍 Delivering to</div><div className="addr-prev-txt">{getAddr()}</div></div>
              <div className="ord-mini">
                <div className="ord-mini-title">Order Summary</div>
                {cart.map(item=><div className="ord-row" key={item._id}><span>{item.name} × {item.qty}</span><span>₹{(item.price*item.qty).toLocaleString("en-IN")}</span></div>)}
                <div className="ord-row"><span>Delivery Fee</span><span>₹{delFee}</span></div>
                <div className="ord-row grand"><span>Grand Total</span><span>₹{grand.toLocaleString("en-IN")}</span></div>
              </div>
              <div className="step-title">Payment Method</div>
              <div className="pay-opts">
                <div className={`pay-opt ${payM==="upi"?"sel":""}`} onClick={()=>setPayM("upi")}>
                  <div className="pay-radio"><div className="pay-radio-dot"/></div>
                  <span className="pay-opt-icon">📲</span>
                  <div><div className="pay-opt-name">UPI Payment</div><div className="pay-opt-desc">GPay, PhonePe, Paytm or any UPI app</div></div>
                </div>
                {payM==="upi" && (
                  <div className="upi-extra">
                    <label className="flabel">Your UPI ID</label>
                    <input className={`finput ${upiErr?"err":""}`} placeholder="yourname@okaxis" value={upiId} onChange={e=>{setUpiId(e.target.value);setUpiErr("");}}/>
                    {upiErr&&<span className="ferr">{upiErr}</span>}
                    <div className="upi-chips">
                      {["@okaxis","@ybl","@paytm","@okhdfcbank"].map(s=><span key={s} className="upi-chip" onClick={()=>setUpiId(prev=>prev.split("@")[0]+s)}>{s}</span>)}
                    </div>
                  </div>
                )}
                <div className={`pay-opt ${payM==="cod"?"sel":""}`} onClick={()=>setPayM("cod")}>
                  <div className="pay-radio"><div className="pay-radio-dot"/></div>
                  <span className="pay-opt-icon">💵</span>
                  <div><div className="pay-opt-name">Cash on Delivery</div><div className="pay-opt-desc">Pay in cash when your order arrives</div></div>
                </div>
              </div>
            </div>
            <div className="cart-foot">
              <button className="cart-btn-primary" onClick={placeOrder} disabled={placing}>
                {placing ? <span className="placing-wrap"><span className="placing-spinner"/>Placing Order...</span> : `Place Order · ₹${grand.toLocaleString("en-IN")}`}
              </button>
              <button className="cart-btn-back" onClick={()=>setStep(1)}>← Back to Address</button>
            </div>
          </>
        )}

        {/* STEP 3 */}
        {step===3 && (
          <div className="success-wrap">
            <div className="success-icon">🎉</div>
            <h2 className="success-title">Order <em>Placed!</em></h2>
            <p className="success-txt">Your Whiskery & Frost order is confirmed and being freshly prepared.<br/>Estimated delivery: <strong style={{color:"var(--gold)"}}>30–45 minutes</strong>.</p>
            <div className="success-oid">Order ID: {oid}</div>
            <div className="success-pay-tag"><span style={{fontSize:"18px"}}>{payM==="upi"?"📲":"💵"}</span><span>{payM==="upi"?`Paid via UPI · ${upiId}`:"Cash on Delivery"}</span></div>
            <div className="success-addr">📍 {getAddr()}</div>
            <button className="success-continue" onClick={reset}>Back to Bakery</button>
          </div>
        )}
      </div>

      {/* ─── NAVBAR ─── */}
      <nav className={`nav ${scrolled?"scrolled":""}`}>
        <a href="#" className="nav-logo"><span className="nav-logo-main">Whiskery & Frost </span><span className="nav-logo-sub">Artisan Bakery · Est. 2018</span></a>
        <ul className="nav-links">
          {[["Menu","#menu"],["Our Story","#our-story"],["Specialties","#specialties"],["Reviews","#reviews"]].map(([l,h])=>(
            <li key={l}><a href={h}>{l}</a></li>
          ))}
        </ul>
        <div style={{display:"flex",alignItems:"center",gap:"20px"}}>
          <div className="cart-icon-wrap" onClick={openCart}>
            <button style={{background:"none",border:"none",cursor:"pointer",fontSize:"22px",color:"var(--white)"}}>🛍</button>
            {count>0 && <span className="cart-cnt">{count}</span>}
          </div>
          <button className="nav-cta" onClick={openCart}>Order Now</button>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="hero" id="home">
        <div className="hero-bg"/><div className="hero-lines"/>
        <div className="hero-orb"><span className="hero-orb-letter">F</span></div>
        <div className="hero-content">
          <div className="hero-tag"><div className="hero-tag-line"/><span>Artisan Patisserie & Bakehouse · Bengaluru</span></div>
          <h1 className="hero-title">Baked with<br/><em>Passion &</em>Precision</h1>
          <p className="hero-sub">Where every loaf tells a story, and every pastry<br/>is a small act of devotion.</p>
          <div className="hero-btns">
            <button className="btn-gold" onClick={()=>document.getElementById("menu").scrollIntoView({behavior:"smooth"})}>Explore Menu</button>
            <button className="btn-outline" onClick={()=>document.getElementById("our-story").scrollIntoView({behavior:"smooth"})}>Our Story</button>
          </div>
        </div>
        <div className="hero-scroll"><span>Scroll</span><div className="scroll-line"/></div>
        <div className="hero-stats">
          <div className="stat"><span className="stat-n">47+</span><span className="stat-l">Items Daily</span></div>
          <div className="stat"><span className="stat-n">6</span><span className="stat-l">Years Crafting</span></div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-band">
        <div className="marquee-track">
          {[...MQ,...MQ].map((m,i)=><div className="mq-item" key={i}><span>{m}</span><div className="mq-dot"/></div>)}
        </div>
      </div>

      {/* ─── MENU ─── */}
      <section className="section menu-section" id="menu" ref={menuRef}>
        <div className="menu-header">
          <div>
            <div className="sec-label"><div className="sec-label-line"/><span>Our Menu</span></div>
            <h2 className="sec-title">Crafted for Every<br/><em>Craving</em></h2>
          </div>
          <div className="menu-filter">
            {cats.map(c=><button key={c} className={`fbtn ${filter===c?"active":""}`} onClick={()=>setFilter(c)}>{c}</button>)}
          </div>
        </div>

        {/* Loading state */}
        {menuLoading && (
          <div className="menu-grid">
            {[...Array(6)].map((_,i)=><div key={i} className="skeleton-card" style={{animationDelay:`${i*0.1}s`}}/>)}
          </div>
        )}

        {/* Error state */}
        {menuError && (
          <div className="menu-error">
            <span className="menu-error-icon">⚠️</span>
            <p className="menu-error-txt">{menuError}</p>
            <button className="retry-btn" onClick={fetchMenu}>Try Again</button>
          </div>
        )}

        {/* Menu grid */}
        {!menuLoading && !menuError && (
          <div className="menu-grid">
            {shown.map((item,i)=>(
              <div className="mcard" key={item._id} style={{animationDelay:`${i*0.05}s`}}>
                <div className="mcard-img" style={{background:`hsl(${(item.name.charCodeAt(0)*37)%360},25%,88%)`}}>
                  <span className="mcard-emoji">{item.emoji}</span>
                  {item.tag && <span className="mcard-badge">{item.tag}</span>}
                </div>
                <div className="mcard-body">
                  <div className="mcard-cat">{item.category}</div>
                  <div className="mcard-name">{item.name}</div>
                  <div className="mcard-desc">{item.description}</div>
                  <div className="mcard-foot">
                    <span className="mcard-price">₹{item.price}</span>
                    <button className={`add-btn ${addedIds[item._id]?"added":""}`} onClick={()=>addToCart(item)}>
                      {addedIds[item._id]?"✓":"+"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ─── STORY ─── */}
      <section className="story-section" id="our-story">
        <div className="story-vis">
          <div className="story-vis-inner">
            <span className="story-big">2018</span>
            <div className="story-badge"><span className="story-badge-year">6</span><span className="story-badge-txt">Years of craft</span></div>
          </div>
        </div>
        <div className="story-content">
          <div className="sec-label"><div className="sec-label-line"/><span>Our Story</span></div>
          <h2 className="sec-title light">Born from a Love<br/><em>of the Craft</em></h2>
          <p className="story-body">Whiskery & Frost began in a small home kitchen in Bengaluru in 2018, driven by one simple belief — that exceptional baking is a form of storytelling. Today, we bake every item from scratch each morning, using time-honoured techniques and the finest ingredients we can source.</p>
          <div className="pillars">
            {[
              {icon:"🌾",title:"Finest Ingredients",text:"Stoneground heritage flours, cultured European butters, and seasonal produce."},
              {icon:"🔥",title:"Traditional Methods",text:"Long fermentation, hand shaping, and stone-deck ovens for authentic results."},
              {icon:"☀️",title:"Baked at Dawn",text:"Everything leaves the oven before 7am — always at its absolute freshest."},
              {icon:"♻️",title:"Sustainably Sourced",text:"Local farms, ethical suppliers, and zero-waste production practices."},
            ].map(p=>(
              <div className="pillar" key={p.title}><span className="pillar-icon">{p.icon}</span><div className="pillar-title">{p.title}</div><div className="pillar-text">{p.text}</div></div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SPECIALTIES ─── */}
      <section className="section spec-section" id="specialties">
        <div className="sec-label"><div className="sec-label-line"/><span>Specialties</span></div>
        <h2 className="sec-title">The House<br/><em>Signatures</em></h2>
        <div className="spec-grid">
          <div className="sc feat"><div className="sc-glow"/><span className="sc-num">01</span><span className="sc-emoji">🥐</span><div className="sc-title">The Whiskery & Frost Croissant</div><div className="sc-desc">Our crown jewel. 27 hand-laminated layers, cold-proofed overnight, baked at precise temperature.</div><div className="sc-price">₹149 <span>per piece</span></div></div>
          <div className="sc"><div className="sc-glow"/><span className="sc-num">02</span><span className="sc-emoji">🍞</span><div className="sc-title">Heritage Sourdough</div><div className="sc-desc">72-hour cold ferment using our 6-year-old starter. Complex, tangy, deeply satisfying.</div><div className="sc-price">₹349</div></div>
          <div className="sc"><div className="sc-glow"/><span className="sc-num">03</span><span className="sc-emoji">🍓</span><div className="sc-title">Strawberry Tart</div><div className="sc-desc">Crème pâtissière on butter shortcrust, finished with glazed seasonal berries.</div><div className="sc-price">₹329</div></div>
          <div className="sc"><div className="sc-glow"/><span className="sc-num">04</span><span className="sc-emoji">☕</span><div className="sc-title">Salted Caramel Latte</div><div className="sc-desc">House-made caramel, double espresso, oat milk microfoam. The perfect companion.</div><div className="sc-price">₹249</div></div>
          <div className="sc"><div className="sc-glow"/><span className="sc-num">05</span><span className="sc-emoji">🍫</span><div className="sc-title">Chocolate Fondant</div><div className="sc-desc">Molten Belgian chocolate core, cocoa sponge exterior. Served warm. Always perfect.</div><div className="sc-price">₹299</div></div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="testi-section" id="reviews">
        <div className="testi-head"><div><div className="sec-label"><div className="sec-label-line"/><span>Reviews</span></div><h2 className="sec-title light">What Our Guests<br/><em>Are Saying</em></h2></div></div>
        <div className="testi-grid">
          {TESTIMONIALS.map((t,i)=>(
            <div className="tc" key={i}><span className="tc-quote">"</span><div className="tc-stars">{"★".repeat(t.stars)}</div><p className="tc-text">{t.text}</p><div className="tc-author"><div className="tc-avatar">{t.av}</div><div><div className="tc-name">{t.name}</div><div className="tc-role">{t.role}</div></div></div></div>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="cta-section">
        <div className="cta-l">
          <h2 className="cta-title">Stay in the Loop<br/>on <em>What's Baking</em></h2>
          <p className="cta-txt">From seasonal specials to limited pastry drops — join our inner circle and be the first to know.</p>
          <div className="cta-form">
            <input className="cta-inp" type="email" placeholder="Your email address" value={email} onChange={e=>setEmail(e.target.value)}/>
                      <button className="cta-sub" onClick={() => { if (email) { toast_("✦ You're on the list!"); setEmail(""); } }}>Subscribe</button>
          </div>
        </div>
        <div>
          <ul className="contact-list">
            {[["🕖","Open Tuesday – Sunday, 7am – 6pm"],["📍","HQTC, Electronic City Phase 1, Bengaluru – 560006"],["📞","+91 98456 72310"],["✉️","hello@frostandflour.in"],["🚚","Free delivery above ₹500 within 5km"]].map(([ic,tx])=>(
              <li key={tx}><span className="c-icon">{ic}</span>{tx}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="footer">
        <div className="footer-top">
          <div><span className="f-brand">Whiskery & Frost</span><span className="f-tag">Artisan Bakery · Est. 2018</span><p className="f-desc">A Bengaluru neighbourhood bakery dedicated to the art of honest, exceptional baking. Every item crafted by hand, every morning, without compromise.</p><div className="f-socials">{["fb","ig","yt","tw"].map(s=><div className="f-soc" key={s}>{s}</div>)}</div></div>
          <div>
            <div className="f-col-title">Explore</div>
            <ul className="f-links">
              <li><a onClick={()=>filterScroll("All")}>Full Menu</a></li>
              <li><a href="#our-story">Our Story</a></li>
              <li><a href="#specialties">Specialties</a></li>
              <li><a href="#reviews">Reviews</a></li>
              <li><a onClick={()=>toast_("✦ Gift cards coming soon!")}>Gift Cards</a></li>
              <li><a onClick={()=>toast_("✦ Catering: hello@whiskeryandfrost.in")}>Catering</a></li>
            </ul>
          </div>
          <div>
            <div className="f-col-title">Menu</div>
            <ul className="f-links">
              <li><a onClick={()=>filterScroll("Breads")}>Artisan Breads</a></li>
              <li><a onClick={()=>filterScroll("Pastries")}>French Pastries</a></li>
              <li><a onClick={()=>filterScroll("Muffins")}>Muffins</a></li>
              <li><a onClick={()=>filterScroll("Cakes")}>Cakes & Tarts</a></li>
              <li><a onClick={()=>filterScroll("Beverages")}>Beverages</a></li>
              <li><a onClick={()=>filterScroll("All")}>Daily Specials</a></li>
            </ul>
          </div>
          <div>
            <div className="f-col-title">Visit Us</div>
            <div className="f-contact-item"><span className="f-c-icon">📍</span><span className="f-c-txt">HQTC, Electronic City Phase 1,<br/>Bengaluru – 560006, Karnataka</span></div>
            <div className="f-contact-item"><span className="f-c-icon">🕖</span><span className="f-c-txt">Tue – Sun: 7am – 6pm<br/>Monday: Closed (Baking Day)</span></div>
            <div className="f-contact-item"><span className="f-c-icon">📞</span><span className="f-c-txt">+91 98456 72310</span></div>
            <div className="f-contact-item"><span className="f-c-icon">✉️</span><span className="f-c-txt">hello@whiskeryandfrost.in</span></div>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="f-copy">© 2025 Whiskery & Frost. All rights reserved. Bengaluru, India.</span>
          <div className="f-bot-links">{["Privacy","Terms","Accessibility"].map(l=><a key={l} href="#">{l}</a>)}</div>
        </div>
      </footer>
    </>
  );
}