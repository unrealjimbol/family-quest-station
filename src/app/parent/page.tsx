"use client";

import Link from "next/link";
import { useState } from "react";
import DataBackup from "@/components/DataBackup";
import KidAvatar from "@/components/KidAvatar";
import PinGate from "@/components/PinGate";
import PointPresetEditor from "@/components/PointPresetEditor";
import RewardPresetEditor from "@/components/RewardPresetEditor";
import QuestEditor from "@/components/QuestEditor";
import KidWeekView from "@/components/WeekView";
import { getBalance } from "@/lib/points";
import { getPin, lockSession, setPin } from "@/lib/pin";
import { todayStr } from "@/lib/storage";
import { updateState, useAppState } from "@/lib/store";

const questions: { id: number; prompt: string; placeholder: string }[] = [
  {
    id: 1,
    prompt: "今天有一件还不错的小事。",
    placeholder: "一个笑声、一个拥抱、一顿好好吃的饭…",
  },
  {
    id: 2,
    prompt: "一个感觉有点重的瞬间——你是怎么处理的。",
    placeholder: "哪怕只是深呼吸了一下，也算。",
  },
  {
    id: 3,
    prompt: "孩子们做了什么让你意外的事。",
    placeholder: "一个新词、一个善意、一个问题…",
  },
  {
    id: 4,
    prompt: "给明天的自己一个小小的善意。",
    placeholder: "准备好衣服、泡好咖啡、摆好碗…",
  },
  {
    id: 5,
    prompt: "用一个词形容你现在的感受。",
    placeholder: "累了、骄傲、温柔、准备好了…",
  },
];

