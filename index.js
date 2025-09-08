// ===== grab elements =====
const sidebarBtn = document.querySelector(".sidebar");
const closeBtn = document.querySelector(".sidebar-close");
const asideContainer = document.querySelector(".aside-container");
const body = document.body;
const header = document.querySelector("header");

// ===== open / close sidebar =====
sidebarBtn.addEventListener("click", () => {
  asideContainer.classList.add("activate");
  body.classList.add("no-scroll");
});
closeBtn.addEventListener("click", () => {
  asideContainer.classList.remove("activate");
  body.classList.remove("no-scroll");
});

// ===== helper: update scroll-margin-top for all anchor targets =====
// This makes scrollIntoView respect the header height without math on every click.
function updateScrollMargin() {
  const headerHeight = header ? header.offsetHeight : 0;
  // pick the section-like elements you scroll to; adjust selector if needed
  document.querySelectorAll("section, main, footer").forEach(el => {
    el.style.scrollMarginTop = `${headerHeight}px`;
  });
}

// run on load + resize (header size may change on mobile)
window.addEventListener("load", updateScrollMargin);
window.addEventListener("resize", updateScrollMargin);

// ===== helper: safe href parser =====
function validHash(href) {
  if (!href) return null;
  if (href === "#" || href === "" ) return null;
  if (href.startsWith("#")) return href;
  // if someone put absolute urls with hashes, try to extract the hash
  try {
    const u = new URL(href, location.href);
    return u.hash || null;
  } catch (err) {
    return null;
  }
}

