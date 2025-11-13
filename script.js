document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('.carousel');

    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const prevBtn = carousel.querySelector('.prev');
        const nextBtn = carousel.querySelector('.next');
        const items = Array.from(carousel.querySelectorAll('.carousel-item'));
        const totalItems = items.length;

        let currentIndex = 0;
        let autoPlayInterval = null;
        let isAutoPlaying = true;
        const autoPlayDelay = 3000; // 3 segundos entre slides
        let isTransitioning = false;

        // Função para calcular o tamanho do item
        const getItemWidth = () => {
            const itemStyle = window.getComputedStyle(items[0]);
            const itemWidth = items[0].offsetWidth;
            const itemMarginRight = parseFloat(itemStyle.marginRight);
            return itemWidth + itemMarginRight;
        };

        // Função para atualizar a posição do carrossel
        const updateCarousel = (smooth = true) => {
            const itemWidth = getItemWidth();
            const offset = -currentIndex * itemWidth;

            if (smooth) {
                track.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            } else {
                track.style.transition = 'none';
            }

            track.style.transform = `translateX(${offset}px)`;
        };

        // Função para ir para o próximo slide
        const slideNext = () => {
            if (isTransitioning) return;
            isTransitioning = true;

            currentIndex++;
            updateCarousel(true);

            // Se chegou ao final (itens duplicados), volta ao início sem animação
            setTimeout(() => {
                if (currentIndex >= totalItems) {
                    currentIndex = 0;
                    updateCarousel(false);
                }
                isTransitioning = false;
            }, 600);
        };

        // Função para ir para o slide anterior
        const slidePrev = () => {
            if (isTransitioning) return;
            isTransitioning = true;

            currentIndex--;

            // Se voltou antes do início, vai para o final
            if (currentIndex < 0) {
                currentIndex = totalItems - 1;
                updateCarousel(false);
                setTimeout(() => {
                    isTransitioning = false;
                }, 50);
            } else {
                updateCarousel(true);
                setTimeout(() => {
                    isTransitioning = false;
                }, 600);
            }
        };

        // Função para iniciar o autoplay
        const startAutoPlay = () => {
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
            }
            autoPlayInterval = setInterval(() => {
                slideNext();
            }, autoPlayDelay);
        };

        // Função para parar o autoplay
        const stopAutoPlay = () => {
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
                autoPlayInterval = null;
            }
        };

        // Event listeners para os botões
        nextBtn.addEventListener('click', () => {
            slideNext();
            stopAutoPlay();
            startAutoPlay();
        });

        prevBtn.addEventListener('click', () => {
            slidePrev();
            stopAutoPlay();
            startAutoPlay();
        });

        // Pausar autoplay ao passar o mouse sobre o carrossel
        carousel.addEventListener('mouseenter', () => {
            stopAutoPlay();
        });

        // Retomar autoplay ao sair do carrossel
        carousel.addEventListener('mouseleave', () => {
            if (isAutoPlaying) {
                startAutoPlay();
            }
        });

        // Atualizar em redimensionamento
        window.addEventListener('resize', () => {
            updateCarousel(false);
        });

        // Primeira inicialização
        updateCarousel(false);

        // Iniciar autoplay
        startAutoPlay();
    });
});