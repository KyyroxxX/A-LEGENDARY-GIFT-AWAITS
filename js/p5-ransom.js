/**
 * P5 ransom lettering — splits big display titles into per-letter spans
 * (.ch with random box/boxw/red), hover jitter included.
 * Titles only (never body text, buttons or battle chrome).
 */
(function () {
    const SEL = ['.psel-title', '.gw-title-line', '.gw-title-gold', '.final-title', '.vn-title'];

    function clsFor(i) {
        const r = (i * 7 + 3) % 10;
        if (r < 2) return 'box';
        if (r < 4) return 'boxw';
        if (r < 5) return 'red';
        return '';
    }

    function splitEl(el) {
        if (!el || el.classList.contains('ransomed')) return;
        let walker;
        try {
            walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        } catch (_) {
            return;
        }
        const nodes = [];
        let n = 0;
        while (walker.nextNode()) nodes.push(walker.currentNode);
        nodes.forEach((node) => {
            const text = node.nodeValue;
            if (!text || !text.trim()) return;
            const frag = document.createDocumentFragment();
            [...text].forEach((ch) => {
                if (ch === ' ' || ch === '\n' || ch === '\t') {
                    frag.appendChild(document.createTextNode(ch));
                    return;
                }
                const s = document.createElement('span');
                const c = clsFor(n);
                s.className = c ? `ch ${c}` : 'ch';
                s.textContent = ch;
                frag.appendChild(s);
                n++;
            });
            node.replaceWith(frag);
        });
        if (n > 0) el.classList.add('p5-ransom', 'ransomed');
    }

    function scan() {
        SEL.forEach((sel) => {
            let list = null;
            try {
                list = document.querySelectorAll(`${sel}:not(.ransomed)`);
            } catch (_) {
                return;
            }
            list.forEach(splitEl);
        });
    }

    let queued = false;
    function queue() {
        if (queued) return;
        queued = true;
        const run = () => {
            queued = false;
            try {
                scan();
            } catch (_) { /* never break the app */ }
        };
        if (typeof requestAnimationFrame === 'function') requestAnimationFrame(run);
        else setTimeout(run, 32);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', queue);
    else queue();
    try {
        new MutationObserver(queue).observe(document.body, { childList: true, subtree: true });
    } catch (_) { /* ignore */ }
    window.__p5ransom = queue;
})();
