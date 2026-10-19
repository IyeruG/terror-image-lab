import React, { useRef, useState } from "react";
import { Upload, Download, Smartphone, RotateCcw, Type, Palette, Sparkles, Signal, Wifi, BatteryFull, Clock3 } from "lucide-react";

const models = [
  { id: "pro", name: "iPhone 16 Pro" },
  { id: "max", name: "iPhone 16 Pro Max" },
  { id: "standard", name: "iPhone 16" },
];
const finishes = [
  { name: "Titanio natural", color: "#b8b6ae" },
  { name: "Titanio negro", color: "#33363b" },
  { name: "Titanio desierto", color: "#b9a18a" },
  { name: "Azul", color: "#7c9eb5" },
  { name: "Rosa", color: "#e9b9c5" },
];
const backgrounds = [
  { name: "Niebla", value: "linear-gradient(145deg,#e5e7eb,#a9b4c5)", colors: ["#e5e7eb", "#a9b4c5"] },
  { name: "Lavanda", value: "linear-gradient(145deg,#e9ddff,#a99be7)", colors: ["#e9ddff", "#a99be7"] },
  { name: "Menta", value: "linear-gradient(145deg,#d8f4e8,#80cdb4)", colors: ["#d8f4e8", "#80cdb4"] },
  { name: "Atardecer", value: "linear-gradient(145deg,#ffbd9d,#9a78d5)", colors: ["#ffbd9d", "#9a78d5"] },
  { name: "Medianoche", value: "linear-gradient(145deg,#25283e,#090b13)", colors: ["#25283e", "#090b13"] },
  { name: "Crema", value: "linear-gradient(145deg,#fff1d7,#d7b991)", colors: ["#fff1d7", "#d7b991"] },
];

