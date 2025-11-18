/**
 * CONTACT.JS - XỬ LÝ CHO TRANG CONTACT.HTML
 * Tạo form validation, animations và xử lý submit cho trang Liên hệ
 *
 * Màu sắc chủ đạo:
 * - Primary: #d84315 (đỏ cam)
 * - Hover: #bf360c (đỏ đậm)
 * - Success: #4caf50 (xanh lá)
 * - Error: #f44336 (đỏ)
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
         * - Box-shadow: 0 4px 12px rgba(216, 67, 21, 0.3)
         * - Transition: 300ms ease
         */
        categoryItems.forEach(function(item) {
            // Thêm CSS transition
            item.style.transition = 'transform 300ms ease, box-shadow 300ms ease';

            // Mouse enter - Hover vào
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05)';
                this.style.boxShadow = '0 4px 12px rgba(216, 67, 21, 0.3)';
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
// B. FORM VALIDATION (Xác thực form)
// ============================================================

(function() {
    'use strict';

    // Đảm bảo DOM đã load xong
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFormValidation);
    } else {
        initFormValidation();
    }

    function initFormValidation() {
        const form = document.querySelector('.contact-form form');

        if (!form) {
            console.warn('Contact form not found');
            return;
        }

        // Lấy các form fields
        const nameInput = form.querySelector('input[type="text"]');
        const phoneInput = form.querySelector('input[type="tel"]');
        const contentTextarea = form.querySelector('textarea');

        if (!nameInput || !phoneInput || !contentTextarea) {
            console.warn('Form fields not found');
            return;
        }

        // ============================================================
        // VALIDATION RULES
        // ============================================================

        const validationRules = {
            name: {
                required: true,
                minLength: 2,
                pattern: /^[a-zA-ZÀ-ỹ\s]+$/,
                messages: {
                    required: 'Vui lòng nhập tên',
                    minLength: 'Tên phải có ít nhất 2 ký tự',
                    pattern: 'Tên chỉ được chứa chữ cái và khoảng trắng'
                }
            },
            phone: {
                required: true,
                pattern: /^(0|\+84)[0-9]{9,10}$/,
                messages: {
                    required: 'Vui lòng nhập số điện thoại',
                    pattern: 'Số điện thoại không hợp lệ'
                }
            },
            content: {
                required: true,
                minLength: 10,
                maxLength: 500,
                messages: {
                    required: 'Vui lòng nhập nội dung',
                    minLength: 'Nội dung phải có ít nhất 10 ký tự',
                    maxLength: 'Nội dung không được vượt quá 500 ký tự'
                }
            }
        };

        // ============================================================
        // SETUP FORM GROUPS
        // ============================================================

        // Wrap inputs in containers for proper styling
        setupFormField(nameInput, 'name');
        setupFormField(phoneInput, 'phone');
        setupFormField(contentTextarea, 'content');

        /**
         * Setup form field with necessary elements
         */
        function setupFormField(field, fieldName) {
            const formGroup = field.closest('.form-group');
            if (!formGroup) return;

            // Add wrapper for input and icons
            const inputWrapper = document.createElement('div');
            inputWrapper.className = 'input-wrapper';
            inputWrapper.style.position = 'relative';

            // Wrap the input
            field.parentNode.insertBefore(inputWrapper, field);
            inputWrapper.appendChild(field);

            // Add checkmark icon
            const checkmark = document.createElement('i');
            checkmark.className = 'fas fa-check-circle field-valid-icon';
            checkmark.style.cssText = `
                position: absolute;
                right: 15px;
                top: 50%;
                transform: translateY(-50%);
                color: #4caf50;
                font-size: 20px;
                opacity: 0;
                transition: opacity 300ms ease;
                pointer-events: none;
            `;
            inputWrapper.appendChild(checkmark);

            // Add error message container
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.style.cssText = `
                color: #f44336;
                font-size: 13px;
                margin-top: 5px;
                max-height: 0;
                overflow: hidden;
                transition: max-height 200ms ease;
            `;
            formGroup.appendChild(errorMsg);

            // Add character counter for textarea
            if (fieldName === 'content') {
                const counter = document.createElement('div');
                counter.className = 'character-counter';
                counter.style.cssText = `
                    position: absolute;
                    bottom: 10px;
                    right: 10px;
                    font-size: 12px;
                    color: #666;
                    background: rgba(255, 255, 255, 0.9);
                    padding: 2px 6px;
                    border-radius: 4px;
                    transition: color 300ms ease;
                `;
                counter.textContent = '0/500 ký tự';

                // Position relative for textarea wrapper
                inputWrapper.style.position = 'relative';
                inputWrapper.appendChild(counter);

                // Update counter on input
                field.addEventListener('input', function() {
                    updateCharacterCounter(this, counter);
                });
            }

            // Add transition to field
            field.style.transition = 'border-color 300ms ease';
        }

        /**
         * Update character counter
         */
        function updateCharacterCounter(textarea, counter) {
            const length = textarea.value.length;
            const maxLength = 500;
            counter.textContent = `${length}/${maxLength} ký tự`;

            // Change color based on length
            if (length < 450) {
                counter.style.color = '#666';
            } else if (length >= 450 && length < 500) {
                counter.style.color = '#ff9800'; // warning
            } else {
                counter.style.color = '#f44336'; // max reached
            }
        }

        // ============================================================
        // VALIDATION FUNCTIONS
        // ============================================================

        /**
         * Validate a single field
         */
        function validateField(field, rules) {
            const value = field.value.trim();
            let error = null;

            // Check required
            if (rules.required && !value) {
                error = rules.messages.required;
            }
            // Check min length
            else if (rules.minLength && value.length < rules.minLength) {
                error = rules.messages.minLength;
            }
            // Check max length
            else if (rules.maxLength && value.length > rules.maxLength) {
                error = rules.messages.maxLength;
            }
            // Check pattern
            else if (rules.pattern && !rules.pattern.test(value)) {
                error = rules.messages.pattern;
            }

            return error;
        }

        /**
         * Show field as valid
         */
        function showValid(field) {
            const formGroup = field.closest('.form-group');
            const inputWrapper = field.closest('.input-wrapper');
            const checkmark = inputWrapper.querySelector('.field-valid-icon');
            const errorMsg = formGroup.querySelector('.error-message');

            // Update border
            field.style.borderColor = '#4caf50';
            field.style.borderWidth = '2px';

            // Show checkmark with fade in
            if (checkmark) {
                checkmark.style.opacity = '1';
            }

            // Hide error message
            if (errorMsg) {
                errorMsg.style.maxHeight = '0';
                errorMsg.textContent = '';
            }

            // Remove error class
            formGroup.classList.remove('has-error');
            formGroup.classList.add('has-success');
        }

        /**
         * Show field as invalid
         */
        function showInvalid(field, message) {
            const formGroup = field.closest('.form-group');
            const inputWrapper = field.closest('.input-wrapper');
            const checkmark = inputWrapper.querySelector('.field-valid-icon');
            const errorMsg = formGroup.querySelector('.error-message');

            // Update border
            field.style.borderColor = '#f44336';
            field.style.borderWidth = '2px';

            // Hide checkmark
            if (checkmark) {
                checkmark.style.opacity = '0';
            }

            // Show error message with slide down
            if (errorMsg) {
                errorMsg.textContent = message;
                errorMsg.style.maxHeight = '50px';
            }

            // Add shake animation
            field.style.animation = 'shake 400ms ease';
            setTimeout(() => {
                field.style.animation = '';
            }, 400);

            // Add error class
            formGroup.classList.add('has-error');
            formGroup.classList.remove('has-success');
        }

        /**
         * Clear validation state
         */
        function clearValidation(field) {
            const formGroup = field.closest('.form-group');
            const inputWrapper = field.closest('.input-wrapper');
            const checkmark = inputWrapper ? inputWrapper.querySelector('.field-valid-icon') : null;
            const errorMsg = formGroup ? formGroup.querySelector('.error-message') : null;

            field.style.borderColor = '';
            field.style.borderWidth = '';

            if (checkmark) {
                checkmark.style.opacity = '0';
            }

            if (errorMsg) {
                errorMsg.style.maxHeight = '0';
                errorMsg.textContent = '';
            }

            if (formGroup) {
                formGroup.classList.remove('has-error', 'has-success');
            }
        }

        // ============================================================
        // EVENT LISTENERS
        // ============================================================

        /**
         * Blur event - validate when user leaves field
         */
        nameInput.addEventListener('blur', function() {
            if (this.value.trim()) {
                const error = validateField(this, validationRules.name);
                if (error) {
                    showInvalid(this, error);
                } else {
                    showValid(this);
                }
            }
        });

        phoneInput.addEventListener('blur', function() {
            if (this.value.trim()) {
                const error = validateField(this, validationRules.phone);
                if (error) {
                    showInvalid(this, error);
                } else {
                    showValid(this);
                }
            }
        });

        contentTextarea.addEventListener('blur', function() {
            if (this.value.trim()) {
                const error = validateField(this, validationRules.content);
                if (error) {
                    showInvalid(this, error);
                } else {
                    showValid(this);
                }
            }
        });

        /**
         * Input event - real-time validation
         */
        nameInput.addEventListener('input', function() {
            if (this.value.trim()) {
                const error = validateField(this, validationRules.name);
                if (error) {
                    showInvalid(this, error);
                } else {
                    showValid(this);
                }
            } else {
                clearValidation(this);
            }
        });

        phoneInput.addEventListener('input', function() {
            if (this.value.trim()) {
                const error = validateField(this, validationRules.phone);
                if (error) {
                    showInvalid(this, error);
                } else {
                    showValid(this);
                }
            } else {
                clearValidation(this);
            }
        });

        contentTextarea.addEventListener('input', function() {
            if (this.value.trim()) {
                const error = validateField(this, validationRules.content);
                if (error) {
                    showInvalid(this, error);
                } else {
                    showValid(this);
                }
            } else {
                clearValidation(this);
            }
        });

        /**
         * Focus event - show primary color border
         */
        function handleFocus() {
            const formGroup = this.closest('.form-group');
            const label = formGroup ? formGroup.querySelector('label') : null;

            // Only set border color if not already validated
            if (!formGroup.classList.contains('has-error') &&
                !formGroup.classList.contains('has-success')) {
                this.style.borderColor = '#d84315';
                this.style.borderWidth = '2px';
            }

            // Floating label effect
            if (label) {
                label.style.transition = 'all 300ms ease';
                label.style.transform = 'translateY(-10px) scale(0.9)';
                label.style.color = '#d84315';
            }

            // Fade out placeholder
            this.dataset.placeholder = this.placeholder;
            this.placeholder = '';
        }

        /**
         * Blur event - restore placeholder
         */
        function handleBlurFocus() {
            const formGroup = this.closest('.form-group');
            const label = formGroup ? formGroup.querySelector('label') : null;

            // Restore label if field is empty
            if (!this.value && label) {
                label.style.transform = '';
                label.style.color = '';
            }

            // Restore placeholder
            if (this.dataset.placeholder) {
                this.placeholder = this.dataset.placeholder;
            }
        }

        nameInput.addEventListener('focus', handleFocus);
        phoneInput.addEventListener('focus', handleFocus);
        contentTextarea.addEventListener('focus', handleFocus);

        nameInput.addEventListener('blur', handleBlurFocus);
        phoneInput.addEventListener('blur', handleBlurFocus);
        contentTextarea.addEventListener('blur', handleBlurFocus);

        // ============================================================
        // FORM SUBMIT
        // ============================================================

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validate all fields
            const nameError = validateField(nameInput, validationRules.name);
            const phoneError = validateField(phoneInput, validationRules.phone);
            const contentError = validateField(contentTextarea, validationRules.content);

            // Show validation results
            if (nameError) {
                showInvalid(nameInput, nameError);
            } else {
                showValid(nameInput);
            }

            if (phoneError) {
                showInvalid(phoneInput, phoneError);
            } else {
                showValid(phoneInput);
            }

            if (contentError) {
                showInvalid(contentTextarea, contentError);
            } else {
                showValid(contentTextarea);
            }

            // If all valid, submit form
            if (!nameError && !phoneError && !contentError) {
                // Show success message
                showToast('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.', 'success');

                // Reset form after short delay
                setTimeout(() => {
                    form.reset();
                    clearValidation(nameInput);
                    clearValidation(phoneInput);
                    clearValidation(contentTextarea);

                    // Reset character counter
                    const counter = contentTextarea.closest('.input-wrapper').querySelector('.character-counter');
                    if (counter) {
                        counter.textContent = '0/500 ký tự';
                        counter.style.color = '#666';
                    }
                }, 500);
            } else {
                // Show error toast
                showToast('Vui lòng kiểm tra lại thông tin', 'error');
            }
        });

        console.log('Form validation initialized successfully');
    }
})();

