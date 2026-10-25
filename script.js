const C = window.CONFIG, $ = s => document.querySelector(s), rnd = (a, b) => a + Math.random() * (b - a)
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches

/* ---------- sound effects (generated, no files) + music ---------- */
let sfxOn = false, actx
function play(kind) {
  if (!sfxOn) return
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)()
    ;({ open: [523, 659, 784], wish: [659, 880], celebrate: [523, 659, 784, 1047] })[kind].forEach((f, i) => {
      const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime + i * .12
      o.frequency.value = f; g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.08, t + .03); g.gain.exponentialRampToValueAtTime(.0001, t + .5)
      o.connect(g).connect(actx.destination); o.start(t); o.stop(t + .55)
    })
  } catch {}
}
const audio = $('#audio'); audio.src = C.music
$('#music').onclick = async e => {
  const b = e.currentTarget, on = b.getAttribute('aria-pressed') !== 'true'
  sfxOn = on; b.setAttribute('aria-pressed', on); b.textContent = on ? '⏸' : '♫'
  b.setAttribute('aria-label', on ? 'Pause music and sounds' : 'Play music and sounds')
  try { on ? await audio.play() : audio.pause() } catch {} // no song file yet: effects still work
}

/* ---------- helpers ---------- */
function hearts(el, n) { for (let i = 0; i < n; i++) { const s = document.createElement('span'); s.textContent = i % 4 ? '♥' : '✦'; s.style.cssText = `left:${rnd(0, 100)}%;font-size:${rnd(14, 32)}px;color:${i % 3 ? '#e88aa8' : '#b79be0'};animation-duration:${rnd(9, 18)}s;animation-delay:${-rnd(0, 12)}s`; el.append(s) } }
function burst(emojis = ['♡', '✦', '✨', '💗', '🌸'], n = 24) {
  if (reduce) return
  const w = document.createElement('div'); w.className = 'burst'; w.setAttribute('aria-hidden', 'true')
  for (let i = 0; i < n; i++) {
    const s = document.createElement('span'); s.textContent = emojis[i % emojis.length]; s.style.left = rnd(15, 85) + '%'; w.append(s)
    s.animate([{ transform: 'translate(0,0) scale(.5)', opacity: 1 }, { transform: `translate(${rnd(-150, 150)}px,-${rnd(300, 750)}px) rotate(${rnd(0, 120)}deg) scale(1.2)`, opacity: 0 }], { duration: rnd(2000, 3000), delay: rnd(0, 400), easing: 'ease-out', fill: 'forwards' })
  }
  document.body.append(w); setTimeout(() => w.remove(), 3800)
}
function photo(src, alt) { return src ? `<img class="ph" src="${src}" alt="${alt}" loading="lazy" decoding="async">` : `<div class="ph empty"><span>♡<br>Add a photo in config.js</span></div>` }
function cake(el) { el.innerHTML = `<div class="candles">${'<div class="candle"><b></b><u></u></div>'.repeat(19)}</div><div class="body"><div class="t"></div><div class="m"></div><div class="plate"></div></div>`; el.setAttribute('role', 'img'); el.setAttribute('aria-label', 'Birthday cake with 19 candles') }
const bold = t => t.startsWith('**') ? `<strong>${t.replaceAll('**', '')}</strong>` : t
const reveal = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); reveal.unobserve(e.target) } }), { threshold: .15 })

/* ---------- build content from config ---------- */
$('#introLine').textContent = C.introLine
$('#heroLines').innerHTML = C.heroLines.join('<br><br>')
$('#heroPhoto').innerHTML = `<div class="frame">${photo(C.heroPhoto, 'Rebecca')}</div>`
$('#letterTitle').textContent = C.letterTitle
$('#letterBody').innerHTML = C.letter.map(t => `<p class="rv">${bold(t)}</p>`).join('')
$('#wishes').innerHTML = C.wishes.map((w, i) => `<li class="glass rv" style="transition-delay:${(i % 3) * .1}s"><b>${i + 1}</b>${w}</li>`).join('')
$('#scrap').innerHTML = C.scrapbook.map((p, i) => `<figure class="rv ${p.shape}"><i class="tape"></i><div class="imgbox">${photo(p.src, p.caption)}</div><figcaption>${p.caption}</figcaption><span class="deco" aria-hidden="true">${['♡', '🌸', '✦', '♡'][i % 4]}</span></figure>`).join('')
$('#wishPrompt').textContent = C.wishPrompt; $('#wishReveal').textContent = C.wishReveal; $('#finaleLine').textContent = C.finaleLine
$('#finaleMsg').insertAdjacentHTML('beforeend', `<h3>${C.finale[0]}</h3>` + C.finale.slice(1).map(t => `<p>${t}</p>`).join(''))
document.querySelectorAll('.hearts').forEach(h => hearts(h, 12))
$('.stars').innerHTML = Array.from({ length: 40 }, (_, i) => `<i style="left:${(i * 47) % 100}%;top:${(i * 29) % 100}%;width:${2 + i % 3}px;height:${2 + i % 3}px;animation-duration:${2 + i % 5}s"></i>`).join('')
const cc = $('#cardCake'), bc = $('#bigCake'); cake(cc); cake(bc)
document.querySelectorAll('.rv').forEach(el => reveal.observe(el))

/* ---------- intro ---------- */
function enter() { $('#intro').classList.add('gone'); $('#main').hidden = false; document.querySelectorAll('.rv').forEach(el => reveal.observe(el)); setTimeout(() => $('#intro').remove(), 900); scrollTo(0, 0) }
$('#openBtn').onclick = () => { $('#intro').classList.add('opened'); play('open'); burst(); setTimeout(enter, 2400) }
$('#skipBtn').onclick = () => { play('open'); enter() }

/* ---------- interactive card ---------- */
let typer
$('#cardCover').onclick = e => {
  const b = e.currentTarget, open = b.classList.toggle('open'); b.setAttribute('aria-expanded', open); b.setAttribute('aria-label', open ? 'Close the card' : 'Open the card'); play('open')
  clearInterval(typer); const p = $('#cardText'); p.textContent = ''
  if (open) { let n = 0; p.setAttribute('aria-label', C.cardMessage); typer = setInterval(() => { p.textContent = C.cardMessage.slice(0, ++n); if (n >= C.cardMessage.length) clearInterval(typer) }, reduce ? 1 : 35) }
}
$('#loveBtn').onclick = () => { burst(); play('wish') }
$('#blowBtn').onclick = e => { const off = cc.classList.toggle('off'); e.currentTarget.setAttribute('aria-pressed', !off); e.currentTarget.textContent = off ? 'Relight the candles 🔥' : 'Blow out the candles 💨' }

/* ---------- wish + finale ---------- */
$('#wishBtn').onclick = e => { $('#night').classList.add('lit'); e.currentTarget.hidden = true; play('wish') }
$('#celebrateBtn').onclick = e => {
  burst(['🎉', '🎊', '✨', '💗', '💜', '🌸'], 36); play('celebrate'); bc.classList.add('glow')
  $('#finaleMsg').classList.add('show'); e.currentTarget.hidden = true
  $('#finaleMsg').scrollIntoView({ behavior: 'smooth', block: 'center' })
}
