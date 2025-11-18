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

// ============================================================
// B. SEARCH & FILTER SYSTEM (Hệ thống tìm kiếm và lọc)
// ============================================================

(function() {
    'use strict';

    // Đảm bảo DOM đã load xong
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSearchAndFilter);
    } else {
        initSearchAndFilter();
    }

    function initSearchAndFilter() {
        // Lấy các elements
        const searchInput = document.querySelector('.search-input');
        const provinceDropdown = document.querySelector('.filter-dropdown');
        const districtDropdown = document.querySelector('.district-dropdown');
        const storeCards = document.querySelectorAll('.store-card');
        const storeList = document.querySelector('.store-list');

        // Kiểm tra các elements có tồn tại không
        if (!searchInput || !provinceDropdown || !districtDropdown || !storeList) {
            console.warn('Search & Filter elements not found');
            return;
        }

        // ============================================================
        // DISTRICT DATA - Mapping provinces to districts
        // ============================================================
        const districtData = {
            'Hồ Chí Minh': ['Quận 1', 'Quận 3', 'Quận 5', 'Quận 10', 'Quận 11'],
            'Hà Nội': ['Quận Ba Đình', 'Quận Cầu Giấy', 'Quận Hà Đông', 'Quận Hoàn Kiếm'],
            'Đà Nẵng': ['Quận Hải Châu', 'Quận Thanh Khê', 'Quận Sơn Trà', 'Quận Ngũ Hành Sơn'],
            'Bình Dương': ['TP Thủ Dầu Một', 'TP Dĩ An', 'TP Thuận An'],
            'Cần Thơ': ['Quận Ninh Kiều', 'Quận Cái Răng', 'Quận Bình Thủy']
        };

        // ============================================================
        // 1. LIVE SEARCH (Tìm kiếm thời gian thực)
        // ============================================================

        let searchDebounceTimer;
        const DEBOUNCE_DELAY = 300; // ms

        /**
         * Debounce function để tránh search quá nhiều lần
         */
        function debounce(func, delay) {
            return function(...args) {
                clearTimeout(searchDebounceTimer);
                searchDebounceTimer = setTimeout(() => func.apply(this, args), delay);
            };
        }

        /**
         * Hàm tìm kiếm chính
         */
        function performSearch() {
            const searchValue = searchInput.value.toLowerCase().trim();
            const selectedProvince = provinceDropdown.value;
            const selectedDistrict = districtDropdown.value;

            let visibleCount = 0;

            storeCards.forEach(card => {
                const storeName = card.querySelector('.store-header').textContent.toLowerCase();
                const storeAddress = card.querySelector('.store-address').textContent.toLowerCase();

                // Check search match
                const matchesSearch = searchValue === '' || storeName.includes(searchValue);

                // Check province match
                const matchesProvince = selectedProvince === 'Chọn tỉnh thành' ||
                                       storeAddress.includes(selectedProvince.toLowerCase());

                // Check district match
                const matchesDistrict = selectedDistrict === 'Chọn quận/huyện' ||
                                       storeAddress.includes(selectedDistrict.toLowerCase());

                // Combine all filters
                const shouldShow = matchesSearch && matchesProvince && matchesDistrict;

                if (shouldShow) {
                    // Fade in
                    card.style.opacity = '0';
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.transition = 'opacity 300ms ease';
                        card.style.opacity = '1';
                    }, 10);
                    visibleCount++;
                } else {
                    // Fade out
                    card.style.transition = 'opacity 200ms ease';
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 200);
                }
            });

            // Hiển thị thông báo nếu không tìm thấy
            showNoResultsMessage(visibleCount);
        }

        /**
         * Hiển thị thông báo không tìm thấy kết quả
         */
        function showNoResultsMessage(visibleCount) {
            let noResultsMsg = storeList.querySelector('.no-results-message');

            if (visibleCount === 0) {
                if (!noResultsMsg) {
                    noResultsMsg = document.createElement('div');
                    noResultsMsg.className = 'no-results-message';
                    noResultsMsg.innerHTML = '<p>Không tìm thấy cửa hàng nào phù hợp</p>';
                    noResultsMsg.style.cssText = `
                        text-align: center;
                        padding: 40px 20px;
                        color: #999;
                        font-size: 16px;
                        opacity: 0;
                        transition: opacity 300ms ease;
                    `;
                    storeList.appendChild(noResultsMsg);
                    setTimeout(() => {
                        noResultsMsg.style.opacity = '1';
                    }, 10);
                }
            } else {
                if (noResultsMsg) {
                    noResultsMsg.style.opacity = '0';
                    setTimeout(() => {
                        noResultsMsg.remove();
                    }, 300);
                }
            }
        }

        // Event listener cho search input với debounce
        searchInput.addEventListener('input', debounce(performSearch, DEBOUNCE_DELAY));

        // ============================================================
        // 2. PROVINCE FILTER (Lọc theo tỉnh)
        // ============================================================

        /**
         * Cập nhật district dropdown dựa trên province được chọn
         */
        function updateDistrictDropdown(province) {
            // Clear current options (keep first default option)
            districtDropdown.innerHTML = '<option selected>Chọn quận/huyện</option>';

            if (province && province !== 'Chọn tỉnh thành' && districtData[province]) {
                // Add districts for selected province
                districtData[province].forEach(district => {
                    const option = document.createElement('option');
                    option.value = district;
                    option.textContent = district;
                    districtDropdown.appendChild(option);
                });
                districtDropdown.disabled = false;
            } else {
                // Disable district dropdown if no province selected
                districtDropdown.disabled = true;
            }
        }

        provinceDropdown.addEventListener('change', function() {
            const selectedProvince = this.value;

            // Update district dropdown
            updateDistrictDropdown(selectedProvince);

            // Perform filter with animation
            performSearch();
        });

        // ============================================================
        // 3. DISTRICT FILTER (Lọc theo quận)
        // ============================================================

        districtDropdown.addEventListener('change', function() {
            performSearch();
        });

        // ============================================================
        // 4. INITIAL SETUP
        // ============================================================

        // Disable district dropdown initially
        districtDropdown.disabled = true;

        // Set initial transition for all cards
        storeCards.forEach(card => {
            card.style.transition = 'opacity 300ms ease';
        });

        console.log('Search & Filter system initialized successfully');
    }
})();

