const counterUp = window.counterUp.default;

const callback = entries => {
    entries.forEach(entry => {
        const el = entry.target;

        if(entry.isIntersecting && ! el.classList.contains("is-visible")) {
            counterUp(el, {
                duration: 250,
                delay: 10,
            })

            el.classList.add("is-visible");
        }
    })
}

const IO = new IntersectionObserver(callback, { threshold: 1 });

const el1 = document.querySelector(".counter1");
const el2 = document.querySelector(".counter2");

IO.observe(el1);
IO.observe(el2);