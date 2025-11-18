/**
 * CART.JS - XỬ LÝ CHO TRANG CART.HTML
 * Tạo các hiệu ứng tương tác, animation và xử lý logic cho trang Cửa hàng
 *
 * Màu sắc chủ đạo:
 * - Primary: #ff8c00 (cam)
 * - Hover: #e67e00 (cam đậm)
 * - Border: #daa520 (vàng đồng)
 * - Background: #f9f9f9
 */

// ============================================================
// A. CATEGORIES CAROUSEL (Băng chuyền danh mục)
// ============================================================

(function() {
    'use strict';

    // Đảm bảo DOM đã load xong
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCategoriesCarousel);
    } else {
        initCategoriesCarousel();
    }

    function initCategoriesCarousel() {
        // Lấy các elements
        const categoriesContainer = document.getElementById('categoriesContainer');
        const prevButton = document.getElementById('prevButton');
        const nextButton = document.getElementById('nextButton');
        const categoryItems = document.querySelectorAll('.category-item');

        // Kiểm tra các elements có tồn tại không
        if (!categoriesContainer || !prevButton || !nextButton) {
            console.warn('Categories carousel elements not found');
            return;
        }

        // ============================================================
        // 1. SMOOTH SCROLL NAVIGATION
        // ============================================================

        /**
         * Xử lý cuộn trái (Previous)
         * - Cuộn trái 300px với smooth behavior
         * - Animation duration: 400ms
         * - Easing: ease-in-out
         */
        prevButton.addEventListener('click', function() {
            categoriesContainer.scrollBy({
                left: -300,
                behavior: 'smooth'
            });
        });

        /**
         * Xử lý cuộn phải (Next)
         * - Cuộn phải 300px với smooth behavior
         * - Animation duration: 400ms
         * - Easing: ease-in-out
         */
        nextButton.addEventListener('click', function() {
            categoriesContainer.scrollBy({
                left: 300,
                behavior: 'smooth'
            });
        });

        // ============================================================
        // 2. AUTO-HIDE BUTTONS
        // ============================================================

        /**
         * Cập nhật trạng thái hiển thị của các nút điều hướng
         * - Ẩn nút Previous khi ở đầu (scrollLeft = 0)
         * - Ẩn nút Next khi ở cuối (scrollLeft + width >= scrollWidth)
         * - Hiển thị cả hai nút trong các trường hợp còn lại
         * - Transition: opacity 300ms ease
         */
        function updateNavigationButtons() {
            const scrollLeft = categoriesContainer.scrollLeft;
            const scrollWidth = categoriesContainer.scrollWidth;
            const clientWidth = categoriesContainer.clientWidth;

            // Kiểm tra vị trí ở đầu
            if (scrollLeft <= 0) {
                prevButton.style.opacity = '0';
                prevButton.style.pointerEvents = 'none';
            } else {
                prevButton.style.opacity = '1';
                prevButton.style.pointerEvents = 'auto';
            }

            // Kiểm tra vị trí ở cuối
            // Thêm threshold 1px để tránh lỗi làm tròn
            if (scrollLeft + clientWidth >= scrollWidth - 1) {
                nextButton.style.opacity = '0';
                nextButton.style.pointerEvents = 'none';
            } else {
                nextButton.style.opacity = '1';
                nextButton.style.pointerEvents = 'auto';
            }
        }

        // Thêm CSS transition cho buttons
        prevButton.style.transition = 'opacity 300ms ease';
        nextButton.style.transition = 'opacity 300ms ease';

        // Lắng nghe sự kiện scroll
        categoriesContainer.addEventListener('scroll', updateNavigationButtons);

        // Lắng nghe sự kiện resize để cập nhật buttons khi thay đổi kích thước
        window.addEventListener('resize', updateNavigationButtons);

        // Gọi lần đầu để thiết lập trạng thái ban đầu
        updateNavigationButtons();

        // ============================================================
        // 3. HOVER EFFECTS ON CATEGORY ITEMS
        // ============================================================

        /**
         * Thêm hover effects cho category items
         * - Transform: scale(1.05)
         * - Box-shadow: 0 4px 12px rgba(255, 140, 0, 0.3)
         * - Transition: 300ms ease
         */
        categoryItems.forEach(function(item) {
            // Thêm CSS transition
            item.style.transition = 'transform 300ms ease, box-shadow 300ms ease';

            // Mouse enter - Hover vào
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05)';
                this.style.boxShadow = '0 4px 12px rgba(255, 140, 0, 0.3)';
            });

            // Mouse leave - Rời khỏi
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = 'none';
            });
        });

        // ============================================================
        // 4. TOUCH/SWIPE SUPPORT (Bonus for mobile)
        // ============================================================

        let touchStartX = 0;
        let touchEndX = 0;

        categoriesContainer.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        categoriesContainer.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50; // Minimum distance for a swipe
            const difference = touchStartX - touchEndX;

            if (Math.abs(difference) > swipeThreshold) {
                if (difference > 0) {
                    // Swipe left - scroll right
                    categoriesContainer.scrollBy({
                        left: 300,
                        behavior: 'smooth'
                    });
                } else {
                    // Swipe right - scroll left
                    categoriesContainer.scrollBy({
                        left: -300,
                        behavior: 'smooth'
                    });
                }
            }
        }

        console.log('Categories carousel initialized successfully');
    }
})();
