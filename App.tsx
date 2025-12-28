
import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Star, 
  Timer, 
  Smartphone, 
  Monitor, 
  Lock, 
  CreditCard, 
  ShieldCheck,
  Instagram,
  Youtube,
  ArrowRight,
  ShoppingBag
} from 'lucide-react';

// --- Components ---

const FloatingCTA = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Mostra o card após 400px de scroll
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToPrecos = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('precos');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-[60] p-4 transition-all duration-700 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      <div className="max-w-xl mx-auto bg-zinc-900/90 backdrop-blur-xl border border-white/10 p-3 rounded-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex items-center justify-between gap-4">
        <div className="hidden sm:flex flex-col pl-2">
          <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">Oferta Exclusiva</span>
          <div className="flex items-center gap-2">
            <span className="text-white font-black text-xl">R$ 5,90</span>
            <span className="bg-red-600/20 text-red-500 text-[9px] px-2 py-0.5 rounded-full font-bold">94% OFF</span>
          </div>
        </div>
        
        <button 
          onClick={scrollToPrecos}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 animate-pulse-subtle group"
        >
          <ShoppingBag size={18} className="group-hover:rotate-12 transition-transform" />
          ADQUIRIR AGORA POR R$ 5,90
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

const Navbar = () => {
  const scrollToPrecos = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('precos');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="font-montserrat font-black text-xl text-red-600">NILSON<span className="text-white">RODRIGUES</span></div>
        <button 
          onClick={scrollToPrecos}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 md:px-4 rounded-full text-xs md:text-sm transition-all transform hover:scale-105 active:scale-95"
        >
          ADQUIRIR AGORA
        </button>
      </div>
    </nav>
  );
};

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [endHourStr, setEndHourStr] = useState("");

  useEffect(() => {
    const STORAGE_KEY = 'nilson_promo_target_30';
    let endTimestampStr = localStorage.getItem(STORAGE_KEY);
    let endTimestamp: number;

    if (!endTimestampStr) {
      // Lógica: Próximo horário :30 que garanta pelo menos 30 minutos de oferta
      const now = new Date();
      const baseDate = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutos no futuro
      
      const targetDate = new Date(baseDate);
      // Se os minutos do baseDate passarem de 30, o próximo :30 é na próxima hora
      if (baseDate.getMinutes() > 30) {
        targetDate.setHours(baseDate.getHours() + 1);
      }
      targetDate.setMinutes(30);
      targetDate.setSeconds(0);
      targetDate.setMilliseconds(0);

      endTimestamp = targetDate.getTime();
      localStorage.setItem(STORAGE_KEY, endTimestamp.toString());
    } else {
      endTimestamp = parseInt(endTimestampStr, 10);
      
      // Se o tempo já expirou há mais de 1 hora, resetamos para uma nova oferta
      if (Date.now() > endTimestamp + (60 * 60 * 1000)) {
        localStorage.removeItem(STORAGE_KEY);
        window.location.reload();
        return;
      }
    }

    const endDate = new Date(endTimestamp);
    setEndHourStr(endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

    const updateTimer = () => {
      const now = Date.now();
      const diff = endTimestamp - now;

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours: h, minutes: m, seconds: s });
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-4">
      <p className="text-xl md:text-2xl font-bold uppercase tracking-tighter">
        A promoção encerra às {endHourStr || "--:--"}
      </p>
      <div className="flex items-center justify-center gap-2 font-mono text-2xl font-bold text-red-500">
        <Timer size={24} />
        <span>
          {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s
        </span>
      </div>
    </div>
  );
};

const ScarcityMarquee = () => (
  <div className="bg-red-600 py-3 overflow-hidden whitespace-nowrap">
    <div className="flex animate-marquee">
      {[...Array(20)].map((_, i) => (
        <span key={i} className="mx-4 text-white font-black text-sm uppercase tracking-tighter">
          📢 DESCONTO ENCERRA EM BREVE! 📢
        </span>
      ))}
    </div>
  </div>
);

const TemplateCard = ({ title, description, image, isMobile = false }: { title: string, description: string, image: string, isMobile?: boolean }) => (
  <div className={`bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-red-600/50 transition-all group shrink-0 ${isMobile ? 'w-[220px] md:w-[240px]' : 'w-[300px] md:w-[400px]'} mx-3`}>
    <div className={`relative overflow-hidden ${isMobile ? 'aspect-[9/16]' : 'aspect-video'}`}>
      <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
        <span className="text-white font-bold text-[10px] md:text-xs uppercase tracking-wider">Modelo Editável</span>
      </div>
    </div>
    <div className="p-4">
      <h4 className="text-sm md:text-base font-bold text-white mb-1 truncate">{title}</h4>
      <p className="text-zinc-500 text-[10px] md:text-xs truncate">{description}</p>
    </div>
  </div>
);

const MarqueeSlider = ({ children, speed = "40s", reverse = false }: { children: React.ReactNode, speed?: string, reverse?: boolean }) => (
  <div className="relative flex overflow-x-hidden group">
    <div 
      className={`flex whitespace-nowrap animate-marquee py-4 ${reverse ? 'flex-row-reverse' : ''}`}
      style={{ animationDuration: speed }}
    >
      {children}
      {children}
    </div>
  </div>
);

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const items = [
    { question: "O que exatamente eu vou receber?", answer: "Você receberá acesso imediato a uma área de membros contendo 48 modelos de Mini Sites editáveis no Canva prontos para uso." },
    { question: "Preciso ter página de vendas?", answer: "Não! A proposta é utilizar esses modelos diretamente no seu checkout, economizando com hospedagem." },
    { question: "Preciso saber design ou programação?", answer: "Absolutamente nada. Os modelos são 100% editáveis no Canva (arrasta e solta)." },
    { question: "Posso usar em qualquer plataforma?", answer: "Sim! Hotmart, Kiwify, Eduzz, Braip e qualquer checkout que aceite links externos." },
    { question: "Tem garantia?", answer: "Sim! Garantia incondicional de 30 dias. Se não gostar, devolvemos seu dinheiro." }
  ];

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800">
          <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full p-5 flex items-center justify-between text-left hover:bg-zinc-800 transition-colors">
            <span className="font-bold text-zinc-100">{item.question}</span>
            {openIndex === i ? <ChevronUp className="text-red-600" /> : <ChevronDown className="text-zinc-500" />}
          </button>
          {openIndex === i && <div className="p-5 pt-0 text-zinc-400 text-sm border-t border-zinc-800/50 leading-relaxed">{item.answer}</div>}
        </div>
      ))}
    </div>
  );
};