// ============================================================
// C. FLOATING BUTTONS (Nút nổi)
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
        const phoneBtn = document.querySelector('.float-btn.phone');
        const messengerBtn = document.querySelector('.float-btn.messenger');

        if (!phoneBtn || !messengerBtn) {
            console.warn('Floating buttons not found');
            return;
        }

        // ============================================================
        // PHONE BUTTON
        // ============================================================

        phoneBtn.addEventListener('click', function() {
            // Create ripple effect
            createRipple(this);

            // Call phone number
            window.location.href = 'tel:+84909876543';
        });

        // ============================================================
        // MESSENGER BUTTON
        // ============================================================

        messengerBtn.addEventListener('click', function() {
            // Create ripple effect
            createRipple(this);

            // Open Messenger
            window.open('https://m.me/your-page-id', '_blank');
        });

        /**
         * Create ripple effect on button click
         */
        function createRipple(button) {
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                width: 0;
                height: 0;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                pointer-events: none;
            `;
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);

            // Animate ripple
            setTimeout(() => {
                ripple.style.transition = 'width 600ms ease, height 600ms ease, opacity 600ms ease';
                ripple.style.width = '100px';
                ripple.style.height = '100px';
                ripple.style.opacity = '0';
            }, 10);

            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
        }

        // ============================================================
        // HOVER EFFECTS
        // ============================================================

        [phoneBtn, messengerBtn].forEach(btn => {
            btn.style.transition = 'all 300ms ease';

            btn.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.1)';
            });

            btn.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });

        // ============================================================
        // PULSE ANIMATION FOR MESSENGER
        // ============================================================

        function startMessengerPulse() {
            setInterval(() => {
                messengerBtn.style.animation = 'pulse 2s ease';
                setTimeout(() => {
                    messengerBtn.style.animation = '';
                }, 2000);
            }, 5000);
        }

        startMessengerPulse();

        console.log('Floating buttons initialized successfully');
    }
})();

// ============================================================
// D. NOTIFICATIONS & TOASTS (Thông báo)
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
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            50% { transform: translateX(10px); }
            75% { transform: translateX(-10px); }
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes slideDown {
            from {
                max-height: 0;
                opacity: 0;
            }
            to {
                max-height: 50px;
                opacity: 1;
            }
        }

        /* Floating label animations */
        .form-group label {
            transition: all 300ms ease;
        }

        .form-group.has-success input,
        .form-group.has-success textarea {
            border-color: #4caf50 !important;
        }

        .form-group.has-error input,
        .form-group.has-error textarea {
            border-color: #f44336 !important;
        }

        /* Smooth transitions for all inputs */
        .contact-form input,
        .contact-form textarea {
            transition: border-color 300ms ease, box-shadow 300ms ease;
        }

        .contact-form input:focus,
        .contact-form textarea:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(216, 67, 21, 0.1);
        }

        /* Character counter styling */
        .character-counter {
            font-weight: 500;
            user-select: none;
        }
    `;
    document.head.appendChild(style);
})();

