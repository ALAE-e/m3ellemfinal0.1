// ====== 1. CONFIGURATION FIREBASE ======
const firebaseConfig = {
    apiKey: "AIzaSyCwJFwYhHZZMxADo624Op7uu086KPvJmie4", 
    authDomain: "m3alam-76ad8.firebaseapp.com",
    databaseURL: "https://m3alam-76ad8-default-rtdb.europe-west1.firebasedatabase.app", 
    projectId: "m3alam-76ad8",
    storageBucket: "m3alam-76ad8.firebasestorage.app",
    messagingSenderId: "230932444898",        
    appId: "1:230932444898:web:a10b4685be22b08a5c50bb", 
    measurementId: "G-Y7LFKR0ND6"            
};

// تشغيل Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = app.firestore();

document.addEventListener("DOMContentLoaded", () => {

    // ====== 2. HAMBURGER MENU ======
    const hamburger = document.querySelector(".hamburger");
    const menu = document.querySelector(".menu");

    if (hamburger && menu) {
        hamburger.addEventListener("click", () => {
            menu.classList.toggle("active");
            menu.classList.toggle("show"); // درناهم بجوج باش كيفما كان ف الـ CSS يخدم
            hamburger.classList.toggle("active");
        });
    }

    // ====== 3. COMMENT ÇA MARCHE ======
    const commentLink = document.querySelector('.menu a[href*="how-it-works"]');
    const targetSection = document.getElementById('how-it-works');

    if (commentLink && targetSection) {
        commentLink.addEventListener('click', function(e) {
            e.preventDefault(); 
            document.querySelectorAll('.menu a').forEach(link => link.classList.remove('active'));
            this.classList.add('active');
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // ====== 4. LOGIN MODAL LOGIC ======
    const loginModal = document.getElementById("loginModal");
    const openLoginBtn = document.getElementById("openLogin");
    const closeLoginBtn = document.getElementById("closeLogin");

    if (openLoginBtn && loginModal) openLoginBtn.addEventListener("click", () => loginModal.style.display = "flex");
    if (closeLoginBtn && loginModal) closeLoginBtn.addEventListener("click", () => loginModal.style.display = "none");

    // ====== 5. DEMANDE MODAL LOGIC ======
    const demandeModal = document.getElementById("demandeModal");
    const closeDemandeBtn = document.getElementById("closeDemande");
    const demandeForm = document.getElementById("demandeForm");

    let selectedService = "Intervention Générale"; 
    const allDemandeButtons = document.querySelectorAll(".primary, .service-card a");

    allDemandeButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault(); 
            const card = btn.closest(".service-card");
            if (card) {
                const serviceTitle = card.querySelector("h3").innerText;
                selectedService = serviceTitle; 
            } else {
                selectedService = "Intervention Rapide (Hero)"; 
            }

            if (demandeModal) {
                demandeModal.style.display = "flex"; 
            }
        });
    });

    if (closeDemandeBtn && demandeModal) {
        closeDemandeBtn.addEventListener("click", () => {
            demandeModal.style.display = "none";
        });
    }

    window.addEventListener("click", (e) => {
        if (loginModal && e.target === loginModal) loginModal.style.display = "none";
        if (demandeModal && e.target === demandeModal) demandeModal.style.display = "none";
    });

    // ====== 6. SIFFT L-DATA L-DATABASE ======
    if (demandeForm) {
        demandeForm.addEventListener("submit", (e) => {
            e.preventDefault(); 
            
            const name = document.getElementById("userName").value;
            const phone = document.getElementById("userPhone").value;
            const location = document.getElementById("userLocation").value;

            const obj = {
                nom_complet: name,
                type_service: selectedService,
                telephone: phone,
                localisation: location, 
                coords: userCoords ? userCoords : "Non autorisée", 
                date_demande: new Date().toISOString()
            }

            database.collection('demandes').add(obj)
            .then(() => {
                alert(`Parfait ${name}! Votre demande pour (${selectedService}) a été envoyée avec succès.`);
                demandeForm.reset(); 
                demandeModal.style.display = "none"; 
            })
            .catch((error) => {
                console.error("Erreur Firebase:", error);
                alert("Une erreur est survenue, veuillez réessayer.");
            });
        });
    }
});

// ====== 7. تلوين روابط المنيو أوتوماتيكياً على حساب الصفحة الحالية ======
    const currentUrl = window.location.href;
    const menuLinks = document.querySelectorAll(".menu a");

    menuLinks.forEach(link => {
        // كنقارنو الرابط ديال كل زر مع رابط الصفحة الحالية الفوق
        if (currentUrl.includes(link.getAttribute("href"))) {
            // كنحيدو active من كاع الروابط ونعطيوها للزر د الصفحة الحالية
            menuLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
        }
    });