const App: React.FC = () => {
  const scrollToPrecos = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('precos');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const computerTemplates = [
    { title: "Misturinhas Secretas", desc: "Progressiva Espelhada Profissional", img: "images/computador1.png" },
    { title: "Pack Canva Páscoa", desc: "Posts e Stories de Páscoa", img: "images/computador2.png" },
    { title: "Cardápio Editável", desc: "Design de Páscoa Profissional", img: "images/computador3.png" },
    { title: "Chef de Cozinha", desc: "Mais de 100 receitas fáceis", img: "images/computador4.png" },
    { title: "Secar Saudável", desc: "Ebook para emagrecer em 4 semanas", img: "images/computador5.png" },
    { title: "Forever Shape On", desc: "Sua jornada fitness começa aqui", img: "images/computador6.png" },
    { title: "Upper Training", desc: "Consultoria fitness humanizada", img: "images/computador7.png" },
    { title: "Full Stack Developer", desc: "Torne-se um desenvolvedor de elite", img: "images/computador8.png" },
    { title: "Método PAS UnB", desc: "Passe na UnB com estudo inteligente", img: "images/computador9.png" },
    { title: "Estrategista de Conteúdo", desc: "Transforme posts em dinheiro", img: "images/computador10.png" },
    { title: "Páginas de Alta Conversão", desc: "Design focado em desempenho", img: "images/computador11.png" },
    { title: "Receitas de Sucesso", desc: "Pilar do método para emagrecer", img: "images/computador12.png" },
  ];

  const mobileTemplates = [
    { title: "Página Cozinheiro", desc: "Foco total em celular", img: "images/mobile-cozinheiro.png" },
    { title: "Renda Extra", desc: "Conversão mobile validada", img: "images/mobile-renda.png" },
    { title: "Emagrecimento", desc: "Layout clean e rápido", img: "images/mobile-emagrecer.png" },
    { title: "Desenvolvimento", desc: "Páginas leves para mobile", img: "images/mobile-dev.png" },
    { title: "Religiosa", desc: "Nicho fé e cristão", img: "images/mobile-crista.png" },
  ];

  return (
    <div className="min-h-screen selection:bg-red-600 selection:text-white pb-20 md:pb-0">
      <Navbar />
      <FloatingCTA />

      {/* Hero Section */}
      <header className="pt-32 pb-20 px-4 bg-gradient-to-b from-red-950/20 to-black">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block px-4 py-1.5 rounded-full bg-red-600/10 border border-red-600/30 text-red-500 font-bold text-xs uppercase tracking-widest animate-pulse">
            Modelos Validados e Lucrativos
          </div>
          <h1 className="text-4xl md:text-7xl font-black font-montserrat leading-[1.1] uppercase">
            Venda <span className="text-red-600">sem página de vendas</span> usando apenas o checkout
          </h1>
          <p className="text-lg md:text-2xl text-zinc-400 font-medium max-w-2xl mx-auto">
            48 Modelos de Mini Sites Editáveis no Canva prontos para importar e começar a lucrar hoje mesmo.
          </p>
          <div className="pt-6">
            <button 
              onClick={scrollToPrecos}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-base md:text-xl font-black py-4 md:py-5 px-6 md:px-10 rounded-2xl shadow-[0_0_40px_rgba(220,38,38,0.4)] transition-all transform hover:scale-105 active:scale-95"
            >
              QUERO MEUS MODELOS AGORA <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <p className="mt-4 text-zinc-500 text-xs md:text-sm flex items-center justify-center gap-2">
              <Lock size={14} /> Compra 100% Segura e Acesso Imediato
            </p>
          </div>
        </div>
      </header>

      {/* Computer Slider */}
      <section className="py-20 bg-zinc-950 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-12 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-red-600">
            <Monitor size={32} />
            <h2 className="text-3xl md:text-4xl font-black font-montserrat uppercase">Veja como fica em computadores</h2>
          </div>
          <p className="text-zinc-400 max-w-2xl mx-auto">Design profissional que transmite autoridade e confiança instantânea em tela cheia.</p>
        </div>
        
        <MarqueeSlider speed="60s">
          {computerTemplates.map((t, i) => (
            <TemplateCard key={i} title={t.title} description={t.desc} image={t.img} />
          ))}
        </MarqueeSlider>
      </section>

      {/* Mobile Slider */}
      <section className="py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-12 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-red-600">
            <Smartphone size={32} />
            <h2 className="text-3xl md:text-4xl font-black font-montserrat uppercase">É assim que vai ficar no celular</h2>
          </div>
          <p className="text-zinc-400">90% das suas vendas virão do mobile. Nossos templates são 100% responsivos.</p>
        </div>
        
        <MarqueeSlider speed="45s" reverse>
          {mobileTemplates.map((t, i) => (
            <TemplateCard key={i} isMobile title={t.title} description={t.desc} image={t.img} />
          ))}
        </MarqueeSlider>
      </section>

      {/* Bio */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12 bg-zinc-900/40 p-10 rounded-[3rem] border border-zinc-800/50">
          <div className="shrink-0 relative">
            <img src="images/foto-autor.png" alt="Nilson Rodrigues" className="w-64 h-64 object-cover rounded-[2rem] shadow-2xl grayscale hover:grayscale-0 transition-all duration-700 bg-zinc-800" />
            <div className="absolute -bottom-4 -right-4 bg-red-600 text-white p-3 rounded-2xl">
               <span className="font-black text-xs uppercase">Autor do Projeto</span>
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-black font-montserrat uppercase">Quem é <span className="text-red-600">Nilson Rodrigues</span></h2>
            <div className="h-1 w-20 bg-red-600" />
            <p className="text-zinc-300 text-lg leading-relaxed italic">
              "Olá, eu sou o criador de todos os Mini Sites, trabalho com Marketing Digital há mais de 5 anos. Criei produtos que ultrapassaram mais de 1M em vendas."
            </p>
            <p className="text-zinc-400 leading-relaxed">
              Já ajudei centenas de pessoas através dos meus conhecimentos passados no Youtube e Instagram, ajudei jovens e adultos a largarem a CLT e viver do Digital.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing / Offer */}
      <section id="precos" className="py-24 px-4 bg-zinc-950 relative overflow-hidden scroll-mt-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.1)_0,transparent_70%)] pointer-events-none" />
        <ScarcityMarquee />
        
        <div className="max-w-4xl mx-auto mt-20 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-black font-montserrat uppercase text-red-600">ÚLTIMO DIA!</h2>
            <CountdownTimer />
            <p className="text-zinc-400 font-bold uppercase tracking-[0.2em] text-xs md:text-sm">Condição válida por pouco tempo</p>
          </div>

          <div className="bg-white text-black p-1 pt-1 rounded-[2.5rem] md:rounded-[3rem] shadow-[0_0_100px_rgba(220,38,38,0.3)]">
            <div className="bg-white rounded-[2.3rem] md:rounded-[2.8rem] p-8 md:p-16 space-y-10">
              <div className="text-center space-y-2">
                <h3 className="text-xl md:text-2xl font-black font-montserrat uppercase text-zinc-900">Oferta por tempo limitado 🔥</h3>
                <div className="flex items-center justify-center gap-4 pt-2 md:pt-4">
                  <span className="text-zinc-400 line-through text-2xl md:text-3xl font-bold">R$ 97,00</span>
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] md:text-xs font-black uppercase">Desconto Aplicado</div>
                </div>
                <div className="text-6xl md:text-9xl font-black font-montserrat text-zinc-950 leading-none">
                  R$ 5<span className="text-2xl md:text-3xl font-bold">,90</span>
                </div>
                <p className="text-zinc-500 font-bold text-xs md:text-sm">Cartão, Pix ou Boleto</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 max-w-2xl mx-auto">
                {[
                  "Acesso vitalício",
                  "Área de membros premium",
                  "Acesso aos 48 Modelos",
                  "Garantia incondicional de 30 dias"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 font-bold text-zinc-700 text-xs md:text-base">
                    <CheckCircle2 size={16} className="text-green-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="text-center space-y-6 pt-4 flex justify-center">
                <button className="w-full md:w-auto md:min-w-[400px] bg-red-600 hover:bg-red-700 text-white text-base md:text-xl font-black py-4 md:py-6 px-6 md:px-12 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-2xl flex items-center justify-center gap-3">
                   ADQUIRIR AGORA <ArrowRight className="w-5 h-5 md:w-7 md:h-7" />
                </button>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-zinc-400 opacity-60">
                 <ShieldCheck size={32} className="md:size-10" />
                 <Lock size={24} className="md:size-8" />
                 <CreditCard size={24} className="md:size-8" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto bg-zinc-900 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3rem] border-2 border-dashed border-red-600/50 flex flex-col md:flex-row items-center gap-10">
          <img src="https://cdn-icons-png.flaticon.com/512/3699/3699516.png" alt="Garantia" className="w-32 h-32 md:w-40 md:h-40 filter drop-shadow-[0_0_20px_rgba(220,38,38,0.3)]" />
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-black font-montserrat uppercase">Garantia incondicional de 30 dias</h2>
            <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
              Se você não tiver resultados em até 30 dias, devolvo 100% do seu investimento sem burocracia.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-zinc-950">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-black font-montserrat uppercase">Perguntas Frequentes</h2>
            <p className="text-zinc-400">Tudo o que você precisa saber antes de adquirir.</p>
          </div>
          <FAQ />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 border-t border-zinc-900 bg-black text-center space-y-8">
        <div className="font-montserrat font-black text-2xl tracking-tighter uppercase">Nilson Rodrigues</div>
        <div className="flex flex-col items-center gap-6">
          <p className="text-zinc-400 font-bold uppercase text-sm tracking-widest">Me siga nas redes sociais:</p>
          <div className="flex gap-6">
            <a href="#" className="w-12 h-12 md:w-14 md:h-14 bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-red-600 hover:bg-zinc-800 transition-all">
              <Instagram size={20} className="md:size-6" />
            </a>
            <a href="#" className="w-12 h-12 md:w-14 md:h-14 bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-red-600 hover:bg-zinc-800 transition-all">
              <Youtube size={20} className="md:size-6" />
            </a>
          </div>
        </div>
        <div className="pt-8 border-t border-zinc-900 max-w-7xl mx-auto text-zinc-500 text-[10px] md:text-xs">
          <p>© 2025 - Nilson Rodrigues. Todos os direitos reservados.</p>
          <p className="mt-6 max-w-3xl mx-auto opacity-40 leading-relaxed">
            Aviso Legal: Os resultados podem variar. Não garantimos faturamento sem trabalho.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
