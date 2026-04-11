from __future__ import annotations

import json
import sys
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parents[2]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from app.analysis import service  # noqa: E402


WEB_ROOT = ROOT_DIR / "Game-Analysis-Web"
DATA_DIR = WEB_ROOT / "data"
CHAMPIONS_DIR = DATA_DIR / "champions"
ROLE_ORDER = {"TOP": 0, "JGL": 1, "MID": 2, "ADC": 3, "SUP": 4}


def _write_json(path: Path, payload: dict | list) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def _export_game_analysis() -> dict:
    filters_metadata = service.get_locked_data_filters_metadata()
    ranks_json = json.dumps(filters_metadata.get("selected_ranks", []))
    analysis_payload = service.build_game_analysis_payload(ranks_json)
    analysis_export = {
        **analysis_payload,
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
    }
    _write_json(DATA_DIR / "game-analysis.json", analysis_export)
    return analysis_payload


def _load_export_context(analysis_payload: dict) -> dict:
    selected_patch, selected_patches, available_patches, patch_dirs = service._resolve_analysis_patches(
        analysis_payload.get("selected_patches")
    )
    dictionary = service._load_dictionary()
    rune_dictionary = service._load_rune_dictionary()
    item_dictionary = service._load_item_dictionary()

    raw_info = service._concat_normalized_frames(
        patch_dirs,
        "info_basica.parquet",
        service.INFO_BASICA_COLUMNS,
        service.normalize_info_basica_df,
    )
    raw_counters, raw_synergies = service._concat_split_matchups_frames(patch_dirs)
    raw_runes = service._concat_normalized_frames(
        patch_dirs,
        "runas.parquet",
        service.RUNAS_COLUMNS,
        service.normalize_runes_df,
    )
    raw_first_buys = service._concat_normalized_frames(
        patch_dirs,
        "first_buys.parquet",
        service.FIRST_BUYS_COLUMNS,
        service.normalize_first_buys_df,
    )
    raw_core_build_paths = service._concat_normalized_frames(
        patch_dirs,
        "core_build_paths.parquet",
        service.CORE_BUILD_PATH_COLUMNS,
        service.normalize_core_build_paths_df,
    )
    raw_completed_items = service._concat_normalized_frames(
        patch_dirs,
        "completed_items.parquet",
        service.COMPLETED_ITEMS_COLUMNS,
        service.normalize_completed_items_df,
    )

    locked_filters = service._build_locked_filter_metadata_from_raw_info(
        selected_patch,
        selected_patches,
        available_patches,
        raw_info,
    )
    selected_ranks = locked_filters.get("selected_ranks", [])

    return {
        "selected_patch": selected_patch,
        "selected_patches": selected_patches,
        "available_patches": available_patches,
        "available_ranks": locked_filters.get("available_ranks", []),
        "selected_ranks": selected_ranks,
        "total_games_analyzed": locked_filters.get("total_games_analyzed", 0),
        "data_filters_locked": locked_filters.get("data_filters_locked", True),
        "dictionary": dictionary,
        "rune_dictionary": rune_dictionary,
        "item_dictionary": item_dictionary,
        "info_df": service._aggregate_info_basica(service._filter_ranks(raw_info, selected_ranks)).merge(
            dictionary,
            on="champion",
            how="left",
        ),
        "counters_df": service._aggregate_counters(service._filter_ranks(raw_counters, selected_ranks)),
        "synergies_df": service._aggregate_synergies(service._filter_ranks(raw_synergies, selected_ranks)),
        "runes_df": service._aggregate_runes(service._filter_ranks(raw_runes, selected_ranks)),
        "first_buys_df": service._aggregate_first_buys(service._filter_ranks(raw_first_buys, selected_ranks)),
        "core_build_paths_df": service._aggregate_core_build_paths(
            service._filter_ranks(raw_core_build_paths, selected_ranks)
        ),
        "completed_items_df": service._aggregate_completed_items(
            service._filter_ranks(raw_completed_items, selected_ranks)
        ),
    }


