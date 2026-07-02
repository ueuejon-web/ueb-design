document.addEventListener('DOMContentLoaded', () => {
    // 1. CTA Button Smooth Scroll (Fallback if CSS scroll-behavior isn't supported)
    const ctaBtn = document.querySelector('.pixel-btn');
    if (ctaBtn) {
        ctaBtn.addEventListener('click', (e) => {
            const contactArea = document.getElementById('contact');
            if (contactArea && getComputedStyle(document.documentElement).scrollBehavior !== 'smooth') {
                e.preventDefault();
                contactArea.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // 2. Panel Click Interaction
    const panels = document.querySelectorAll('.pixel-panel');
    panels.forEach(panel => {
        panel.addEventListener('click', (e) => {
            const panelImg = panel.querySelector('.panel-image');
            const panelTitle = panelImg ? panelImg.alt : 'Unknown Panel';
            console.log('Panel Clicked:', panelTitle);

            // Smooth scroll fallback for panels with anchor links
            const href = panel.getAttribute('href');
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement && getComputedStyle(document.documentElement).scrollBehavior !== 'smooth') {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // 3. Q&A Accordion Logic
    const qaQuestions = document.querySelectorAll('.qa-question');
    qaQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            
            // Toggle current item
            const isActive = item.classList.contains('active');
            
            // Optional: Close other items when opening one
            document.querySelectorAll('.qa-item').forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // 3.5. Portfolio Accordion Logic
    const portfolioHeaders = document.querySelectorAll('.portfolio-card-header');
    portfolioHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const card = header.parentElement;
            const isActive = card.classList.contains('active');
            
            // Close other portfolio cards when opening one
            document.querySelectorAll('.portfolio-card').forEach(otherCard => {
                otherCard.classList.remove('active');
            });

            if (!isActive) {
                card.classList.add('active');
            }
        });
    });

    // 4. Treasure Chest Easter Egg Logic
    const chests = document.querySelectorAll('.chest');
    const messageBox = document.getElementById('treasureMessage');
    const messageText = messageBox ? messageBox.querySelector('.treasure-text') : null;
    const sturdyLockedSfx = new Audio('仕掛け作動2.mp3');
    const mimicAlertSfx = new Audio('8bitアラート2.mp3');
    const mimicDamageSfx = new Audio('8bitダメージ2.mp3');
    const mimicRevealSfx = new Audio('8bit下降10.mp3');
    const mimicExplodeSfx = new Audio('8bit爆発2.mp3');
    const mimicDefeatSfx = new Audio('8bit下降6.mp3');
    const rareItemSfx = new Audio('8bit獲得2.mp3');
    const normalItemSfx = new Audio('8bit獲得8.mp3');

    if (messageBox) {
        messageBox.addEventListener('click', function() {
            this.style.display = 'none';
        });
    }

    function showMessage(text, chestElement) {
        if (!messageBox || !messageText) return;
        messageText.innerHTML = text;
        
        // Position message box below the clicked chest
        if (chestElement) {
            const rect = chestElement.getBoundingClientRect();
            messageBox.style.top = (rect.bottom + window.scrollY + 15) + 'px';
            messageBox.style.left = (rect.left + window.scrollX + (rect.width / 2)) + 'px';
            // Note: transform: translate(-50%, 0) is handled by CSS animation and base styles now
        }
        
        messageBox.style.display = 'inline-block';
        
        // Simple typewriter effect
        messageText.style.width = '0';
        messageText.style.overflow = 'hidden';
        messageText.style.whiteSpace = 'nowrap';
        messageText.style.animation = 'none';
        void messageText.offsetWidth; // trigger reflow
        messageText.style.animation = 'typing 1s steps(20, end) forwards';
        
        // Add typing animation to CSS dynamically if not present
        if (!document.getElementById('typing-anim')) {
            const style = document.createElement('style');
            style.id = 'typing-anim';
            style.innerHTML = `@keyframes typing { from { width: 0 } to { width: 100% } }`;
            document.head.appendChild(style);
        }
    }

    function playSturdyLockedSfx() {
        sturdyLockedSfx.currentTime = 0;
        sturdyLockedSfx.play().catch(() => {
            // Ignore autoplay-related rejections in strict browser settings.
        });
    }

    function playMimicHitSfxSequence(onDamageStart) {
        mimicAlertSfx.currentTime = 0;
        mimicDamageSfx.currentTime = 0;

        let hasTriggeredDamageStart = false;
        const triggerDamageStart = () => {
            if (hasTriggeredDamageStart) return;
            hasTriggeredDamageStart = true;
            if (typeof onDamageStart === 'function') {
                onDamageStart();
            }
        };

        mimicAlertSfx
            .play()
            .then(() => new Promise(resolve => {
                mimicAlertSfx.onended = () => {
                    mimicAlertSfx.onended = null;
                    resolve();
                };
            }))
            .then(() => {
                triggerDamageStart();
                return mimicDamageSfx.play();
            })
            .catch(() => {
                triggerDamageStart();
                // Ignore autoplay-related rejections in strict browser settings.
            });
    }

    function playMimicRevealSfx() {
        mimicRevealSfx.currentTime = 0;
        mimicRevealSfx.play().catch(() => {
            // Ignore autoplay-related rejections in strict browser settings.
        });
    }

    function playRareItemSfx() {
        rareItemSfx.currentTime = 0;
        rareItemSfx.play().catch(() => {
            // Ignore autoplay-related rejections in strict browser settings.
        });
    }

    function playNormalItemSfx() {
        normalItemSfx.currentTime = 0;
        normalItemSfx.play().catch(() => {
            // Ignore autoplay-related rejections in strict browser settings.
        });
    }

    function playMimicDefeatSfxSequence(onExplodeStart, onDefeatStart) {
        mimicAlertSfx.currentTime = 0;
        mimicExplodeSfx.currentTime = 0;
        mimicDefeatSfx.currentTime = 0;

        let hasTriggeredExplodeStart = false;
        let hasTriggeredDefeatStart = false;
        const triggerExplodeStart = () => {
            if (hasTriggeredExplodeStart) return;
            hasTriggeredExplodeStart = true;
            if (typeof onExplodeStart === 'function') {
                onExplodeStart();
            }
        };
        const triggerDefeatStart = () => {
            if (hasTriggeredDefeatStart) return;
            hasTriggeredDefeatStart = true;
            if (typeof onDefeatStart === 'function') {
                onDefeatStart();
            }
        };

        mimicAlertSfx
            .play()
            .then(() => new Promise(resolve => {
                mimicAlertSfx.onended = () => {
                    mimicAlertSfx.onended = null;
                    resolve();
                };
            }))
            .then(() => {
                triggerExplodeStart();
                return mimicExplodeSfx.play();
            })
            .then(() => new Promise(resolve => {
                mimicExplodeSfx.onended = () => {
                    mimicExplodeSfx.onended = null;
                    resolve();
                };
            }))
            .then(() => {
                triggerDefeatStart();
                return mimicDefeatSfx.play();
            })
            .catch(() => {
                triggerExplodeStart();
                triggerDefeatStart();
                // Ignore autoplay-related rejections in strict browser settings.
            });
    }

    chests.forEach(chest => {
        chest.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            
            // If already open or defeated, do nothing
            if (this.classList.contains('open') || this.classList.contains('mimic-defeated') || this.classList.contains('mimic-defeating')) return;

            if (type === 'normal') {
                this.classList.add('open');
                playNormalItemSfx();
                showMessage('100G を てにいれた！<br>やったね！', this);
            } 
            else if (type === 'sturdy') {
                let clicks = parseInt(this.getAttribute('data-clicks')) || 0;
                clicks++;
                this.setAttribute('data-clicks', clicks);

                if (clicks < 3) {
                    // Shake animation
                    this.classList.remove('shake');
                    void this.offsetWidth; // trigger reflow
                    this.classList.add('shake');
                    playSturdyLockedSfx();
                    showMessage('かたくて あかない！<br>もうすこし たたいてみよう。', this);
                } else {
                    this.classList.add('open');
                    playRareItemSfx();
                    showMessage('レアアイテム を てにいれた！<br>ラッキー！', this);
                }
            }
            else if (type === 'mimic') {
                // If already defeated, no further interaction
                if (this.classList.contains('mimic-defeated')) return;

                let clicks = parseInt(this.getAttribute('data-clicks')) || 0;
                clicks++;
                this.setAttribute('data-clicks', clicks);

                if (clicks < 3) {
                    // Shake animation
                    this.classList.remove('shake');
                    void this.offsetWidth; // trigger reflow
                    this.classList.add('shake');
                    playSturdyLockedSfx();
                    showMessage('かたくて あかない！<br>もうすこし たたいてみよう。', this);
                } else if (clicks === 3) {
                    this.classList.add('mimic-revealed');
                    playMimicRevealSfx();
                    showMessage('なんと たからばこは ミミックだった！', this);
                } else if (clicks <= 7) {
                    playMimicHitSfxSequence(() => {
                        this.classList.add('mimic-revealed');
                        this.classList.add('mimic-attacking');
                        this.classList.remove('shake');
                        void this.offsetWidth;
                        this.classList.add('shake');
                        showMessage('１０ のダメージを あたえた！', this);
                        setTimeout(() => {
                            this.classList.remove('mimic-attacking');
                        }, 500);
                    });
                } else {
                    this.classList.add('mimic-defeating');
                    playMimicDefeatSfxSequence(() => {
                        // Reuse the same hit flash/shake timing used by the 10-damage phase.
                        this.classList.add('mimic-revealed');
                        this.classList.add('mimic-attacking');
                        this.classList.remove('shake');
                        void this.offsetWidth;
                        this.classList.add('shake');
                        setTimeout(() => {
                            this.classList.remove('mimic-attacking');
                        }, 500);
                    }, () => {
                        this.classList.remove('mimic-revealed');
                        this.classList.remove('mimic-attacking');
                        this.classList.remove('mimic-defeating');
                        this.classList.add('mimic-defeated');
                        this.classList.add('open');
                        showMessage('９９９ ダメージを あたえた！<br>ミミックを やっつけた！', this);
                    });
                }
            }
        });
    });

    // 5. Back to Top Button Logic
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            // Show button after scrolling down 300px
            if (window.scrollY > 300) {
                backToTopBtn.style.display = 'block';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });

        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    console.log("上ブ.デザイン: Pure HTML/CSS Pixel UI Initialized.");
});
