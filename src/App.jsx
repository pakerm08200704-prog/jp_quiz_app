import React, { useState, useEffect } from 'react';

// 1-6 課單字庫 (已完整保留)
const vocabularyData = {
  1: [["わたし","我"],["あなた","你"],["あのひと","那個人"],["あのかた","那個人(禮貌)"],["さん","...先生/小姐"],["ちゃん","...小孩/親稱"],["じん","...國人"],["せんせい","老師"],["きょうし","教員"],["がくせい","學生"],["かいしゃいん","公司職員"],["しゃいん","某公司的職員"],["ぎんこういん","銀行員"],["いしや","醫生"],["けんきゅうしゃ","研究員"],["だいがく","大學"],["びょういん","醫院"],["だれ","誰"],["どなた","誰(禮貌)"],["さい","歲"],["なんさい","幾歲"],["おいくつ","幾歲(禮貌)"],["はい","是"],["いいえ","不是"],["はじめまして","初次見面"],["からきました","從...過來"],["どうぞよろしくおねがいします","請多指教"],["しつれいですが","冒昧請問"],["おなまえは","您尊姓大名"],["こちらは","這位是"]],
  2: [["これ","這個"],["それ","那個"],["あれ","遠那個"],["この","這個(修飾名詞)"],["その","那個(修飾名詞)"],["あの","那個(修飾名詞)"],["ほん","書"],["じしょ","辭典"],["ざっし","雜誌"],["しん新聞","報紙"],["ノート","筆記本"],["てちょう","記事本"],["めいし","名片"],["カード","卡片"],["えんぴつ","鉛筆"],["シャープペンシル","自動鉛筆"],["カギ","鑰匙"],["とけい","鐘錶"],["かさ","傘"],["かばん","書包/皮包"],["シーディー","CD"],["テレビ","電視"],["ラジオ","收音機"],["カメラ","相機"],["コンピューター","電腦"],["くるま","汽車"],["つくえ","桌子"],["いす","椅子"],["チョコレート","巧克力"],["コーヒー","咖啡"],["おみやげ","伴手禮"],["えいご","英語"],["にほんご","日語"],["なん","什麼"],["そう","是的"],["おせわになります","承蒙照顧"],["こちらこそ","我才要請您指教"],["あのう","那個..."],["どうぞ","請"],["ありがとうございます","謝謝"],["そうですか","這樣啊"],["ちがいます","不是的"]],
  3: [["ここ","這裡"],["そこ","那裡"],["あそこ","那邊"],["どこ","哪裡"],["こちら","這邊(禮貌)"],["そちら","那邊(禮貌)"],["あちら","那邊(禮貌)"],["どちら","哪邊(禮貌)"],["きょうしつ","教室"],["しょくどう","餐廳"],["じむしょ","辦公室"],["かいぎしつ","會議室"],["うけつけ","接待處"],["ロビー","大廳"],["へや","房間"],["トイレ","廁所"],["おてあらい","洗手間"],["かいだん","樓梯"],["エレベーター","電梯"],["エスカレーター","電扶梯"],["じ自動販売機","自動販賣機"],["でんわ","電話"],["うち","家"],["くつ","鞋子"],["ネクタイ","領帶"],["ワイン","葡萄酒"],["うりば","賣場"],["ちか","地下"],["かい","...樓"],["なんがい","幾樓"],["えん","日圓"],["いくら","多少錢"],["ひゃく","百"],["せん","千"],["まん","萬"],["いらっしゃいませ","歡迎光臨"],["みせてください","請給我看..."],["じゃ","那麼"],["ください","請給我..."],["すみません","對不起"],["どうも","謝了"]],
  4: [["おきます","起床"],["ねます","睡覺"],["はたらきます","工作"],["やすみます","休息"],["べんきょうします","學習"],["おわります","結束"],["デパート","百貨公司"],["ぎんこう","銀行"],["ゆうびんきょく","郵局"],["としょかん","圖書館"],["びじゅつかん","美術館"],["いま","現在"],["じ","點"],["ふん/ぷん","分"],["はん","半"],["なんじ","幾點"],["なんぷん","幾分"],["ごぜん","上午"],["ごご","下午"],["あさ","早上"],["ひる","中午"],["よる/ばん","晚上"],["おととい","前天"],["きのう","昨天"],["きょう","今天"],["あした","明天"],["あさって","後天"],["けさ","今早"],["こんばん","今晚"],["やすみ","休息/假"],["ひるやすみ","午休"],["しけん","考試"],["かいぎ","會議"],["えいが","電影"],["まいあさ","每天早上"],["まいばん","每天晚上"],["まいにち","每天"],["にちようび","星期日"],["げつようび","星期一"],["かようび","星期二"],["すいようび","星期三"],["もくようび","星期四"],["きんようび","星期五"],["どようび","星期六"],["から","從..."],["まで","到..."],["と","和"],["ばんごう","號碼"],["なんばん","幾號"],["そちら","您那邊"],["たいへんですね","真辛苦呢"]],
  5: [["いきます","去"],["きます","來"],["かえります","回來"],["がっこう","學校"],["スーパー","超市"],["えき","車站"],["ひこうき","飛機"],["ふね","船"],["でんしゃ","電車"],["ちかてつ","地下鐵"],["しんかんせん","新幹線"],["バス","巴士"],["タクシー","計程車"],["じてんしゃ","自行車"],["あるいて","走路"],["ひと","人"],["ともだち","朋友"],["かれ","他/男友"],["かのじょ","她/女友"],["かぞく","家人"],["ひとりで","一個人"],["せんしゅう","上週"],["こんしゅう","本週"],["らいしゅう","下週"],["せんげつ","上個月"],["こんげつ","這個月"],["らいげつ","下個月"],["きょねん","去年"],["ことし","今年"],["らいねん","明年"],["がつ","月"],["なんがつ","幾月"],["ついたち","1號"],["ふつか","2號"],["みっか","3號"],["よっか","4號"],["いつか","5號"],["むいか","6號"],["なのか","7號"],["ようか","8號"],["ここのか","9號"],["とおか","10號"],["じゅうよっか","14號"],["はつか","20號"],["にじゅうよっか","24號"]],
  6: [["たべます","吃"],["のみます","喝"],["すいます","吸(菸)"],["みます","看"],["ききます","聽"],["よみます","讀"],["かきます","寫/畫"],["かいます","買"],["とります","拍(照)"],["します","做"],["あいます","遇見"],["ごはん","飯"],["あさごはん","早餐"],["ひるごはん","午餐"],["ばんごはん","晚餐"],["パン","麵包"],["たまご","雞蛋"],["にく","肉"],["さかな","魚"],["やさい","蔬菜"],["くだもの","水果"],["みず","水"],["おちゃ","茶"],["こうちゃ","紅茶"],["ぎゅうにゅう","牛奶"],["ジュース","果汁"],["ビール","啤酒"],["おさけ","酒"],["たばこ","香菸"],["てがみ","信"],["レポート","報告"],["しゃしん","照片"],["ビデオ","影片"],["みせ","商店"],["にわ","院子"],["しゅくだい","作業"],["テニス","網球"],["サッカー","足球"],["おはなみ","賞花"],["なに","什麼"],["いっしょに","一起"],["ちょっと","一下/稍微"],["いつも","總是"],["ときどき","有時"],["それから","然後"],["ええ","是的(口語)"],["いいですね","好呀"],["わかりました","明白了"],["なんですか","是什麼呢"]]
};

