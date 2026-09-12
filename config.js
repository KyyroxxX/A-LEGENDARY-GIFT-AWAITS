/**
 * OPERATION CHIKITRISKIS — Configuration
 * Edit this file to personalize the entire experience.
 */
const CONFIG = {
    recipientName: "Mi Chikiwitina Chikitriskis",
    recipientShort: "chikiwitina chikitriskis",

    // Replace with your real Steam key before gifting
    steamCode: "XXXX-XXXX-XXXX-XXXX",

    legendaryReward: "Metaphor: ReFantazio",
    legendaryRewardSubtitle: "THE JOURNEY AWAITS",

    bannerName: "LA CRÓNICA DE LOS ELEGIDOS",
    bannerSubtitle: "Un destino extraordinario aguarda a quien tenga el valor de invocar.",

    currencyName: "Chikistrites",
    currencyAlt: "Fragmentos del Destino",

    legendaryPull: null,
    pityMax: 50,
    invocationCap: 2700,
    /** Soft currency → pull ticket (WuWa/Genshin style). */
    chikiPerInvocation: 320,

    // Off in production. Manual QA: __qa.unlockAll() / __qa.fillPulls() / __qa.setSteamCode('…') in the browser console.
    devFullGachaAccess: false,

    // Multi-banner: One Piece / Naruto / JoJo / Bleach / JJK + Metaphor late-game.
    // Dupes: 4★ C0–C6 · 5★ C0–C3 (5★ C3 > 4★ C6). Metaphor Steam tras THE 50/50.
    maxConstellation4: 6,
    maxConstellation5: 3,
    pullCostSingle: 1,
    pullCostMulti: 10,

    musicEnabled: true,
    finalMessage: "Te quiero muchísimo ❤️",
    signature: "De tu persona favorita.",
    signatureSubtitle: "Sí, la que controlaba las probabilidades desde el principio.",

    letterContent: {
        greeting: "Querida chikiwitina chikitriskis:",
        paragraphs: [
            "Después de muchas investigaciones extremadamente importantes, decisiones de alto nivel y probablemente demasiado tiempo invertido en algo completamente innecesario...",
            "He llegado a una conclusión.",
            "Merecías algo especial.",
            "Pero claro.",
            "Simplemente darte un regalo habría sido demasiado fácil.",
            "Y nosotros no hacemos las cosas fáciles.",
            "Así que he decidido convertir tu regalo en una aventura.",
            "Porque si hay algo que me gusta más que hacerte regalos...",
            "es hacerte sufrir un poquito antes de conseguirlos.",
            "Con cariño, por supuesto ❤️",
            "Existe un regalo esperando al final de todo esto. Pero antes deberás conquistarlo."
        ],
        closing: ["El destino no se entrega.", "Se conquista."]
    },

    gachaRewards: {
        common: [],
        rare: [],
        epic: [],
        legendary: {
            name: "METAPHOR: REFANTAZIO",
            desc: "Un destino reservado únicamente para una persona digna de ser llamada Chikiwitina Chikitriskis. Solo en el banner Metaphor late-game, tras derrotar THE 50/50."
        }
    },

    // Deprecated: pulls are now unique characters via GachaRoster (no fixed rarity sequence).
    pullSequence: [],

    styleRanks: {
        D: "Chiki",
        C: "Chiki Chiki",
        B: "Chikitriskis",
        A: "Chiki Master",
        S: "Supreme Chiki",
        SS: "Chosen Chiki",
        SSS: "LEGENDARY CHIKIWITINA"
    },

    achievements: [
        { id: "first_pull", title: "Primera Invocación", desc: "El comienzo de una adicción peligrosa." },
        { id: "rng_survivor", title: "RNG Survivor", desc: "Has sobrevivido a otro banner." },
        { id: "chiki_master", title: "Chiki Master", desc: "Has dominado la Caza del Destino." },
        { id: "boss_5050", title: "50/50 Destroyer", desc: "El azar ya no tiene poder sobre ti." },
        { id: "legendary", title: "The Chosen Chiki", desc: "Has obtenido una recompensa legendaria." },
        { id: "curious", title: "Curiosa profesional", desc: "Has encontrado un secreto." },
        { id: "useless_btn", title: "Persistente", desc: "Este botón no hacía nada. Ahora sí." },
        { id: "volume_touch", title: "Control de la Resonancia", desc: "Has despertado el volumen del destino." },
        { id: "first_battle", title: "El Destino Se Mueve", desc: "Has entrado por primera vez en la arena." },
        { id: "first_victory", title: "Primera Victoria", desc: "Has ganado tu primer combate." },
        { id: "triple_threat", title: "Tres Cartas, Un Destino", desc: "Has formado un equipo completo de tres personajes." },
        { id: "no_support", title: "A Pulso", desc: "Has entrado en combate sin ningún support." },
        { id: "critical_hit", title: "Golpe de Audacia", desc: "Has conseguido tu primer golpe crítico." },
        { id: "weakness_exploited", title: "Persona Usuario", desc: "Has explotado una debilidad elemental." },
        { id: "first_transform", title: "Cambio de Persona", desc: "Has presenciado una transformación en combate." },
        { id: "finisher", title: "Última Palabra", desc: "Has ejecutado un remate." },
        { id: "assault", title: "Asalto Total", desc: "Has desatado un Asalto contra el enemigo." },
        { id: "long_battle", title: "Resistencia del Destino", desc: "Has llegado a la ronda 10 de un combate." },
        { id: "last_stand", title: "Al Borde del Abismo", desc: "Has ganado con un aliado al límite de sus fuerzas." },
        { id: "multi_pull", title: "Una Mano de Diez", desc: "Has realizado una invocación múltiple." },
        { id: "dupe_hunter", title: "Constelación Ascendente", desc: "Has conseguido un duplicado." },
        { id: "five_star", title: "Señal Legendaria", desc: "Has obtenido un personaje de 5★." },
        { id: "six_star", title: "La Estrella Imposible", desc: "Has obtenido un personaje de 6★." }
    ],

    easterEggs: [
        { trigger: "star", message: "Achievement unlocked: Curiosa profesional.", achievement: "curious" },
        { trigger: "useless", message: "Este botón no hacía nada.", followUp: "Ahora sí.", achievement: "useless_btn" },
        { trigger: "rng", message: "No es RNG si el novio controla el servidor." },
        { trigger: "wallet", message: "Tu wallet ha sufrido exactamente 0 daños." }
    ]
};

// Prevent direct access to steam code in console during normal play
Object.defineProperty(CONFIG, '_steamCode', {
    value: CONFIG.steamCode,
    writable: true
});