// ============================================================
// C. STORE CARD INTERACTIONS (Tương tác với thẻ cửa hàng)
// ============================================================

(function() {
    'use strict';

    // Đảm bảo DOM đã load xong
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initStoreCardInteractions);
    } else {
        initStoreCardInteractions();
    }

    function initStoreCardInteractions() {
        // Lấy các elements
        const storeCards = document.querySelectorAll('.store-card');
        const mapIframe = document.querySelector('#map iframe');
        const mapContainer = document.querySelector('#map');

        // Kiểm tra các elements có tồn tại không
        if (storeCards.length === 0) {
            console.warn('Store cards not found');
            return;
        }

        // ============================================================
        // STORE DATA - Coordinates for each store
        // ============================================================
        const storeData = {
            'Sudes Sài Gòn': {
                lat: 10.7626,
                lng: 106.6677,
                address: 'Tầng 3, 70 Lữ Gia, Phường 15, Quận 11, Thành phố Hồ Chí Minh'
            },
            'Sudes Bình Dương': {
                lat: 10.9804,
                lng: 106.6519,
                address: 'lẻ / 24 Nguyễn Hữu Cảnh, Phường Phú Thọ, TP Thủ Dầu Một'
            },
            'Sudes Cần Thơ': {
                lat: 10.0452,
                lng: 105.7469,
                address: '81 đường Phan Huy Chú, KDC Thới Nhựt 1, Phường An Khánh'
            },
            'Sudes Hà Nội': {
                lat: 21.0285,
                lng: 105.8252,
                address: 'Tầng 6 - 266 Đội Cấn, Phường Liễu Giai, Quận Ba Đình'
            },
            'Sudes Đà Nẵng': {
                lat: 16.0544,
                lng: 108.2022,
                address: '161 đường Huỳnh Tấn Phát, Phường Hoà Cường Nam'
            },
            'Sudes Hoàng Quốc Việt': {
                lat: 21.0490,
                lng: 105.7971,
                address: '36 Hoàng Quốc Việt, Phường Nghĩa Tân, Quận Cầu Giấy'
            },
            'Sudes Hoàng Đạo Thúy': {
                lat: 21.0078,
                lng: 105.7952,
                address: '150 Hoàng Đạo Thúy, Phường Trung Hòa, Quận Cầu Giấy'
            },
            'Sudes Trần Phú': {
                lat: 20.9719,
                lng: 105.7785,
                address: '53 Trần Phú, Phường Văn Quán, Quận Hà Đông'
            }
        };

        // ============================================================
        // 1. CLICK TO SELECT STORE
        // ============================================================

        storeCards.forEach(card => {
            // Set initial transition
            card.style.transition = 'all 300ms ease';

            card.addEventListener('click', function() {
                // Remove active class from all cards
                storeCards.forEach(c => {
                    c.classList.remove('active');
                    c.style.borderColor = '#ff8c00';
                    c.style.backgroundColor = 'white';
                    c.style.color = '#333';
                });

                // Add active class to clicked card
                this.classList.add('active');

                // Animate selection
                this.style.borderColor = '#ff5500';
                this.style.backgroundColor = '#ff8c00';
                this.style.color = 'white';

                // Update text colors for active state
                const header = this.querySelector('.store-header');
                const address = this.querySelector('.store-address');
                const hotline = this.querySelector('.store-hotline');
                const hotlineSpan = this.querySelector('.store-hotline span');

                if (header) header.style.color = 'white';
                if (address) address.style.color = 'white';
                if (hotline) hotline.style.color = 'white';
                if (hotlineSpan) hotlineSpan.style.color = 'white';

                // Scroll card into view if needed
                this.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });

                // Update map
                const storeName = this.querySelector('.store-header').textContent.trim();
                updateMap(storeName);
            });
        });

        // ============================================================
        // 2. HOVER EFFECTS (Additional to CSS)
        // ============================================================

        storeCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                if (!this.classList.contains('active')) {
                    this.style.transform = 'translateY(-2px)';
                    this.style.boxShadow = '0 4px 12px rgba(255, 140, 0, 0.3)';
                }
            });

            card.addEventListener('mouseleave', function() {
                if (!this.classList.contains('active')) {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = 'none';
                }
            });
        });

        // ============================================================
        // 3. UPDATE MAP ON SELECTION
        // ============================================================

        /**
         * Cập nhật bản đồ khi chọn cửa hàng
         */
        function updateMap(storeName) {
            if (!mapIframe || !storeData[storeName]) {
                console.warn('Map iframe or store data not found');
                return;
            }

            const store = storeData[storeName];

            // Show loading overlay
            showLoadingOverlay();

            // Create new Google Maps URL
            const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.6456!2d${store.lng}!3d${store.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM!5e0!3m2!1svi!2s!4v1234567890`;

            // Fade out current map
            mapContainer.style.transition = 'opacity 300ms ease';
            mapContainer.style.opacity = '0.3';

            // Update iframe src after short delay
            setTimeout(() => {
                mapIframe.src = mapUrl;

                // Fade in new map
                setTimeout(() => {
                    mapContainer.style.opacity = '1';
                    hideLoadingOverlay();
                }, 1000);
            }, 300);
        }

        /**
         * Hiển thị loading overlay
         */
        function showLoadingOverlay() {
            let overlay = document.querySelector('.map-loading-overlay');

            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'map-loading-overlay';
                overlay.innerHTML = `
                    <div class="spinner"></div>
                    <p>Đang tải bản đồ...</p>
                `;
                overlay.style.cssText = `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    text-align: center;
                    color: #ff8c00;
                    font-size: 16px;
                    z-index: 100;
                `;

                const spinner = document.createElement('style');
                spinner.textContent = `
                    .spinner {
                        width: 40px;
                        height: 40px;
                        margin: 0 auto 10px;
                        border: 4px solid #f3f3f3;
                        border-top: 4px solid #ff8c00;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                    }
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `;
                document.head.appendChild(spinner);

                mapContainer.style.position = 'relative';
                mapContainer.appendChild(overlay);
            }

            overlay.style.display = 'block';
        }

        /**
         * Ẩn loading overlay
         */
        function hideLoadingOverlay() {
            const overlay = document.querySelector('.map-loading-overlay');
            if (overlay) {
                overlay.style.display = 'none';
            }
        }

        console.log('Store card interactions initialized successfully');
    }
})();
