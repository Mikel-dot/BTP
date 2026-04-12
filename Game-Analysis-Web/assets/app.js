const LANGUAGE = document.documentElement.lang.toLowerCase().startsWith("en") ? "en" : "es";

const UI_COPY = {
    es: {
        roleLabels: {
            ALL: "Todo",
            TOP: "Top",
            JGL: "Jungla",
            MID: "Mid",
            ADC: "ADC",
            SUP: "Soporte"
        },
        shardLabels: {
            5001: "\u26e8\ufe0f Armadura",
            5002: "\ud83e\ude84 Resistencia magica",
            5003: "\u2764\ufe0f Vida",
            5005: "\u2694\ufe0f Vel. ataque",
            5007: "\ud83c\udfc3 Vel. movimiento",
            5008: "\u2728 Fuerza adaptable",
            5009: "\u23f1\ufe0f Aceleracion",
            5010: "\u2764\ufe0f Vida escalable",
            5011: "\ud83e\udea8 Tenacidad"
        },
        numberLocale: "es-ES",
        ddragonLocale: "es_ES",
        texts: {
            filterLocked: "Aun solo hemos analizado {games} partidas entre todos los parches. Para mantener datos estadisticamente relevantes, por ahora no permitimos filtrar por rangos o parches, aunque la funcion ya esta desarrollada.",
            allPatches: "Todos los parches",
            allRanks: "Todos los rangos",
            patchesCount: "{count} parches",
            ranksCount: "{count} rangos",
            gamesAnalyzed: "{games} partidas analizadas",
            noChampions: "No hay campeones para mostrar con estos filtros.",
            noData: "Sin datos suficientes.",
            cannotOpenDirectly: "Esta version web no se puede abrir con doble clic directo. Sirvela por http o subela a GitHub Pages.",
            cannotLoad: "No se pudo cargar la version web de Game Analysis.",
            patchLoadWarn: "No se pudo cargar el parche visual mas reciente.",
            analysisTitle: "Game Analysis",
            championTitle: "Champion Analysis",
            championMeta: "Parches: {patches} | Rangos: {ranks} | {games} partidas analizadas",
            explainer: "El delta de abajo mide como cambia el rendimiento de {champion} cuando juega en {role} y aparece junto o enfrente de otro campeon en un rol concreto. En Sinergias, un delta positivo significa que {champion} suele rendir mejor junto al campeon indicado. En Counters, un delta positivo significa que {champion} suele rendir mejor versus el campeon indicado.",
            gamesLabel: "Partidas",
            deltaLabel: "Delta",
            deltaOneLabel: "D1",
            shards: "Fragmentos"
        }
    },
    en: {
        roleLabels: {
            ALL: "All",
            TOP: "Top",
            JGL: "Jungle",
            MID: "Mid",
            ADC: "ADC",
            SUP: "Support"
        },
        shardLabels: {
            5001: "\u26e8\ufe0f Armor",
            5002: "\ud83e\ude84 Magic resist",
            5003: "\u2764\ufe0f Health",
            5005: "\u2694\ufe0f Attack speed",
            5007: "\ud83c\udfc3 Move speed",
            5008: "\u2728 Adaptive force",
            5009: "\u23f1\ufe0f Ability haste",
            5010: "\u2764\ufe0f Scaling health",
            5011: "\ud83e\udea8 Tenacity"
        },
        numberLocale: "en-US",
        ddragonLocale: "en_US",
        texts: {
            filterLocked: "We have only analyzed {games} matches across all patches so far. To keep the data statistically meaningful, patch and rank filters are temporarily locked even though the feature is already built.",
            allPatches: "All patches",
            allRanks: "All ranks",
            patchesCount: "{count} patches",
            ranksCount: "{count} ranks",
            gamesAnalyzed: "{games} matches analyzed",
            noChampions: "No champions match the current filters.",
            noData: "Not enough data.",
            cannotOpenDirectly: "This web version cannot be opened with a direct double click. Serve it over http or upload it to GitHub Pages.",
            cannotLoad: "Failed to load the Game Analysis web version.",
            patchLoadWarn: "Could not load the latest visual patch.",
            analysisTitle: "Game Analysis",
            championTitle: "Champion Analysis",
            championMeta: "Patches: {patches} | Ranks: {ranks} | {games} matches analyzed",
            explainer: "The delta values below measure how {champion} performs when played as {role} alongside or against another champion in a specific role. In Synergies, a positive delta means {champion} usually performs better with that champion on the same team. In Counters, a positive delta means {champion} usually performs better against that champion.",
            gamesLabel: "Games",
            deltaLabel: "Delta",
            deltaOneLabel: "D1",
            shards: "Shards"
        }
    }
};

const UI = UI_COPY[LANGUAGE];
const ROLE_LABELS = UI.roleLabels;
const ROLE_ORDER = { TOP: 0, JGL: 1, MID: 2, ADC: 3, SUP: 4 };
const SHARD_LABELS = UI.shardLabels;

