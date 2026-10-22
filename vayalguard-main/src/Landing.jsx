import { useEffect, useState } from "react";
import {
  Sprout,
  Languages,
  CloudRain,
  Cloud,
  Sun,
  CloudSun,
  ShieldAlert,
  ClipboardCheck,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import "./landing.css";

const IMD_URL = "https://mausam.imd.gov.in/responsive/agromet_adv_ser_district_current_en.php";

const content = {
  en: {
    tagline: "Climate-smart farming",
    navHow: "How it works",
    navFeatures: "Features",
    navCta: "Check my farm",
    langButton: "தமிழ்",
    heroTitle: "Know what the weather means for your field before it arrives.",
    heroText:
      "Enter your village and crop. VayalGuard reads the 7-day forecast and tells you what needs attention and what to do next.",
    ctaPrimary: "Check my farm",
    ctaSecondary: "See how it works",
    heroNote: "Available in Tamil and English. Works on any phone.",
    sampleLabel: "Sample for illustration",
    sampleTitle: "Paddy at flowering stage",
    sampleBadge: "Moderate attention",
    sampleSummary: "Some forecast conditions deserve attention. Monitor the field and recheck the forecast.",
    sampleReasons: [
      "Rain probability reaches 80% on Thursday.",
      "A high of 36°C is forecast while the crop is flowering.",
    ],
    days: ["Today", "Tue", "Wed", "Thu", "Fri"],
    howTitle: "How it works",
    steps: [
      { title: "Tell us about your farm", text: "Village, crop, sowing date, growth stage and how you irrigate." },
      { title: "We read the 7-day forecast", text: "Rain, heat, wind and dry spells are checked against your crop and its stage." },
      { title: "You get a clear plan", text: "A risk level, the reasons behind it, and a short checklist for the days ahead." },
    ],
    featTitle: "Built for how farmers decide",
    features: [
      { title: "Risk you can read at a glance", text: "Green, amber or red, with the exact reasons listed so you can judge for yourself." },
      { title: "Advice that fits your crop", text: "16 crops plus your own. The guidance changes with the growth stage." },
      { title: "Tamil and English", text: "Switch language any time. Every screen is translated." },
      { title: "Official advisories one tap away", text: "Links to India Meteorological Department agro-advisories for your district." },
    ],
    levels: ["Lower attention", "Moderate attention", "High attention"],
    cropsTitle: "Works with the crops you grow",
    crops: ["Paddy", "Groundnut", "Cotton", "Sugarcane", "Banana", "Coconut", "Millets", "Chilli", "Tomato", "Onion", "Maize", "Pulses", "Wheat", "Sesame", "Sunflower", "Soybean"],
    cropsMore: "Or add your own crop.",
    noteTitle: "What VayalGuard is, and is not",
    noteText:
      "VayalGuard gives screening guidance from forecast data. It does not predict crop loss, and it does not replace weather warnings from IMD or advice from your agriculture officer.",
    imdLink: "Open IMD advisories",
    finalTitle: "See this week's forecast for your field.",
    finalText: "Enter your village and choose your crop. That is all it takes to begin.",
    footer: "Weather data from Open-Meteo. Advisory links go to the India Meteorological Department.",
  },
  ta: {
    tagline: "காலநிலைக்கு ஏற்ற வேளாண்மை",
    navHow: "எப்படி செயல்படுகிறது",
    navFeatures: "சிறப்பம்சங்கள்",
    navCta: "என் வயலைப் பார்க்க",
    langButton: "English",
    heroTitle: "வானிலை உங்கள் வயலை எப்படிப் பாதிக்கும் என்பதை முன்கூட்டியே அறிந்துகொள்ளுங்கள்.",
    heroText:
      "கிராமம் மற்றும் பயிரை உள்ளிடுங்கள். 7 நாள் முன்னறிவிப்பைப் பார்த்து, எதற்குக் கவனம் தேவை, அடுத்து என்ன செய்ய வேண்டும் என்பதை VayalGuard சொல்லும்.",
    ctaPrimary: "என் வயலைப் பார்க்க",
    ctaSecondary: "எப்படி செயல்படுகிறது",
    heroNote: "தமிழ் மற்றும் ஆங்கிலத்தில் கிடைக்கும். எந்த கைப்பேசியிலும் செயல்படும்.",
    sampleLabel: "எடுத்துக்காட்டு மட்டுமே",
    sampleTitle: "பூக்கும் நிலையில் நெல்",
    sampleBadge: "மிதமான கவனம்",
    sampleSummary: "முன்னறிவிப்பைக் கவனித்து வயல் நிலையைச் சரிபார்க்கவும்.",
    sampleReasons: [
      "வியாழக்கிழமை மழை வாய்ப்பு 80% வரை உள்ளது.",
      "பயிர் பூக்கும் நிலையில் இருக்கும்போது 36°C வரை வெப்பம் முன்னறிவிக்கப்பட்டுள்ளது.",
    ],
    days: ["இன்று", "செவ்", "புத", "வியா", "வெள்"],
    howTitle: "எப்படி செயல்படுகிறது",
    steps: [
      { title: "உங்கள் வயலைப் பற்றி சொல்லுங்கள்", text: "கிராமம், பயிர், விதைத்த தேதி, வளர்ச்சி நிலை, பாசன முறை." },
      { title: "7 நாள் முன்னறிவிப்பைப் பார்க்கிறோம்", text: "மழை, வெப்பம், காற்று, வறட்சி ஆகியவை உங்கள் பயிர் மற்றும் அதன் வளர்ச்சி நிலைக்கு ஏற்ப சரிபார்க்கப்படும்." },
      { title: "தெளிவான திட்டம் கிடைக்கும்", text: "அபாய நிலை, அதற்கான காரணங்கள், வரும் நாட்களுக்கான சிறிய செயல் பட்டியல்." },
    ],
    featTitle: "விவசாயிகள் முடிவெடுக்கும் விதத்திற்கு ஏற்றது",
    features: [
      { title: "ஒரே பார்வையில் அபாய நிலை", text: "பச்சை, மஞ்சள் அல்லது சிவப்பு நிறத்துடன் காரணங்களும் பட்டியலிடப்படும்; நீங்களே முடிவெடுக்கலாம்." },
      { title: "உங்கள் பயிருக்கு ஏற்ற ஆலோசனை", text: "16 பயிர்கள், உங்கள் சொந்தப் பயிரையும் சேர்க்கலாம். வளர்ச்சி நிலைக்கு ஏற்ப வழிகாட்டல் மாறும்." },
      { title: "தமிழ் மற்றும் ஆங்கிலம்", text: "எப்போது வேண்டுமானாலும் மொழியை மாற்றலாம். எல்லாத் திரைகளும் மொழிபெயர்க்கப்பட்டுள்ளன." },
      { title: "அதிகாரப்பூர்வ ஆலோசனைகள் ஒரே தொடுதலில்", text: "உங்கள் மாவட்டத்திற்கான இந்திய வானிலை ஆய்வு மைய வேளாண் ஆலோசனைகளுக்கான இணைப்புகள்." },
    ],
    levels: ["குறைந்த கவனம்", "மிதமான கவனம்", "அதிக கவனம்"],
    cropsTitle: "நீங்கள் பயிரிடும் பயிர்களுக்கு ஏற்றது",
    crops: ["நெல்", "நிலக்கடலை", "பருத்தி", "கரும்பு", "வாழை", "தென்னை", "சிறுதானியங்கள்", "மிளகாய்", "தக்காளி", "வெங்காயம்", "மக்காச்சோளம்", "பருப்பு வகைகள்", "கோதுமை", "எள்", "சூரியகாந்தி", "சோயாபீன்"],
    cropsMore: "அல்லது உங்கள் சொந்தப் பயிரைச் சேர்க்கவும்.",
    noteTitle: "VayalGuard என்றால் என்ன, என்ன அல்ல",
    noteText:
      "VayalGuard முன்னறிவிப்புத் தரவின் அடிப்படையிலான எச்சரிக்கை வழிகாட்டலை மட்டுமே தருகிறது. பயிர் இழப்பைக் கணிக்காது; IMD வானிலை எச்சரிக்கைகள் அல்லது உங்கள் வேளாண் அலுவலரின் ஆலோசனைக்கு மாற்றாகாது.",
    imdLink: "IMD ஆலோசனைகளைத் திறக்க",
    finalTitle: "உங்கள் வயலுக்கான இந்த வாரத்து முன்னறிவிப்பைப் பாருங்கள்.",
    finalText: "கிராமத்தை உள்ளிட்டு பயிரைத் தேர்ந்தெடுங்கள். தொடங்க அவ்வளவுதான்.",
    footer: "வானிலைத் தரவு: Open-Meteo. ஆலோசனை இணைப்புகள் இந்திய வானிலை ஆய்வு மையத்திற்குச் செல்லும்.",
  },
};

const sampleForecast = [
  { icon: Sun, max: 34, rain: 20 },
  { icon: CloudSun, max: 35, rain: 40 },
  { icon: Cloud, max: 36, rain: 60 },
  { icon: CloudRain, max: 33, rain: 80 },
  { icon: CloudRain, max: 32, rain: 50 },
];

function readLanguage() {
  try {
    const saved = JSON.parse(localStorage.getItem("vayalguard-profile") || "{}");
    return saved.language === "ta" ? "ta" : "en";
  } catch {
    return "en";
  }
}

// Shares the language choice with the dashboard, which reads the same saved profile.
function writeLanguage(language) {
  try {
    const saved = JSON.parse(localStorage.getItem("vayalguard-profile") || "{}");
    localStorage.setItem("vayalguard-profile", JSON.stringify({ ...saved, language }));
  } catch {
    // The landing page still works without browser storage.
  }
}

export default function Landing({ onStart }) {
  const [language, setLanguage] = useState(readLanguage);
  const c = content[language];

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  function toggleLanguage() {
    const next = language === "en" ? "ta" : "en";
    setLanguage(next);
    writeLanguage(next);
  }

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="lp">
      <section className="lp-hero">
        <header className="lp-nav">
          <div className="lp-brand">
            <span className="lp-brand-mark">
              <Sprout size={24} />
            </span>
            <span>
              <strong>VayalGuard</strong>
              <small>{c.tagline}</small>
            </span>
          </div>

          <nav className="lp-nav-links" aria-label="Page sections">
            <button type="button" onClick={() => scrollTo("lp-how")}>{c.navHow}</button>
            <button type="button" onClick={() => scrollTo("lp-features")}>{c.navFeatures}</button>
          </nav>

          <div className="lp-nav-actions">
            <button type="button" className="lp-lang" onClick={toggleLanguage}>
              <Languages size={16} />
              {c.langButton}
            </button>
            <button type="button" className="lp-btn lp-btn-turmeric lp-nav-cta" onClick={onStart}>
              {c.navCta}
            </button>
          </div>
        </header>

        <div className="lp-hero-grid">
          <div className="lp-hero-copy">
            <h1>{c.heroTitle}</h1>
            <p>{c.heroText}</p>
            <div className="lp-hero-buttons">
              <button type="button" className="lp-btn lp-btn-turmeric lp-btn-large" onClick={onStart}>
                {c.ctaPrimary}
              </button>
              <button type="button" className="lp-btn lp-btn-ghost lp-btn-large" onClick={() => scrollTo("lp-how")}>
                {c.ctaSecondary}
              </button>
            </div>
            <p className="lp-hero-note">{c.heroNote}</p>
          </div>

          <aside className="lp-sample" aria-label={c.sampleLabel}>
            <div className="lp-sample-top">
              <div>
                <span className="lp-sample-tag">{c.sampleLabel}</span>
                <h2>{c.sampleTitle}</h2>
              </div>
              <span className="lp-badge lp-badge-medium">
                <ShieldAlert size={15} />
                {c.sampleBadge}
              </span>
            </div>

            <div className="lp-sample-summary">{c.sampleSummary}</div>

            <ul className="lp-sample-reasons">
              {c.sampleReasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>

            <div className="lp-sample-days">
              {sampleForecast.map((day, index) => {
                const Icon = day.icon;
                return (
                  <div className={`lp-sample-day ${index === 0 ? "is-today" : ""}`} key={c.days[index]}>
                    <span>{c.days[index]}</span>
                    <Icon size={22} />
                    <strong>{day.max}°</strong>
                    <em>{day.rain}%</em>
                  </div>
                );
              })}
            </div>
          </aside>
        </div>
      </section>

      <section className="lp-section" id="lp-how">
        <h2 className="lp-section-title">{c.howTitle}</h2>
        <ol className="lp-steps">
          {c.steps.map((step, index) => (
            <li key={step.title}>
              <span className="lp-step-number">{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="lp-section lp-section-tint" id="lp-features">
        <h2 className="lp-section-title">{c.featTitle}</h2>
        <div className="lp-features">
          {c.features.map((feature, index) => (
            <article key={feature.title}>
              <span className="lp-feature-icon">
                {index === 0 ? <ShieldAlert size={22} /> : index === 1 ? <Sprout size={22} /> : index === 2 ? <Languages size={22} /> : <ClipboardCheck size={22} />}
              </span>
              <div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
                {index === 0 && (
                  <div className="lp-levels">
                    <span className="lp-badge lp-badge-low">{c.levels[0]}</span>
                    <span className="lp-badge lp-badge-medium">{c.levels[1]}</span>
                    <span className="lp-badge lp-badge-high">{c.levels[2]}</span>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="lp-section">
        <h2 className="lp-section-title">{c.cropsTitle}</h2>
        <ul className="lp-crops">
          {c.crops.map((crop) => (
            <li key={crop}>{crop}</li>
          ))}
        </ul>
        <p className="lp-crops-more">{c.cropsMore}</p>
      </section>

      <section className="lp-section lp-note-wrap">
        <div className="lp-note">
          <CheckCircle2 size={26} />
          <div>
            <h3>{c.noteTitle}</h3>
            <p>{c.noteText}</p>
            <a href={IMD_URL} target="_blank" rel="noopener noreferrer">
              {c.imdLink} <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </section>

      <section className="lp-final">
        <h2>{c.finalTitle}</h2>
        <p>{c.finalText}</p>
        <button type="button" className="lp-btn lp-btn-turmeric lp-btn-large" onClick={onStart}>
          {c.ctaPrimary}
        </button>
      </section>

      <footer className="lp-footer">{c.footer}</footer>
    </div>
  );
}