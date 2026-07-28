# SSOT-OPS-SESSION-001 · Session Asset & Knowledge Inheritance Governance

---

## Metadata

- **File Name:** `SSOT-OPS-SESSION-001_Session_Asset_and_Knowledge_Inheritance.md`
- **Category:** Operations / Constitution
- **Importance:** Level 4
- **Status:** Approved
- **Governance State:** Approved — LOCK 후보 (2026-07-28, 오너 결정)
- **Effective From:** 2026-07-28 (현재 세션부터 즉시 적용)
- **Origin Candidate:** `CAND-OPS-007_Session_Asset_Governance.md`
- **Project:** DreamTown · Project Phoenix
- **Governance:** `GOV-001_Governance_Lifecycle.md` — RFC 없이 오너 직접 승격 (반복 문제 실증 확인)
- **Related:** `CAND-KW-001_K-Wisdom_Governance.md`, `CAND-OPS-001_Knowledge_Operating_System.md`

---

## Core Definition

**Project Phoenix의 모든 의미 있는 세션은 종료 시 핵심 결정, 생성 자산, 커밋, 미완료 항목과 다음 시작점을 기록한다. 다음 세션은 이 기록을 먼저 읽고 이어서 시작하며, 이미 결정된 내용을 처음부터 다시 논의하지 않는다.**

---

## Purpose

대화가 종료될 때마다 맥락이 끊기고, 다음 세션에서 기존 결정을 다시 설명하거나 동일한 설계를 반복하는 문제를 방지한다.

Session Asset은 단순한 회의록이 아니다.

```
Candidate는 무엇을 정의했는가를 남긴다.
Commit은 무엇이 변경되었는가를 남긴다.
Session Asset은 왜 결정했고 어디서 이어가야 하는가를 남긴다.
```

세 자산이 연결되어야 지식이 후대와 다음 운영자에게 대물림된다.

---

## Mandatory Rule

다음 조건 중 하나라도 충족되면 세션 종료 전에 Session Asset을 생성한다.

- Candidate가 생성·수정·승격된 경우
- SSOT 또는 Constitution에 영향을 주는 결정이 나온 경우
- 구현 방향이나 아키텍처가 결정된 경우
- 기존 원칙의 중요한 수정이 발생한 경우
- Git Commit이 생성된 경우
- 다음 세션에서 이어야 할 미완료 작업이 있는 경우
- 반복해서 설명하면 안 되는 핵심 맥락이 형성된 경우

일반 대화, 단순 질의, 기존 내용의 반복에는 생성하지 않는다.

---

## Required Contents

모든 Session Asset에는 최소한 다음 항목을 기록한다.

```markdown
# Session Asset — {날짜}_{주제}

## Date
세션 날짜

## Theme
세션을 관통하는 한 줄 주제

## Starting Context
세션 시작 시 이미 완료되어 있던 상태

## Key Decisions
이번 세션에서 확정된 결정

## Created or Updated Assets
생성·수정된 Candidate, SSOT, 코드, 문서

## Commits
관련 Git Commit 해시와 의미

## Key Learning
이번 세션에서 새롭게 확인한 원칙이나 교훈

## Unfinished Items
아직 결정·구현되지 않은 항목

## Next Starting Point
다음 세션에서 가장 먼저 시작할 지점

## Inheritance Statement
다음 세션은 본 기록을 기준으로 이어서 진행하며,
확정된 결정을 특별한 근거 없이 다시 초기화하지 않는다.
```

---

## Inheritance Protocol

새로운 세션을 시작할 때는 다음 순서를 따른다.

```
1. 가장 최근 Session Asset 확인
2. 관련 Candidate와 SSOT 상태 확인
3. 최근 Commit 확인
4. 미완료 항목과 Next Starting Point 확인
5. 이어서 작업 시작
```

다음 세션에서 이미 승인된 결정을 다시 변경하려면 반드시 변경 이유와 새로운 근거를 기록한다.

다음 이유만으로는 기존 결정을 초기화할 수 없다.

- 기억이 나지 않는다
- 새로운 세션이다
- 다른 AI나 운영자가 참여했다

---

## Non-Duplication Rule

Session Asset은 기존 문서 내용을 통째로 복사하지 않는다. 대신 링크와 식별자를 사용한다.

```
Candidate: CAND-KW-001
SSOT: SSOT-OPS-SESSION-001
Commit: af52c08
Related Session: 2026-07-28_Knowledge_to_Wisdom
```

세션 문서는 **정본을 대체하지 않고 정본이 만들어진 맥락을 연결**한다.

---

## Repository Structure

```
docs/YAKB/
├── 99_SSOT/
│   └── SSOT-OPS-SESSION-001_Session_Asset_and_Knowledge_Inheritance.md  ← 이 문서
│
├── 02_SEEDS/Candidates/
│   └── CAND-OPS-007_Session_Asset_Governance.md  (승격 이력)
│
└── Sessions/
    ├── INDEX.md
    └── 2026/
        └── 2026-07-28_Knowledge_to_Wisdom.md  (첫 번째 공식 Session Asset)
```

---

## LOCKED Principle

> **Project Phoenix는 세션이 끝날 때 지식을 닫지 않는다. 다음 세션이 이어받을 수 있는 시작점을 남긴다.**

> **새로운 세션은 새로운 시작이 아니라, 이전 세션에서 이어지는 다음 구간이다.**

---

## "이번 세션을 자산화해" 명령 정의

이 명령은 다음을 의미한다.

```
1. Candidate 생성 (Level 4 감지 시)
2. 기존 SSOT 영향 분석
3. Session Asset 작성 (docs/YAKB/Sessions/2026/날짜_주제.md)
4. Sessions/INDEX.md 갱신
5. Git Commit
6. 다음 시작점 명시
7. Knowledge Capture Report 출력
```

---

## Effective Point

이 원칙은 이 문서가 생성된 세션(2026-07-28)부터 즉시 적용된다.

첫 번째 공식 Session Asset: `docs/YAKB/Sessions/2026/2026-07-28_Knowledge_to_Wisdom.md`
