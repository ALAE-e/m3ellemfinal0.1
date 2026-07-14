document.addEventListener("DOMContentLoaded", () => {
    // كيجيب الرابط د الصفحة الحالية من المتصفح
    const currentUrl = window.location.href;
    
    // كيجيب كاع الروابط اللي وسط الـ menu
    const menuLinks = document.querySelectorAll('.menu a');

    menuLinks.forEach(link => {
        // كنحيدو active من كولشي ف اللول باش نقيو الألوان
        link.classList.remove('active');

        // يلا كان الرابط فيه سميت الملف ديالنا، كنزيدو ليه active
        if (currentUrl.includes(link.getAttribute('href'))) {
            link.classList.add('active');
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const menuLinks = document.querySelectorAll('.menu a');

    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            // 1. كنحيدو الـ active من كاع الروابط باش نطفيو اللون الزرق
            menuLinks.forEach(item => item.classList.remove('active'));
            
            // 2. كنزيدو الـ active غي للرابط اللي تكليكا عليه دابا باش يزراق
            this.classList.add('active');
        });
    });

    // 💡 زيادة ناضية: يلا تفتحت الصفحة ديريكت، الكود كيزرق الرابط المناسب أوتوماتيكياً
    const currentUrl = window.location.href;
    menuLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href !== "" && currentUrl.includes(href)) {
            link.classList.add('active');
        }
    });
});
document.addEventListener("DOMContentLoaded", () => {
    // تلوين زر Devenir réparateur أوتوماتيكياً ف هاد الصفحة
    const links = document.querySelectorAll(".menu a");
    links.forEach(link => {
        // كنقلبو على الرابط اللي فيه سمية الصفحة
        if (link.getAttribute("href").includes("devenir-reparateur.html")) {
            links.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
        }
    });

    // ... هنا حط باقي الكود والـ Logic ديال هاد الصفحة بوحدها ...
});