const ITEM_STAT_MAP = {
    FlatHPPoolMod: ["\u2764\ufe0f", LANGUAGE === "en" ? "Health" : "Vida"],
    FlatMPPoolMod: ["\ud83d\udca7", "Mana"],
    FlatPhysicalDamageMod: ["\ud83d\udde1\ufe0f", "AD"],
    FlatMagicDamageMod: ["\u2728", "AP"],
    FlatArmorMod: ["\ud83d\udee1\ufe0f", LANGUAGE === "en" ? "Armor" : "Armadura"],
    FlatSpellBlockMod: ["\ud83e\ude84", LANGUAGE === "en" ? "Magic resist" : "Resistencia magica"],
    PercentAttackSpeedMod: ["\u2694\ufe0f", LANGUAGE === "en" ? "Attack speed" : "Vel. ataque"],
    FlatMovementSpeedMod: ["\ud83c\udfc3", LANGUAGE === "en" ? "Move speed" : "Vel. movimiento"],
    PercentMovementSpeedMod: ["\ud83c\udfc3", LANGUAGE === "en" ? "Move speed" : "Vel. movimiento"],
    FlatCritChanceMod: ["\ud83c\udfaf", LANGUAGE === "en" ? "Critical strike" : "Critico"],
    FlatAbilityHasteMod: ["\u23f1\ufe0f", LANGUAGE === "en" ? "Ability haste" : "Aceleracion"],
    FlatHPRegenMod: ["\ud83d\udc9a", LANGUAGE === "en" ? "Health regen" : "Reg. vida"],
    FlatMPRegenMod: ["\ud83d\udd37", LANGUAGE === "en" ? "Mana regen" : "Reg. mana"],
    PercentLifeStealMod: ["\ud83e\ude78", LANGUAGE === "en" ? "Life steal" : "Robo de vida"],
    PercentOmnivampMod: ["\ud83e\ude78", "Omnivamp"],
    PercentTenacityMod: ["\ud83e\udea8", LANGUAGE === "en" ? "Tenacity" : "Tenacidad"]
};

const FILTERS_LOCKED_TEXT = UI.texts.filterLocked;

const state = {
    latestPatch: "16.7.1",
    analysis: null,
    analysisRows: [],
    roleFilter: "ALL",
    sortKey: "tier",
    sortDirection: "desc",
    currentPage: 1,
    rowsPerPage: 20,
    searchQuery: "",
    championCache: new Map(),
    currentChampionFile: null,
    currentChampionRole: "",
    matchupMode: "synergies",
    runeMode: "popular",
    itemData: null,
    itemDataPatch: "",
    runeData: null,
    runeDataPatch: ""
};

