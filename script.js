let data = [];
let map;

window.onload = async () => {
  const response = await fetch("data.json");
  data = await response.json();

  const input = document.getElementById("search");
  input.addEventListener("input", suggest);
  document.addEventListener("click", () => {
    document.getElementById("suggestions").innerHTML = "";
  });

  initMap();
};

function suggest(e) {
  const input = e.target.value.trim().replace(/\s/g, "");
  const suggestions = document.getElementById("suggestions");
  suggestions.innerHTML = "";

  const matches = data.filter(d =>
    (d.시도명 + d.시군구명).replace(/\s/g, "").includes(input)
  );

  const unique = [...new Set(matches.map(d => `${d.시도명} ${d.시군구명}`))];
  unique.slice(0, 10).forEach(loc => {
    const li = document.createElement("li");
    li.textContent = loc;
    li.onclick = () => {
      document.getElementById("search").value = loc;
      suggestions.innerHTML = "";
    };
    suggestions.appendChild(li);
  });
}

function search() {
  const val = document.getElementById("search").value.trim().replace(/\s/g, "");
  const result = document.getElementById("result");
  const matched = data.filter(d =>
    (d.시도명 + d.시군구명).replace(/\s/g, "") === val
  );

  result.innerHTML = "";

  if (matched.length === 0) {
    result.classList.remove("hidden");
    result.innerHTML = "해당 지역 정보를 찾을 수 없습니다.";
    return;
  }

  matched.forEach(i => {
    result.classList.remove("hidden");
    result.innerHTML += `
      <strong>${i.시도명} ${i.시군구명} - ${i.관리구역명}</strong><br>
      🧺 생활: ${i.생활쓰레기배출방법} (${i.생활쓰레기배출요일})<br>
      🍎 음식물: ${i.음식물쓰레기배출방법} (${i.음식물쓰레기배출요일})<br>
      ♻️ 재활용: ${i.재활용품배출방법} (${i.재활용품배출요일})<br>
      🚫 미수거일: ${i.미수거일}<br>
      ☎️ 문의: ${i.관리부서전화번호}<br><br>
    `;

    moveMap(i.시도명 + " " + i.시군구명);
  });
}

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 37.5665, lng: 126.9780 },
    zoom: 11
  });
}

function moveMap(location) {
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: location }, (results, status) => {
    if (status === "OK") {
      map.setCenter(results[0].geometry.location);
      new google.maps.Marker({
        map: map,
        position: results[0].geometry.location
      });
    }
  });
}