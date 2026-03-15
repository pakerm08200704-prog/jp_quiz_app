import React, { useState, useEffect } from 'react';
import vocabularyData from "./vocabulary";

function App() {
  const [lesson, setLesson] = useState(1);
  const [quizList, setQuizList] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [options, setOptions] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [msg, setMsg] = useState("");
  const [score, setScore] = useState(0);
  const [wrongWords, setWrongWords] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [totalInSession, setTotalInSession] = useState(0);

  // --- 密碼牆邏輯 ---
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [passError, setPassError] = useState(false);

  const today = new Date();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const date = today.getDate().toString().padStart(2, '0');
  const CORRECT_PASSWORD = month + date; 

  useEffect(() => {
    const lastUnlockDate = localStorage.getItem('sora_last_unlock_date');
    if (lastUnlockDate === CORRECT_PASSWORD) {
      setIsUnlocked(true);
    } else {
      setIsUnlocked(false);
    }
  }, [CORRECT_PASSWORD]);

  const handleUnlock = () => {
    if (inputPassword === CORRECT_PASSWORD) {
      localStorage.setItem('sora_last_unlock_date', CORRECT_PASSWORD);
      setIsUnlocked(true);
      setPassError(false);
    } else {
      setPassError(true);
      setInputPassword('');
    }
  };

  // --- 測驗邏輯 ---
  const initQuiz = (L, wordsToUse = null) => {
    if (!vocabularyData || !vocabularyData[L] || !Array.isArray(vocabularyData[L])) {
      setQuizList([]);
      return;
    }
    const words = wordsToUse || [...vocabularyData[L]];
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setQuizList(shuffled);
    setTotalInSession(shuffled.length);
    setCurrentIdx(0);
    setScore(0);
    setWrongWords([]);
    setIsFinished(false);
    setShowFeedback(false);
    setMsg("");
    if (shuffled.length > 0) {
      updateOptions(shuffled[0], vocabularyData[L]);
    }
  };

  const updateOptions = (correct, allPool) => {
    if (!correct || !allPool) return;
    const wrong = allPool
      .filter(w => w[0] !== correct[0])
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);
    setOptions([correct, ...wrong].sort(() => 0.5 - Math.random()));
  };

  const handleLessonChange = (L) => {
    setLesson(L);
    initQuiz(L);
  };

  useEffect(() => {
    if (vocabularyData) initQuiz(lesson);
  }, []);

  const handleAnswer = (item) => {
    const currentWord = quizList[currentIdx];
    if (item[0] === currentWord[0]) {
      setMsg("✅ 正確！");
      setScore(prev => prev + 1);
    } else {
      setMsg("❌ 選錯了");
      if (!wrongWords.some(w => w[0] === currentWord[0])) {
        setWrongWords(prev => [...prev, currentWord]);
      }
    }
    setShowFeedback(true);
  };

  const nextStep = () => {
    if (currentIdx + 1 < quizList.length) {
      const next = currentIdx + 1;
      setCurrentIdx(next);
      updateOptions(quizList[next], vocabularyData[lesson]);
      setShowFeedback(false);
      setMsg("");
    } else {
      setIsFinished(true);
    }
  };

  // --- 修改點：移除姓名，改為中立的學習筆記聲明 ---
  const CopyrightFooter = () => (
    <footer className="mt-8 text-center text-[10px] text-slate-400 px-6 pb-6 leading-relaxed">
      <p>© 2026 SoraTalk - 日本語學習筆記</p>
      <p className="mt-1">
        本程式為個人非營利學習用途。測驗內容參考自《大家的日本語》，相關版權歸原出版社所有。若有侵權請聯繫告知，將立即處理。
      </p>
    </footer>
  );

  if (!isUnlocked) {
    return (
      <div className="max-w-[450px] mx-auto bg-slate-50 min-h-screen flex flex-col items-center justify-center p-6">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-sky-100 w-full text-center">
          <div className="w-20 h-20 bg-sky-100 rounded-3xl mx-auto mb-6 flex items-center justify-center">
            <span className="text-4xl">🉐</span>
          </div>
          <h2 className="text-2xl font-black text-sky-900 mb-2">SoraTalk 日本語</h2>
          <p className="text-slate-500 mb-6 text-sm">請輸入今日通關密碼即可開始</p>
          
          <input 
            type="text"
            inputMode="numeric"
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
            placeholder="請輸入 4 位數密碼"
            className={`w-full p-4 rounded-2xl border ${passError ? 'border-red-400' : 'border-sky-100'} bg-slate-50 mb-4 focus:outline-none focus:ring-2 focus:ring-sky-400 text-center text-lg`}
          />
          
          {passError && <p className="text-red-500 text-xs mb-4">密碼不正確，請確認當天日期（月日）</p>}

          <button 
            onClick={handleUnlock}
            className="w-full py-4 rounded-2xl bg-sky-500 text-white text-lg font-bold shadow-lg shadow-sky-100 hover:bg-sky-600 transition-all mb-4"
          >
            開啟程式
          </button>
        </div>
        <CopyrightFooter />
      </div>
    );
  }

  if (!vocabularyData) return null;

  const currentWord = quizList[currentIdx] || ["", "", ""];
  const progress = totalInSession > 0 ? ((currentIdx + (isFinished ? 1 : 0)) / totalInSession) * 100 : 0;

  const ResultView = () => {
    const accuracy = totalInSession > 0 ? Math.round((score / totalInSession) * 100) : 0;
    return (
      <div className="bg-white p-8 rounded-3xl shadow-xl text-center border border-sky-100">
        <h2 className="text-sky-900 text-xl font-bold mb-2">{isFinished ? `第 ${lesson} 課結束` : "學習結算"}</h2>
        <div className="text-7xl my-6 font-black text-sky-500 tracking-tight">{accuracy}%</div>
        <p className="text-slate-500 text-lg mb-8">答對：<span className="font-bold text-slate-800">{score}</span> / {totalInSession}</p>
        <div className="flex flex-col gap-4">
          <button onClick={() => initQuiz(lesson)} className="w-full py-4 rounded-2xl bg-sky-500 text-white text-lg font-bold shadow-lg shadow-sky-100 hover:bg-sky-600 transition-all">再測一次</button>
          {wrongWords.length > 0 && (
            <button onClick={() => initQuiz(lesson, wrongWords)} className="w-full py-4 rounded-2xl border-2 border-red-400 bg-white text-red-500 text-lg font-bold">複習錯題 ({wrongWords.length})</button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-[450px] mx-auto bg-slate-50 min-h-screen font-sans flex flex-col">
      <header className="bg-sky-600 text-white py-5 px-6 text-center shadow-md sticky top-0 z-10">
        <h1 className="text-xl font-bold tracking-wider">SoraTalk 日本語</h1>
      </header>

      <main className="p-6 flex-grow">
        <div className="flex gap-3 mb-8">
          <select value={lesson} onChange={(e) => handleLessonChange(Number(e.target.value))} className="flex-[2] p-3 rounded-xl border border-sky-100 bg-white shadow-sm focus:ring-2 focus:ring-sky-400 focus:outline-none font-medium text-slate-700">
            {Object.keys(vocabularyData).map(L => <option key={L} value={L}>第 {L} 課 ({vocabularyData[L].length} 題)</option>)}
          </select>
          {!isFinished && <button onClick={() => setIsFinished(true)} className="flex-1 rounded-xl bg-sky-100 text-sky-700 font-bold">結算</button>}
        </div>

        {isFinished ? <ResultView /> : (
          <div className="space-y-6">
            <div className="px-1">
              <div className="flex justify-between text-xs text-slate-400 mb-2 font-bold uppercase tracking-tighter">
                <span>進度</span>
                <span>{currentIdx + 1} / {totalInSession}</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div style={{ width: `${progress}%` }} className="h-full bg-sky-400 transition-all duration-500" />
              </div>
            </div>

            <div className="bg-sky-100 py-14 px-4 rounded-[2.5rem] text-center border-2 border-sky-200 shadow-sm">
              <h2 className="text-4xl text-sky-900 font-black break-all leading-tight">
                {currentWord[0]}
              </h2>
            </div>

            {!showFeedback ? (
              <div className="grid gap-4">
                {options.map((opt, i) => (
                  <button key={i} onClick={() => handleAnswer(opt)} className="w-full p-5 rounded-2xl border border-sky-50 bg-white text-lg text-slate-700 font-semibold shadow-sm hover:border-sky-200 hover:bg-sky-50 active:scale-[0.98] transition-all">
                    {opt[2]}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <p className={`text-center font-black text-2xl animate-bounce ${msg.includes('✅') ? 'text-emerald-500' : 'text-red-500'}`}>{msg}</p>
                <div onClick={nextStep} className="p-8 bg-sky-500 text-white rounded-[2rem] cursor-pointer text-center shadow-xl shadow-sky-100 transform transition active:scale-95">
                  <div className="text-3xl font-black mb-1 break-all">{currentWord[0]}</div>
                  <div className="text-lg font-medium text-sky-100">
                    {currentWord[1] && `【${currentWord[1]}】`} {currentWord[2]}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      <CopyrightFooter />
    </div>
  );
}

export default App;