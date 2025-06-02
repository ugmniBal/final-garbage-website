let data = [];
let suggestionsEl = document.getElementById('suggestions');

fetch('merged_data.json')
  .then(res => res.json())
  .then(json => { data = json });

function autocomplete() {
  const input = document.getElementById("locationInput").value.trim();
  suggestionsEl.innerHTML = "";
  if (!input) return;
  const matched = data.filter(d => {
    const full = `${d.시도명} ${d.시군구명} ${d.관리구역명}`;
    return full.includes(input);
  });
  matched.slice(0, 10).forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.시도명} ${item.시군구명} ${item.관리구역명}`;
    li.onclick = () => {
      document.getElementById("locationInput").value = li.textContent;
      suggestionsEl.innerHTML = "";
    };
    suggestionsEl.appendChild(li);
  });
}

function searchInfo() {
  const input = document.getElementById("locationInput").value.trim();
  const resultDiv = document.getElementById("result");
  const match = data.find(d => {
    const full = `${d.시도명} ${d.시군구명} ${d.관리구역명}`;
    return full === input;
  });
  resultDiv.innerHTML = match ? `
    <strong>📍 ${match.시도명} ${match.시군구명} ${match.관리구역명}</strong><br><br>
    🏠 배출장소: ${match.배출장소}<br>
    🗑️ 생활쓰레기: ${match.생활쓰레기배출방법} (${match.생활쓰레기배출요일})<br>
    🍱 음식물쓰레기: ${match.음식물쓰레기배출방법} (${match.음식물쓰레기배출요일})<br>
    ♻️ 재활용품: ${match.재활용품배출방법} (${match.재활용품배출요일})<br>
    🚫 미수거일: ${match.미수거일}<br>
    ☎️ 문의: ${match.관리부서전화번호}<br>
  ` : "❗ 일치하는 지역 정보를 찾을 수 없습니다.";
}
