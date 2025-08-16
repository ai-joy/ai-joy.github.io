

class PagesUI {
	constructor(main, span) {
		this.container = main;
		this.container.classList.add("pages-container");

		this.btnBar = this.container.appendChild(document.createElement("div"));
		this.btnBar.classList.add("btn-bar");
		this.prevBtn = this.btnBar.appendChild(document.createElement("button"));
		this.prevBtn.innerText = "< Previous";
		this.nextBtn = this.btnBar.appendChild(document.createElement("button"));
		this.nextBtn.innerText = "Next >";
		this.nextBtn.classList.add("next");
		this.prevBtn.classList.add("prev");

		this.contentArea = this.container.appendChild(document.createElement("div"));
		this.contentArea.classList.add("content-area");
	}
	render(pageContentArr) {
		// render the inner HTML for each element
		var mc = this.contentArea;
		pageContentArr.forEach(async (p) => {
			const page = mc.appendChild(document.createElement("div"));
			page.classList.add("page-content");
			page.innerHTML = await p.text();
		});
	}
	clear() {
		this.contentArea.innerHTML = "";
	}
	onNext(callback) {
		this.nextBtn.onclick = callback;
	}
	onPrev(callback) {
		this.prevBtn.onclick = callback;
	}
}


function loadPages(pageList) {
	return Promise.all(pageList.map((p) => fetch("/" + p.path)));
}


class PageManager {
	
	constructor(pages, span) {
		this.pages = pages; //.map((page) => new Page(page));
		this.n_pages = this.pages.length;
		this.ui = new PagesUI(document.querySelector("main"));
		this.cur = 0;
		this.span = span;
	}

	_loadAndRender(fromIndex, toIndex) {
		var mthis = this;
		loadPages(this.pages.slice(fromIndex, toIndex)).then((pageContentArr) => {
			mthis.ui.render(pageContentArr);
		});
	}

	shiftLeft() {
		this.cur = Math.max(0, this.cur - this.span);
	}

	shiftRight() {
		this.cur = Math.min(this.pages.length - this.span, this.cur + this.span);
	}

	start() {
		var mthis = this;
		this.ui.onNext(() => {
			mthis.ui.clear();
			mthis._loadAndRender(mthis.cur, mthis.cur + mthis.span);
			mthis.shiftRight();
		});
		this.ui.onPrev(() => {
			mthis.ui.clear();
			mthis.shiftLeft();
			mthis._loadAndRender(mthis.cur, mthis.cur + mthis.span);
		});
		mthis.ui.clear();
		mthis._loadAndRender(mthis.cur, mthis.cur + mthis.span);
		mthis.shiftRight();
	}
}


fetch("/pages.lst").then(async (r) => {
	const p = await r.json();
	const articlesPerPage = 2;
	try {
		const pm = new PageManager(p.pages, articlesPerPage);
		pm.start();
	} catch (error) {
		console.log(error);
	}
});
