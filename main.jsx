import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Upload, Download, Skull, WandSparkles, ShieldCheck, RefreshCw } from 'lucide-react';
import './styles.css';

const looks = [
  { id:'vhs', name:'VHS maldito', desc:'Cinta vieja, ruido y colores rotos' },
  { id:'void', name:'Ojos del vacío', desc:'Ojos oscuros y sombras profundas' },
  { id:'smile', name:'Sonrisa imposible', desc:'Boca siniestra y contraste extremo' },
  { id:'nightmare', name:'Cara de pesadilla', desc:'Deformación visual y terror analógico' },
];

function App(){
  const [image,setImage] = useState('');
  const [fileName,setFileName] = useState('');
  const [look,setLook] = useState('nightmare');
  const [intensity,setIntensity] = useState(78);
  const [status,setStatus] = useState('');
  const canvasRef = useRef(null);
  const uploadRef = useRef(null);

  const render = () => {
    const canvas=canvasRef.current; if(!canvas || !image) return;
    const ctx=canvas.getContext('2d',{willReadFrequently:true}); const source=new Image();
    source.onload=()=>{
      const max=1100, scale=Math.min(1,max/Math.max(source.width,source.height));
      canvas.width=Math.max(1,Math.round(source.width*scale)); canvas.height=Math.max(1,Math.round(source.height*scale));
      const w=canvas.width,h=canvas.height, power=intensity/100;
      ctx.clearRect(0,0,w,h);
      ctx.filter=`grayscale(${look==='vhs'?.72:.9}) contrast(${1.25+power*.95}) brightness(${1.03-power*.42})`;
      ctx.drawImage(source,0,0,w,h); ctx.filter='none';
      // Approximate face-area treatment: designed for a portrait centered in the photo.
      if(['void','smile','nightmare'].includes(look)){
        const cx=w*.5, faceY=h*.43, faceW=w*.31, eyeY=h*.39, eyeDx=faceW*.42;
        const eyeRx=Math.max(5,faceW*.18), eyeRy=Math.max(7,h*.026);
        for(const sign of [-1,1]){
          const ex=cx+sign*eyeDx, ey=eyeY;
          const g=ctx.createRadialGradient(ex,ey,1,ex,ey,eyeRx*1.8);
          g.addColorStop(0,`rgba(0,0,0,${.98*power})`); g.addColorStop(.68,`rgba(0,0,0,${.94*power})`); g.addColorStop(1,'rgba(0,0,0,0)');
          ctx.fillStyle=g; ctx.beginPath(); ctx.ellipse(ex,ey,eyeRx*1.8,eyeRy*2.1,-.08*sign,0,Math.PI*2); ctx.fill();
          if(look==='nightmare'){
            ctx.strokeStyle=`rgba(130,0,0,${power*.55})`;ctx.lineWidth=Math.max(1,w*.003);ctx.beginPath();ctx.moveTo(ex-eyeRx,ey);ctx.lineTo(ex-eyeRx*.3,ey+eyeRy*2);ctx.lineTo(ex+eyeRx*.8,ey+eyeRy*2.4);ctx.stroke();
          }
        }
        if(['smile','nightmare'].includes(look)){
          const mx=cx,my=h*.56,mw=faceW*(look==='smile'?.78:.67),mh=h*(look==='smile'?.105:.075);
          ctx.save(); ctx.shadowColor='#000';ctx.shadowBlur=mh*.7;
          ctx.fillStyle=`rgba(0,0,0,${.96*power})`;ctx.beginPath();ctx.ellipse(mx,my,mw,mh,0,0,Math.PI*2);ctx.fill();
          ctx.shadowBlur=0; ctx.strokeStyle=`rgba(150,35,35,${power*.85})`;ctx.lineWidth=Math.max(1.5,w*.003);ctx.beginPath();ctx.ellipse(mx,my,mw,mh,0,0,Math.PI*2);ctx.stroke();
          if(look==='smile'||look==='nightmare'){
            const teethN=11, toothW=mw*2/teethN;
            for(let i=0;i<teethN;i++){const tx=mx-mw+i*toothW;ctx.fillStyle=`rgba(210,205,190,${power*.82})`;ctx.beginPath();ctx.moveTo(tx,my-mh*.35);ctx.lineTo(tx+toothW*.85,my-mh*.35);ctx.lineTo(tx+toothW*.68,my+mh*.1);ctx.lineTo(tx+toothW*.18,my+mh*.1);ctx.closePath();ctx.fill();}
          }
          ctx.restore();
        }
      }
      // Analog-video RGB split, grain and scan lines.
      const pixels=ctx.getImageData(0,0,w,h), d=pixels.data, original=new Uint8ClampedArray(d), shift=Math.max(1,Math.floor(power*5));
      for(let y=0;y<h;y++) for(let x=0;x<w;x++){
        const i=(y*w+x)*4, rx=Math.min(w-1,x+shift), bx=Math.max(0,x-shift);
        if(look==='vhs'||look==='nightmare'){d[i]=original[(y*w+rx)*4];d[i+2]=original[(y*w+bx)*4+2];}
        if(Math.random()<power*.13){const n=(Math.random()-.5)*power*90;d[i]=Math.max(0,Math.min(255,d[i]+n));d[i+1]=Math.max(0,Math.min(255,d[i+1]+n));d[i+2]=Math.max(0,Math.min(255,d[i+2]+n));}
      }
      ctx.putImageData(pixels,0,0);
      for(let y=0;y<h;y+=3){ctx.fillStyle=`rgba(0,0,0,${power*.24})`;ctx.fillRect(0,y,w,1);}
      const vignette=ctx.createRadialGradient(w/2,h/2,Math.min(w,h)*.14,w/2,h/2,Math.max(w,h)*.72);vignette.addColorStop(0,'rgba(0,0,0,0)');vignette.addColorStop(1,`rgba(0,0,0,${.85*power})`);ctx.fillStyle=vignette;ctx.fillRect(0,0,w,h);
      if(look==='vhs'||look==='nightmare'){
        for(let n=0;n<Math.ceil(power*7);n++){const yy=Math.random()*h;ctx.fillStyle=`rgba(220,220,255,${power*.16})`;ctx.fillRect(0,yy,w,Math.max(1,h*.002));}
      }
    };
    source.src=image;
  };
  useEffect(()=>{render();},[image,look,intensity]);
  const onFile=(file)=>{if(!file)return;if(!file.type.startsWith('image/')){setStatus('Elige un archivo de imagen.');return;}if(file.size>12*1024*1024){setStatus('La imagen debe pesar menos de 12 MB.');return;}const r=new FileReader();r.onload=()=>{setImage(r.result);setFileName(file.name);setStatus('');};r.readAsDataURL(file);};
  const download=()=>{if(!canvasRef.current||!image)return;const a=document.createElement('a');a.download='terror-image-lab.png';a.href=canvasRef.current.toDataURL('image/png');a.click();};

  return <div className="shell">
    <header className="topbar"><div className="brand"><div className="brand-mark"><Skull size={22}/></div><div><b>TERROR <span>IMAGE LAB</span></b><small>ANALOG HORROR WORKSHOP</small></div></div><div className="top-right"><span className="live-dot"/> <span>LOCAL EFFECTS</span><span className="version">FREE</span></div></header>
    <section className="hero"><div className="eyebrow"><span/> EXPERIMENTAL IMAGE DISTORTION</div><h1>MAKE IT<br/><em>UNNATURAL.</em></h1><p>Sube una foto y conviértela en una imagen inquietante con ojos oscuros, sonrisas imposibles y efectos de cinta VHS. Sin cuenta y sin API de IA de pago.</p></section>
    <div className="workspace">
      <section className="panel"><div className="panel-heading"><span>01 / SOURCE IMAGE</span><span className="muted">MAX 12 MB</span></div>
        <button className="upload-zone" onClick={()=>uploadRef.current?.click()}>{image?<img src={image} alt="Foto original"/>:<div className="upload-placeholder"><Upload size={27}/><b>SUBE UNA FOTO</b><small>JPG · PNG · WEBP</small><span className="upload-cta">Seleccionar imagen</span></div>}</button>
        <input ref={uploadRef} type="file" accept="image/*" hidden onChange={e=>onFile(e.target.files?.[0])}/>
        {fileName&&<div className="file-label"><span>{fileName}</span><button onClick={()=>{setImage('');setFileName('');setStatus('');}}>QUITAR</button></div>}
        <div className="field-label">ELIGE UN ESTILO</div><div className="presets">{looks.map(s=><button key={s.id} className={look===s.id?'selected':''} onClick={()=>setLook(s.id)}>{s.name}</button>)}</div>
        <div className="intensity"><div><label>INTENSIDAD DEL TERROR</label><b>{intensity}%</b></div><input type="range" min="20" max="100" value={intensity} onChange={e=>setIntensity(Number(e.target.value))}/><div className="range-labels"><span>SUTIL</span><span>PERTURBADOR</span><span>EXTREMO</span></div></div>
        <button className="primary-btn" onClick={()=>{if(!image){setStatus('Primero sube una foto.');return;}render();setStatus('Transformación aplicada. Puedes cambiar el estilo o la intensidad.');}}><WandSparkles size={16}/> TRANSFORMAR EN TERROR</button>
        <div className="notice"><ShieldCheck size={17}/><span>Los efectos se procesan en tu navegador. La foto no se envía a una API de generación de imágenes.</span></div>{status&&<div className="status">{status}</div>}
      </section>
      <section className="panel"><div className="panel-heading"><span>02 / DISTORTED OUTPUT</span><span className="rec"><i/> LIVE PREVIEW</span></div><div className="preview-frame">{image?<><canvas ref={canvasRef}/><span className="overlay-tag">TERROR FILTER // {look.toUpperCase()}</span></>:<div className="monitor-empty"><Skull size={43}/><b>NO SIGNAL</b><small>YOUR NIGHTMARE APPEARS HERE</small><div className="monitor-line"/></div>}</div>
        <div className="output-meta"><div><small>SELECTED STYLE</small><b className="ready">{looks.find(s=>s.id===look)?.name}</b></div><div><small>PROCESSING</small><b>ON DEVICE</b></div></div>
        <button className="download-btn" disabled={!image} onClick={download}><Download size={16}/> DESCARGAR IMAGEN PNG</button><button className="secondary-btn" onClick={()=>{setLook('nightmare');setIntensity(78);setStatus('Ajustes restablecidos.');}}><RefreshCw size={14}/> RESTABLECER AJUSTES</button>
        <div className="privacy-note"><span/> <div>Nota: los ojos y la boca se oscurecen usando una posición aproximada para retratos centrados. No hay detección facial avanzada todavía, así que el resultado depende de la foto.</div></div>
      </section>
    </div><footer><span>TERROR IMAGE LAB / COMMUNITY EXPERIMENT</span><span>FREE BROWSER EFFECTS · NO AI API</span></footer>
  </div>;
}

createRoot(document.getElementById('root')).render(<App/>);