def _build_role_payload(context: dict, champion_id: int, role_key: str, champion_name: str) -> dict:
    selected_data_role = service.APP_TO_DATA_ROLE.get(role_key, "")
    champion_rows = context["info_df"].loc[
        (context["info_df"]["champion"] == champion_id)
        & (context["info_df"]["role"].isin(service.STANDARD_DATA_ROLES))
    ].copy()

    summary_row = champion_rows.loc[champion_rows["role"] == selected_data_role]
    if summary_row.empty:
        summary = {
            "games_played": 0,
            "win_rate": 0.0,
            "pick_rate": 0.0,
            "ban_rate": 0.0,
        }
    else:
        selected_summary = summary_row.iloc[0]
        champion_name = str(selected_summary["champion_name"] or champion_name)
        summary = {
            "games_played": int(selected_summary["games_played"]),
            "win_rate": round(float(selected_summary["win_rate"]), 2),
            "pick_rate": round(float(selected_summary["pick_rate_role"]), 2),
            "ban_rate": round(float(selected_summary["ban_rate"]), 2),
        }

    synergy_target_roles = [
        data_role for data_role in service.STANDARD_DATA_ROLES if data_role != selected_data_role
    ]
    counter_target_roles = service.STANDARD_DATA_ROLES.copy()

    synergies_rows = service._build_extreme_role_rows(
        context["synergies_df"],
        champion_id,
        selected_data_role,
        context["dictionary"],
        "ally_champion",
        "ally_role",
        synergy_target_roles,
    )
    counters_rows = service._build_extreme_role_rows(
        context["counters_df"],
        champion_id,
        selected_data_role,
        context["dictionary"],
        "enemy_champion",
        "enemy_role",
        counter_target_roles,
    )

    synergies_rows = sorted(
        synergies_rows,
        key=lambda row: service._role_sort_key(service.APP_TO_DATA_ROLE.get(row["role_key"], "")),
    )
    counters_rows = sorted(
        counters_rows,
        key=lambda row: service._role_sort_key(service.APP_TO_DATA_ROLE.get(row["role_key"], "")),
    )

    return {
        "champion_id": champion_id,
        "champion_name": champion_name,
        "available_patches": context["available_patches"],
        "selected_patch": context["selected_patch"],
        "selected_patches": context["selected_patches"],
        "available_ranks": context["available_ranks"],
        "selected_ranks": context["selected_ranks"],
        "selected_role": role_key,
        "summary": summary,
        "synergies": {"rows": synergies_rows},
        "counters": {"rows": counters_rows},
        "runes": service._build_runes_payload(
            context["runes_df"],
            context["rune_dictionary"],
            champion_id,
            selected_data_role,
        ),
        "items": service._build_items_payload(
            context["first_buys_df"],
            context["core_build_paths_df"],
            context["completed_items_df"],
            context["item_dictionary"],
            champion_id,
            selected_data_role,
        ),
    }


def _export_champion_pages(analysis_payload: dict) -> int:
    context = _load_export_context(analysis_payload)
    champion_roles: dict[int, list[dict]] = defaultdict(list)
    for row in analysis_payload.get("rows", []):
        champion_roles[int(row["champion_id"])].append(row)

    generated = 0

    for champion_id, rows in champion_roles.items():
        sorted_rows = sorted(
            rows,
            key=lambda row: (
                -float(row.get("pick_rate", 0.0)),
                -float(row.get("win_rate", 0.0)),
                ROLE_ORDER.get(str(row.get("role_key", "")).upper(), 99),
            ),
        )

        roles = []
        for row in sorted_rows:
            role_key = str(row.get("role_key", "")).upper()
            if role_key and role_key not in roles:
                roles.append(role_key)

        if not roles:
            continue

        champion_rows = context["info_df"].loc[
            (context["info_df"]["champion"] == champion_id)
            & (context["info_df"]["role"].isin(service.STANDARD_DATA_ROLES))
        ].copy()
        default_role = service._pick_default_role(champion_rows)
        default_role = service.DATA_TO_APP_ROLE.get(default_role, roles[0]) if default_role else roles[0]
        champion_name = str(sorted_rows[0].get("champion_name", ""))
        role_payloads = {}

        for role_key in roles:
            role_payloads[role_key] = _build_role_payload(context, champion_id, role_key, champion_name)

        champion_payload = {
            "champion_id": champion_id,
            "champion_name": champion_name,
            "default_role": default_role,
            "available_roles": roles,
            "selected_patch": context["selected_patch"],
            "selected_patches": context["selected_patches"],
            "selected_ranks": context["selected_ranks"],
            "available_patches": context["available_patches"],
            "available_ranks": context["available_ranks"],
            "total_games_analyzed": context["total_games_analyzed"],
            "data_filters_locked": context["data_filters_locked"],
            "roles": role_payloads,
            "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        }
        _write_json(CHAMPIONS_DIR / f"{champion_id}.json", champion_payload)
        generated += 1

    return generated


def main() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    CHAMPIONS_DIR.mkdir(parents=True, exist_ok=True)

    analysis_payload = _export_game_analysis()
    champion_count = _export_champion_pages(analysis_payload)
    print(
        f"Game Analysis Web exportado en {WEB_ROOT} | "
        f"filas analysis: {len(analysis_payload.get('rows', []))} | "
        f"campeones: {champion_count}"
    )


if __name__ == "__main__":
    main()
