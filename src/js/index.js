// ** 오늘 얻은 인사이트
// 1. 이벤트 위임
// 2. 요구사항을 단계별로 쪼개어 접근하는 것의 중요성
// 3. DOM 요소를 가져올 때는 $표시로 변수처럼 사용 가능
// 4. new 메서드: innerText, innerHTML, insertAdjacentHTML, closest, e.target

// ** step1 요구사항 구현을 위한 전략
// * TODO 메뉴 추가
// - [V] 메뉴의 이름을 입력 받고 엔터키 입력으로 메뉴 추가
// - [V] 메뉴의 이름을 입력 받고 확인 버튼을 클릭하면 메뉴 추가
// - [V] 추가되는 메뉴의 마크업은 `<ul id="espresso-menu-list" class="mt-3 pl-0"></ul>` 안에 삽입해야 한다.
// - [V] 총 메뉴 개수를 count하여 상단에 보여준다
// - [V] 메뉴가 추가되고 나면, input은 빈 값으로 초기화한다.
// - [V] 사용자 입력값이 빈 값이라면 추가되지 않는다.

// * TODO 메뉴 수정
// - [V] 메뉴의 수정 버튼 클릭 이벤트를 받고, 메뉴 수정하는 모달창(prompt)이 뜬다.
// - [V] 모달창에서 신규메뉴명을 입력 받고, 확인버튼을 누르면 메뉴가 수정된다.

// * TODO 메뉴 삭제
// - [V] 메뉴 삭제 버튼 클릭 이벤트를 받고, 메뉴 삭제 컨펌 모달창이 뜬다.
// - [V] 확인 버튼을 클릭하면 메뉴가 삭제된다.
// - [V] 총 메뉴 개수를 count하여 상단에 보여준다.

//반복되는 코드를 간결하게 나타냄
const $ = (selector) => document.querySelector(selector);

function App() {
  // 이벤트 위임

  const updateMenuCount = () => {
    const menuCount = $("#espresso-menu-list").querySelectorAll("li").length;
    $(".menu-count").innerText = `총 ${menuCount}개`;
  };

  const addMenuName = () => {
    if (!$("#espresso-menu-name").value) {
      alert("값을 입력해주세요.");
      return;
    }
    const espressoMenuName = $("#espresso-menu-name").value;
    const menuItemTemplate = (espressoMenuName) => {
      return `<li class="menu-list-item d-flex items-center py-2">
        <span class="w-100 pl-2 menu-name">${espressoMenuName}</span>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
        >
          수정
        </button>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
        >
          삭제
        </button>
      </li>`;
    };

    //innerHTML은 위에 계속 덮어쓰므로 insertAdjacentHTML 사용
    $("#espresso-menu-list").insertAdjacentHTML(
      "beforeend",
      menuItemTemplate(espressoMenuName)
    );

    updateMenuCount();
    $("#espresso-menu-name").value = "";
  };

  const updateMenuName = (e) => {
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt("메뉴명을 수정하세요", $menuName.innerText);
    $menuName.innerText = updatedMenuName;
  };

  const removeMenuName = (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      e.target.closest("li").remove();
      updateMenuCount();
    }
  };

  $("#espresso-menu-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("menu-edit-button")) {
      updateMenuName(e);
    }

    if (e.target.classList.contains("menu-remove-button")) {
      removeMenuName(e);
    }
  });

  $("#espresso-menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });

  $("#espresso-menu-submit-button").addEventListener("click", addMenuName);

  // 메뉴의 이름을 입력받는 것
  $("#espresso-menu-name").addEventListener("keypress", (e) => {
    if (e.key !== "Enter") {
      return;
    }
    addMenuName();
  });
}

App();
