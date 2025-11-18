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
                // Remove active class from all cards and reset their styles
                storeCards.forEach(c => {
                    c.classList.remove('active');
                    c.style.borderColor = '#ff8c00';
                    c.style.backgroundColor = 'white';
                    c.style.color = '#333';

                    // Reset text colors for inactive state
                    const header = c.querySelector('.store-header');
                    const address = c.querySelector('.store-address');
                    const hotline = c.querySelector('.store-hotline');
                    const hotlineSpan = c.querySelector('.store-hotline span');

                    if (header) header.style.color = '';
                    if (address) address.style.color = '';
                    if (hotline) hotline.style.color = '';
                    if (hotlineSpan) hotlineSpan.style.color = '';
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

// ============================================================
// D. FLOATING BUTTONS (Nút nổi)
// ============================================================

(function() {
    'use strict';

    // Đảm bảo DOM đã load xong
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFloatingButtons);
    } else {
        initFloatingButtons();
    }

    function initFloatingButtons() {
        // Lấy các elements
        const btnTop = document.querySelector('.btn-top');
        const btnLocation = document.querySelector('.btn-location');
        const btnMessenger = document.querySelector('.btn-messenger');
        const storeList = document.querySelector('.store-list');

        // Kiểm tra các elements có tồn tại không
        if (!btnTop || !btnLocation || !btnMessenger || !storeList) {
            console.warn('Floating buttons elements not found');
            return;
        }
        // ============================================================
        // 2. LOCATION BUTTON
        // ============================================================

        btnLocation.addEventListener('click', function() {
            const icon = this.querySelector('i');

            // Show loading animation
            icon.style.transition = 'transform 1s ease';
            icon.style.transform = 'rotate(360deg)';

            // Show loading toast
            showToast('Đang xác định vị trí của bạn...', 'info');

            // Simulate location detection
            setTimeout(() => {
                // Reset icon rotation
                icon.style.transform = 'rotate(0deg)';

                // Show success toast
                showToast('Đã xác định vị trí của bạn', 'success');
            }, 1000);
        });
    }
})();

// ============================================================
// E. MAP INTERACTIONS (Tương tác với bản đồ)
// ============================================================

(function() {
    'use strict';

    // Đảm bảo DOM đã load xong
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMapInteractions);
    } else {
        initMapInteractions();
    }

    function initMapInteractions() {
        // Lấy các elements
        const playBtn = document.querySelector('.play-btn');
        const mapContainer = document.querySelector('#map');
        const mapIframe = document.querySelector('#map iframe');

        // Kiểm tra các elements có tồn tại không
        if (!playBtn || !mapContainer || !mapIframe) {
            console.warn('Map interaction elements not found');
            return;
        }
        // ============================================================
        // 2. MAP LOADING STATE
        // ============================================================

        /**
         * Show skeleton loader
         */
        function showMapLoader() {
            let loader = mapContainer.querySelector('.map-skeleton-loader');

            if (!loader) {
                loader = document.createElement('div');
                loader.className = 'map-skeleton-loader';
                loader.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                    z-index: 50;
                `;
                mapContainer.style.position = 'relative';
                mapContainer.appendChild(loader);
            }

            loader.style.display = 'block';
            loader.style.opacity = '1';
        }

        /**
         * Hide skeleton loader
         */
        function hideMapLoader() {
            const loader = mapContainer.querySelector('.map-skeleton-loader');
            if (loader) {
                loader.style.transition = 'opacity 300ms ease';
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 300);
            }
        }

        // Listen to iframe load event
        mapIframe.addEventListener('load', function() {
            setTimeout(hideMapLoader, 1000);
        });

        // ============================================================
        // 3. FULLSCREEN TOGGLE
        // ============================================================

        let isFullscreen = false;
        let originalStyles = {};

        mapContainer.addEventListener('dblclick', function() {
            if (!isFullscreen) {
                enterFullscreen();
            } else {
                exitFullscreen();
            }
        });
    }
})();


// ============================================================
// G. NOTIFICATIONS & TOASTS (Thông báo)
// ============================================================

(function() {
    'use strict';

    // Toast container
    let toastContainer = null;
    const MAX_TOASTS = 3;
    const TOAST_DURATION = 3000;

    /**
     * Initialize toast system
     */
    function initToastSystem() {
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            toastContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
            `;
            document.body.appendChild(toastContainer);
        }
    }

    /**
     * Show toast notification
     * @param {string} message - Toast message
     * @param {string} type - Toast type: 'success', 'error', 'info'
     */
    window.showToast = function(message, type = 'info') {
        initToastSystem();

        // Remove oldest toast if max reached
        const existingToasts = toastContainer.querySelectorAll('.toast');
        if (existingToasts.length >= MAX_TOASTS) {
            existingToasts[0].remove();
        }

        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        // Toast colors based on type
        const colors = {
            success: { bg: '#4caf50', icon: 'fa-check-circle' },
            error: { bg: '#f44336', icon: 'fa-exclamation-circle' },
            info: { bg: '#2196f3', icon: 'fa-info-circle' }
        };

        const color = colors[type] || colors.info;

        toast.style.cssText = `
            background: ${color.bg};
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            min-width: 300px;
            max-width: 400px;
            display: flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
            transform: translateX(400px);
            transition: transform 300ms ease;
            font-size: 14px;
        `;

        toast.innerHTML = `
            <i class="fas ${color.icon}" style="font-size: 20px;"></i>
            <span style="flex: 1;">${message}</span>
            <i class="fas fa-times" style="font-size: 16px; opacity: 0.8;"></i>
        `;

        toastContainer.appendChild(toast);

        // Slide in animation
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 10);

        // Auto dismiss after duration
        const dismissTimeout = setTimeout(() => {
            dismissToast(toast);
        }, TOAST_DURATION);

        // Click to dismiss
        toast.addEventListener('click', function() {
            clearTimeout(dismissTimeout);
            dismissToast(toast);
        });
    };

    /**
     * Dismiss toast
     */
    function dismissToast(toast) {
        toast.style.transform = 'translateX(400px)';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }

    console.log('Toast notification system initialized successfully');
})();

// ============================================================
// ADD GLOBAL CSS ANIMATIONS
// ============================================================

(function() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }

        @keyframes highlight {
            0%, 100% { box-shadow: 0 0 0 0 rgba(255, 140, 0, 0); }
            50% { box-shadow: 0 0 0 10px rgba(255, 140, 0, 0.4); }
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
})();