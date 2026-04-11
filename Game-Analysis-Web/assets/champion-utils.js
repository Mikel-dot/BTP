(function () {
    const exceptions = {
        "BARDO": "Bard",
        "MAESTRO YI": "MasterYi",
        "MONKEYKING": "MonkeyKing",
        "WUKONG": "MonkeyKing",
        "NUNU": "Nunu",
        "NUNU Y WILLUMP": "Nunu",
        "NUNU & WILLUMP": "Nunu",
        "RENATA": "Renata",
        "RENATA GLASC": "Renata",
        "DR. MUNDO": "DrMundo",
        "DRMUNDO": "DrMundo",
        "K'SANTE": "KSante",
        "KSANTE": "KSante",
        "KOG'MAW": "KogMaw",
        "KOGMAW": "KogMaw",
        "REK'SAI": "RekSai",
        "REKSAI": "RekSai",
        "JARVAN IV": "JarvanIV",
        "JARVANIV": "JarvanIV",
        "BEL'VETH": "Belveth",
        "BELVETH": "Belveth",
        "CHO'GATH": "Chogath",
        "CHOGATH": "Chogath",
        "KAI'SA": "Kaisa",
        "KAISA": "Kaisa",
        "KHA'ZIX": "Khazix",
        "KHAZIX": "Khazix",
        "VEL'KOZ": "Velkoz",
        "VELKOZ": "Velkoz",
        "LEBLANC": "Leblanc",
        "AURELION SOL": "AurelionSol",
        "AURELIONSOL": "AurelionSol",
        "XIN ZHAO": "XinZhao",
        "XINZHAO": "XinZhao",
        "MASTER YI": "MasterYi",
        "TAHM KENCH": "TahmKench",
        "TWISTED FATE": "TwistedFate",
        "LEE SIN": "LeeSin",
        "MISS FORTUNE": "MissFortune"
    };

    let currentPatch = "16.7.1";

    function normalizeKey(value) {
        return String(value || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toUpperCase()
            .trim()
            .replace(/\s+/g, " ");
    }

    function formatChampionName(name) {
        if (!name || name === "---") {
            return null;
        }

        const upper = normalizeKey(name);
        if (exceptions[upper]) {
            return exceptions[upper];
        }

        const normalized = String(name)
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
        return normalized.charAt(0).toUpperCase() + normalized.slice(1).replace(/[^a-zA-Z0-9]/g, "");
    }

    function getChampionImgUrl(name) {
        const formatted = formatChampionName(name);
        return formatted
            ? `https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/champion/${formatted}.png`
            : "";
    }

    function getItemImgUrl(itemId) {
        const safeItemId = Number(itemId || 0);
        return safeItemId > 0
            ? `https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/item/${safeItemId}.png`
            : "";
    }

    function colorDelta(value) {
        if (Number(value) > 0) {
            return "positive";
        }
        if (Number(value) < 0) {
            return "negative";
        }
        return "neutral";
    }

    function formatDelta(value) {
        if (value === null || value === undefined || value === "") {
            return "-";
        }

        const number = Number(value);
        if (Number.isNaN(number)) {
            return "-";
        }

        const rounded = Math.round(number * 10) / 10;
        if (Object.is(rounded, -0) || rounded === 0) {
            return "0.0";
        }

        const text = rounded.toFixed(1);
        return rounded > 0 ? `+${text}` : text;
    }

    window.gaWebChampionUtils = {
        setPatch(patch) {
            if (patch) {
                currentPatch = patch;
            }
        },
        getChampionImgUrl,
        getItemImgUrl,
        colorDelta,
        formatDelta
    };
})();