export default function App() {
  const [lesson, setLesson] = useState(1);
  const [quizList, setQuizList] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [options, setOptions] = useState([]);
  const [msg, setMsg] = useState("");
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [mode, setMode] = useState('jpToCh');

  useEffect(() => {
    startNewLesson(1);
  }, []);

  useEffect(() => {
    startNewLesson(lesson);
  }, [lesson, mode]);

  const startNewLesson = (L) => {
    const words = [...vocabularyData[L]].sort(() => Math.random() - 0.5);
    setQuizList(words);
    setCurrentIdx(0);
    setScore(0);
    setIsFinished(false);
    setMsg("");
    generateOptions(words[0], vocabularyData[L]);
  };

  const generateOptions = (correct, all) => {
    const wrong = all.filter(w => w[0] !== correct[0]).sort(() => 0.5 - Math.random()).slice(0, 2);
    setOptions([correct, ...wrong].sort(() => 0.5 - Math.random()));
  };

  const handleAnswer = (selectedItem) => {
    const isCorrect = selectedItem[0] === quizList[currentIdx][0];
    if (isCorrect) {
      setMsg("✅ 正確！");
      setScore(s => s + 1);
      setTimeout(() => {
        const next = currentIdx + 1;
        if (next < quizList.length) {
          setCurrentIdx(next);
          generateOptions(quizList[next], vocabularyData[lesson]);
          setMsg("");
        } else {
          setIsFinished(true);
        }
      }, 800);
    } else {
      setMsg("❌ 答錯了！");
    }
  };

  const currentNum = currentIdx + 1;
  const totalNum = quizList.length;
  const progressPercent = totalNum > 0 ? (currentNum / totalNum) * 100 : 0;

  if (isFinished) {
    return (
      <div style={{ padding: '30px', textAlign: 'center', minHeight: '100vh', background: '#f5f7f9' }}>
        <h2 style={{marginTop: '50px'}}>🎉 測驗完成</h2>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '15px', margin: '20px 0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <p style={{fontSize: '22px', fontWeight: 'bold', color: '#4A90E2'}}>最終得分</p>
            <p style={{fontSize: '48px', margin: '10px 0', color: '#333'}}>{score} / {totalNum}</p>
        </div>
        <button onClick={() => startNewLesson(lesson)} style={{ padding: '15px 40px', borderRadius: '12px', background: '#4A90E2', color: '#fff', border: 'none', fontSize: '18px', fontWeight: 'bold' }}>重新挑戰</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '15px', textAlign: 'center', minHeight: '100vh', background: '#f5f7f9', userSelect: 'none' }}>
      
      {/* 進度條區域 */}
      <div style={{ marginBottom: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#666', marginBottom: '5px', padding: '0 5px' }}>
          <span>單字挑戰中</span>
          <span>{currentNum} / {totalNum}</span>
        </div>
        <div style={{ width: '100%', height: '10px', background: '#ddd', borderRadius: '5px', overflow: 'hidden' }}>
          <div style={{ width: `${progressPercent}%`, height: '100%', background: '#4caf50', transition: 'width 0.3s ease-out' }} />
        </div>
      </div>

      {/* 控制面板 */}
      <div style={{ background: '#4A90E2', padding: '15px', borderRadius: '20px', color: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h2 style={{margin: '0 0 10px 0', fontSize: '24px'}}>SoraTalk 日語初級 1</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <select value={lesson} onChange={(e) => setLesson(Number(e.target.value))} style={{ padding: '8px', borderRadius: '8px', border: 'none', outline: 'none' }}>
            {[1,2,3,4,5,6].map(l => <option key={l} value={l}>第 {l} 課</option>)}
          </select>
          <select value={mode} onChange={(e) => setMode(e.target.value)} style={{ padding: '8px', borderRadius: '8px', border: 'none', outline: 'none' }}>
            <option value="jpToCh">日選中</option>
            <option value="chToJp">中選日</option>
          </select>
        </div>
      </div>

      {/* 回饋訊息 */}
      <p style={{ height: '30px', fontWeight: 'bold', fontSize: '20px', margin: '20px 0', color: msg.includes('✅') ? '#4caf50' : '#f44336' }}>
        {msg}
      </p>

      {/* 題目顯示 */}
      <div style={{ margin: '30px 0', minHeight: '120px', background: '#fff', borderRadius: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' }}>
        <div style={{ fontSize: '42px', fontWeight: 'bold', color: '#333', padding: '20px' }}>
          {quizList[currentIdx] && (mode === 'jpToCh' ? quizList[currentIdx][0] : quizList[currentIdx][1])}
        </div>
      </div>

      {/* 選項區 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {options.map((opt, i) => (
          <button key={i} onClick={() => handleAnswer(opt)} style={{ padding: '18px', fontSize: '22px', borderRadius: '15px', border: 'none', background: '#fff', boxShadow: '0 3px 6px rgba(0,0,0,0.08)', color: '#333' }}>
            {mode === 'jpToCh' ? opt[1] : opt[0]}
          </button>
        ))}
      </div>
    </div>
  );
}