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

// تفعيل Firebase (مجرور بـ حماية عشان يلا كان مشعل ديجا ما يعطيش Error)
const app = firebase.apps.length === 0 ? firebase.initializeApp(firebaseConfig) : firebase.app();
const database = app.firestore();

document.addEventListener("DOMContentLoaded", () => {

    // ====== 2. HAMBURGER MENU (مزدوع هنا باش يخدم 100%) ======
    const hamburger = document.querySelector(".hamburger");
    const menu = document.querySelector(".menu");

    if (hamburger && menu) {
        hamburger.addEventListener("click", () => {
            menu.classList.toggle("active");
            menu.classList.toggle("show");
            hamburger.classList.toggle("active");
        });
    }

    // ====== 3. متغيرات الـ DOM ======
    const modal = document.getElementById("modalForm");
    const closeBtn = document.getElementById("closeFormBtn");
    const openBtns = document.querySelectorAll(".service-btn");
    const clientForm = document.getElementById("clientForm");

    let selectedService = "Service Général";
    let userCoords = null; 

    // ====== 4. دالة جلب العنوان وتحويل الإحداثيات لـ كَتْبة ======
    function fetchAddressFromCoords(lat, lon) {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.address) {
                    const city = data.address.city || data.address.town || data.address.suburb || data.address.village || "";
                    const suburb = data.address.neighbourhood || data.address.suburb || "";
                    const road = data.address.road || "";
                    
                    let fullLocation = "";
                    if (city) fullLocation += city;
                    if (suburb) fullLocation += `, ${suburb}`;
                    if (road) fullLocation += `, ${road}`;
                    
                    const locationInput = document.getElementById("clientLocation");
                    if (locationInput && fullLocation.trim() !== "") {
                        locationInput.value = fullLocation;
                    }
                }
            })
            .catch(error => {
                console.error("Erreur Geocoding API:", error);
            });
    }

    // ====== 5. الدالة الرئيسية لطلب الـ Location ======
    function handleServiceSelection() {
        const options = {
            enableHighAccuracy: true, 
            timeout: 7000,            
            maximumAge: 0             
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    userCoords = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    fetchAddressFromCoords(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.log("الـ User رفض إذن الموقع أو حدث خطأ:", error.message);
                },
                options
            );
        }
    }

    // ====== 6. التحكم ف الـ Modal والـ Click Events ======
    openBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const card = btn.closest(".service-page-card");
            if(card) {
                selectedService = card.querySelector("h3").innerText;
            }
            
            handleServiceSelection();
            if (modal) modal.style.display = "flex";
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener("click", () => { if (modal) modal.style.display = "none"; });
    }

    window.addEventListener("click", (e) => { 
        if (e.target === modal) modal.style.display = "none"; 
    });

    // ====== 7. إرسال البيانات كاملة للـ Firebase ======
    if(clientForm) {
        clientForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = document.getElementById("clientName").value;
            const phone = document.getElementById("clientPhone").value;
            const location = document.getElementById("clientLocation").value;
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
                alert(`Parfait ${name}! Votre demande pour (${selectedService}) a été reçue.`);
                clientForm.reset();
                if (modal) modal.style.display = "none";
                userCoords = null; 
            })
            .catch((error) => {
                console.error("Firebase Error:", error);
                alert("Une erreur est survenue.");
            });
        });
    }
});