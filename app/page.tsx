/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Send, Heart, BookOpen, 
  Disc3, Play, Pause, Volume2, VolumeX,
  Compass, Radio, PenTool,
  ChevronLeft, ChevronRight, Plus, Trash2,
  Bookmark, MessageSquare, Quote, Music,
  Coffee, Cloud, Wind, Feather, Check,
  Lock, KeyRound, AlertCircle, Eye, EyeOff,
  Clock, MapPin, Smile, FileText, Share2,
  Sliders, RefreshCw
} from "lucide-react";

// =========================================================================
// 1. INTEGRASI FIREBASE FIRESTORE & FALLBACK LOCAL STORAGE
// =========================================================================
import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  doc, 
  deleteDoc,
  updateDoc,
  increment,
  Firestore
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCqj30qnLR-wklP_5_0vHelJg5f2gGWMxs",
  authDomain: "porto-uswa.firebaseapp.com",
  projectId: "porto-uswa",
  storageBucket: "porto-uswa.firebasestorage.app",
  messagingSenderId: "920311690756",
  appId: "1:920311690756:web:85a3cc9b58703aef0ce751"
};

let db: Firestore | null = null;
let isFirebaseActive = false;

try {
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  db = getFirestore(app);
  isFirebaseActive = true;
} catch (err) {
  console.warn("Gagal inisialisasi Firebase:", err);
  isFirebaseActive = false;
}

// Password Admin Khusus Sesuai Permintaan
const ADMIN_SECRET_KEY = "Uswasaz170608";

// =========================================================================
// 2. DATA STRUKTUR STORYTELLING & PRESET MEMO
// =========================================================================

export interface StickyMessage {
  id: string;
  author: string;
  text: string;
  color: "kuning" | "biru" | "merah" | "hijau";
  rotation: number;
  timestamp: string;
  likes: number;
  isFloating?: boolean;
}

export interface ScrapbookStory {
  id: number;
  chapterNumber: string;
  title: string;
  subtitle: string;
  badge: string;
  accentBadge: string;
  illustrationIcon: string;
  body: string[];
  quote: string;
  reflection: string;
}

export interface StoryCardHighlight {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  emoji: string;
  tapeColor: string;
  tapeAngle: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  description: string;
  metaLeft: string;
  metaRight: string;
}

// 6 Bab Scrapbook Jurnal Uswa
const SCRAPBOOK_CHAPTERS: ScrapbookStory[] = [
  {
    id: 1,
    chapterNumber: "Babak I",
    title: "Di Antara Sindoro dan Sumbing",
    subtitle: "Temanggung, kota berhawa sejuk tempat cerita ini bertumbuh.",
    badge: "Akar Cerita",
    accentBadge: "bg-amber-100 text-amber-900 border-amber-300",
    illustrationIcon: "🍃",
    body: [
      "Temanggung punya cara tersendiri untuk membuat seseorang betah merenung. Diapit oleh dua gunung megah yang kerap diselimuti kabut tipis di pagi hari, ritme kehidupan di sini tidak terburu-buru seperti kota-kota besar.",
      "Tumbuh di kota ini membuat Uswa menyadari bahwa kita tidak butuh hingar-bingar luar biasa untuk merasa utuh. Di atas meja belajar kayu sederhana, ditemani hembusan angin sejuk yang menyelinap lewat kisi jendela, kata-kata menemukan jalannya sendiri ke atas kertas.",
      "Bagi Uswa, menulis esai dan catatan harian bukan tentang memamerkan kehebatan bahasa, melainkan cara menjaga agar apa yang dirasakan hari ini tidak hanyut begitu saja ditelan waktu."
    ],
    quote: "Ketenangan bukanlah ketiadaan suara, melainkan kesanggupan mendengar apa yang berbisik di dalam dada.",
    reflection: "Catatan ini ditulis saat fajar menyapa punggung bukit Temanggung."
  },
  {
    id: 2,
    chapterNumber: "Babak II",
    title: "Nostalgia Pop Rumahsakit",
    subtitle: "Ketika jangle pop 90-an menjadi kawan setia merapikan pikiran.",
    badge: "Melodi Sore",
    accentBadge: "bg-amber-100 text-amber-900 border-amber-300",
    illustrationIcon: "📼",
    body: [
      "Ada kehangatan ganjil dalam melodi lagu-lagu Rumahsakit. Petikan gitar pop yang jernih, progresi nada yang melayang, dan lirik-lirik bersahaja yang tidak memaksakan drama.",
      "Trek seperti 'Hilang' atau 'Kuning' bukan sekadar daftar putar audio di latar belakang. Mereka adalah mesin waktu. Setiap kali pita kaset berputar, ada rasa nyaman yang melingkupi ruangan—mengingatkan bahwa hidup boleh dijalani perlahan.",
      "Musik pop indie era 90-an punya ketulusan yang langka: mereka bernyanyi tentang kerinduan, ketidaksempurnaan, dan harapan tanpa perlu berpura-pura menjadi sosok yang serba tahu."
    ],
    quote: "Lagu yang baik tidak menuntut perhatian penuhmu; ia merangkul keheninganmu dengan anggun.",
    reflection: "Diputar berulang kali pada sore hari di sela rehat belajar."
  },
  {
    id: 3,
    chapterNumber: "Babak III",
    title: "Sepiring Nasi Goreng Kampung",
    subtitle: "Bukti sederhana bahwa kenyamanan sejati tak pernah rumit.",
    badge: "Kenyamanan Rasa",
    accentBadge: "bg-rose-100 text-rose-900 border-rose-300",
    illustrationIcon: "🍳",
    body: [
      "Manusia sering kali mencari kebahagiaan di tempat-tempat yang jauh dan mahal. Padahal, tombol pemulih energi paling ampuh sering kali hanya berwujud sepiring nasi goreng kampung hangat.",
      "Kecap manis yang meresap pas, aroma wajan besi yang gurih, taburan bawang goreng renyah, dan yang paling krusial: sebutir telur mata sapi dengan bagian kuning yang masih setengah matang meleleh saat dibelah.",
      "Momen menyantap nasi goreng hangat sepulang sekolah selalu menjadi jeda sakral. Di suapan pertama, semua kerumitan ujian dan lelahnya tugas mendadak terasa bisa dihadapi kembali dengan kepala tegak."
    ],
    quote: "Bahagia itu tidak memerlukan validasi kemewahan; ia hanya butuh rasa syukur yang hangat.",
    reflection: "Didedikasikan untuk menu makan malam paling setia di rumah."
  },
  {
    id: 4,
    chapterNumber: "Babak IV",
    title: "Kaki Kiri di Sudut Lapangan",
    subtitle: "Dinamika menjadi pemain kidal saat bermain futsal sore.",
    badge: "Ritme Tubuh",
    accentBadge: "bg-emerald-100 text-emerald-900 border-emerald-300",
    illustrationIcon: "⚽",
    body: [
      "Olahraga futsal adalah ruang di mana pikiran berhenti menganalisis dan tubuh mengambil kendali penuh. Bagi seorang kidal, lapangan hijau kecil menghadirkan sudut pandang yang selalu tak lazim bagi lawan.",
      "Sebagian besar pemain bertahan terbiasa menutup pergerakan kaki kanan. Ketika bola digiring menyusur garis sayap kiri dan diarahkan lewat sepakan kidal melengkung, ada kepuasan murni dalam membuka celah yang tak terduga.",
      "Keringat, tawa bersama teman setim, dan bunyi derit sol sepatu di lantai lapangan adalah penyeimbang mutlak setelah berjam-jam berkutat di depan meja belajar."
    ],
    quote: "Perbedaan sudut pandang—bahkan yang lahir dari kaki kiri—selalu membuka celah yang indah.",
    reflection: "Tercatat seusai pertandingan futsal santai bersama kawan sekolah."
  },
  {
    id: 5,
    chapterNumber: "Babak V",
    title: "Mendengar Isi Kepala Manusia",
    subtitle: "Ketertarikan mendalam pada psikologi, fiksi, dan ruang empati.",
    badge: "Ruang Pikir",
    accentBadge: "bg-violet-100 text-violet-900 border-violet-300",
    illustrationIcon: "🎧",
    body: [
      "Mengapa seseorang bisa mengambil keputusan yang tampak keliru bagi orang lain? Apa yang melatari sebuah keberanian atau ketakutan? Pertanyaan-pertanyaan ini yang membuat Uswa gemar mendengarkan obrolan panjang di podcast.",
      "Dipadukan dengan kegemaran membaca novel fiksi dan cerita aksi, mempelajari psikologi manusia bukan untuk menghakimi, melainkan untuk melatih kelembutan hati.",
      "Setiap orang yang kita temui di jalan membawa ransel pengalaman dan kepedihan yang tak terlihat. Semakin banyak kita mendengar sudut pandang orang lain, semakin kita sadar betapa luasnya semesta manusia."
    ],
    quote: "Mendengarkan tanpa menyela adalah bentuk penghormatan tertinggi kepada kemanusiaan.",
    reflection: "Ditulis setelah menyimak diskusi panjang tentang perilaku dan empati."
  },
  {
    id: 6,
    chapterNumber: "Babak VI",
    title: "Keabadian Sapardi Djoko Damono",
    subtitle: "Renungan tentang waktu yang fana dan rasa yang abadi.",
    badge: "Sastra Abadi",
    accentBadge: "bg-amber-100 text-amber-900 border-amber-300",
    illustrationIcon: "📜",
    body: [
      "“Yang fana adalah waktu. Kita abadi.” Tujuh kata sederhana dari Sapardi Djoko Damono yang selalu berhasil meredakan rasa cemas akan masa depan.",
      "Waktu memang tidak pernah berhenti berjalan; ia menua, ia menggugurkan dedaunan, dan menghapus jejak langkah. Namun kata-kata tulus, kebaikan yang pernah kita berikan, dan buku-buku yang kita cintai tidak akan pernah lapuk.",
      "Melalui portofolio cerita ini, Uswa hanya ingin menitipkan sepotong jejak kecil: bahwa pernah ada seorang anak muda di Temanggung yang mencintai kata-kata, mengagumi keindahan sederhana, dan terus belajar menjadi manusia yang lebih utuh."
    ],
    quote: "Waktu boleh terus berlalu, tapi rasa yang ditulis dengan jujur akan tinggal melampaui usianya.",
    reflection: "Kutipan dari bait puisi yang selalu diulang di lembar pertama buku catatan."
  }
];