// ============================================================
// E. PAGE LOAD ANIMATIONS
// ============================================================

(function() {
    'use strict';

    // Đảm bảo DOM đã load xong
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPageLoadAnimations);
    } else {
        initPageLoadAnimations();
    }

    function initPageLoadAnimations() {
        // Set initial states (hidden)
        const categoriesWrapper = document.querySelector('.categories-wrapper');
        const contactInfo = document.querySelector('.contact-info');
        const contactForm = document.querySelector('.contact-form');
        const mapSection = document.querySelector('.map-section');
        const floatButtons = document.querySelectorAll('.float-btn');

        // Hide elements initially
        const elements = [
            { el: categoriesWrapper, delay: 100 },
            { el: contactInfo, delay: 300 },
            { el: contactForm, delay: 500 },
            { el: mapSection, delay: 700 }
        ];

        elements.forEach(({ el }) => {
            if (el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
            }
        });

        floatButtons.forEach(btn => {
            btn.style.opacity = '0';
            btn.style.transform = 'scale(0.8)';
        });

        // Animate elements in sequence
        elements.forEach(({ el, delay }) => {
            if (el) {
                setTimeout(() => {
                    el.style.transition = 'opacity 400ms ease, transform 400ms ease';
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, delay);
            }
        });

        // Animate floating buttons
        floatButtons.forEach((btn, index) => {
            setTimeout(() => {
                btn.style.transition = 'opacity 300ms ease, transform 300ms ease';
                btn.style.opacity = '1';
                btn.style.transform = 'scale(1)';
            }, 900 + (index * 100));
        });

        console.log('Page load animations initialized successfully');
    }
})();

// ============================================================
// INITIALIZE ALL MODULES
// ============================================================

(function() {
    'use strict';

    console.log('%c Contact.js Fully Loaded! ', 'background: #d84315; color: white; font-size: 16px; padding: 8px; border-radius: 4px;');
    console.log('All modules initialized:');
    console.log('✓ Categories Carousel');
    console.log('✓ Form Validation');
    console.log('✓ Floating Buttons');
    console.log('✓ Toast Notifications');
    console.log('✓ Page Load Animations');
})();
