import { $ } from "./utils/dom.js";
import store from "./store/index.js";
import MenuApi from "./api/index.js";

/* FIXME: Step3 요구사항 - 서버와의 통신을 통해 메뉴 관리하기 

TODO: 서버 요청 부분
- [V] 웹 서버를 띄운다.
- [V] 서버에 새로운 메뉴명이 추가될 수 있도록 요청한다.
- [V] 서버에 카테고리별 메뉴리스트를 불러올 수 있도록 요청한다.
- [V] 서버에 저장된 메뉴가 수정되도록 요청한다.
- [V] 서버에 메뉴의 품절상태를 토글될 수 있도록 요청한다.
- [V] 서버에 메뉴가 삭제되도록 요청한다.

 TODO: 리팩토링 부분
- [V] localStorage에 저장하는 로직은 지운다.
- [V] fetch 비동기 api를 사용하는 부분을 async await을 사용하여 구현한다.

TODO: 사용자 경험
- [V] API 통신이 실패하는 경우에 대해 사용자가 알 수 있게 alert으로 예외처리를 진행한다.
- [V] 중복되는 메뉴는 추가할 수 없다.

FIXME: 회고
1. 웹서버 띄우기
2. BASE_URL 웹 서버 변수 선언
3. async/await 비동기 처리, 웹 서버에 요청하는 코드 구현
4. 서버에 요청한 데이터를 받아 화면에 렌더링
5. 리팩토링 
- localStorage 부분 지우기
- API 파일 따로 만들기
- 페이지 렌더링과 관련하여 중복 코드 제거
- 서버 요청할 때 option 객체
- 카테고리 버튼 클릭 시 콜백함수 분리
6. 사용자 경험 부분  */

function App() {
  // 상태는 변하는 데이터, 이 앱에서 변하는 것이 무엇인가 - 메뉴이름
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };
  this.currentCategory = "espresso";

  this.init = () => {
    render();
    initEventListeners();
  };

  const render = async () => {
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );
    const template = this.menu[this.currentCategory]
      .map((menuItem) => {
        //data를 html마크업하고 싶을 때 쓰는 표준 속성
        return `<li data-menu-id="${
          menuItem.id
        }" class="menu-list-item d-flex items-center py-2">
      <span id="menu" class="w-100 pl-2 menu-name ${
        menuItem.isSoldOut ? "sold-out" : ""
      }" >${menuItem.name}</span>
      <button
        type="button"
        class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
      >
        품절
      </button>

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
      })
      .join("");

    //innerHTML은 위에 계속 덮어쓰므로 insertAdjacentHTML 사용
    $("#menu-list").innerHTML = template;
    updateMenuCount();
  };

  const updateMenuCount = () => {
    const menuCount = this.menu[this.currentCategory].length;
    $(".menu-count").innerText = `총 ${menuCount} 개`;
  };

  const addMenuName = async () => {
    if (!$("#menu-name").value) {
      alert("값을 입력해주세요.");
      return;
    }

    const duplicatedItem = this.menu[this.currentCategory].find(
      (menuItem) => menuItem.name === $("#menu-name").value
    );
    if (duplicatedItem) {
      alert("이미 등록된 메뉴입니다. 다시 입력해주세요.");
      $("#menu-name").value = "";
      return;
    }

    const menuName = $("#menu-name").value;
    await MenuApi.createMenu(this.currentCategory, menuName);

    render();
    $("#menu-name").value = "";
  };

  const updateMenuName = async (e) => {
    //data속성 가져오기
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt("메뉴명을 수정하세요", $menuName.innerText);
    await MenuApi.updateMenu(this.currentCategory, updatedMenuName, menuId);

    render();
  };

  const removeMenuName = async (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      await MenuApi.deleteMenu(this.currentCategory, menuId);

      render();
    }
  };

  const soldOutMenu = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    await MenuApi.toggleSoldOutMenu(this.currentCategory, menuId);

    render();
  };

  const changeCategory = (e) => {
    const isCategoryButton = e.target.classList.contains("cafe-category-name");
    if (isCategoryButton) {
      const categoryName = e.target.dataset.categoryName;
      this.currentCategory = categoryName;
      $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
      render();
    }
  };

  const initEventListeners = () => {
    // 메뉴의 이름을 입력받는 것
    $("#menu-name").addEventListener("keypress", (e) => {
      if (e.key !== "Enter") {
        return;
      }
      addMenuName();
    });

    $("#menu-submit-button").addEventListener("click", addMenuName);

    $("#menu-form").addEventListener("submit", (e) => {
      e.preventDefault();
    });

    //수정, 삭제, 품절
    $("#menu-list").addEventListener("click", (e) => {
      if (e.target.classList.contains("menu-edit-button")) {
        updateMenuName(e);
        return;
      }

      if (e.target.classList.contains("menu-remove-button")) {
        removeMenuName(e);
        return;
      }

      if (e.target.classList.contains("menu-sold-out-button")) {
        soldOutMenu(e);
        return;
      }
    });

    $("nav").addEventListener("click", changeCategory);
  };
}

const app = new App();
app.init();
