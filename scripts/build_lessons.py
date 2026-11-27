#!/usr/bin/env python3
"""Build and validate structured SysProgs lesson content using only the Python standard library."""
from __future__ import annotations
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "content" / "lessons"
EXAMPLES = ROOT / "content" / "examples"
OUTPUT = ROOT / "web" / "data" / "lessons.json"
REQUIRED = {"id", "title", "course_id", "module_id", "order", "difficulty", "estimated_minutes", "learning_objectives", "blocks"}
BLOCK_TYPES = {"prose", "heading", "callout", "image", "video", "code", "resource", "quiz", "lab"}

def validate(lesson: dict, path: Path) -> list[str]:
    errors = []
    missing = REQUIRED - lesson.keys()
    if missing:
        errors.append(f"{path}: missing required fields: {', '.join(sorted(missing))}")
    if lesson.get("difficulty") not in {"beginner", "intermediate", "advanced", "expert"}:
        errors.append(f"{path}: invalid difficulty")
    if not isinstance(lesson.get("order"), int) or lesson.get("order", 0) < 1:
        errors.append(f"{path}: order must be a positive integer")
    if not isinstance(lesson.get("estimated_minutes"), int) or lesson.get("estimated_minutes", 0) < 1:
        errors.append(f"{path}: estimated_minutes must be a positive integer")
    if not isinstance(lesson.get("learning_objectives"), list) or not lesson.get("learning_objectives"):
        errors.append(f"{path}: provide at least one learning objective")
    blocks = lesson.get("blocks", [])
    if not isinstance(blocks, list) or not blocks:
        errors.append(f"{path}: provide at least one content block")
    else:
        for index, block in enumerate(blocks, 1):
            if not isinstance(block, dict) or block.get("type") not in BLOCK_TYPES:
                errors.append(f"{path}: block {index} has an unknown type")
                continue
            kind = block["type"]
            for field in {
                "prose": ("markdown",), "heading": ("level", "text"),
                "callout": ("tone", "title", "markdown"), "image": ("src", "alt", "caption"),
                "video": ("provider", "video_id", "title", "creator", "fallback_url"),
                "code": ("language", "source"), "resource": ("title", "publisher", "url", "purpose"),
                "quiz": ("question", "options", "correct_option", "explanation"),
                "lab": ("title", "objective", "instructions", "completion_criteria")
            }[kind]:
                if field not in block:
                    errors.append(f"{path}: block {index} ({kind}) missing {field}")
            if kind == "quiz":
                options = block.get("options", [])
                answer = block.get("correct_option", -1)
                if not isinstance(options, list) or len(options) < 2 or not isinstance(answer, int) or answer < 0 or answer >= len(options):
                    errors.append(f"{path}: block {index} has invalid quiz options/answer")
            if kind == "heading" and block.get("level") not in (2, 3, 4):
                errors.append(f"{path}: block {index} heading level must be 2, 3 or 4")
    return errors

def main() -> int:
    files = sorted(SOURCE.rglob("*.lesson.json")) if SOURCE.exists() else []
    files += sorted(EXAMPLES.glob("*.lesson.json")) if EXAMPLES.exists() else []
    lessons, errors, seen = [], [], set()
    for path in files:
        try:
            lesson = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as exc:
            errors.append(f"{path}: {exc}")
            continue
        errors.extend(validate(lesson, path))
        lesson_id = lesson.get("id")
        if lesson_id in seen:
            errors.append(f"{path}: duplicate lesson id {lesson_id}")
        seen.add(lesson_id)
        lessons.append(lesson)
    if errors:
        print("\n".join(errors), file=sys.stderr)
        return 1
    lessons.sort(key=lambda item: (item.get("course_id", ""), item.get("module_id", ""), item.get("order", 0)))
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps({"schema_version": "1.0", "lessons": lessons}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Built {len(lessons)} structured lesson(s) -> {OUTPUT.relative_to(ROOT)}")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