function escapeHtml(value) {
    return String(value == null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function translate(template, params = {}) {
    return String(template || "").replace(/\{(\w+)\}/g, (_, key) => String(params[key] ?? ""));
}

function formatCount(value) {
    return Number(value || 0).toLocaleString(UI.numberLocale);
}

function formatPercent(value) {
    return `${Number(value || 0).toFixed(2)}%`;
}

function formatDelta(value) {
    return window.gaWebChampionUtils.formatDelta(value);
}

function getDeltaClass(value) {
    return window.gaWebChampionUtils.colorDelta(value);
}

function getRoleLabel(roleKey) {
    return ROLE_LABELS[String(roleKey || "").toUpperCase()] || String(roleKey || "");
}

function getTierOrder(tier) {
    return { "S+": 6, S: 5, A: 4, B: 3, C: 2, D: 1 }[String(tier || "D").toUpperCase()] || 0;
}

function stripHtml(value) {
    const temp = document.createElement("div");
    temp.innerHTML = String(value || "");
    return (temp.textContent || temp.innerText || "").trim();
}

function getCurrentVisualPatch() {
    return state.latestPatch;
}

function compareRows(a, b, sortKey, sortDirection) {
    const direction = sortDirection === "asc" ? 1 : -1;
    let aValue;
    let bValue;

    switch (sortKey) {
    case "champion_name":
        aValue = String(a.champion_name || "").toLowerCase();
        bValue = String(b.champion_name || "").toLowerCase();
        break;
    case "tier":
        aValue = getTierOrder(a.tier);
        bValue = getTierOrder(b.tier);
        break;
    case "role_key":
        aValue = Object.prototype.hasOwnProperty.call(ROLE_ORDER, String(a.role_key || "").toUpperCase())
            ? ROLE_ORDER[String(a.role_key || "").toUpperCase()]
            : 99;
        bValue = Object.prototype.hasOwnProperty.call(ROLE_ORDER, String(b.role_key || "").toUpperCase())
            ? ROLE_ORDER[String(b.role_key || "").toUpperCase()]
            : 99;
        break;
    case "weak_against":
        aValue = Number(a && a.weak_against && a.weak_against[0] ? a.weak_against[0].delta : 0);
        bValue = Number(b && b.weak_against && b.weak_against[0] ? b.weak_against[0].delta : 0);
        break;
    default:
        aValue = Number(a[sortKey] || 0);
        bValue = Number(b[sortKey] || 0);
        break;
    }

    if (aValue < bValue) {
        return -1 * direction;
    }
    if (aValue > bValue) {
        return 1 * direction;
    }
    return String(a.champion_name || "").localeCompare(String(b.champion_name || ""), UI.numberLocale);
}

async function initLatestPatch() {
    try {
        const response = await fetch("https://ddragon.leagueoflegends.com/api/versions.json");
        const versions = await response.json();
        if (Array.isArray(versions) && versions[0]) {
            state.latestPatch = versions[0];
        }
    } catch (error) {
        console.warn(UI.texts.patchLoadWarn, error);
    }
    window.gaWebChampionUtils.setPatch(state.latestPatch);
}

async function loadAnalysisData() {
    const response = await fetch("./data/game-analysis.json", { cache: "no-store" });
    if (!response.ok) {
        throw new Error(`No se pudo cargar game-analysis.json (${response.status})`);
    }

    state.analysis = await response.json();
    state.analysisRows = Array.isArray(state.analysis.rows) ? state.analysis.rows : [];
    renderAnalysisHeader();
    renderRoleFilters();
    renderSortButtons();
    renderAnalysisTable();
}

function renderAnalysisHeader() {
    const subtitle = document.getElementById("analysis-subtitle");
    const patchesSummary = document.getElementById("analysis-patches-summary");
    const ranksSummary = document.getElementById("analysis-ranks-summary");
    const helpText = translate(FILTERS_LOCKED_TEXT, { games: formatCount(state.analysis.total_games_analyzed) });

    subtitle.textContent = translate(UI.texts.gamesAnalyzed, { games: formatCount(state.analysis.total_games_analyzed) });
    patchesSummary.textContent = (state.analysis.selected_patches || []).length === (state.analysis.available_patches || []).length
        ? UI.texts.allPatches
        : translate(UI.texts.patchesCount, { count: (state.analysis.selected_patches || []).length });
    ranksSummary.textContent = (state.analysis.selected_ranks || []).length === (state.analysis.available_ranks || []).length
        ? UI.texts.allRanks
        : translate(UI.texts.ranksCount, { count: (state.analysis.selected_ranks || []).length });

    document.getElementById("analysis-patches-help").dataset.helpText = helpText;
    document.getElementById("analysis-ranks-help").dataset.helpText = helpText;
}

function renderRoleFilters() {
    const root = document.getElementById("role-filters");
    const roles = ["ALL", "TOP", "JGL", "MID", "ADC", "SUP"];
    root.innerHTML = roles.map((roleKey) => `
        <button type="button" class="filter-btn ${state.roleFilter === roleKey ? "active" : ""}" data-role-filter="${roleKey}">
            ${escapeHtml(getRoleLabel(roleKey))}
        </button>
    `).join("");

    root.querySelectorAll("[data-role-filter]").forEach((button) => {
        button.addEventListener("click", () => {
            state.roleFilter = button.dataset.roleFilter;
            state.currentPage = 1;
            renderRoleFilters();
            renderAnalysisTable();
        });
    });
}

function renderSortButtons() {
    document.querySelectorAll("[data-sort-key]").forEach((button) => {
        if (!button.dataset.label) {
            button.dataset.label = button.textContent.trim();
        }
        const isActive = button.dataset.sortKey === state.sortKey;
        button.textContent = isActive
            ? `${button.dataset.label} ${state.sortDirection === "desc" ? "\u2193" : "\u2191"}`
            : button.dataset.label;
        button.classList.toggle("is-active", isActive);
    });
}

function renderLoadError(message) {
    const subtitle = document.getElementById("analysis-subtitle");
    const analysisBody = document.getElementById("analysis-table-body");
    if (subtitle) {
        subtitle.textContent = message;
    }
    if (analysisBody) {
        analysisBody.innerHTML = `<tr><td colspan="7" class="empty-state">${escapeHtml(message)}</td></tr>`;
    }
}

function getFilteredRows() {
    const query = state.searchQuery.trim().toLowerCase();
    let rows = [...state.analysisRows];

    if (state.roleFilter !== "ALL") {
        rows = rows.filter((row) => row.role_key === state.roleFilter);
    }
    if (query) {
        rows = rows.filter((row) => String(row.champion_name || "").toLowerCase().includes(query));
    }

    return rows.sort((a, b) => compareRows(a, b, state.sortKey, state.sortDirection));
}

function renderAnalysisTable() {
    const body = document.getElementById("analysis-table-body");
    const indicator = document.getElementById("page-indicator");
    const rows = getFilteredRows();
    const totalPages = Math.max(1, Math.ceil(rows.length / state.rowsPerPage));
    state.currentPage = Math.min(Math.max(1, state.currentPage), totalPages);
    const startIndex = (state.currentPage - 1) * state.rowsPerPage;
    const pageRows = rows.slice(startIndex, startIndex + state.rowsPerPage);

    indicator.textContent = `${state.currentPage} / ${totalPages}`;
    document.getElementById("page-prev-10").disabled = state.currentPage <= 1;
    document.getElementById("page-prev").disabled = state.currentPage <= 1;
    document.getElementById("page-next").disabled = state.currentPage >= totalPages;
    document.getElementById("page-next-10").disabled = state.currentPage >= totalPages;

    if (!pageRows.length) {
        body.innerHTML = `<tr><td colspan="7" class="empty-state">${escapeHtml(UI.texts.noChampions)}</td></tr>`;
        return;
    }

    body.innerHTML = pageRows.map((row) => `
        <tr>
            <td>
                <div class="champion-cell" data-open-champion="${row.champion_id}" data-open-role="${escapeHtml(row.role_key)}">
                    <img src="${window.gaWebChampionUtils.getChampionImgUrl(row.champion_name)}" alt="${escapeHtml(row.champion_name)}">
                    <span class="champion-name">${escapeHtml(row.champion_name)}</span>
                </div>
            </td>
            <td>
                <span class="tier-pill tier-${String(row.tier || "D").toLowerCase().replace("+", "plus")}" title="Score ${Number(row.score || 0).toFixed(1)}">
                    ${escapeHtml(row.tier)}
                </span>
            </td>
            <td><span class="role-pill">${escapeHtml(getRoleLabel(row.role_key))}</span></td>
            <td>${formatPercent(row.win_rate)}</td>
            <td>${formatPercent(row.pick_rate)}</td>
            <td>${formatPercent(row.ban_rate)}</td>
            <td>
                <div class="weak-against-list">
                    ${(row.weak_against || []).slice(0, 3).map((enemy) => `
                        <img
                            src="${window.gaWebChampionUtils.getChampionImgUrl(enemy.name)}"
                            alt="${escapeHtml(enemy.name)}"
                            title="${escapeHtml(`${enemy.name} ${getRoleLabel(enemy.role)} | ${UI.texts.deltaLabel.toLowerCase()} ${Number(enemy.delta).toFixed(1)} | ${enemy.matches} ${UI.texts.gamesLabel.toLowerCase()}`)}"
                        >
                    `).join("") || `<span class="neutral">-</span>`}
                </div>
            </td>
        </tr>
    `).join("");

    body.querySelectorAll("[data-open-champion]").forEach((element) => {
        element.addEventListener("click", () => {
            openChampionPage(Number(element.dataset.openChampion), element.dataset.openRole);
        });
    });
}

async function loadChampionFile(championId) {
    if (state.championCache.has(championId)) {
        return state.championCache.get(championId);
    }

    const response = await fetch(`./data/champions/${championId}.json`, { cache: "no-store" });
    if (!response.ok) {
        throw new Error(`No se pudo cargar el campeon ${championId} (${response.status})`);
    }

    const payload = await response.json();
    state.championCache.set(championId, payload);
    return payload;
}

function setView(viewName) {
    document.getElementById("analysis-view").classList.toggle("hidden", viewName !== "analysis");
    document.getElementById("champion-view").classList.toggle("hidden", viewName !== "champion");
    document.getElementById("site-title").textContent = viewName === "analysis" ? UI.texts.analysisTitle : UI.texts.championTitle;
}

function updateRoute() {
    if (!state.currentChampionFile) {
        if (window.location.hash !== "#analysis") {
            window.location.hash = "#analysis";
        }
        return;
    }

    const nextHash = `#champion/${state.currentChampionFile.champion_id}/${state.currentChampionRole}`;
    if (window.location.hash !== nextHash) {
        window.location.hash = nextHash;
    }
}

function renderChampionLockedMeta(filePayload) {
    const meta = document.getElementById("champion-locked-meta");
    const patches = Array.isArray(filePayload.selected_patches) ? filePayload.selected_patches.join(", ") : "";
    const ranks = Array.isArray(filePayload.selected_ranks) ? filePayload.selected_ranks.join(", ") : "";
    meta.textContent = translate(UI.texts.championMeta, {
        patches,
        ranks,
        games: formatCount(filePayload.total_games_analyzed || 0)
    });
}

function renderChampionSummary(rolePayload) {
    document.getElementById("summary-win-rate").textContent = formatPercent(rolePayload.summary.win_rate);
    document.getElementById("summary-pick-rate").textContent = formatPercent(rolePayload.summary.pick_rate);
    document.getElementById("summary-ban-rate").textContent = formatPercent(rolePayload.summary.ban_rate);
    document.getElementById("summary-games").textContent = formatCount(rolePayload.summary.games_played);
}

function renderChampionRoles(filePayload) {
    const root = document.getElementById("champion-role-buttons");
    root.innerHTML = filePayload.available_roles.map((roleKey) => `
        <button type="button" class="role-btn ${state.currentChampionRole === roleKey ? "active" : ""}" data-role-key="${roleKey}">
            ${escapeHtml(getRoleLabel(roleKey))}
        </button>
    `).join("");

    root.querySelectorAll("[data-role-key]").forEach((button) => {
        button.addEventListener("click", () => {
            const nextRole = button.dataset.roleKey;
            if (nextRole === state.currentChampionRole) {
                return;
            }
            state.currentChampionRole = nextRole;
            renderChampionPage();
            updateRoute();
        });
    });
}

function renderChampionExplainer(filePayload, rolePayload) {
    const roleName = getRoleLabel(rolePayload.selected_role || state.currentChampionRole);
    const text = translate(UI.texts.explainer, {
        champion: filePayload.champion_name,
        role: roleName
    });
    document.getElementById("champion-explainer-text").textContent = text;
}

function renderMatchups(rolePayload) {
    const source = state.matchupMode === "synergies" ? rolePayload.synergies : rolePayload.counters;
    const container = document.getElementById("matchups-container");
    const rows = Array.isArray(source && source.rows) ? source.rows : [];

    document.getElementById("toggle-synergies").classList.toggle("active", state.matchupMode === "synergies");
    document.getElementById("toggle-counters").classList.toggle("active", state.matchupMode === "counters");

    if (!rows.length) {
        container.innerHTML = `<div class="empty-state">${escapeHtml(UI.texts.noData)}</div>`;
        return;
    }

    container.innerHTML = rows.map((row) => `
        <div class="matchup-row">
            <div class="matchup-row-label">${escapeHtml(getRoleLabel(row.role_key))} \u00b7 ${escapeHtml(UI.texts.deltaOneLabel)} \u00b7 ${escapeHtml(UI.texts.deltaLabel)} \u00b7 ${escapeHtml(UI.texts.gamesLabel)}</div>
            <div class="matchup-row-track scrollbar-skin">
                <div class="matchup-row-track-inner">
                    ${(row.entries || []).map((entry) => `
                        <div class="matchup-entry">
                            <img src="${window.gaWebChampionUtils.getChampionImgUrl(entry.name)}" alt="${escapeHtml(entry.name)}">
                            <div class="entry-name">${escapeHtml(entry.name)}</div>
                            <div class="metric-line ${getDeltaClass(entry.delta_1)}"><span class="metric-label">${escapeHtml(UI.texts.deltaOneLabel)}</span><strong>${formatDelta(entry.delta_1)}</strong></div>
                            <div class="metric-line ${getDeltaClass(entry.delta)}"><span class="metric-label">${escapeHtml(UI.texts.deltaLabel)}</span><strong>${formatDelta(entry.delta)}</strong></div>
                            <div class="metric-line neutral"><span class="metric-label">${escapeHtml(UI.texts.gamesLabel)}</span><strong>${formatCount(entry.matches)}</strong></div>
                        </div>
                    `).join("")}
                </div>
            </div>
        </div>
    `).join("");
}

function renderVerticalCombos(rootId, combos) {
    const root = document.getElementById(rootId);
    const safeCombos = Array.isArray(combos) ? combos : [];
    if (!safeCombos.length) {
        root.innerHTML = `<div class="empty-state">${escapeHtml(UI.texts.noData)}</div>`;
        return;
    }

    root.innerHTML = safeCombos.map((combo) => `
        <div class="item-card">
            <div class="item-stack">
                ${(combo.items || []).map((item) => `
                    <img class="item-icon" src="${window.gaWebChampionUtils.getItemImgUrl(item.item_id)}" alt="${escapeHtml(item.item_name)}" data-item-id="${item.item_id}">
                `).join("")}
            </div>
            <div class="metric-line ${getDeltaClass(combo.delta)}"><span class="metric-label">${escapeHtml(UI.texts.deltaLabel)}</span><strong>${formatDelta(combo.delta)}</strong></div>
            <div class="metric-line neutral"><span class="metric-label">${escapeHtml(UI.texts.gamesLabel)}</span><strong>${formatCount(combo.matches)}</strong></div>
        </div>
    `).join("");
}

function renderCoreBuildPaths(coreBuildPaths) {
    const root = document.getElementById("core-path-container");
    const safePaths = Array.isArray(coreBuildPaths && coreBuildPaths.paths) ? coreBuildPaths.paths : [];
    if (!safePaths.length) {
        root.innerHTML = `<div class="empty-state">${escapeHtml(UI.texts.noData)}</div>`;
        return;
    }

    root.innerHTML = `<div class="horizontal-scroll-inner">${safePaths.map((path) => `
        <div class="path-card">
            <div class="item-stack">
                ${(path.items || []).map((item) => `
                    <img class="item-icon" src="${window.gaWebChampionUtils.getItemImgUrl(item.item_id)}" alt="${escapeHtml(item.item_name)}" data-item-id="${item.item_id}">
                `).join("")}
            </div>
            <div class="metric-line ${getDeltaClass(path.delta)}"><span class="metric-label">${escapeHtml(UI.texts.deltaLabel)}</span><strong>${formatDelta(path.delta)}</strong></div>
            <div class="metric-line neutral"><span class="metric-label">${escapeHtml(UI.texts.gamesLabel)}</span><strong>${formatCount(path.matches)}</strong></div>
        </div>
    `).join("")}</div>`;
}

function renderCoreItems(coreItems) {
    const root = document.getElementById("core-items-container");
    const safeRows = Array.isArray(coreItems && coreItems.rows) ? coreItems.rows : [];
    if (!safeRows.length) {
        root.innerHTML = `<div class="empty-state">${escapeHtml(UI.texts.noData)}</div>`;
        return;
    }

    root.innerHTML = safeRows.map((row) => `
        <div class="core-items-row">
            <div class="core-items-order">Item ${Number(row.order || 0)}</div>
            <div class="horizontal-scroll-row scrollbar-skin">
                <div class="horizontal-scroll-inner">
                    ${(row.items || []).map((item) => `
                        <div class="core-item-card">
                            <img class="item-icon" src="${window.gaWebChampionUtils.getItemImgUrl(item.item_id)}" alt="${escapeHtml(item.item_name)}" data-item-id="${item.item_id}">
                            <div class="entry-name">${escapeHtml(item.item_name)}</div>
                            <div class="metric-line ${getDeltaClass(item.delta)}"><span class="metric-label">${escapeHtml(UI.texts.deltaLabel)}</span><strong>${formatDelta(item.delta)}</strong></div>
                            <div class="metric-line neutral"><span class="metric-label">${escapeHtml(UI.texts.gamesLabel)}</span><strong>${formatCount(item.matches)}</strong></div>
                        </div>
                    `).join("")}
                </div>
            </div>
        </div>
    `).join("");
}

async function ensureRuneData() {
    const patch = getCurrentVisualPatch();
    if (state.runeData && state.runeDataPatch === patch) {
        return state.runeData;
    }

    const response = await fetch(`https://ddragon.leagueoflegends.com/cdn/${patch}/data/${UI.ddragonLocale}/runesReforged.json`);
    if (!response.ok) {
        throw new Error(`No se pudo cargar runesReforged.json (${response.status})`);
    }

    const payload = await response.json();
    const runeMap = new Map();
    const styleMap = new Map();
    payload.forEach((style) => {
        styleMap.set(Number(style.id), style);
        (style.slots || []).forEach((slot) => {
            (slot.runes || []).forEach((rune) => {
                runeMap.set(Number(rune.id), rune);
            });
        });
    });

    state.runeData = { styles: styleMap, runes: runeMap };
    state.runeDataPatch = patch;
    return state.runeData;
}

async function ensureItemData() {
    const patch = getCurrentVisualPatch();
    if (state.itemData && state.itemDataPatch === patch) {
        return state.itemData;
    }

    const response = await fetch(`https://ddragon.leagueoflegends.com/cdn/${patch}/data/${UI.ddragonLocale}/item.json`);
    if (!response.ok) {
        throw new Error(`No se pudo cargar item.json (${response.status})`);
    }

    const payload = await response.json();
    const itemMap = new Map();
    Object.entries(payload.data || {}).forEach(([itemId, itemData]) => {
        itemMap.set(Number(itemId), itemData);
    });

    state.itemData = itemMap;
    state.itemDataPatch = patch;
    return state.itemData;
}

function buildRuneChip(rune, fallbackId) {
    if (!rune) {
        return `<div class="rune-chip"><div class="rune-name">${escapeHtml(String(fallbackId || ""))}</div></div>`;
    }

    return `
        <div class="rune-chip">
            <img class="rune-icon" src="https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}" alt="${escapeHtml(rune.name)}">
            <div class="rune-name">${escapeHtml(rune.name)}</div>
        </div>
    `;
}

async function renderRunes(rolePayload) {
    const root = document.getElementById("runes-container");
    const runePayload = rolePayload.runes;
    document.getElementById("toggle-runes-popular").classList.toggle("active", state.runeMode === "popular");
    document.getElementById("toggle-runes-delta").classList.toggle("active", state.runeMode === "highest_delta");

    if (!(runePayload && runePayload.has_data)) {
        root.innerHTML = `<div class="empty-state">${escapeHtml(UI.texts.noData)}</div>`;
        return;
    }

    const runeData = await ensureRuneData();
    const selected = state.runeMode === "popular" ? runePayload.popular : runePayload.highest_delta;
    if (!selected) {
        root.innerHTML = `<div class="empty-state">${escapeHtml(UI.texts.noData)}</div>`;
        return;
    }

    const primaryStyle = runeData.styles.get(Number(selected.primary_style));
    const secondaryStyle = runeData.styles.get(Number(selected.sub_style));
    root.innerHTML = `
        <div class="metric-line ${getDeltaClass(selected.delta)}"><span class="metric-label">${escapeHtml(UI.texts.deltaLabel)}</span><strong>${formatDelta(selected.delta)}</strong></div>
        <div class="metric-line neutral"><span class="metric-label">${escapeHtml(UI.texts.gamesLabel)}</span><strong>${formatCount(selected.matches)}</strong></div>
        <div class="rune-block">
            <div class="rune-section">
                <div class="rune-section-title">${escapeHtml(primaryStyle && primaryStyle.name ? primaryStyle.name : (LANGUAGE === "en" ? "Primary" : "Principal"))}</div>
                <div class="rune-row">
                    ${(selected.primary_runes || []).map((runeId) => buildRuneChip(runeData.runes.get(Number(runeId)), runeId)).join("")}
                </div>
            </div>
            <div class="rune-section">
                <div class="rune-section-title">${escapeHtml(secondaryStyle && secondaryStyle.name ? secondaryStyle.name : (LANGUAGE === "en" ? "Secondary" : "Secundaria"))}</div>
                <div class="rune-row">
                    ${(selected.secondary_runes || []).map((runeId) => buildRuneChip(runeData.runes.get(Number(runeId)), runeId)).join("")}
                </div>
            </div>
        </div>
        <div class="rune-section">
            <div class="rune-section-title">${escapeHtml(UI.texts.shards)}</div>
            <div class="shards-row">
                ${(selected.stat_shards || []).map((shardId) => `<div class="shard-pill">${escapeHtml(SHARD_LABELS[Number(shardId)] || `Shard ${shardId}`)}</div>`).join("")}
            </div>
        </div>
    `;
}

function formatItemStatValue(statKey, value) {
    if (statKey.startsWith("Percent")) {
        const percentValue = Math.abs(Number(value || 0)) <= 1.5 ? Number(value || 0) * 100 : Number(value || 0);
        return `${Number(percentValue).toFixed(percentValue % 1 === 0 ? 0 : 1)}%`;
    }
    return Number(value || 0).toFixed(Number(value || 0) % 1 === 0 ? 0 : 1);
}

function buildStatChips(itemData) {
    return Object.entries((itemData && itemData.stats) || {})
        .filter(([statKey, value]) => ITEM_STAT_MAP[statKey] && Number(value || 0) !== 0)
        .map(([statKey, value]) => {
            const [icon, label] = ITEM_STAT_MAP[statKey];
            return `${icon} +${formatItemStatValue(statKey, value)} ${label}`;
        });
}

function extractDescriptionLines(description) {
    const normalized = String(description || "")
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/li>/gi, "\n")
        .replace(/<li>/gi, "- ")
        .replace(/<\/p>/gi, "\n")
        .replace(/<attention>/gi, "")
        .replace(/<\/attention>/gi, "")
        .replace(/<active>/gi, "")
        .replace(/<\/active>/gi, "")
        .replace(/<passive>/gi, "")
        .replace(/<\/passive>/gi, "")
        .replace(/<maintext>/gi, "")
        .replace(/<\/maintext>/gi, "")
        .replace(/<rarityMythic>/gi, "")
        .replace(/<\/rarityMythic>/gi, "")
        .replace(/<rarityLegendary>/gi, "")
        .replace(/<\/rarityLegendary>/gi, "")
        .replace(/<ornnBonus>/gi, "")
        .replace(/<\/ornnBonus>/gi, "");

    return stripHtml(normalized)
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
}

function cleanItemDescription(itemData) {
    const rawDescription = String((itemData && itemData.description) || "");
    const chipLines = buildStatChips(itemData);
    const hasFlatStatChips = chipLines.length > 0;

    return extractDescriptionLines(rawDescription).filter((line) => {
        const lower = line.toLowerCase();
        if (!hasFlatStatChips) {
            return true;
        }

        const looksDuplicatedStat =
            /vida|health/.test(lower) ||
            /mana/.test(lower) ||
            /armadura|armor/.test(lower) ||
            /resistencia m|magic resist/.test(lower) ||
            /velocidad de ataque|attack speed/.test(lower) ||
            /velocidad de movimiento|movement speed|move speed/.test(lower) ||
            /crit|critical strike/.test(lower) ||
            /aceleraci|ability haste/.test(lower) ||
            /robo de vida|life steal/.test(lower) ||
            /omnivamp/.test(lower) ||
            /tenacidad|tenacity/.test(lower) ||
            /reg\. vida|health regen/.test(lower) ||
            /reg\. mana|mana regen/.test(lower) ||
            /\bad\b/.test(lower) ||
            /\bap\b/.test(lower);

        return !looksDuplicatedStat;
    });
}

function positionTooltip(event) {
    const tooltip = document.getElementById("item-tooltip");
    const offset = 18;
    const rect = tooltip.getBoundingClientRect();
    let left = event.clientX + offset;
    let top = event.clientY + offset;

    if (left + rect.width > window.innerWidth - 12) {
        left = event.clientX - rect.width - offset;
    }
    if (top + rect.height > window.innerHeight - 12) {
        top = window.innerHeight - rect.height - 12;
    }
    if (left < 12) {
        left = 12;
    }
    if (top < 12) {
        top = 12;
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
}

async function showItemTooltip(event) {
    const itemId = Number(event && event.currentTarget && event.currentTarget.dataset ? event.currentTarget.dataset.itemId || 0 : 0);
    if (!itemId) {
        return;
    }

    const itemMap = await ensureItemData();
    const itemData = itemMap.get(itemId);
    if (!itemData) {
        return;
    }

    const tooltip = document.getElementById("item-tooltip");
    const chips = buildStatChips(itemData);
    const descriptionLines = cleanItemDescription(itemData);
    const plainText = stripHtml(itemData.plaintext || "");
    tooltip.innerHTML = `
        <div class="item-tooltip-head">
            <div class="item-tooltip-title">${escapeHtml(itemData.name || `Item ${itemId}`)}</div>
            <div class="item-tooltip-gold">${formatCount(itemData.gold && itemData.gold.total ? itemData.gold.total : 0)} ${LANGUAGE === "en" ? "gold" : "oro"}</div>
        </div>
        ${chips.length ? `<div class="item-tooltip-stats">${chips.map((chip) => `<span class="stat-chip">${escapeHtml(chip)}</span>`).join("")}</div>` : ""}
        ${plainText ? `<div class="item-tooltip-text item-tooltip-plain">${escapeHtml(plainText)}</div>` : ""}
        ${descriptionLines.length ? `<div class="item-tooltip-text">${descriptionLines.map((line) => `<div>${escapeHtml(line)}</div>`).join("")}</div>` : ""}
    `;
    tooltip.classList.remove("hidden");
    positionTooltip(event);
}

function hideItemTooltip() {
    const tooltip = document.getElementById("item-tooltip");
    tooltip.classList.add("hidden");
    tooltip.innerHTML = "";
}

function bindItemTooltips() {
    document.querySelectorAll("[data-item-id]").forEach((element) => {
        element.addEventListener("mouseenter", showItemTooltip);
        element.addEventListener("mousemove", positionTooltip);
        element.addEventListener("mouseleave", hideItemTooltip);
    });
}

async function renderChampionPage() {
    const filePayload = state.currentChampionFile;
    if (!filePayload) {
        backToAnalysis({ updateHash: true });
        return;
    }

    const rolePayload = filePayload.roles && state.currentChampionRole ? filePayload.roles[state.currentChampionRole] : null;
    if (!rolePayload) {
        state.currentChampionRole = filePayload.default_role;
        return renderChampionPage();
    }

    document.getElementById("champion-hero-image").src = window.gaWebChampionUtils.getChampionImgUrl(filePayload.champion_name);
    document.getElementById("champion-hero-image").alt = filePayload.champion_name;
    document.getElementById("champion-hero-name").textContent = filePayload.champion_name;

    renderChampionLockedMeta(filePayload);
    renderChampionSummary(rolePayload);
    renderChampionRoles(filePayload);
    renderChampionExplainer(filePayload, rolePayload);
    renderMatchups(rolePayload);
    renderVerticalCombos("first-buy-container", rolePayload.items && rolePayload.items.first_buy ? rolePayload.items.first_buy.combos : []);
    renderVerticalCombos("first-recall-container", rolePayload.items && rolePayload.items.first_recall_buy ? rolePayload.items.first_recall_buy.combos : []);
    renderCoreBuildPaths(rolePayload.items ? rolePayload.items.core_build_paths : null);
    renderCoreItems(rolePayload.items ? rolePayload.items.core_items : null);
    await renderRunes(rolePayload);
    bindItemTooltips();
    setView("champion");
}

async function openChampionPage(championId, requestedRole, options = {}) {
    const { updateHash = true } = options;
    const filePayload = await loadChampionFile(championId);
    state.currentChampionFile = filePayload;
    state.currentChampionRole = filePayload.roles && requestedRole && filePayload.roles[requestedRole]
        ? requestedRole
        : filePayload.default_role;
    await renderChampionPage();
    if (updateHash) {
        updateRoute();
    }
}

function backToAnalysis(options = {}) {
    const { updateHash = true } = options;
    state.currentChampionFile = null;
    state.currentChampionRole = "";
    hideItemTooltip();
    setView("analysis");
    if (updateHash) {
        updateRoute();
    }
}

async function handleRoute() {
    const hash = window.location.hash || "#analysis";
    if (!hash || hash === "#analysis") {
        backToAnalysis({ updateHash: false });
        return;
    }

    const championMatch = hash.match(/^#champion\/(\d+)(?:\/([A-Z]+))?$/i);
    if (!championMatch) {
        backToAnalysis({ updateHash: false });
        return;
    }

    const championId = Number(championMatch[1]);
    const roleKey = String(championMatch[2] || "").toUpperCase();
    await openChampionPage(championId, roleKey, { updateHash: false });
}

function bindStaticEvents() {
    document.getElementById("analysis-search-input").addEventListener("input", (event) => {
        state.searchQuery = event.target.value || "";
        state.currentPage = 1;
        renderAnalysisTable();
    });

    document.getElementById("page-prev-10").addEventListener("click", () => {
        state.currentPage = Math.max(1, state.currentPage - 10);
        renderAnalysisTable();
    });
    document.getElementById("page-prev").addEventListener("click", () => {
        state.currentPage = Math.max(1, state.currentPage - 1);
        renderAnalysisTable();
    });
    document.getElementById("page-next").addEventListener("click", () => {
        state.currentPage += 1;
        renderAnalysisTable();
    });
    document.getElementById("page-next-10").addEventListener("click", () => {
        state.currentPage += 10;
        renderAnalysisTable();
    });

    document.querySelectorAll("[data-sort-key]").forEach((button) => {
        button.addEventListener("click", () => {
            const sortKey = button.dataset.sortKey;
            if (state.sortKey === sortKey) {
                state.sortDirection = state.sortDirection === "desc" ? "asc" : "desc";
            } else {
                state.sortKey = sortKey;
                state.sortDirection = "desc";
            }
            state.currentPage = 1;
            renderSortButtons();
            renderAnalysisTable();
        });
    });

    document.getElementById("champion-back").addEventListener("click", () => {
        backToAnalysis();
    });

    document.getElementById("toggle-synergies").addEventListener("click", () => {
        if (state.matchupMode !== "synergies") {
            state.matchupMode = "synergies";
            if (state.currentChampionFile) {
                renderMatchups(state.currentChampionFile.roles[state.currentChampionRole]);
            }
        }
    });

    document.getElementById("toggle-counters").addEventListener("click", () => {
        if (state.matchupMode !== "counters") {
            state.matchupMode = "counters";
            if (state.currentChampionFile) {
                renderMatchups(state.currentChampionFile.roles[state.currentChampionRole]);
            }
        }
    });

    document.getElementById("toggle-runes-popular").addEventListener("click", async () => {
        if (state.runeMode !== "popular" && state.currentChampionFile) {
            state.runeMode = "popular";
            await renderRunes(state.currentChampionFile.roles[state.currentChampionRole]);
        }
    });

    document.getElementById("toggle-runes-delta").addEventListener("click", async () => {
        if (state.runeMode !== "highest_delta" && state.currentChampionFile) {
            state.runeMode = "highest_delta";
            await renderRunes(state.currentChampionFile.roles[state.currentChampionRole]);
        }
    });

    window.addEventListener("hashchange", () => {
        handleRoute().catch((error) => {
            console.error(error);
        });
    });
}

async function init() {
    if (window.location.protocol === "file:") {
        renderLoadError(UI.texts.cannotOpenDirectly);
        return;
    }

    bindStaticEvents();
    await initLatestPatch();
    await loadAnalysisData();
    await handleRoute();
}

document.addEventListener("DOMContentLoaded", () => {
    init().catch((error) => {
        console.error(error);
        renderLoadError(UI.texts.cannotLoad);
    });
});
