
const lenis = new Lenis()

lenis.on('scroll', (e) => {
  console.log(e)
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)


gsap.registerPlugin(Flip ,CustomEase ,ScrollToPlugin);

const items = document.querySelectorAll(".nav-item p");
const gallery = document.querySelector(".gallery");
const galleryContainer = document.querySelector(".gallery-container");
const imgpreviews = document.querySelector(".img-previews");
const dst = document.querySelectorAll(".des-titles p");

let activeLayout = "layout-1-gallery";

function switchLayout(newLayout){
    if(newLayout === activeLayout) return;

    if(activeLayout === "layout-2-gallery" && window.scrollY > 0){
        gsap.to(window, {
            scrollTo : {y:0},
            duration: 0.5,
            ease : "power3.inOut",
            onComplete : () => switchLayoutHandler(newLayout),
        });
    }else{
        switchLayoutHandler(newLayout);
    }
}

function switchLayoutHandler(newLayout){
    const state = Flip.getState(gallery.querySelectorAll(".img"));

    gallery.classList.remove(activeLayout);
    gallery.classList.add(newLayout);

    staggerValue = 0.025;

    Flip.from(state,{
        duration: 1.5,
        ease: "power4.inOut",
        stagger: staggerValue,
    });

    activeLayout = newLayout;

    if(newLayout === "layout-3-gallery"){
        gsap.to(".des-titles", {
            autoAlpha: 1,
            ease: "power3.inOut",
            duration: 1.3,
            delay:0.5
        });
        
    }

    if(newLayout === "layout-1-gallery"){
        gsap.to(".des-titles", {
            autoAlpha: 0,
            ease: "power3.inOut",
            duration: 1.3,
        });
    }

    if(newLayout === "layout-2-gallery"){
        gsap.to(imgpreviews, {
            autoAlpha: 1,
            duration: 0.3,
            delay: 0.5,
        });
        gsap.to(".des-titles", {
            autoAlpha: 0,
            ease: "power3.inOut",
            duration: 1.3,
        });
        window.addEventListener("scroll",handleScroll);
    }else{
        gsap.to(imgpreviews, {
            autoAlpha: 0,
            duration: 0.3,
        });
        window.removeEventListener("scroll",handleScroll);
        gsap.set(gallery,{clearProps : "y"});
    }

    items.forEach((item) => {
        item.classList.toggle("active", item.id === newLayout);
    });
}

items.forEach((item) => {
    console.log(item);
    item.addEventListener("click",() => {
        if(!item.id) return;

        const newLayout = item.id;
        switchLayout(newLayout);
    });
});

function handleScroll(){
    if(activeLayout !== "layout-2-gallery") return;

    const imgPreviewsHeight = imgpreviews.scrollHeight;
    const gallHeight = gallery.scrollHeight;
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    const scrollFraction = scrollY / (imgPreviewsHeight - windowHeight);
    const galleryTranslateY = -scrollFraction * (gallHeight - windowHeight) * 1.525;

    gsap.to(gallery, {
        y: galleryTranslateY,
        ease: "none",
        duration: 0.1,
    });
}

window.addEventListener("load", () => {
    if(activeLayout === "layout-2-gallery"){
        handleScroll();
    }
});