export default function App() {
  const [model, setModel] = useState(models[0]);
  const [finish, setFinish] = useState(finishes[0]);
  const [bg, setBg] = useState(backgrounds[0]);
  const [headline, setHeadline] = useState("Tu idea. Tu estilo.");
  const [subline, setSubline] = useState("Diseñado para destacar.");
  const [showText, setShowText] = useState(true);
  const [softShapes, setSoftShapes] = useState(true);
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [clock, setClock] = useState("9:41");
  const [battery, setBattery] = useState(100);
  const [showStatus, setShowStatus] = useState(true);
  const [showWifi, setShowWifi] = useState(true);
  const [showSignal, setShowSignal] = useState(true);
  const [showBattery, setShowBattery] = useState(true);
  const [exporting, setExporting] = useState(false);
  const uploadRef = useRef(null);

  const loadImage = (event) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => { setImage(reader.result); setImageName(file.name); };
    reader.readAsDataURL(file);
  };
  const reset = () => {
    setModel(models[0]); setFinish(finishes[0]); setBg(backgrounds[0]);
    setHeadline("Tu idea. Tu estilo."); setSubline("Diseñado para destacar.");
    setShowText(true); setSoftShapes(true); setImage(null); setImageName("");
    setClock("9:41"); setBattery(100); setShowStatus(true); setShowWifi(true); setShowSignal(true); setShowBattery(true);
    if (uploadRef.current) uploadRef.current.value = "";
  };

  const exportPng = async () => {
    setExporting(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1200; canvas.height = 1500;
      const ctx = canvas.getContext("2d");
      const gradient = ctx.createLinearGradient(0, 0, 1200, 1500);
      gradient.addColorStop(0, "#f7f7fa"); gradient.addColorStop(1, "#e6e9ef");
      ctx.fillStyle = gradient; ctx.fillRect(0, 0, 1200, 1500);
      ctx.fillStyle = "#1a1a1e"; ctx.font = "700 32px Arial"; ctx.fillText("MOCKUP STUDIO", 72, 90);
      ctx.fillStyle = "#777983"; ctx.font = "22px Arial"; ctx.fillText(model.name + " · " + finish.name, 72, 128);
      const phoneW = model.id === "max" ? 470 : model.id === "pro" ? 440 : 420;
      const phoneH = model.id === "max" ? 970 : model.id === "pro" ? 930 : 900;
      const x = (1200 - phoneW) / 2, y = 205, radius = 78;
      // Shadow and complete outer device body
      ctx.save(); ctx.shadowColor = "rgba(20,25,40,.25)"; ctx.shadowBlur = 45; ctx.shadowOffsetY = 22;
      ctx.fillStyle = finish.color; roundedRect(ctx, x, y, phoneW, phoneH, radius); ctx.fill(); ctx.restore();
      ctx.save(); ctx.strokeStyle = "rgba(255,255,255,.8)"; ctx.lineWidth = 4; roundedRect(ctx, x + 3, y + 3, phoneW - 6, phoneH - 6, radius - 3); ctx.stroke();
      // Visible hardware buttons on both sides
      ctx.fillStyle = "#55565a"; roundedRect(ctx, x - 5, y + 150, 7, 70, 4); ctx.fill();
      roundedRect(ctx, x - 5, y + 240, 7, 55, 4); ctx.fill(); roundedRect(ctx, x - 5, y + 310, 7, 55, 4); ctx.fill();
      roundedRect(ctx, x + phoneW - 2, y + 210, 7, 100, 4); ctx.fill();
      const inset = 13, sx = x + inset, sy = y + inset, sw = phoneW - inset * 2, sh = phoneH - inset * 2;
      ctx.save(); roundedRect(ctx, sx, sy, sw, sh, radius - 14); ctx.clip();
      const screenGrad = ctx.createLinearGradient(sx, sy, sx + sw, sy + sh);
      screenGrad.addColorStop(0, bg.colors[0]); screenGrad.addColorStop(1, bg.colors[1]); ctx.fillStyle = screenGrad; ctx.fillRect(sx, sy, sw, sh);
      if (softShapes && !image) {
        ctx.globalAlpha = .38; ctx.fillStyle = "#fff";
        ctx.beginPath(); ctx.ellipse(sx + sw * .72, sy + sh * .34, sw * .42, sw * .34, -.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(sx + sw * .2, sy + sh * .74, sw * .35, sw * .25, .6, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
      }
      if (image) {
        const img = new Image();
        await new Promise((resolve) => { img.onload = resolve; img.onerror = resolve; img.src = image; });
        if (img.complete && img.naturalWidth) {
          const ratio = Math.max(sw / img.width, sh / img.height);
          const iw = img.width * ratio, ih = img.height * ratio;
          ctx.drawImage(img, sx + (sw - iw) / 2, sy + (sh - ih) / 2, iw, ih);
        }
      }
      if (showText && !image) {
        ctx.fillStyle = bg.name === "Medianoche" ? "#fff" : "#20212b";
        ctx.textAlign = "center"; ctx.font = "bold 38px Arial";
        wrapText(ctx, headline, sx + sw / 2, sy + sh * .62, sw - 44, 46);
        ctx.font = "22px Arial"; ctx.globalAlpha = .8;
        wrapText(ctx, subline, sx + sw / 2, sy + sh * .69, sw - 40, 30); ctx.globalAlpha = 1;
      }
      if (showStatus) {
        const darkBg = bg.name === "Medianoche" || Boolean(image);
        ctx.fillStyle = darkBg ? "#fff" : "#16171c";
        ctx.textAlign = "left"; ctx.font = "bold 22px Arial"; ctx.fillText(clock || "9:41", sx + 27, sy + 42);
        ctx.textAlign = "right"; ctx.font = "bold 18px Arial";
        let right = sx + sw - 25;
        if (showBattery) {
          ctx.strokeStyle = darkBg ? "#fff" : "#16171c"; ctx.lineWidth = 2;
          roundedRect(ctx, right - 35, sy + 23, 28, 14, 3); ctx.stroke();
          ctx.fillStyle = darkBg ? "#fff" : "#16171c"; ctx.fillRect(right - 32, sy + 26, 21 * battery / 100, 8);
          ctx.fillRect(right - 6, sy + 27, 3, 6); right -= 45;
        }
        if (showWifi) { ctx.fillText("Wi-Fi", right, sy + 40); right -= 52; }
        if (showSignal) { ctx.fillText("▂▄▆", right, sy + 40); }
      }
      ctx.fillStyle = "#050507"; roundedRect(ctx, x + phoneW * .34, y + 21, phoneW * .32, 42, 24); ctx.fill();
      ctx.restore();
      ctx.fillStyle = "#1a1a1e"; ctx.font = "500 20px Arial"; ctx.textAlign = "center"; ctx.fillText("Crea, personaliza y comparte", 600, 1410);
      const link = document.createElement("a"); link.download = "iphone-mockup-studio.png"; link.href = canvas.toDataURL("image/png"); link.click();
    } catch (error) {
      alert("No se pudo exportar la imagen. Prueba con otra imagen de pantalla.");
    } finally { setExporting(false); }
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="Mockup Studio inicio"><span className="brand-icon"><Smartphone size={19}/></span><span>mockup<span className="brand-light">studio</span></span></a>
        <span className="top-note"><span className="live-dot"></span> Estudio creativo</span>
      </header>
      <section className="intro">
        <div className="eyebrow"><Sparkles size={14}/> TU LIENZO DIGITAL</div>
        <h1>Tu pantalla.<br/><span>Tu universo.</span></h1>
        <p>Crea mockups elegantes de iPhone. Personaliza el dispositivo, el fondo y la barra de estado; después exporta tu diseño completo en PNG.</p>
      </section>
      <section className="workspace">
        <div className="preview-panel">
          <div className="panel-heading"><div><span className="section-kicker">VISTA PREVIA</span><h2>Tu mockup</h2></div><button className="icon-button" onClick={reset} title="Restablecer diseño"><RotateCcw size={17}/></button></div>
          <div className="preview-stage">
            <div className="stage-glow"></div>
            <div className="phone-shadow">
              <div className={"phone-frame " + (model.id === "max" ? "phone-max" : model.id === "standard" ? "phone-standard" : "")} style={{ "--device-color": finish.color }}>
                <div className="phone-side side-left"></div><div className="phone-side side-right"></div>
                <div className="phone-screen" style={{ background: image ? "#111" : bg.value }}>
                  {image ? <img className="screen-image" src={image} alt="Vista previa de pantalla cargada"/> : <>{softShapes && <><div className="orb orb-one"></div><div className="orb orb-two"></div><div className="orb orb-three"></div></>}{showText && <div className="screen-copy"><span>{headline || "Tu idea. Tu estilo."}</span><small>{subline || "Diseñado para destacar."}</small></div>}</>}
                  {showStatus && <div className={"screen-status " + (bg.name === "Medianoche" || image ? "status-light" : "")}><span className="status-time">{clock || "9:41"}</span><span className="status-icons">{showSignal && <Signal size={14} strokeWidth={2.8} />}{showWifi && <Wifi size={14} strokeWidth={2.8}/ >}{showBattery && <span className="battery-icon"><span style={{width: battery + "%"}}></span></span>}</span></div>}
                  <div className="dynamic-island"></div>
                </div>
              </div>
            </div>
            <div className="preview-caption"><span className="caption-dot"></span>{model.name}<span className="caption-divider">/</span>{finish.name}</div>
          </div>
          <div className="preview-footer"><span>PREVIEW EN TIEMPO REAL</span><span>PNG · ALTA CALIDAD</span></div>
        </div>
        <aside className="controls-panel">
          <div className="controls-heading"><div><span className="section-kicker">PERSONALIZACIÓN</span><h2>Diseña a tu manera</h2></div></div>
          <div className="control-section">
            <div className="control-title"><span className="step-number">01</span><div><h3>Modelo de iPhone</h3><p>Elige la silueta del dispositivo</p></div></div>
            <div className="model-options">{models.map((item) => <button key={item.id} onClick={() => setModel(item)} className={"model-option " + (model.id === item.id ? "selected" : "")}><Smartphone size={21}/><span>{item.name}</span>{model.id === item.id && <span className="checkmark">✓</span>}</button>)}</div>
          </div>
          <div className="control-section">
            <div className="control-title"><span className="step-number">02</span><div><h3>Acabado del dispositivo</h3><p>Color del cuerpo y los laterales</p></div></div>
            <div className="finish-options">{finishes.map((item) => <button key={item.name} className={"finish-option " + (finish.name === item.name ? "selected" : "")} onClick={() => setFinish(item)} title={item.name}><span className="finish-swatch" style={{ background: item.color }}></span><span>{item.name}</span></button>)}</div>
          </div>
          <div className="control-section">
            <div className="control-title"><span className="step-number">03</span><div><h3>Fondo de pantalla</h3><p>Selecciona una atmósfera</p></div><Palette size={17} className="muted-icon"/></div>
            <div className="background-options">{backgrounds.map((item) => <button key={item.name} onClick={() => setBg(item)} className={"background-option " + (bg.name === item.name ? "selected" : "")} title={item.name} style={{ background: item.value }}><span>{bg.name === item.name ? "✓" : ""}</span></button>)}</div>
            <div className="selected-background">{bg.name}</div>
          </div>
          <div className="control-section">
            <div className="control-title"><span className="step-number">04</span><div><h3>Tu pantalla</h3><p>Sube una imagen o crea una composición</p></div></div>
            <button className="upload-button" onClick={() => uploadRef.current?.click()}><Upload size={18}/><span>{imageName ? "Cambiar imagen" : "Subir imagen de pantalla"}</span><span className="upload-arrow">↗</span></button>
            <input ref={uploadRef} type="file" accept="image/*" onChange={loadImage} hidden/>
            {imageName && <div className="file-chip">{imageName}<button onClick={() => {setImage(null);setImageName("");if(uploadRef.current)uploadRef.current.value="";}}>Quitar</button></div>}
            {!image && <div className="text-fields"><label><span><Type size={13}/> Título</span><input value={headline} maxLength={60} onChange={(e) => setHeadline(e.target.value)} placeholder="Escribe tu título"/></label><label><span>Subtítulo</span><input value={subline} maxLength={80} onChange={(e) => setSubline(e.target.value)} placeholder="Añade una frase"/></label></div>}
            <label className="toggle-row"><span>Mostrar texto en pantalla</span><input type="checkbox" checked={showText} onChange={(e) => setShowText(e.target.checked)}/><i></i></label>
            <label className="toggle-row"><span>Formas abstractas suaves</span><input type="checkbox" checked={softShapes} onChange={(e) => setSoftShapes(e.target.checked)}/><i></i></label>
          </div>
          <div className="control-section status-controls">
            <div className="control-title"><span className="step-number">05</span><div><h3>Barra de estado</h3><p>Personaliza la hora, señal y batería</p></div><Clock3 size={17} className="muted-icon"/></div>
            <label className="field-label">Hora que aparecerá en el iPhone</label>
            <input className="status-input" value={clock} maxLength={5} onChange={(e) => setClock(e.target.value)} placeholder="9:41" aria-label="Hora del iPhone"/>
            <div className="battery-setting"><label htmlFor="battery-level">Batería: {battery}%</label><input id="battery-level" type="range" min="1" max="100" value={battery} onChange={(e) => setBattery(Number(e.target.value))}/></div>
            <label className="toggle-row"><span>Mostrar barra de estado</span><input type="checkbox" checked={showStatus} onChange={(e) => setShowStatus(e.target.checked)}/><i></i></label>
            <label className="toggle-row"><span>Mostrar señal móvil</span><input type="checkbox" checked={showSignal} onChange={(e) => setShowSignal(e.target.checked)}/><i></i></label>
            <label className="toggle-row"><span>Mostrar Wi-Fi</span><input type="checkbox" checked={showWifi} onChange={(e) => setShowWifi(e.target.checked)}/><i></i></label>
            <label className="toggle-row"><span>Mostrar batería</span><input type="checkbox" checked={showBattery} onChange={(e) => setShowBattery(e.target.checked)}/><i></i></label>
          </div>
          <button className="export-button" onClick={exportPng} disabled={exporting}><Download size={18}/>{exporting ? "Preparando PNG..." : "Exportar mockup PNG"}<span>↗</span></button>
          <p className="privacy-note">Tu imagen se procesa en el navegador. No se sube a ningún servidor.</p>
        </aside>
      </section>
      <footer className="footer"><span>MOCKUP STUDIO <span className="footer-dot">●</span> HECHO PARA TUS IDEAS</span><span>Un buen diseño empieza con una pantalla en blanco.</span></footer>
    </main>
  );
}
function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = String(text || "").split(" "); let line = ""; let currentY = y;
  for (const word of words) {
    const test = line ? line + " " + word : word;
    if (ctx.measureText(test).width > maxWidth && line) { ctx.fillText(line, x, currentY); line = word; currentY += lineHeight; }
    else line = test;
  }
  if (line) ctx.fillText(line, x, currentY);
}