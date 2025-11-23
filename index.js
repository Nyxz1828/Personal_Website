//language part here:

document.addEventListener("DOMContentLoaded", () => {
  const langSelect = document.getElementById("languageSelect");

  // === All language text ===
  const langPack = {
    en: {
      Self_into_text: "Hey, I'm ",
      name_text: "Liu Chen Yu",
      occupation_text: "Computer Science Graduate • Full-Stack Developer • Software Engineer • Digital Creator",

      // About Me Section
      About_Me: "About Me",
      about_me_text_1: "I'm a passionate coder who thrives on building efficient, scalable systems. My main focus is turning data and logic into clean, functional web apps.",
      about_me_text_2: "From back-end automation to modern UI interfaces, I enjoy solving real-world problems with technology.",
      Bios: "Bios",
      Languages: "Languages",
      Frameworks_n_Tools: "Frameworks & Tools",

      // Education Section
      Education: "Education",
      University_degree: "Feng Chia University (逢甲大學)",
      Degree_info: "Bachelor Degree in  Information Engineering and Computer Science",
      Degree_year_location: "2022 – 2026 • Taichung, Taiwan",
      Degree_focus: "• Focus: Embedded Systems, Data Analytics, Web Engineering",
      Degree_Fyp: "• Final Year Project: Automated Warehouse System",
      High_School_School: "Han Chiang High School",
      Hc_stream: "Science Stream",
      hc_yr_loc: "2016 – 2021 • Penang, Malaysia",
      hc_pos: "• Secretary of Robotic Club",
      hc_achievement: "• Participated in First Lego League(2018-2019)",
      
      
      // past projects
      past_project: "Past Projects",
      PJ1: "ProBall Analytics",
      PJ1_description: "A baseball analytics web app using HTML, JSON APIs, and JavaScript for CPBL data visualization.",
      PJ2: "Will Be Updated", 
      PJ2_description: "Custom chatbot built using Node.js, OpenAI API, and Tailwind for UI integration.",
      PJ3: "Automated Warehouse System",
      PJ3_description: "Capstone project integrating AGV control, data monitoring, and database synchronization.",

      //Schools Notes & Projects Archive
      school_archive: "📁 Schools Notes & Projects Archive " ,
      Notion_Notes: "Notions Notes",
      Notions_descriptions: " Personal notes and past homework from school during University",
      Notion_point1: "Programming languages",
      Notion_point2: "AI related",
      Notion_point3: "Full-Stack",
      Google_colab: "Google Colab Notes",
      Google_Colab_descriptions: "Google Colabs Codes which includes",
      Colab_point1: "Google Scripts",
      Colab_point2: "NLP",
      Colab_point3: "Personal Works",
      Github: "GitHub",
      Github_description: "Some respository are being stored here. Past-project if kept are usually in notions or Colab",
      Github_point1: "IoT",
      Github_point2: "Full-Stack",
      Github_point3: "APP",


      

      //Additional Info
      Addi_info: "Additional Info",
      addi_info_description: "Beyond coding, I enjoy learning languages, contributing to open-source projects, and building data tools that inspire others.",
      addi_info_Github: "GitHub", 
      addi_info_linkedln: "LinkedIn",
      addi_info_contact: "Contact",
      addi_info_Resume: "Resume",
      addi_info_Notion: "Notions",
      
      
      //footer
      build_by: "© 2025 Visual Code Studio — Built by Liu Chen Yu 劉晨煜",





    },
    zh: {
      Self_into_text: "您好，我是",
      name_text: "劉晨煜",
      occupation_text: "資訊工程學士學位•全棧工程師•軟體工程師•數字創作者",

      // About Me Section
      About_Me: "關於我",
      about_me_text_1: "我是一位熱愛寫程式的開發者，擅長打造高效、可擴展的系統。主要專注於將資料與邏輯轉化為乾淨、實用的網頁應用程式。",
      about_me_text_2: "從後端自動化到現代化 UI 介面，我喜歡用技術解決真實世界的問題。",
      Bios: "簡介",
      Languages: "語言",
      Frameworks_n_Tools: "框架與工具",

      // Education Section
      Education: "學歷",
      University_degree: "逢甲大學",
      Degree_info: "資訊工程學系 學士學位",
      Degree_year_location: "2022 – 2026 • 台中，台灣",
      Degree_focus: "• 主修方向：嵌入式系統、資料分析、網頁工程",
      Degree_Fyp: "• 畢業專題：自動化倉儲系統",
      High_School_School: "韓江中學",
      Hc_stream: "理科班",
      hc_yr_loc: "2016 – 2021 • 檳城，馬來西亞",
      hc_pos: "• 機器人學會秘書",
      hc_achievement: "• 參加 First Lego League（2018–2019）",

      // Past Projects
      past_project: "過往專案",
      PJ1: "ProBall Analytics",
      PJ1_description: "使用 HTML、JSON API 與 JavaScript 製作的 CPBL 資料視覺化棒球分析平台。",
      PJ2: "之後更新",
      PJ2_description: "以 Node.js、OpenAI API 與 Tailwind 打造的自訂聊天機器人。",
      PJ3: "自動化倉儲系統",
      PJ3_description: "整合 AGV 控制、資料監控與資料庫同步的畢業專題。",

      // Schools Notes & Projects Archive
      school_archive: "📁 校內筆記與專案資料庫",
      Notion_Notes: "Notion 筆記",
      Notions_descriptions: "大學期間的個人筆記與作業紀錄",
      Notion_point1: "程式語言",
      Notion_point2: "人工智慧相關",
      Notion_point3: "全端開發",
      Google_colab: "Google Colab 筆記",
      Google_Colab_descriptions: "包含以下類型的 Colab 程式碼：",
      Colab_point1: "Google Script",
      Colab_point2: "自然語言處理",
      Colab_point3: "個人作品",
      Github: "GitHub",
      Github_description: "部分專案儲存在此處，較舊的專案通常保存在 Notion 或 Colab。",
      Github_point1: "物聯網",
      Github_point2: "全端開發",
      Github_point3: "APP 開發",

      // Additional Info
      Addi_info: "其他資訊",
      addi_info_description: "除了寫程式，我也喜歡學習語言、參與開源專案，以及打造能啟發他人的資料工具。",
      addi_info_Github: "GitHub",
      addi_info_linkedln: "LinkedIn",
      addi_info_contact: "聯絡方式",
      addi_info_Resume: "履歷",
      addi_info_Notion: "Notion",

      // Footer
      build_by: "© 2025 Visual Code Studio — 由 劉晨煜 Liu Chen Yu 製作",

    },
    jp: {
        Self_into_text: "こんにちは、私は",
        name_text: "リュウ チェン ユー"+ "</span>" +"と申します。<br><br>よろしくお願いいたします。",
        occupation_text: "コンピュータサイエンス学士•フルスタック開発者•ソフトウェア開発技術者•デジタルクリエーター",

        // About Me Section
        About_Me: "自己紹介",
        about_me_text_1: "効率的でスケーラブルなシステム構築に情熱を持つエンジニアです。主に、データとロジックを分かりやすく、機能的な Web アプリへと落とし込むことに注力しています。",
        about_me_text_2: "バックエンドの自動化からモダンな UI まで、技術を使って現実の課題を解決することを楽しんでいます。",
        Bios: "プロフィール",
        Languages: "言語",
        Frameworks_n_Tools: "フレームワーク & ツール",

        // Education Section
        Education: "学歴",
        University_degree: "逢甲大学（Feng Chia University）",
        Degree_info: "情報工学・コンピュータサイエンス 学士号",
        Degree_year_location: "2022 – 2026 • 台湾・台中",
        Degree_focus: "• 専門分野：組込みシステム、データ分析、Web エンジニアリング",
        Degree_Fyp: "• 卒業研究：自動倉庫システム",
        High_School_School: "ハンチェン高校（Han Chiang High School）",
        Hc_stream: "サイエンスストリーム（理系）",
        hc_yr_loc: "2016 – 2021 • マレーシア・ペナン",
        hc_pos: "• ロボティクスクラブ 書記",
        hc_achievement: "• First Lego League（2018–2019）参加",

        // Past Projects
        past_project: "過去のプロジェクト",
        PJ1: "ProBall Analytics",
        PJ1_description: "HTML、JSON API、JavaScript を使用し、CPBL データを可視化するための野球分析 Web アプリ。",
        PJ2: "後日更新予定",
        PJ2_description: "Node.js、OpenAI API、Tailwind を用いて構築したカスタムチャットボット。",
        PJ3: "自動倉庫システム",
        PJ3_description: "AGV 制御、データ監視、データベース同期を統合した卒業プロジェクト。",

        // Schools Notes & Projects Archive
        school_archive: "📁 学習ノート & プロジェクトアーカイブ",
        Notion_Notes: "Notion ノート",
        Notions_descriptions: "大学時代の個人ノートおよび課題記録",
        Notion_point1: "プログラミング言語",
        Notion_point2: "AI 関連",
        Notion_point3: "フルスタック開発",
        Google_colab: "Google Colab ノート",
        Google_Colab_descriptions: "以下を含む Colab コード：",
        Colab_point1: "Google Scripts",
        Colab_point2: "自然言語処理（NLP）",
        Colab_point3: "個人作品",
        Github: "GitHub",
        Github_description: "いくつかのリポジトリがここに保存されています。過去のプロジェクトは Notion または Colab に保管している場合があります。",
        Github_point1: "IoT",
        Github_point2: "フルスタック開発",
        Github_point3: "アプリ開発",

        // Additional Info
        Addi_info: "追加情報",
        addi_info_description: "プログラミング以外にも、語学学習、オープンソースへの貢献、そして人々を刺激するデータツールの制作を楽しんでいます。",
        addi_info_Github: "GitHub",
        addi_info_linkedln: "LinkedIn",
        addi_info_contact: "連絡先",
        addi_info_Resume: "履歴書",
        addi_info_Notion: "Notion",

        // Footer
        build_by: "© 2025 Visual Code Studio — 制作：劉晨煜（Liu Chen Yu）",


    }
  };

// === When dropdown changes language ===
langSelect.addEventListener("change", function () {
  const lang = langSelect.value;

  // SPECIAL HANDLING: Self intro block with underline + name
  document.getElementById("Self_into_text").innerHTML =
    langPack[lang].Self_into_text +
    " <span class='border-b-4 border-indigo-500 pb-1' id='name_text'>" +
    langPack[lang].name_text +
    "</span>";
  
  document.getElementById("addi_info_contact").innerHTML =
    '<i data-feather="mail">' + '</i>' + " " + langPack[lang].addi_info_contact;
  document.getElementById("addi_info_Resume").innerHTML =
    '<i data-feather="file-text" >' + '</i>' + " " + langPack[lang].addi_info_Resume;
  feather.replace();



  // Auto-update *all* elements whose ID matches langPack keys
  const allElements = document.querySelectorAll("[id]");

  allElements.forEach(el => {
    const key = el.id;

    // Skip special case handled above
    if (key === "Self_into_text" || key === "name_text" ||   key === "addi_info_Github" || key === "addi_info_linkedln" || key === "addi_info_contact" || key==="addi_info_Resume" || key==="addi_info_Notion") return;

    if (langPack[lang][key] !== undefined) {
      el.innerHTML = langPack[lang][key];
    }
  });

  console.log("Language changed to:", lang);
});


});




//ends here for language part

