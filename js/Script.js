document.addEventListener('DOMContentLoaded', () => {

  /* ---------- ANO NO RODAPÉ ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- MENU MOBILE ---------- */
  const burger = document.getElementById('burger');
  const navLinks = document.querySelector('.nav-links');
  burger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  /* ---------- NAV: leve sombra ao rolar ---------- */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.style.background = window.scrollY > 20 ? 'rgba(11,14,17,.92)' : 'rgba(11,14,17,.75)';
  });

  /* ---------- SCROLL REVEAL ---------- */
  const revealTargets = document.querySelectorAll(
    '.about-text, .about-badges, .services-grid .card, .diff-visual, .diff-list, .gallery-grid .g-item, .contact-info, .contact-form'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealTargets.forEach(el => io.observe(el));

  /* ---------- DEPOIMENTOS / COMPROMISSO ---------- */
  const items = document.querySelectorAll('.t-item');
  const dotsWrap = document.querySelector('.t-dots');
  let current = 0;

  items.forEach((_, i) => {
    const dot = document.createElement('button');
    if (i === 0) dot.classList.add('active');
    dot.setAttribute('aria-label', 'Depoimento ' + (i + 1));
    dot.addEventListener('click', () => showTestimonial(i));
    dotsWrap.appendChild(dot);
  });
  const dots = dotsWrap.querySelectorAll('button');

  function showTestimonial(i) {
    items[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = i;
    items[current].classList.add('active');
    dots[current].classList.add('active');
  }

  setInterval(() => {
    showTestimonial((current + 1) % items.length);
  }, 6000);

  /* ---------- FAÍSCAS NO BOTÃO PRIMÁRIO (assinatura visual) ---------- */
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mouseenter', (e) => {
      const rect = btn.getBoundingClientRect();
      for (let i = 0; i < 6; i++) {
        const bit = document.createElement('span');
        bit.className = 'spark-bit';
        const angle = Math.random() * Math.PI * 2;
        const dist = 18 + Math.random() * 22;
        bit.style.left = (rect.width / 2) + 'px';
        bit.style.top = (rect.height / 2) + 'px';
        btn.appendChild(bit);
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist - 10;
        bit.animate([
          { transform: 'translate(0,0)', opacity: 1 },
          { transform: `translate(${dx}px, ${dy}px)`, opacity: 0 }
        ], { duration: 500 + Math.random() * 300, easing: 'cubic-bezier(.2,.6,.3,1)' })
          .onfinish = () => bit.remove();
      }
    });
  });

  /* ---------- FORMULÁRIO DE CONTATO ---------- */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const WHATSAPP_NUMBER = '5511948270823';
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const nome = data.get('nome');
    const telefone = data.get('telefone');
    const servico = data.get('servico');
    const mensagem = data.get('mensagem');

    const texto =
      `Olá, VF Metal! Meu nome é ${nome}.\n` +
      `Telefone: ${telefone}\n` +
      `Serviço de interesse: ${servico}\n` +
      `Detalhes: ${mensagem}`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;
    status.textContent = 'Abrindo o WhatsApp com seu pedido...';
    window.open(url, '_blank', 'noopener');
    form.reset();
  });

  /* ---------- GRADE TÉCNICA (blueprint) NO HERO ---------- */
  const canvas = document.getElementById('blueprint');
  const ctx = canvas.getContext('2d');
  let w, h, dpr;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.offsetWidth;
    h = canvas.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  const gap = 46;
  let t = 0;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(76,134,186,0.10)';
    ctx.lineWidth = 1;

    ctx.beginPath();
    for (let x = 0; x <= w; x += gap) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
    }
    for (let y = 0; y <= h; y += gap) {
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }
    ctx.stroke();

    // linha de "medição" horizontal que se desloca lentamente, como um esquadro
    const sweepY = (Math.sin(t) * 0.5 + 0.5) * h;
    const grad = ctx.createLinearGradient(0, sweepY - 60, 0, sweepY + 60);
    grad.addColorStop(0, 'rgba(143,216,255,0)');
    grad.addColorStop(0.5, 'rgba(143,216,255,0.08)');
    grad.addColorStop(1, 'rgba(143,216,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, sweepY - 60, w, 120);

    if (!reduceMotion) {
      t += 0.0025;
      requestAnimationFrame(draw);
    }
  }
  draw();
});
