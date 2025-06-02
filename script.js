let data = [];
let selectedData = [];

window.onload = async () => {
  const res = await fetch("merged_data.json");
  data = await res.json();
  const sidoSet = new Set(data.map(d => d["시도명"]));
  const sidoSelect = document.getElementById("sido");
  sidoSet.forEach(sido => {
    const opt = document.createElement("option");
    opt.value = sido;
    opt.textContent = sido;
    sidoSelect.appendChild(opt);
  });
  sidoSelect.addEventListener("change", updateSigungu);
};

function updateSigungu(e) {
  const sigunguSelect = document.getElementById("sigungu");
  const dongSelect = document.getElementById("dong");
  sigunguSelect.innerHTML = "<option>시/군/구 선택</option>";
  dongSelect.innerHTML = "<option>동 선택</option>";
  const selectedSido = e.target.value;
  selectedData = data.filter(d => d["시도명"] === selectedSido);
  const sigunguSet = new Set(selectedData.map(d => d["시군구명"]));
  sigunguSet.forEach(sg => {
    const opt = document.createElement("option");
    opt.value = sg;
    opt.textContent = sg;
    sigunguSelect.appendChild(opt);
  });
  sigunguSelect.addEventListener("change", updateDong);
}

function updateDong(e) {
  const dongSelect = document.getElementById("dong");
  dongSelect.innerHTML = "<option>동 선택</option>";
  const selectedSigungu = e.target.value;
  const dongs = selectedData.filter(d => d["시군구명"] === selectedSigungu)
                            .map(d => d["관리구역명"]);
  new Set(dongs).forEach(dong => {
    const opt = document.createElement("option");
    opt.value = dong;
    opt.textContent = dong;
    dongSelect.appendChild(opt);
  });
}

function searchInfo() {
  const sido = document.getElementById("sido").value;
  const sigungu = document.getElementById("sigungu").value;
  const dong = document.getElementById("dong").value;
  const result = data.find(d =>
    d["시도명"] === sido &&
    d["시군구명"] === sigungu &&
    d["관리구역명"] === dong
  );
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = result ? `
    <strong>📍 ${result["시도명"]} ${result["시군구명"]} ${result["관리구역명"]}</strong><br><br>
    🏠 배출장소: ${result["배출장소"]}<br>
    🗑️ 생활쓰레기: ${result["생활쓰레기배출방법"]} (${result["생활쓰레기배출요일"]})<br>
    🍱 음식물쓰레기: ${result["음식물쓰레기배출방법"]} (${result["음식물쓰레기배출요일"]})<br>
    ♻️ 재활용품: ${result["재활용품배출방법"]} (${result["재활용품배출요일"]})<br>
    🚫 미수거일: ${result["미수거일"]}<br>
    ☎️ 문의: ${result["관리부서전화번호"]}<br>
  ` : "❗ 선택한 지역 정보를 찾을 수 없습니다.";
}