export default function ParentPage() {
  const state = useAppState();
  const answers = state.parent.today.answers;
  const [savedNotice, setSavedNotice] = useState(false);

  function update(id: number, value: string) {
    updateState((prev) => ({
      ...prev,
      parent: {
        today: {
          date: todayStr(),
          answers: { ...prev.parent.today.answers, [id]: value },
        },
      },
    }));
  }

  function flashSaved() {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 1500);
  }

  function handleResetToday() {
    updateState((prev) => ({
      ...prev,
      parent: { today: { date: todayStr(), answers: {} } },
    }));
  }

  const filled = Object.values(answers).filter((v) => v && v.trim().length > 0).length;

  return (
    <PinGate>
    <div className="min-h-screen w-full bg-[#f1ede4] px-6 py-6 md:px-10 md:py-10">
      <div className="mx-auto w-full max-w-3xl pb-24">
        <header className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="flex h-12 items-center rounded-full bg-white px-4 text-base font-semibold text-ink shadow-sm ring-1 ring-black/5"
          >
            ← Home
          </Link>
          <button
            type="button"
            onClick={handleResetToday}
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink-soft shadow-sm ring-1 ring-black/5"
          >
            重置今天
          </button>
        </header>

        <section className="text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-ink-soft">本周概况</p>
          <h1 className="mt-2 text-3xl font-bold leading-tight md:text-4xl">
            家庭节奏
          </h1>
          <p className="mt-3 text-base text-ink-soft md:text-lg">
            这周过得怎么样，轻轻看一眼。
          </p>
        </section>

        <div className="mt-8 space-y-5">
          <KidWeekView
            kidId="elio"
            kidName="Elio"
            kidEmoji="🦦"
            accentColor="#e07a5f"
          />
          <KidWeekView
            kidId="emilia"
            kidName="Emilia"
            kidEmoji="🦫"
            accentColor="#d68fa5"
          />
        </div>

        {/* Task Editor */}
        <section className="mt-10">
          <div className="text-center mb-5">
            <p className="text-sm uppercase tracking-[0.2em] text-ink-soft">自定义</p>
            <h2 className="mt-2 text-2xl font-bold leading-tight md:text-3xl">
              编辑任务
            </h2>
            <p className="mt-2 text-sm text-ink-soft md:text-base">
              为每个孩子添加、删除或调整每日任务。
            </p>
          </div>
          <div className="space-y-4">
            <QuestEditor kidId="elio" kidName="Elio" kidEmoji="🦦" />
            <QuestEditor kidId="emilia" kidName="Emilia" kidEmoji="🦫" />
          </div>
        </section>

        {/* Points section */}
        <section className="mt-10">
          <div className="text-center mb-5">
            <p className="text-sm uppercase tracking-[0.2em] text-ink-soft">奖励</p>
            <h2 className="mt-2 text-2xl font-bold leading-tight md:text-3xl">
              积分系统
            </h2>
            <p className="mt-2 text-sm text-ink-soft md:text-base">
              累计积分、加分项目和奖品兑换。
            </p>
          </div>

          <div className="mb-4 flex justify-center gap-6">
            <div className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 shadow-sm ring-1 ring-black/5">
              <KidAvatar emoji="🦦" className="text-2xl" />
              <div>
                <div className="text-xs text-ink-soft">Elio</div>
                <div className="text-xl font-bold text-[#e07a5f]">
                  {getBalance("elio")} <span className="text-sm font-medium text-ink-soft">分</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 shadow-sm ring-1 ring-black/5">
              <KidAvatar emoji="🦫" className="text-2xl" />
              <div>
                <div className="text-xs text-ink-soft">Emilia</div>
                <div className="text-xl font-bold text-[#d68fa5]">
                  {getBalance("emilia")} <span className="text-sm font-medium text-ink-soft">分</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <PointPresetEditor />
            <RewardPresetEditor />
          </div>
        </section>

        <section className="mt-12 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-ink-soft">家长时刻</p>
          <h2 className="mt-2 text-2xl font-bold leading-tight md:text-3xl">
            五个安静的问题
          </h2>
          <p className="mt-3 text-base text-ink-soft md:text-lg">
            慢慢呼吸。随便回答。随便跳过。这只属于你。
          </p>
          <p className="mt-2 text-sm text-ink-soft">
            已回答 {filled} / {questions.length}
          </p>
        </section>

        <ol className="mt-8 space-y-5">
          {questions.map((q, idx) => (
            <li
              key={q.id}
              className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 md:p-8"
            >
              <div className="flex items-start gap-4">
                <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#dde6d8] text-base font-bold text-[#3a6b40]">
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold md:text-xl">{q.prompt}</h2>
                  <textarea
                    value={answers[q.id] ?? ""}
                    onChange={(e) => update(q.id, e.target.value)}
                    onBlur={flashSaved}
                    placeholder={q.placeholder}
                    rows={3}
                    className="mt-3 w-full resize-none rounded-2xl bg-bg-soft p-4 text-base outline-none ring-1 ring-black/5 placeholder:text-ink-soft focus:ring-[#81b29a] md:text-lg"
                  />
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex items-center justify-between">
          <span className="text-sm text-ink-soft">
            {savedNotice ? "已保存" : "输入时自动保存"}
          </span>
          <button
            type="button"
            onClick={flashSaved}
            className="rounded-full bg-[#81b29a] px-6 py-3 font-bold text-white shadow-sm transition hover:bg-[#6f9d87]"
          >
            保存
          </button>
        </div>

        {/* PIN settings */}
        <PinSettings />

        {/* Data backup/restore */}
        <section className="mt-8">
          <DataBackup />
        </section>

        <p className="mt-10 text-center text-sm text-ink-soft">
          今天辛苦了，谢谢你。
        </p>
      </div>
    </div>
    </PinGate>
  );
}

function PinSettings() {
  const [showPinChange, setShowPinChange] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [pinSaved, setPinSaved] = useState(false);

  function handleSavePin() {
    if (newPin.length === 4 && /^\d{4}$/.test(newPin)) {
      setPin(newPin);
      setNewPin("");
      setShowPinChange(false);
      setPinSaved(true);
      setTimeout(() => setPinSaved(false), 2000);
    }
  }

  function handleLock() {
    lockSession();
    window.location.reload();
  }

  return (
    <section className="mt-12">
      <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 md:p-7">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden="true">🔒</span>
            <h3 className="text-base font-bold">PIN 密码锁</h3>
            {pinSaved ? (
              <span className="text-xs font-medium text-[#81b29a] animate-pop">已保存！</span>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPinChange(!showPinChange)}
              className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink-soft ring-1 ring-black/10 hover:bg-bg-soft"
            >
              {showPinChange ? "取消" : "修改 PIN"}
            </button>
            <button
              type="button"
              onClick={handleLock}
              className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink-soft ring-1 ring-black/10 hover:bg-bg-soft"
            >
              立即锁定
            </button>
          </div>
        </div>

        {showPinChange ? (
          <div className="mt-4 flex items-center gap-3">
            <label className="text-sm text-ink-soft">新的4位 PIN：</label>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={4}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="1234"
              className="w-24 rounded-lg bg-bg-soft px-3 py-2 text-center text-lg font-bold tracking-widest outline-none ring-1 ring-black/10 focus:ring-[#81b29a]"
            />
            <button
              type="button"
              onClick={handleSavePin}
              disabled={newPin.length !== 4}
              className="rounded-full bg-[#81b29a] px-4 py-1.5 text-xs font-bold text-white disabled:opacity-40"
            >
              保存
            </button>
          </div>
        ) : (
          <p className="mt-2 text-xs text-ink-soft">
            当前 PIN：{getPin()} · 防止小朋友好奇乱点。
          </p>
        )}
      </div>
    </section>
  );
}
