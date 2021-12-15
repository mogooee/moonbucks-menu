// FIXME: Step2 요구사항 - 상태 관리로 메뉴 관리하기
// 상태를 다룰 수 있으면 사용자와의 상호작용을 다룰 수 있다.
// 카탈로그 같은 정적인 웹페이지가 아닌 카톡, 카뱅같은 사용자와의 인터랙션을 잘 반영한 동적인 웹애플리케이션을 만들기 위해 필수!
// TODO: localStorage Read & Wright
// - [V] localStorage에 데이터를 저장한다. (Read)
//   -[V] 메뉴를 추가할 때
//   -[V] 메뉴를 수정할 때
//   -[V] 메뉴를 삭제할 때
// - [V] 새로고침해도 데이터가 남아있게 한다. (Wright)

// TODO: 카테고리별 메뉴판 관리
// - [V] 에스프레소 메뉴판 관리
// - [V] 프라푸치노 메뉴판 관리
// - [V] 블렌디드 메뉴판 관리
// - [V] 티바나 메뉴판 관리
// - [V] 디저트 메뉴판 관리

// TODO: 페이지 접근시 최초 데이터 Read & Rendering
// - [V] 페이지에 최초로 접근할 때는 localStorage에 에스프레소 메뉴를 읽어온다.(Read)
// - [V] 에스프레소 메뉴를 페이지에 그린다. (Rendering)

// TODO: 품절 상태 관리
// - [V] 품절 버튼을 추가
// - [V] 품절 버튼을 클릭하면 localStorage에 상태값이 저장
// - [V] 클릭이벤트에서 가장 가까운 li태그의 class 속성 값에 sold-out을 추가

//반복되는 코드를 간결하게 나타냄
const $ = (selector) => document.querySelector(selector);

const store = {
  setLocalStorage(menu) {
    localStorage.setItem("menu", JSON.stringify(menu));
  },
  getLocalStorage() {
    return JSON.parse(localStorage.getItem("menu"));
  },
};

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
    if (store.getLocalStorage()) {
      this.menu = store.getLocalStorage();
    }
    render();
  };

  const render = () => {
    const template = this.menu[this.currentCategory]
      .map((menuItem, index) => {
        //data를 html마크업하고 싶을 때 쓰는 표준 속성
        return `<li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
      <span id="menu" class="w-100 pl-2 menu-name ${
        menuItem.soldOut ? "sold-out" : ""
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
    const menuCount = $("#menu-list").querySelectorAll("li").length;
    $(".menu-count").innerText = `총 ${menuCount}개`;
  };

  const addMenuName = () => {
    if (!$("#menu-name").value) {
      alert("값을 입력해주세요.");
      return;
    }
    const MenuName = $("#menu-name").value;
    this.menu[this.currentCategory].push({ name: MenuName });
    store.setLocalStorage(this.menu);
    render();
    $("#menu-name").value = "";
  };

  //수정
  const updateMenuName = (e) => {
    //data속성 가져오기
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt("메뉴명을 수정하세요", $menuName.innerText);
    this.menu[this.currentCategory][menuId].name = updatedMenuName;
    store.setLocalStorage(this.menu);
    $menuName.innerText = updatedMenuName;
  };

  const removeMenuName = (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      this.menu[this.currentCategory].splice(menuId, 1);
      store.setLocalStorage(this.menu);
      e.target.closest("li").remove();
      updateMenuCount();
    }
  };

  const soldOutMenu = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    //undefined->true->false...
    this.menu[this.currentCategory][menuId].soldOut =
      !this.menu[this.currentCategory][menuId].soldOut;
    store.setLocalStorage(this.menu);
    render();
  };

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

  $("nav").addEventListener("click", (e) => {
    const isCategoryButton = e.target.classList.contains("cafe-category-name");
    if (isCategoryButton) {
      const categoryName = e.target.dataset.categoryName;
      this.currentCategory = categoryName;
      $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
      render();
    }
  });
}

const app = new App();
app.init();
