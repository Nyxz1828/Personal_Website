//language part here:

document.addEventListener("DOMContentLoaded", () => {
  const langSelect = document.getElementById("languageSelect");

  // === All language text ===
  const langPack = {
    en: {
      Self_into_text: "Hey, I'm ",
      name_text: "Liu Chen Yu",
      occupation_text: "Computer Science Graduate•Full-Stack Developer • Data Engineer • Digital Creator",
      About_Me: "About Me",
      about_me_text_1: "I'm a passionate coder who thrives on building efficient, scalable systems. My main focus is turning data and logic into clean, functional web apps.",
      about_me_text_2: "From back-end automation to modern UI interfaces, I enjoy solving real-world problems with technology.",
      Bios: "Bios",
      Languages: "Languages",
      Frameworks_n_Tools: "Frameworks & Tools",
      Education: "Education",
      University_degree: "Feng Chia University (逢甲大學)",
      Degree_info: "Bachelor Degree in  Information Engineering and Computer Science",
      Degree_year_location: "2022 – 2026 • Taichung, Taiwan",
      Degree_focus: "• Focus: Embedded Systems, Data Analytics, Web Engineering",
      Degree_Fyp: "• Final Year Project: Automated Warehouse System"





    },
    zh: {
      Self_into_text: "您好，我是",
      name_text: "劉晨煜",
      occupation_text: "資訊工程學士學位•全棧工程師•數據工程師•數字創作者"
    },
    jp: {
        Self_into_text: "こんにちは、私は",
        name_text: "リュウ チェン ユー"+ "</span>" +"と申します。<br><br>よろしくお願いいたします。",
        occupation_text: "コンピュータサイエンス学士•フルスタック開発者•データエンジニア•デジタルクリエーター"

    }
  };

  // === When dropdown changes language ===
  langSelect.addEventListener("change", function () {
    const lang = langSelect.value;

    // Update text by ID

    document.getElementById("Self_into_text").innerHTML = langPack[lang].Self_into_text +" <span class='border-b-4 border-indigo-500 pb-1' id='name_text'>" + langPack[lang].name_text ;
    //document.getElementById("name_text").innerHTML = langPack[lang].name_text ;
    document.getElementById("occupation_text").innerHTML = langPack[lang].occupation_text ;
    
  });

});




//ends here for language part