// 4 Kartu Cuplikan Keseharian
const STORY_CARDS: StoryCardHighlight[] = [
  {
    id: "futsal",
    title: "Kidal di Garis Sayap Lapangan",
    subtitle: "Kaki kiri yang selalu memberi sudut operan tak terduga.",
    tag: "Lapangan Sore",
    emoji: "⚽",
    tapeColor: "bg-emerald-200/90",
    tapeAngle: "-rotate-2",
    bgColor: "bg-[#F2FAF4]",
    borderColor: "border-slate-800",
    textColor: "text-emerald-900",
    description: "Di lapangan futsal yang sempit, menjadi pemain kidal menghadirkan insting alami. Operan silang tajam atau tembakan menyusur tiang jauh dari sisi kiri selalu jadi kejutan tak terduga bagi pertahanan lawan. Olahraga adalah pelepasan energi paling jujur setelah seharian membaca buku.",
    metaLeft: "Posisi Andalan: Left Wing",
    metaRight: "✦ Kaki Kiri Alami"
  },
  {
    id: "nasgor",
    title: "Nasi Goreng Telur 1/2 Matang",
    subtitle: "Bukti nyata bahwa kenyamanan sejati tak butuh serba mahal.",
    tag: "Kenyamanan Meja Makan",
    emoji: "🍳",
    tapeColor: "bg-amber-200/90",
    tapeAngle: "rotate-2",
    bgColor: "bg-[#FEF8ED]",
    borderColor: "border-slate-800",
    textColor: "text-amber-900",
    description: "Tidak ada menu yang mengalahkan sepiring nasi goreng kampung hangat dengan bumbu bawang gurih, kerupuk, dan lelehan kuning telur setengah matang. Makanan sederhana ini selalu berhasil menyetel ulang suasana hati setelah seharian memeras otak untuk belajar.",
    metaLeft: "Level Kenikmatan: 100%",
    metaRight: "✦ Resep Favorit"
  },
  {
    id: "podcast",
    title: "Mendengar Isi Kepala Manusia",
    subtitle: "Memahami alasan psikologis di balik keputusan setiap orang.",
    tag: "Ruang Pikir & Diskusi",
    emoji: "🎧",
    tapeColor: "bg-violet-200/90",
    tapeAngle: "rotate-3",
    bgColor: "bg-[#F8F4FD]",
    borderColor: "border-slate-800",
    textColor: "text-violet-900",
    description: "Mendengarkan perbincangan panjang di podcast melatih kesabaran untuk tidak lekas menilai orang lain. Setiap individu membawa luka, harapan, dan latar belakang yang berbeda. Empati tumbuh saat kita bersedia menyimak sebelum bersuara.",
    metaLeft: "Fokus: Psikologi & Diskusi",
    metaRight: "✦ Melatih Empati"
  },
  {
    id: "fiksi",
    title: "Cerita Fiksi, Aksi & Kata-Kata",
    subtitle: "Menyelami dunia baru yang dibangun lewat kalimat sederhana.",
    tag: "Dunia Imajinasi",
    emoji: "📚",
    tapeColor: "bg-sky-200/90",
    tapeAngle: "-rotate-2",
    bgColor: "bg-[#F0F8FD]",
    borderColor: "border-slate-800",
    textColor: "text-sky-900",
    description: "Membaca fiksi dan menonton cerita aksi bukan cuma hiburan lepas. Di sana ada seni merangkai ketegangan, membangun karakter yang tidak sempurna, dan merawat rasa penasaran. Kata-kata yang disusun tepat selalu mampu menggetarkan pembacanya.",
    metaLeft: "Media: Buku & Novel Fiksi",
    metaRight: "✦ Narasi Tertulis"
  }
];

const PRESET_MESSAGES: StickyMessage[] = [
  {
    id: "preset-1",
    author: "Kawan Belajar",
    text: "Tulisannya hangat banget Wa. Tetap semangat mengasah esai dan futsal kidalnya!",
    color: "kuning",
    rotation: -2,
    timestamp: "Hari ini",
    likes: 18,
    isFloating: true
  },
  {
    id: "preset-2",
    author: "Rian Indie",
    text: "Salam sesama penikmat Rumahsakit! Track Hilang emang obat paling ampuh pas sore.",
    color: "biru",
    rotation: 3,
    timestamp: "Kemarin",
    likes: 14,
    isFloating: true
  },
  {
    id: "preset-3",
    author: "Nabila A.",
    text: "Definisi bahagia emang beneran sepiring nasgor telur setengah matang 🍳✨",
    color: "merah",
    rotation: -3,
    timestamp: "2 hari lalu",
    likes: 21,
    isFloating: true
  },
  {
    id: "preset-4",
    author: "Pembaca Temanggung",
    text: "Kutipan Sapardi Djoko Damono selalu jadi pengingat terbaik. Keren banget portofolionya!",
    color: "hijau",
    rotation: 2,
    timestamp: "Minggu ini",
    likes: 26,
    isFloating: true
  }
];

