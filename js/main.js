/* 首页交互脚本
   修改说明：
   - 删除 showDetail/backToMain，因为详情页已经拆成独立 HTML。
   - 只保留首页底部导航栏与泛光控制。
   - 新增产品分类筛选交互。
*/

const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', function () {
    if (!navbar) return;

    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const distanceToBottom = documentHeight - (scrollTop + windowHeight);

    if (distanceToBottom < 80) {
        navbar.classList.add('hide');
        document.body.classList.add('nav-hidden');
    } else {
        navbar.classList.remove('hide');
        document.body.classList.remove('nav-hidden');
    }
});

/* =========================================================
   产品分类筛选交互
========================================================= */
(function () {
    const filterBtns = document.querySelectorAll('.cat-btn');
    const sections = document.querySelectorAll('.category-section');

    if (!filterBtns.length || !sections.length) return;

    // 分类 slug 与 section id 的映射
    const categoryMap = {
        assembly: 'cat-assembly',
        flight: 'cat-flight',
        power: 'cat-power',
        design: 'cat-design',
        performance: 'cat-performance',
        youth: 'cat-youth'
    };

    // 点击筛选按钮
    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var cat = this.getAttribute('data-category');

            // 更新按钮激活态
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            this.classList.add('active');

            if (cat === 'all') {
                // 显示全部：滚动到产品区顶部
                var productsSection = document.getElementById('products');
                if (productsSection) {
                    productsSection.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                // 滚动到对应分类区块
                var targetId = categoryMap[cat];
                var target = document.getElementById(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // 滚动时自动高亮当前分类（节流处理）
    var ticking = false;
    window.addEventListener('scroll', function () {
        if (!ticking) {
            requestAnimationFrame(function () {
                updateActiveFilter();
                ticking = false;
            });
            ticking = true;
        }
    });

    function updateActiveFilter() {
        var currentCategory = 'all';
        var bestTop = -Infinity;

        sections.forEach(function (section) {
            var rect = section.getBoundingClientRect();
            // 以分类区块顶部相对于视口的位置判断
            // 在 rect.top <= 200 的区块中，选 top 值最大的（最接近筛选栏的那个）
            if (rect.top <= 200 && rect.top > bestTop) {
                var id = section.getAttribute('id');
                for (var cat in categoryMap) {
                    if (categoryMap[cat] === id) {
                        currentCategory = cat;
                        bestTop = rect.top;
                        break;
                    }
                }
            }
        });

        // 如果页面滚动到产品区之前，不改变 all 激活态
        var productsSection = document.getElementById('products');
        if (productsSection) {
            var productsRect = productsSection.getBoundingClientRect();
            if (productsRect.top > 100) {
                currentCategory = 'all';
            }
        }

        // 更新按钮激活态
        filterBtns.forEach(function (btn) {
            btn.classList.remove('active');
            if (btn.getAttribute('data-category') === currentCategory) {
                btn.classList.add('active');
            }
        });
    }
})();