// ===== main listener for nav + aside links =====
document.querySelectorAll("aside a, nav a").forEach(anchor => {
  anchor.addEventListener("click", (e) => {
    const href = anchor.getAttribute("href");
    const hash = validHash(href);
    if (!hash) {
      // allow default (e.g., logo '#', external links)
      return;
    }

    e.preventDefault();

    const target = document.querySelector(hash);
    if (!target) return;

    const cameFromAside = !!anchor.closest("aside");

    if (cameFromAside) {
      // 1) close sidebar and restore scrolling
      asideContainer.classList.remove("activate");
      body.classList.remove("no-scroll");

      // 2) give browser a frame or two to update layout/overflow before scrolling
      //    requestAnimationFrame x2 is usually enough; if you still see issues you can
      //    replace the inner rAF with setTimeout(..., 50) matching your CSS transition.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });
    } else {
      // desktop: just scroll (scroll-margin-top already set by updateScrollMargin)
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// image preview
const lightbox = document.createElement("div");
lightbox.id = "lightbox";
document.body.appendChild(lightbox);

const images = document.querySelectorAll(".gallery-image");
images.forEach(image => {
  image.addEventListener("click", e => {
    // lightbox.classList.add("activate");
    const img = document.createElement("img");
    img.src = image.src;
    while (lightbox.firstChild) {
      lightbox.removeChild(lightbox.firstChild);
    }
    lightbox.appendChild(img);

    requestAnimationFrame(() => {
      lightbox.classList.add("activate");
    });

  })
})

lightbox.addEventListener("click", e => {
  if (e.target !== e.currentTarget) return;
  lightbox.classList.remove("activate");
})

document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    lightbox.classList.remove("activate");
  }
});

// email link work tweakin
const mailAnchor = document.getElementById("mail-anchor");
const email = "shivsenasunilkeshary@gmail.com";

function updateMailHref() {
  if (window.innerWidth <= 1024) {
    // Mobile & tablet → mailto
    mailAnchor.href =
      "mailto:" + email +
      "?subject=Political%20Inquiry%20/%20Local%20Issues%20/%20Request%20for%20Discussion%20/%20Feedback%20/%20Collaboration" +
      "&body=Dear%20Mr.%20Sunil%20Keshary,%0D%0A%0D%0AI%20am%20writing%20to%20you%20regarding%20political%20matters.%20This%20may%20concern%20local%20issues,%20a%20request%20for%20discussion,%20or%20a%20potential%20collaboration.%20I%20would%20also%20like%20to%20provide%20you%20with%20valuable%20suggestions%20/%20advice%20/%20grievances(if%20any).%0D%0A%0D%0ABest%20regards,%0D%0A[Your%20Name]%0D%0A[Your%20Mobile%20Number]";
    mailAnchor.removeAttribute("target");
  } else {
    // Laptop/Desktop → Gmail link
    mailAnchor.href =
      "https://mail.google.com/mail/?view=cm&fs=1&to=" + email +
      "&su=Political%20Inquiry%20/%20Local%20Issues%20/%20Request%20for%20Discussion%20/%20Feedback%20/%20Collaboration" +
      "&body=Dear%20Mr.%20Sunil%20Keshary,%0D%0A%0D%0AI%20am%20writing%20to%20you%20regarding%20political%20matters.%20This%20may%20concern%20local%20issues,%20a%20request%20for%20discussion,%20or%20a%20potential%20collaboration.%20I%20would%20also%20like%20to%20provide%20you%20with%20valuable%20suggestions%20/%20advice%20/%20grievances(if%20any).%0D%0A%0D%0ABest%20regards,%0D%0A[Your%20Name]%0D%0A[Your%20Mobile%20Number]";
    mailAnchor.setAttribute("target", "_blank");
  }
}

// Run once on load
updateMailHref();

// Update if window resizes
window.addEventListener("resize", updateMailHref);

// Copy to clipboard when clicked
mailAnchor.addEventListener("click", () => {
  navigator.clipboard.writeText(email).catch(err => {
    console.error("Clipboard copy failed:", err);
  });
});

// scroll animation
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  {
    root: null,               // viewport
    threshold: 0.1,           // 50% of element must be visible
    rootMargin: "-20% 0px -20% 0px" // tighter trigger, closer to center
  }
);

const hiddenElements = document.querySelectorAll(".hidden");
hiddenElements.forEach((el) => observer.observe(el));

// load more button
const image = document.querySelectorAll(".gallery-image");
const loadMore = document.querySelector(".load-more");
let visibleCount = 6;

for(let i = 0; i < visibleCount && i < image.length; i++) {
  image[i].style.display = "block";
}

loadMore.addEventListener("click", () => {
  const nextCount = visibleCount + 3;
  for(let i = 0; i < nextCount && i < image.length; i++) {
    image[i].style.display = "block";
  }
  visibleCount = nextCount;
  if(visibleCount >= image.length) {
    loadMore.style.display = "none";
  }
})

// translation
const languageBtn = document.querySelector(".language");
const languageOptions = document.querySelector(".language-option");
const languageLinks = document.querySelectorAll(".language-option a");

// translation dictionary
const translate = {
  en: {
    logo: "SUNIL KESHARY",
    home: "HOME",
    about: "ABOUT",
    media: "MEDIA",
    highlights: "HIGHLIGHTS",
    contact: "CONTACT",
    journey: "JOURNEY",
    "journey-text": "I was deeply inspired by the ideology of Integral Humanism, first articulated by Pandit Deendayal Upadhyaya, Dr. Shyama Prasad Mukherjee, and Atal Bihari Vajpayee ji. Motivated by this vision, I joined the Bharatiya Janata Party (BJP) in 1997, marking the beginning of my political journey. Over the years, I have served people both in India and abroad(Russia), holding various responsibilities within the party. In BJP Mira Bhayandar, I had the privilege to work actively as Secretary and later as Vice President, where I contributed towards strengthening the organization and addressing public issues. However, due to certain differences regarding the party's direction on ideology and the growing neglect of dedicated workers, I decided to resign from BJP.",
    "shiv-sena-ideology": "SHIV SENA IDEOLOGY",
    "shiv-sena-ideology-text": "On 29th August 2025, I joined Shiv Sena (Shinde group) under the guidance of Maharashtra Transport Minister, Shri Pratap Sarnaik ji. Shiv Sena is a dynamic political force, deeply rooted in the ethos and cultural pride of Maharashtra. The party was founded in 1966 by the indomitable leader Balasaheb Thackeray, who gave the powerful slogan: <b>“गर्व से कहो हम हिंदू हैं”</b>. Inspired by this vision and leadership, I am committed to working for the people with renewed energy and dedication, upholding the values of Hindutva, social justice, and regional pride. Shiv Sena was formally established on June 19, 1966 by visionary leadership of Balasaheb Thackeray. In 2022 dissatisfaction was bubbling in the hearts of Shiv Sainiks This dissatisfaction was finally broken by the then group leader of ShivSena in the Legislative Assembly In June 2022, under the leadership of Eknath Shinde, as many as 50 MLAs staged an uprising. The uprising resulted in the formation of the ShivSena-BJP coalition government and the new government was sworn in on 30 June 2022 under the leadership of Chief Minister Eknath Shinde.",
    "impressed-by-pratap-sarnaik": "IMPRESSED BY PRATAP SARNAIK",
    "impressed-by-pratap-sarnaik-text": 'Today, Shiv Sena with its Strong Alliance with BJP and NCP, it remains committed to its core principles of Marathi pride, social justice, and Hindutva ideology. With a blend of traditional values and modern aspirations, Shiv Sena continues to shape the destiny of Maharashtra, guided by the spirit of its founding fathers and the aspirations of its people. Now Together BJP, Shiv Sena, and NCP jointly run Mahayuti in Maharashtra Jai Hind Jai Maharashtra. “Hon. Mr. Pratap Sarnaik is currently serving as the Transport Minister of Maharashtra State, Guardian Minister of Dharashiv District, and MLA of the 146-Ovala Majivda Assembly Constituency.” Pratap Sarnaik is a dedicated public servant and prominent leader who has devoted over two decades to the service and progress of Maharashtra, with a special focus on Thane and Mira-Bhainder. For the past 15 years as an MLA, Sarnaik has tirelessly worked to uplift communities, enhance infrastructure, and introduce innovative solutions to create better living conditions for his constituents. Known as the "Metro Man" & "Infra Man" for his instrumental role in advancing metro projects, & massive development in Thane & Mira Bhainder. Sarnaik is a respected figure in the region, representing the spirit of progress and community welfare.',
    "shiv-sena-website": "Shiv Sena Website",
    "pratap-sarnaik-website": "Pratap Sarnaik Website",
    "maharashtra-government-website": "Maharashtra Government Website",
    "mmrda-website": "MMRDA Website",
    "media-center": "MEDIA CENTER",
    "load-more": "Load More",
    "office-address": "Shiv Sena Office Address:",
    "office-address-text": "Rashmi Mangal Nagar, Phase 3, Gaurav Sankalp, Mira Road East, Mira Bhayandar, Maharashtra 401107",
    "mobile-number": "Reach us at:",
    email: "Email us at:",
    footer: "© 2025 Sunil Keshary. All rights reserved. | Designed by: Ryan Keshary",
    "ryan-keshary": "Ryan Keshary"
  },
  hi: {
    logo: "सुनिल केशरी",
    home: "होम",
    about: "हमारे बारे में",
    media: "मीडिया",
    highlights: "हाइलाइट्स",
    contact: "संपर्क",
    journey: "यात्रा",
    "journey-text": "मैं समग्र मानवतावाद के सिद्धांतों से गहराई से प्रेरित हुआ, जिसे सबसे पहले पंडित दीनदयाल उपाध्याय, डॉ. श्यामा प्रसाद मुखर्जी और अटल बिहारी वाजपेयी जी ने व्यक्त किया। इस दृष्टि से प्रेरित होकर, मैंने 1997 में भारतीय जनता पार्टी (भाजपा) से जुड़कर अपनी राजनीतिक यात्रा की शुरुआत की। वर्षों से, मैंने भारत और विदेश (रूस) में लोगों की सेवा की, पार्टी में विभिन्न जिम्मेदारियां निभाईं। भाजपा मीरा भायंदर में, मुझे सचिव और बाद में उपाध्यक्ष के रूप में सक्रिय रूप से काम करने का अवसर मिला, जहां मैंने संगठन को मजबूत करने और जनता के मुद्दों को सुलझाने में योगदान दिया। हालांकि, पार्टी की विचारधारा और समर्पित कार्यकर्ताओं की उपेक्षा को लेकर कुछ मतभेदों के कारण, मैंने भाजपा से इस्तीफा देने का निर्णय लिया।",
    "shiv-sena-ideology": "शिव सेना विचारधारा",
    "shiv-sena-ideology-text": '29 अगस्त 2025 को, मैंने महाराष्ट्र परिवहन मंत्री, श्री प्रताप सरनाइक जी के मार्गदर्शन में शिव सेना (शिंदे समूह) में शामिल हुआ। शिव सेना महाराष्ट्र की संस्कृति और गौरव से गहराई से जुड़ा एक गतिशील राजनीतिक दल है। यह पार्टी 1966 में अदम्य नेता बालासाहेब ठाकरे द्वारा स्थापित की गई थी, जिन्होंने शक्तिशाली नारा दिया: <b>"गर्व से कहो हम हिंदू हैं"</b>। इस दृष्टि और नेतृत्व से प्रेरित होकर, मैं जनता के लिए नई ऊर्जा और समर्पण के साथ काम करने के लिए प्रतिबद्ध हूँ, हिंदुत्व, सामाजिक न्याय और क्षेत्रीय गौरव के मूल्यों को बनाए रखते हुए।',
    "impressed-by-pratap-sarnaik": "प्रताप सरनाइक से प्रभावित",
    "impressed-by-pratap-sarnaik-text": "आज, शिव सेना भाजपा और एनसीपी के साथ मजबूत गठबंधन के साथ, मराठी गौरव, सामाजिक न्याय और हिंदुत्व विचारधारा के अपने मूल सिद्धांतों के प्रति प्रतिबद्ध है। पारंपरिक मूल्यों और आधुनिक आकांक्षाओं के मिश्रण के साथ, शिव सेना महाराष्ट्र के भविष्य को आकार देती है, इसके संस्थापकों की आत्मा और जनता की आकांक्षाओं द्वारा निर्देशित। 'माननीय श्री प्रताप सरनाइक वर्तमान में महाराष्ट्र राज्य के परिवहन मंत्री, धाराशिव जिला के संरक्षक मंत्री और 146-ओवला माजीवड़ा विधानसभा क्षेत्र के विधायक के रूप में सेवा दे रहे हैं।'",
    "shiv-sena-website": "शिव सेना वेबसाइट",
    "pratap-sarnaik-website": "प्रताप सरनाइक वेबसाइट",
    "maharashtra-government-website": "महाराष्ट्र सरकार वेबसाइट",
    "mmrda-website": "MMRDA वेबसाइट",
    "media-center": "मीडिया केंद्र",
    "load-more": "और लोड करें",
    "office-address": "शिव सेना कार्यालय का पता:",
    "office-address-text": "रश्मि मंगल नगर, फेज़ 3, गौरव संकल्प, मीरा रोड ईस्ट, मीरा भायंदर, महाराष्ट्र 401107",
    "mobile-number": "संपर्क करें:",
    email: "हमें ईमेल करें:",
    footer: "© 2025 सुनिल केशरी। सर्वाधिकार सुरक्षित | डिज़ाइन किया गया: रयान केशरी",
    "ryan-keshary": "रयान केशरी",
  },
  mr: {
    logo: "सुनील केशरी",
    home: "मुख्यपृष्ठ",
    about: "आमच्याबद्दल",
    media: "मीडिया",
    highlights: "ठळक गोष्टी",
    contact: "संपर्क",
    journey: "राजकीय यात्रा",
    "journey-text": "मला समग्र मानवतावादाच्या तत्त्वांपासून प्रचंड प्रेरणा मिळाली, जे पंडित दीनदयाल उपाध्याय, डॉ. श्यामा प्रसाद मुखर्जी आणि अटल बिहारी वाजपेयी यांनी मांडले. या दृष्टिकोनाने प्रभावित होऊन, मी 1997 मध्ये भारतीय जनता पक्षात (BJP) प्रवेश केला, आणि माझी राजकीय यात्रा सुरू झाली. अनेक वर्षांपासून, मी भारत आणि परदेश (रशिया) मध्ये लोकांची सेवा केली, पक्षातील विविध जबाबदाऱ्या पार पाडल्या. BJP मीरा भायंदरमध्ये, मला सचिव आणि नंतर उपाध्यक्ष म्हणून काम करण्याचा सन्मान मिळाला, जिथे मी संस्थेला मजबूत करण्यास आणि लोकांच्या समस्यांचे निराकरण करण्यास योगदान दिले. तथापि, पक्षाच्या विचारसरणी आणि समर्पित कार्यकर्त्यांच्या दुर्लक्षामुळे काही मतभेद असल्याने, मी BJP सोडण्याचा निर्णय घेतला.",
    "shiv-sena-ideology": "शिवसेना विचारधारा",
    "shiv-sena-ideology-text": '29 ऑगस्ट 2025 रोजी, मी महाराष्ट्र परिवहन मंत्री श्री प्रताप सरनाईक यांच्या मार्गदर्शनाखाली शिवसेना (शिंदे गट) मध्ये सामील झालो. शिवसेना ही महाराष्ट्राच्या संस्कृती आणि अभिमानाशी घट्ट जोडलेली एक गतिशील राजकीय शक्ती आहे. ही पक्ष 1966 मध्ये अदम्य नेते बालासाहेब ठाकरे यांनी स्थापन केली, ज्यांनी शक्तिशाली घोषवाक्य दिले: <b>"गर्वाने सांगा आपण हिंदू आहोत"</b>. या दृष्टिकोन आणि नेतृत्वाने प्रेरित होऊन, मी लोकांसाठी नवी ऊर्जा आणि समर्पणाने काम करण्यास कटिबद्ध आहे, हिंदुत्व, सामाजिक न्याय आणि प्रादेशिक अभिमानाच्या मूल्यांना जपत.',
    "impressed-by-pratap-sarnaik": "प्रताप सरनाईक यांच्यापासून प्रभावित",
    "impressed-by-pratap-sarnaik-text": "आज, शिवसेना BJP आणि NCP सोबतच्या मजबूत अलायन्ससह, मराठी अभिमान, सामाजिक न्याय आणि हिंदुत्व विचारधारेशी प्रामाणिक आहे. पारंपरिक मूल्ये आणि आधुनिक आकांक्षा यांचा संगम करून, शिवसेना महाराष्ट्राच्या भविष्याचा आकार घेते, संस्थापकांच्या आत्म्याने आणि लोकांच्या आकांक्षांनी मार्गदर्शित. 'माननीय श्री प्रताप सरनाईक सध्या महाराष्ट्र राज्याचे परिवहन मंत्री, धाराशिव जिल्ह्याचे संरक्षक मंत्री आणि 146-ओवला माजीवडा विधानसभा क्षेत्राचे आमदार म्हणून कार्यरत आहेत.'",
    "shiv-sena-website": "शिवसेना वेबसाइट",
    "pratap-sarnaik-website": "प्रताप सरनाईक वेबसाइट",
    "maharashtra-government-website": "महाराष्ट्र सरकार वेबसाइट",
    "mmrda-website": "MMRDA वेबसाइट",
    "media-center": "मीडिया केंद्र",
    "load-more": "अजून दाखवा",
    "office-address": "शिवसेना कार्यालयाचा पत्ता:",
    "office-address-text": "रश्मी मंगल नगर, फेज 3, गौरव संकल्प, मीरा रोड ईस्ट, मीरा भायंदर, महाराष्ट्र 401107",
    "mobile-number": "संपर्क करा:",
    email: "आम्हाला ईमेल करा:",
    footer: "© 2025 सुनील केशरी. सर्व हक्क राखीव | डिझाईन: रायन केशरी",
    "ryan-keshary": "रायन केशरी",
  }
};

// toggle dropdown
languageBtn.addEventListener("click", () => {
  languageOptions.classList.toggle("active");
});

// handle language change
languageLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const lang = link.dataset.lang;
    languageOptions.classList.remove("active");
    
    document.querySelectorAll("[data-key]").forEach(el => {
      const key = el.dataset.key;
      if (translate[lang] && translate[lang][key]) {
        el.innerHTML = translate[lang][key];
      }
    });
  });
});

// language wheel
// toggle dropdown
languageBtn.addEventListener("click", () => {
  languageOptions.classList.toggle("active");
});

// Show on hover
languageBtn.addEventListener("mouseenter", () => {
  languageBtn.classList.add("expanded");
  languageOptions.classList.add("show");
});

// Hide when mouse leaves both circle and options
document.addEventListener("mousemove", (e) => {
  if (
    !languageBtn.contains(e.target) &&
    !languageOptions.contains(e.target)
  ) {
    languageBtn.classList.remove("expanded");
    languageOptions.classList.remove("show");
  }
});

// Hide after clicking a language option
document.querySelectorAll(".language-option a").forEach((link) => {
  link.addEventListener("click", () => {
    languageBtn.classList.remove("expanded");
    languageOptions.classList.remove("show");
    // You could also trigger translation logic here
    console.log("Language selected:", link.dataset.lang);
  });
});