// =========================================================================
// 3. SYNTHESIZER AUDIO FALLBACK ENGINE (WEB AUDIO API)
// =========================================================================
class CozySynthPlayer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
  }

  public playSoftPop(freq = 460) {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + 0.07);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.07);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.07);
    } catch {}
  }

  public playLofiTone(freq: number, duration = 0.9) {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const sub = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      sub.type = "sine";
      sub.frequency.setValueAtTime(freq * 0.5, this.ctx.currentTime);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(580, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.14, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(filter);
      sub.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      sub.start();
      osc.stop(this.ctx.currentTime + duration);
      sub.stop(this.ctx.currentTime + duration);
    } catch {}
  }
}

const cozySynth = new CozySynthPlayer();

// =========================================================================
// 4. KOMPONEN UTAMA PORTFOLIO USWA
// =========================================================================

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [realTimeWIB, setRealTimeWIB] = useState("");
  
  // Audio Player State (Dinamis untuk 3 Lagu: Hilang, Kuning, Anomali)
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [activeSongName, setActiveSongName] = useState<"Hilang" | "Kuning" | "Anomali">("Hilang");
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(214);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Scrapbook 3D State
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);

  // Sticky Notes State
  const [stickyNotesList, setStickyNotesList] = useState<StickyMessage[]>(PRESET_MESSAGES);
  const [inputAuthor, setInputAuthor] = useState("");
  const [inputText, setInputText] = useState("");
  const [selectedColor, setSelectedColor] = useState<"kuning" | "biru" | "merah" | "hijau">("kuning");
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [submitSuccessNotice, setSubmitSuccessNotice] = useState(false);

  // Modal Password Delete Note
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [noteTargetId, setNoteTargetId] = useState<string | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Desk State
  const [deskQuoteIndex, setDeskQuoteIndex] = useState(0);
  const [cheerHearts, setCheerHearts] = useState<{ id: number; leftOffset: number }[]>([]);
  const [totalCheers, setTotalCheers] = useState(89);

  const deskQuotes = [
    "“Lagi merapikan catatan esai sambil dengerin petikan gitar Rumahsakit...”",
    "“Sepiring nasi goreng telur setengah matang emang obat capek terbaik.”",
    "“Kaki kiri selalu siap buat latihan operan futsal nanti sore.”",
    "“Waktu fana, tapi kata-kata yang kita tulis dengan jujur akan abadi.”",
    "“Mendengarkan cara orang lain berpikir selalu membuka kacamata baru.”"
  ];

  // -----------------------------------------------------------------------
  // Clock Tracker & Hydration Safe Guard
  // -----------------------------------------------------------------------
  useEffect(() => {
    setIsMounted(true);
    const updateClock = () => {
      const now = new Date();
      setRealTimeWIB(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Asia/Jakarta"
        }) + " WIB"
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // -----------------------------------------------------------------------
  // Sinkronisasi Firebase Firestore & LocalStorage
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (isFirebaseActive && db) {
      try {
        const q = query(collection(db, "uswa_messages"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          if (!snapshot.empty) {
            const fetched = snapshot.docs.map((docSnap) => {
              const d = docSnap.data();
              return {
                id: docSnap.id,
                author: d.author || "Anonim",
                text: d.text || "",
                color: (d.color as "kuning" | "biru" | "merah" | "hijau") || "kuning",
                rotation: d.rotation || 0,
                timestamp: d.timestamp || "Baru saja",
                likes: d.likes || 0,
                isFloating: true
              };
            });
            setStickyNotesList(fetched);
          }
        });
        return () => unsubscribe();
      } catch {}
    } else {
      if (typeof window !== "undefined") {
        const localCached = localStorage.getItem("uswa_notes_storage_v2");
        if (localCached) {
          try {
            const parsed = JSON.parse(localCached);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setStickyNotesList(parsed);
            }
          } catch {}
        }
      }
    }
  }, []);

  // -----------------------------------------------------------------------
  // Audio Player Controller
  // -----------------------------------------------------------------------
  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    if (isPlayingMusic) {
      audioEl.load();
      const playPromise = audioEl.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } else {
      audioEl.pause();
    }
  }, [isPlayingMusic, activeSongName]);

  useEffect(() => {
    if (!isPlayingMusic) return;
    const chords = [261.63, 329.63, 392.00, 523.25, 349.23, 440.00];
    let idx = 0;
    const synthLoop = setInterval(() => {
      if (audioRef.current && audioRef.current.paused) {
        cozySynth.playLofiTone(chords[idx % chords.length], 0.95);
        idx++;
      }
    }, 950);
    return () => clearInterval(synthLoop);
  }, [isPlayingMusic]);

  const handleAudioTimeUpdate = () => {
    if (audioRef.current) {
      setAudioCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration) {
        setAudioDuration(audioRef.current.duration);
      }
    }
  };

  const togglePlayMusic = () => {
    cozySynth.playSoftPop(560);
    setIsPlayingMusic(!isPlayingMusic);
  };

  const handleNextTrack = () => {
    cozySynth.playSoftPop(620);
    const tracks: ("Hilang" | "Kuning" | "Anomali")[] = ["Hilang", "Kuning", "Anomali"];
    const next = tracks[(tracks.indexOf(activeSongName) + 1) % tracks.length];
    setActiveSongName(next);
  };

  const handleTurnPage = (direction: "next" | "prev") => {
    cozySynth.playSoftPop(480);
    if (direction === "next") {
      setCurrentChapterIndex((prev) => Math.min(SCRAPBOOK_CHAPTERS.length - 1, prev + 1));
    } else {
      setCurrentChapterIndex((prev) => Math.max(0, prev - 1));
    }
  };

  // -----------------------------------------------------------------------
  // Sticky Notes & Modal Password Handlers
  // -----------------------------------------------------------------------
  const handlePostStickyMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputAuthor.trim() || !inputText.trim() || isSubmittingNote) return;

    cozySynth.playSoftPop(680);
    setIsSubmittingNote(true);

    const randomRot = Math.floor((Math.random() - 0.5) * 8);
    const newNoteObj: StickyMessage = {
      id: "note-" + Date.now(),
      author: inputAuthor.trim(),
      text: inputText.trim(),
      color: selectedColor,
      rotation: randomRot,
      timestamp: "Baru saja",
      likes: 1,
      isFloating: true
    };

    if (isFirebaseActive && db) {
      try {
        await addDoc(collection(db, "uswa_messages"), {
          author: newNoteObj.author,
          text: newNoteObj.text,
          color: newNoteObj.color,
          rotation: newNoteObj.rotation,
          timestamp: "Hari ini",
          likes: 1,
          createdAt: serverTimestamp()
        });
      } catch {
        const updated = [newNoteObj, ...stickyNotesList];
        setStickyNotesList(updated);
        if (typeof window !== "undefined") {
          localStorage.setItem("uswa_notes_storage_v2", JSON.stringify(updated));
        }
      }
    } else {
      const updated = [newNoteObj, ...stickyNotesList];
      setStickyNotesList(updated);
      if (typeof window !== "undefined") {
        localStorage.setItem("uswa_notes_storage_v2", JSON.stringify(updated));
      }
    }

    setInputAuthor("");
    setInputText("");
    setIsSubmittingNote(false);
    setSubmitSuccessNotice(true);
    setTimeout(() => setSubmitSuccessNotice(false), 3000);
  };

  const handleLikeSticky = async (noteId: string) => {
    cozySynth.playSoftPop(740);
    if (isFirebaseActive && db) {
      try {
        const noteRef = doc(db, "uswa_messages", noteId);
        await updateDoc(noteRef, { likes: increment(1) });
      } catch {}
    }
    const updated = stickyNotesList.map((item) => {
      if (item.id === noteId) return { ...item, likes: item.likes + 1 };
      return item;
    });
    setStickyNotesList(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("uswa_notes_storage_v2", JSON.stringify(updated));
    }
  };

  const openDeleteModal = (noteId: string) => {
    cozySynth.playSoftPop(420);
    setNoteTargetId(noteId);
    setPasswordInput("");
    setPasswordError(false);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput !== ADMIN_SECRET_KEY) {
      setPasswordError(true);
      cozySynth.playSoftPop(220);
      return;
    }

    if (!noteTargetId) return;

    if (isFirebaseActive && db) {
      try {
        await deleteDoc(doc(db, "uswa_messages", noteTargetId));
      } catch {}
    }

    const updated = stickyNotesList.filter((item) => item.id !== noteTargetId);
    setStickyNotesList(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("uswa_notes_storage_v2", JSON.stringify(updated));
    }

    cozySynth.playSoftPop(820);
    setDeleteModalOpen(false);
    setNoteTargetId(null);
  };

  const handleSendCheerBurst = () => {
    cozySynth.playSoftPop(600 + Math.random() * 200);
    setTotalCheers((prev) => prev + 1);

    const newHeart = {
      id: Date.now() + Math.random(),
      leftOffset: (Math.random() - 0.5) * 80
    };
    setCheerHearts((prev) => [...prev, newHeart]);

    setTimeout(() => {
      setCheerHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1200);
  };

  const formatAudioTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const activeChapter = SCRAPBOOK_CHAPTERS[currentChapterIndex];

  return (
    <main 
      suppressHydrationWarning 
      className="min-h-screen bg-[#FDFBF7] text-slate-800 font-sans selection:bg-amber-200 selection:text-amber-950 overflow-x-hidden relative pb-28"
    >
      
      {/* Audio Element Terproteksi Render Client Only */}
      {isMounted && (
        <audio
          ref={audioRef}
          src={`/assets/${activeSongName.toLowerCase()}.mp3`}
          onTimeUpdate={handleAudioTimeUpdate}
          onEnded={handleNextTrack}
          preload="auto"
        />
      )}

      {/* Background Dots Kertas Sketsa */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-30 -z-30"
        style={{
          backgroundImage: "radial-gradient(#D97706 1.1px, transparent 1.1px)",
          backgroundSize: "24px 24px"
        }}
      />

      {/* Pendar Cahaya Lembut Hangat */}
      <div className="fixed top-10 left-1/2 -translate-x-1/2 w-96 sm:w-[680px] h-96 sm:h-[680px] bg-gradient-to-b from-amber-200/50 via-sky-100/40 to-transparent rounded-full blur-[130px] pointer-events-none -z-20" />
      <div className="fixed bottom-1/4 right-0 w-80 sm:w-[500px] h-80 sm:h-[500px] bg-rose-100/45 rounded-full blur-[120px] pointer-events-none -z-20" />

      {/* Awan Kartun Melayang Perlahan */}
      <motion.div 
        animate={{ x: [-140, 1200] }}
        transition={{ duration: 58, repeat: Infinity, ease: "linear" }}
        className="fixed top-16 -left-40 pointer-events-none -z-10 opacity-70 flex items-center"
      >
        <div className="w-44 h-14 bg-white/90 rounded-full shadow-xs relative">
          <div className="absolute -top-6 left-6 w-20 h-20 bg-white/90 rounded-full" />
          <div className="absolute -top-3 left-18 w-14 h-14 bg-white/90 rounded-full" />
        </div>
      </motion.div>

      {/* Partikel Bintang Mengapung Berdenyut */}
      {[
        { t: "10%", l: "7%", s: "text-2xl text-amber-400", d: 0 },
        { t: "20%", r: "9%", s: "text-3xl text-sky-400", d: 1.2 },
        { t: "42%", l: "5%", s: "text-xl text-rose-300", d: 2.1 },
        { t: "60%", r: "7%", s: "text-2xl text-amber-300", d: 0.7 },
        { t: "78%", l: "8%", s: "text-xl text-emerald-400", d: 1.8 }
      ].map((star, i) => (
        <motion.span
          key={i}
          style={{ top: star.t, left: star.l, right: star.r }}
          animate={{
            y: [0, -14, 0],
            scale: [0.9, 1.25, 0.9],
            rotate: [0, 90, 0],
            opacity: [0.35, 0.95, 0.35]
          }}
          transition={{ duration: 4.2, delay: star.d, repeat: Infinity, ease: "easeInOut" }}
          className={`fixed pointer-events-none select-none z-0 font-black ${star.s}`}
        >
          {i % 2 === 0 ? "✦" : "✧"}
        </motion.span>
      ))}

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-3.5 backdrop-blur-xl bg-white/85 border-b-2 border-amber-900/10 shadow-xs">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => cozySynth.playSoftPop(620)}
              className="w-9 h-9 rounded-2xl bg-amber-200 border-2 border-slate-800 shadow-[2px_2px_0px_0px_rgba(30,41,59,1)] flex items-center justify-center text-slate-900 font-black text-base cursor-pointer -rotate-2"
            >
              U
            </motion.div>
            <div>
              <span className="font-black tracking-tight text-slate-900 text-sm sm:text-base">
                uswa<span className="text-amber-600">.</span>story
              </span>
              <span className="hidden sm:block text-[9px] font-black text-slate-500 tracking-wider">
                CATATAN &bull; {isMounted ? realTimeWIB : "TEMANGGUNG"}
              </span>
            </div>
          </div>

          <div 
            onClick={togglePlayMusic}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border-2 border-slate-800 shadow-[2px_2px_0px_0px_rgba(30,41,59,1)] cursor-pointer hover:bg-amber-100 transition-colors"
          >
            <Disc3 className={`w-3.5 h-3.5 text-amber-700 ${isPlayingMusic ? "animate-spin" : ""}`} />
            <span className="text-[11px] font-black text-slate-800">
              {isPlayingMusic ? `Rumahsakit: ${activeSongName}` : "Putar Rumahsakit"}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-5 text-xs font-black text-slate-700">
            <a href="#kaset" className="hover:text-amber-700 transition-colors">Kaset</a>
            <a href="#cerita" className="hover:text-amber-700 transition-colors">Kisah</a>
            <a href="#jurnal" className="hover:text-amber-700 transition-colors">Jurnal</a>
            <a href="#pesan" className="hover:text-amber-700 transition-colors">Pesan</a>
            <a 
              href="#footer"
              className="px-4 py-1.5 rounded-full bg-slate-900 text-white font-bold text-xs shadow-[2px_2px_0px_0px_rgba(217,119,6,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              Sapa Uswa
            </a>
          </div>

        </div>
      </nav>

      {/* HERO SECTION: MEJA UTAMA & 4 ELEMEN SIMETRIS */}
      <section className="relative min-h-[96vh] flex flex-col items-center justify-center pt-24 pb-12 px-4">
        
        {/* Teks Perkenalan Header (Diberikan Padding Bawah Agar Tidak Nabrak) */}
        <div className="text-center max-w-xl mx-auto z-10 mb-4 px-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border-2 border-slate-800 text-[11px] font-black text-slate-800 shadow-[2px_2px_0px_0px_rgba(30,41,59,1)] mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
            Tempat Kata-Kata Menemukan Rumahnya
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Halo, Aku Uswa.
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm sm:max-w-md mx-auto font-medium">
            Seorang pelajar biasa yang tak sempurna, pengagum melodi pop 90-an, kidal saat futsal, dan gemar merawat kenangan sederhana lewat tulisan.
          </p>

          <p className="mt-3 text-[11px] font-black text-amber-700 tracking-wide flex items-center justify-center gap-1.5 pb-2">
            ✦ Sentuh benda-benda di sekitar mejaku untuk melihat ceritanya
          </p>
        </div>

        {/* ================================================================= */}
        {/* KANVAS MEJA DENGAN JARAK AMAN (mt-16 sm:mt-20) BEBAS TABRAKAN     */}
        {/* ================================================================= */}
        <div className="relative w-full max-w-[340px] sm:max-w-[460px] md:max-w-[560px] flex justify-center items-center mt-16 sm:mt-20 mb-8">
          
          {/* Karpet Alas Meja Oval */}
          <div className="absolute -bottom-8 w-full max-w-[320px] sm:max-w-[460px] h-32 sm:h-44 bg-gradient-to-b from-amber-200/70 via-amber-300/60 to-amber-400/50 rounded-[50%] border-4 border-slate-800 shadow-[0_14px_0_0_#1e293b] -z-10" />

          {/* Balon Dialog Tepat di Atas Meja dengan Lebar Responsif */}
          <motion.div 
            onClick={() => {
              cozySynth.playSoftPop(540);
              setDeskQuoteIndex((prev) => (prev + 1) % deskQuotes.length);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-16 z-30 bg-white px-4 py-2.5 rounded-2xl border-3 border-slate-800 shadow-[4px_4px_0px_0px_rgba(30,41,59,1)] flex items-center gap-2 select-none cursor-pointer w-[90%] max-w-[300px] sm:max-w-sm text-center"
          >
            <span className="text-base">💭</span>
            <span className="text-[11px] sm:text-xs font-black text-slate-800 leading-tight">
              {deskQuotes[deskQuoteIndex]}
            </span>
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-r-3 border-b-3 border-slate-800" />
          </motion.div>

          {/* 1. SUDUT KIRI ATAS: HEADPHONE */}
          <motion.div 
            animate={{ y: [0, -14, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-10 -left-6 sm:-top-12 sm:-left-12 z-20 w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26 cursor-pointer flex flex-col items-center"
            onClick={() => cozySynth.playSoftPop(480)}
          >
            <img 
              src="/assets/headphone.svg" 
              alt="Headphone" 
              className="w-full h-full object-contain filter drop-shadow-[0_10px_8px_rgba(30,41,59,0.25)] hover:scale-110 transition-transform"
              onError={(e) => { (e.currentTarget as HTMLElement).style.display = "none"; }}
            />
            <motion.div 
              animate={{ scale: [1, 0.7, 1], opacity: [0.35, 0.15, 0.35] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
              className="w-10 h-3 bg-slate-800 rounded-full blur-[2px] mt-1"
            />
          </motion.div>

          {/* 2. SUDUT KANAN ATAS: KASET RUMAHTSAKIT (SEJAJAR DENGAN HEADPHONE) */}
          <motion.div 
            animate={{ y: [0, -14, 0], rotate: [0, -5, 5, 0] }}
            transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-10 -right-6 sm:-top-12 sm:-right-12 z-20 w-18 h-16 sm:w-24 sm:h-20 md:w-28 md:h-24 cursor-pointer flex flex-col items-center"
            onClick={() => {
              cozySynth.playSoftPop(520);
              togglePlayMusic();
            }}
          >
            <motion.span 
              animate={{ y: [0, -22], opacity: [0, 1, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
              className="absolute -top-3 left-2 text-amber-600 font-black text-sm select-none pointer-events-none"
            >
              ♪
            </motion.span>
            <img 
              src="/assets/kaset.svg" 
              alt="Kaset Rumahsakit" 
              className="w-full h-full object-contain filter drop-shadow-[0_10px_8px_rgba(30,41,59,0.25)] hover:scale-110 transition-transform"
              onError={(e) => { (e.currentTarget as HTMLElement).style.display = "none"; }}
            />
            <motion.div 
              animate={{ scale: [1, 0.7, 1], opacity: [0.35, 0.15, 0.35] }}
              transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
              className="w-12 h-3.5 bg-slate-800 rounded-full blur-[2px] mt-1"
            />
          </motion.div>

          {/* 3. PUSAT TENGAH: MEJA UTAMA & KARAKTER USWA */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            onClick={() => setDeskQuoteIndex((prev) => (prev + 1) % deskQuotes.length)}
            className="relative z-10 w-[270px] sm:w-[360px] md:w-[450px] select-none cursor-pointer"
          >
            <img 
              src="/assets/uswa-desk.svg" 
              alt="Uswa di Meja Belajar" 
              className="w-full h-auto object-contain mx-auto filter drop-shadow-[0_18px_14px_rgba(30,41,59,0.3)]"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.endsWith(".png")) {
                  target.src = "/assets/uswa-desk.png";
                }
              }}
            />
          </motion.div>

          {/* 4. SUDUT KIRI BAWAH: NASI GORENG TELUR */}
          <motion.div 
            animate={{ y: [0, -12, 0], rotate: [0, 4, -4, 0] }}
            transition={{ duration: 3.9, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-6 -left-6 sm:-bottom-8 sm:-left-12 z-20 w-18 h-18 sm:w-24 sm:h-24 md:w-28 md:h-28 cursor-pointer flex flex-col items-center"
            onClick={() => cozySynth.playSoftPop(440)}
          >
            <img 
              src="/assets/nasgor.svg" 
              alt="Nasi Goreng Telur" 
              className="w-full h-full object-contain filter drop-shadow-[0_10px_8px_rgba(30,41,59,0.25)] hover:scale-110 transition-transform"
              onError={(e) => { (e.currentTarget as HTMLElement).style.display = "none"; }}
            />
            <motion.div 
              animate={{ scale: [1, 0.7, 1], opacity: [0.4, 0.2, 0.4] }}
              transition={{ duration: 3.9, repeat: Infinity, ease: "easeInOut" }}
              className="w-12 h-3.5 bg-slate-800 rounded-full blur-[2px] -mt-1"
            />
          </motion.div>

          {/* 5. SUDUT KANAN BAWAH: GULUNGAN KERTAS PUISI (SEJAJAR DENGAN NASGOR) */}
          <motion.div 
            animate={{ y: [0, -12, 0], rotate: [0, -4, 4, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-6 -right-6 sm:-bottom-8 sm:-right-12 z-20 w-16 h-18 sm:w-22 sm:h-24 md:w-26 md:h-28 cursor-pointer flex flex-col items-center"
            onClick={() => cozySynth.playSoftPop(590)}
          >
            <img 
              src="/assets/puisi.svg" 
              alt="Kertas Catatan Puisi" 
              className="w-full h-full object-contain filter drop-shadow-[0_10px_8px_rgba(30,41,59,0.25)] hover:scale-110 transition-transform"
              onError={(e) => { (e.currentTarget as HTMLElement).style.display = "none"; }}
            />
            <motion.div 
              animate={{ scale: [1, 0.65, 1], opacity: [0.4, 0.2, 0.4] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-11 h-3 bg-slate-800 rounded-full blur-[2px] -mt-1"
            />
          </motion.div>

        </div>

        <a 
          href="#kaset"
          className="mt-6 flex flex-col items-center gap-1 text-[11px] font-black text-slate-700 hover:text-amber-800 transition-colors"
        >
          <span>GULIR KE PEMUTAR KASET & CERITA</span>
          <span className="text-base animate-bounce">↓</span>
        </a>
      </section>

      {/* PEMUTAR KASET RUMAHTSAKIT VINTAGE WARM */}
      <section id="kaset" className="py-20 px-4 sm:px-6 max-w-4xl mx-auto relative z-10">
        <div className="bg-[#FFFDF9] border-3 border-slate-800 rounded-[2.5rem] p-6 sm:p-10 shadow-[0_12px_0_0_#1e293b] relative overflow-hidden">
          
          <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border-2 border-slate-800 px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(30,41,59,1)] flex items-center gap-1.5 w-max">
                <Disc3 className={`w-3.5 h-3.5 text-amber-700 ${isPlayingMusic ? "animate-spin" : ""}`} />
                Soundtrack Pengiring Hari
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                Rumahsakit & Petikan Pop 90-an
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md font-medium">
                Melodi jangle pop klasik yang selalu berhasil menenangkan pikiran saat belajar dan menulis di sore hari.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black text-amber-900 bg-amber-200 border-2 border-slate-800 px-3 py-1 rounded-xl shadow-xs">
                {isPlayingMusic ? "MEMUTAR AUDIO" : "AUDIO DIJEDA"}
              </span>
            </div>
          </div>

          <div className="bg-[#FBF6ED] border-3 border-slate-800 rounded-3xl p-6 sm:p-8 shadow-inner relative">
            
            <div className="bg-[#F5ECE0] border-2 border-slate-800 rounded-2xl p-5 flex items-center justify-around relative shadow-sm">
              
              <motion.div 
                animate={{ rotate: isPlayingMusic ? 360 : 0 }}
                transition={{ duration: 2, repeat: isPlayingMusic ? Infinity : 0, ease: "linear" }}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-dashed border-amber-600 bg-[#EFE0CD] flex items-center justify-center shadow-inner"
              >
                <div className="w-5 h-5 rounded-full bg-white border-2 border-slate-800" />
              </motion.div>

              <div className="text-center px-4 bg-white/90 border-2 border-slate-800 rounded-xl py-2 shadow-xs">
                <span className="text-[9px] font-mono font-black uppercase text-amber-800 tracking-wider">
                  SIDE A &bull; STEREO LO-FI
                </span>
                <p className="text-sm sm:text-base font-black text-slate-900 mt-0.5">
                  Rumahsakit &bull; {activeSongName}
                </p>
                <p className="text-[10px] text-slate-500 font-medium">
                  Pop Indie Klasik 1997
                </p>
              </div>

              <motion.div 
                animate={{ rotate: isPlayingMusic ? 360 : 0 }}
                transition={{ duration: 2, repeat: isPlayingMusic ? Infinity : 0, ease: "linear" }}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-dashed border-amber-600 bg-[#EFE0CD] flex items-center justify-center shadow-inner"
              >
                <div className="w-5 h-5 rounded-full bg-white border-2 border-slate-800" />
              </motion.div>
            </div>

            <div className="mt-5">
              <div className="flex justify-between items-center text-[10px] font-mono font-black text-slate-600 mb-1.5">
                <span>{formatAudioTime(audioCurrentTime)}</span>
                <span>{formatAudioTime(audioDuration)}</span>
              </div>
              <div className="w-full h-3 bg-white border-2 border-slate-800 rounded-full overflow-hidden p-0.5">
                <motion.div 
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${(audioCurrentTime / (audioDuration || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlayMusic}
                  className="px-6 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 border-2 border-slate-800 text-slate-900 font-black text-xs flex items-center gap-2 shadow-[3px_3px_0px_0px_rgba(30,41,59,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                >
                  {isPlayingMusic ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  {isPlayingMusic ? "JEDA LAGU" : "PUTAR LAGU"}
                </button>

                <button
                  onClick={handleNextTrack}
                  className="px-4 py-2.5 rounded-full bg-white hover:bg-slate-100 border-2 border-slate-800 text-slate-900 font-black text-xs shadow-[2px_2px_0px_0px_rgba(30,41,59,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                >
                  Ganti Track ⏩
                </button>
              </div>

              {/* Selector 3 Track Lagu */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black text-slate-500 mr-1">TRACK:</span>
                {(["Hilang", "Kuning", "Anomali"] as const).map((trackName) => (
                  <button
                    key={trackName}
                    onClick={() => {
                      cozySynth.playSoftPop(600);
                      setActiveSongName(trackName);
                      if (!isPlayingMusic) setIsPlayingMusic(true);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-black border-2 border-slate-800 transition-all cursor-pointer ${
                      activeSongName === trackName 
                        ? "bg-amber-300 text-slate-900 shadow-xs" 
                        : "bg-white text-slate-600 hover:bg-amber-50"
                    }`}
                  >
                    {trackName}
                  </button>
                ))}
              </div>
            </div>

          </div>

          <p className="mt-4 text-xs text-slate-500 font-medium leading-relaxed italic">
            *Pemutar ini otomatis membaca file <code>hilang.mp3</code>, <code>kuning.mp3</code>, dan <code>anomali.mp3</code> di folder <code>public/assets/</code>.
          </p>

        </div>
      </section>

      {/* 4 KARTU KISAH BERGERAK 3D DINAMIS */}
      <section id="cerita" className="py-20 px-4 sm:px-6 max-w-5xl mx-auto relative z-10">
        
        <div className="text-center mb-12">
          <span className="px-3.5 py-1 bg-amber-100 text-amber-900 text-[10px] font-black rounded-full uppercase tracking-wider border-2 border-slate-800 shadow-[2px_2px_0px_0px_rgba(30,41,59,1)]">
            Potongan Keseharian
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3">
            Hal-Hal Yang Membentuk Uswa
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-sm mx-auto font-medium">
            Bukan sekadar hobi lewat, melainkan kebiasaan kecil yang menemani perjalanan belajar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {STORY_CARDS.map((card, idx) => (
            <motion.div 
              key={card.id}
              animate={{ y: [0, idx % 2 === 0 ? -6 : -7, 0] }}
              transition={{ duration: 4.2 + idx * 0.3, repeat: Infinity, ease: "easeInOut", delay: idx * 0.2 }}
              whileHover={{ scale: 1.02, rotate: idx % 2 === 0 ? 1 : -1 }}
              className={`${card.bgColor} border-3 ${card.borderColor} rounded-[2.5rem] p-6 sm:p-8 shadow-[0_10px_0_0_#1e293b] relative flex flex-col justify-between`}
            >
              <div className={`absolute -top-3.5 ${idx % 2 === 0 ? "left-8" : "right-8"} w-18 h-5 ${card.tapeColor} border border-slate-800 ${card.tapeAngle} rounded-xs shadow-xs`} />

              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-white border-2 border-slate-800 px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(30,41,59,1)]">
                    {card.tag}
                  </span>
                  <span className="text-3xl select-none">{card.emoji}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  {card.title}
                </h3>
                <p className={`text-xs font-bold ${card.textColor} mt-1 italic`}>
                  {card.subtitle}
                </p>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mt-4 pt-3 border-t-2 border-dashed border-slate-300/80 font-medium">
                  {card.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t-2 border-slate-800/10 flex justify-between items-center text-[10px] font-black text-slate-500">
                <span>{card.metaLeft}</span>
                <span>{card.metaRight}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3D SCRAPBOOK JURNAL DENGAN TRANSISI HALUS */}
      <section id="jurnal" className="py-20 px-4 sm:px-6 max-w-4xl mx-auto relative z-10">
        <div className="bg-[#FFFDF9] border-3 border-slate-800 rounded-[2.5rem] p-6 sm:p-10 shadow-[0_12px_0_0_#1e293b] relative overflow-hidden">
          
          <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border-2 border-slate-800 px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(30,41,59,1)] flex items-center gap-1.5 w-max">
                <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                Lembar Catatan Pemikiran
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                Buku Jurnal 6 Babak
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md font-medium">
                Balik halaman untuk membaca esai reflektif Uswa tentang kota asalnya, musik, dan sastra.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black text-slate-800 bg-amber-50 border-2 border-slate-800 px-3 py-1 rounded-xl shadow-xs">
                {activeChapter.chapterNumber} &bull; HALAMAN {currentChapterIndex + 1} DARI {SCRAPBOOK_CHAPTERS.length}
              </span>
            </div>
          </div>

          <div className="bg-[#FAF6EF] border-3 border-slate-800 rounded-3xl p-6 sm:p-8 min-h-[360px] flex flex-col justify-between shadow-inner relative">
            
            <div className="absolute -top-3.5 left-10 w-24 h-6 bg-amber-300/80 border border-slate-800 rotate-2 rounded-xs shadow-xs" />

            <AnimatePresence mode="wait">
              <motion.div
                key={currentChapterIndex}
                initial={{ opacity: 0, x: 25, rotateY: 10 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                exit={{ opacity: 0, x: -25, rotateY: -10 }}
                transition={{ duration: 0.28, ease: "easeInOut" }}
                className="space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`text-[10px] font-black uppercase tracking-wider border-2 border-slate-800 px-3 py-0.5 rounded-full shadow-xs ${activeChapter.accentBadge}`}>
                      {activeChapter.badge}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                      {activeChapter.title}
                    </h3>
                    <p className="text-xs font-bold text-amber-800 italic mt-0.5">
                      {activeChapter.subtitle}
                    </p>
                  </div>
                  <span className="text-3xl select-none">{activeChapter.illustrationIcon}</span>
                </div>

                <div className="space-y-3 pt-2 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {activeChapter.body.map((paragraf, pIdx) => (
                    <p key={pIdx}>{paragraf}</p>
                  ))}
                </div>

                {activeChapter.quote && (
                  <div className="p-4 bg-white/95 border-2 border-dashed border-amber-300 rounded-2xl text-xs sm:text-sm font-serif italic text-slate-800 shadow-xs">
                    &ldquo;{activeChapter.quote}&rdquo;
                  </div>
                )}

                <div className="text-[10px] font-black text-slate-400 italic pt-1">
                  ✦ {activeChapter.reflection}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 pt-4 border-t-2 border-slate-800/15 flex justify-between items-center">
              <button
                disabled={currentChapterIndex === 0}
                onClick={() => handleTurnPage("prev")}
                className="px-4 py-2 bg-white border-2 border-slate-800 rounded-xl text-xs font-black text-slate-800 shadow-[2px_2px_0px_0px_rgba(30,41,59,1)] disabled:opacity-40 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Bab Sebelumnya
              </button>

              <button
                disabled={currentChapterIndex === SCRAPBOOK_CHAPTERS.length - 1}
                onClick={() => handleTurnPage("next")}
                className="px-4 py-2 bg-slate-900 border-2 border-slate-800 rounded-xl text-xs font-black text-white shadow-[2px_2px_0px_0px_rgba(217,119,6,1)] disabled:opacity-40 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1 cursor-pointer"
              >
                Bab Selanjutnya <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* PUISI SAPARDI DJOKO DAMONO */}
      <section className="py-20 px-4 sm:px-6 max-w-xl mx-auto relative z-10 text-center">
        <motion.div
          whileHover={{ y: -6 }}
          className="bg-white border-3 border-slate-800 rounded-[2.5rem] pt-10 pb-8 px-8 sm:px-12 shadow-[0_14px_0_0_#1e293b] relative"
        >
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-200 border-2 border-slate-800 rounded-md text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-[2px_2px_0px_0px_rgba(30,41,59,1)] z-20 whitespace-nowrap">
            Sapardi Djoko Damono
          </div>

          <blockquote className="mt-2 text-2xl sm:text-3xl md:text-4xl font-serif italic text-slate-900 leading-snug">
            &ldquo;Yang fana adalah waktu. <br />
            <span className="underline decoration-amber-400 decoration-wavy underline-offset-8">
              Kita abadi.
            </span>&rdquo;
          </blockquote>

          <p className="mt-6 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium max-w-sm mx-auto">
            Waktu mencatat detik yang hilang, tetapi kata-kata tulus, kebaikan kecil, dan rasa yang pernah kita bagi kepada sesama akan tinggal selamanya di hati orang lain.
          </p>

          <div className="mt-6 pt-4 border-t-2 border-dashed border-slate-200 flex justify-center items-center gap-2 text-[11px] font-black text-slate-500">
            <PenTool className="w-3.5 h-3.5 text-amber-600" />
            <span>Direnungkan kembali oleh Uswa Hashuna Ahmad</span>
          </div>
        </motion.div>
      </section>

      {/* PAPAN PESAN ABADI FIREBASE & LOCAL STORAGE */}
      <section id="pesan" className="py-20 px-4 sm:px-6 max-w-5xl mx-auto relative z-10">
        <div className="bg-[#FFFDF9] border-3 border-slate-800 rounded-[2.5rem] p-6 sm:p-10 shadow-[0_12px_0_0_#1e293b] relative overflow-hidden">
          
          <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border-2 border-slate-800 px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(30,41,59,1)] flex items-center gap-1.5 w-max">
                <MessageSquare className="w-3.5 h-3.5 text-amber-700" />
                Papan Catatan Pengunjung
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                Tinggalkan Jejak Ceritamu
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md font-medium">
                Tulis pesan untuk Uswa! Catatanmu tersimpan abadi di database cloud dan mengapung bersama pesan lainnya.
              </p>
            </div>

            <span className="text-xs font-mono font-black text-slate-800 bg-amber-50 border-2 border-slate-800 px-3 py-1.5 rounded-xl shadow-xs">
              {stickyNotesList.length} PESAN TERSIMPAN
            </span>
          </div>

          {/* Form Input Catatan Baru */}
          <form onSubmit={handlePostStickyMessage} className="bg-[#FAF5ED] border-3 border-slate-800 rounded-3xl p-5 sm:p-6 mb-10 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-4">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-600 block mb-1">
                  Nama atau Panggilanmu:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Teman Membaca"
                  value={inputAuthor}
                  onChange={(e) => setInputAuthor(e.target.value)}
                  className="w-full px-3.5 py-2.5 border-2 border-slate-800 rounded-xl text-xs font-bold focus:outline-amber-500 bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] font-black uppercase text-slate-600 block mb-1">
                  Pesan atau Kesan Membaca:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Kirim semangat, rekomendasi buku, atau sapaan hangat..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full px-3.5 py-2.5 border-2 border-slate-800 rounded-xl text-xs font-bold focus:outline-amber-500 bg-white"
                />
              </div>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-3 pt-2 border-t-2 border-slate-800/10">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-600 uppercase">Pilih Warna:</span>
                {(["kuning", "biru", "merah", "hijau"] as const).map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => {
                      cozySynth.playSoftPop(480);
                      setSelectedColor(col);
                    }}
                    className={`w-7 h-7 rounded-full border-2 border-slate-800 transition-all ${
                      col === "kuning"
                        ? "bg-[#FEF08A]"
                        : col === "biru"
                        ? "bg-[#BAE6FD]"
                        : col === "merah"
                        ? "bg-[#FECDD3]"
                        : "bg-[#A7F3D0]"
                    } ${selectedColor === col ? "scale-125 ring-2 ring-slate-800 shadow-xs" : ""}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                {submitSuccessNotice && (
                  <span className="text-xs font-black text-emerald-700 animate-pulse flex items-center gap-1">
                    <Check className="w-4 h-4" /> Pesan Tertempel Abadi!
                  </span>
                )}
                <button
                  type="submit"
                  disabled={isSubmittingNote}
                  className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_rgba(217,119,6,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" /> {isSubmittingNote ? "Menempelkan..." : "Tempel Pesan"}
                </button>
              </div>
            </div>
          </form>

          {/* Dinding Memo Tempel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stickyNotesList.map((note, index) => {
              const noteColorStyle =
                note.color === "kuning"
                  ? "bg-[#FEF9C3] border-amber-300 text-amber-950"
                  : note.color === "biru"
                  ? "bg-[#E0F2FE] border-sky-300 text-sky-950"
                  : note.color === "merah"
                  ? "bg-[#FFE4E6] border-rose-300 text-rose-950"
                  : "bg-[#DCFCE7] border-emerald-300 text-emerald-950";

              return (
                <motion.div
                  key={note.id}
                  animate={{ y: [0, -7, 0] }}
                  transition={{ 
                    duration: 4 + (index % 3) * 0.5, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: (index % 4) * 0.25 
                  }}
                  whileHover={{ scale: 1.05, rotate: 0 }}
                  style={{ rotate: `${note.rotation}deg` }}
                  className={`p-5 rounded-2xl border-3 border-slate-800 shadow-[4px_5px_0px_0px_rgba(30,41,59,1)] relative flex flex-col justify-between min-h-[175px] ${noteColorStyle}`}
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-4 bg-white/80 border border-slate-800 rounded-xs shadow-xs" />

                  <div>
                    <div className="flex justify-between items-center text-[10px] font-black opacity-70 mb-2">
                      <span>{note.author}</span>
                      <span>{note.timestamp}</span>
                    </div>
                    <p className="text-xs font-bold leading-relaxed">
                      &ldquo;{note.text}&rdquo;
                    </p>
                  </div>

                  <div className="mt-4 pt-2 border-t border-slate-800/10 flex justify-between items-center">
                    <button
                      onClick={() => handleLikeSticky(note.id)}
                      className="flex items-center gap-1.5 text-[11px] font-black hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                    >
                      <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                      <span>{note.likes}</span>
                    </button>

                    <button
                      onClick={() => openDeleteModal(note.id)}
                      className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-white/60 transition-colors cursor-pointer"
                      title="Hapus Catatan (Khusus Admin)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* MODAL VERIFIKASI PASSWORD HAPUS CATATAN ("Uswasz170608") */}
      <AnimatePresence>
        {deleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white border-3 border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-slate-800 text-amber-800 flex items-center justify-center mx-auto mb-3 shadow-[2px_2px_0px_0px_rgba(30,41,59,1)]">
                <Lock className="w-5 h-5" />
              </div>

              <h3 className="text-lg font-black text-slate-900 text-center">
                Verifikasi Admin
              </h3>
              <p className="text-xs text-slate-600 text-center mt-1">
                Masukkan kata sandi admin untuk menghapus pesan pengunjung ini dari papan.
              </p>

              <form onSubmit={handleConfirmDelete} className="mt-4">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Masukkan sandi admin..."
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setPasswordError(false);
                    }}
                    className={`w-full px-3.5 py-2.5 border-2 rounded-xl text-xs font-bold focus:outline-none pr-10 ${
                      passwordError 
                        ? "border-rose-500 bg-rose-50 text-rose-900" 
                        : "border-slate-800 bg-slate-50 text-slate-900 focus:bg-white"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {passwordError && (
                  <p className="text-[11px] font-black text-rose-600 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Kata sandi salah. Coba lagi!
                  </p>
                )}

                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setDeleteModalOpen(false)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 border-2 border-slate-800 rounded-xl text-xs font-black text-slate-700 transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 border-2 border-slate-800 rounded-xl text-xs font-black text-white shadow-[2px_2px_0px_0px_rgba(30,41,59,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                  >
                    Hapus Memo
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer id="footer" className="py-20 px-4 text-center relative z-10">
        <div className="max-w-md mx-auto bg-white border-3 border-slate-800 rounded-3xl p-6 sm:p-8 shadow-[0_10px_0_0_#1e293b]">
          
          <motion.div 
            whileHover={{ rotate: 15 }}
            className="w-12 h-12 rounded-2xl bg-amber-200 border-2 border-slate-800 text-slate-900 flex items-center justify-center mx-auto mb-3 text-2xl shadow-[2px_2px_0px_0px_rgba(30,41,59,1)] -rotate-3 select-none"
          >
            ✍️
          </motion.div>

          <h3 className="text-xl font-black text-slate-900">
            Terima Kasih Sudah Mampir
          </h3>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-medium">
            Uswa Hashuna Ahmad &bull; Manusia biasa yang masih berjalan, masih belajar, dan mencoba merawat kebaikan sedikit lebih banyak setiap hari.
          </p>

          <div className="mt-6 flex justify-center items-center relative">
            {cheerHearts.map((h) => (
              <motion.span
                key={h.id}
                initial={{ y: 0, opacity: 1, scale: 0.8 }}
                animate={{ y: -65, x: h.leftOffset, opacity: 0, scale: 1.6 }}
                transition={{ duration: 1.1, ease: "easeOut" }}
                className="absolute text-2xl pointer-events-none select-none z-30"
              >
                💖
              </motion.span>
            ))}

            <button
              onClick={handleSendCheerBurst}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black border-2 border-slate-800 bg-rose-100 text-rose-900 shadow-[3px_3px_0px_0px_rgba(30,41,59,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              Kirim Semangat ({totalCheers})
            </button>
          </div>

          <div className="mt-5 flex justify-center">
            <a
              href="https://www.instagram.com/hashuna_ahmad?stkn=MTltbWhtb2N2OG81eA==" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white text-xs font-black rounded-full border-2 border-slate-800 shadow-[3px_3px_0px_0px_rgba(217,119,6,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              Sapa Uswa di Instagram
            </a>
          </div>

          <div className="mt-8 pt-4 border-t-2 border-dashed border-slate-200 text-[10px] font-black text-slate-400">
            &copy; 2026 Uswa Hashuna Ahmad &bull; Dirancang dengan rasa ✦
          </div>

        </div>
      </footer>

    </main>
  );
}