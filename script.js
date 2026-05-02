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

    // 4. Treasure Chest Easter Egg Logic
    const chests = document.querySelectorAll('.chest');
    const messageBox = document.getElementById('treasureMessage');
    const messageText = messageBox ? messageBox.querySelector('.treasure-text') : null;

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

    chests.forEach(chest => {
        chest.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            
            // If already open or revealed, do nothing
            if (this.classList.contains('open') || this.classList.contains('mimic-revealed')) return;

            if (type === 'normal') {
                this.classList.add('open');
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
                    showMessage('かたくて あかない！<br>もうすこし たたいてみよう。', this);
                } else {
                    this.classList.add('open');
                    showMessage('レアアイテム を てにいれた！<br>ラッキー！', this);
                }
            }
            else if (type === 'mimic') {
                let clicks = parseInt(this.getAttribute('data-clicks')) || 0;
                clicks++;
                this.setAttribute('data-clicks', clicks);

                if (clicks < 3) {
                    // Shake animation
                    this.classList.remove('shake');
                    void this.offsetWidth; // trigger reflow
                    this.classList.add('shake');
                    showMessage('かたくて あかない！<br>もうすこし たたいてみよう。', this);
                } else {
                    this.classList.add('mimic-revealed');
                    showMessage('なんと たからばこは ミミックだった！<br>たべられちゃう！', this);
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
